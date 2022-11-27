import useEvaluateNumber from '../../hooks/useEvaluateNumber';
import useValidValue from '../../hooks/useValidValue';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import esLocale from 'date-fns/locale/es';
import { NumericFormat } from 'react-number-format';
import Card from '@mui/material/Card';
import useDateSetting from '../../hooks/useDateSetting';
import { useEffect, useState, Suspense } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DataTableCrud } from '../../components/DataTable/DataTableMiu';
import { DesigForm } from '../../components/Form/DesigForm';
import useDialogSave from '../../hooks/useDialogoSave';
import useErrorMessage from '../../hooks/useErrorMessage';
import useRecordData from '../../hooks/useRecordData';
import useSearchData from '../../hooks/useSearchData';
import useListSelection from '../../hooks/useListSelection';
import { ERROR_SYSTEM, DATE_INVALIDATE, VALUE_REQUIRED, MESSAGE_MAX_NUMERIC, ERROR_ZERO, ERROR_LIST, MAX_LENGTH_INT, MAXLENGTH, } from '../../setup/environment';
import { SummaryAccounts } from './SummaryAccounts';
import { IPropsBasic, TDate, TObservations, TAdmissionDate, SiNo } from '../../interfaces/interfaces';
import { titleColumnCollects } from './columnCollects';
import useExchange from '../../hooks/useExchange';
import useSnackBar from '../../hooks/useSnackBar'

interface IProps extends IPropsBasic {
	nameIdDebts: string;
	routeBase: string;
	routeCollect?: string;
	idDebts: number;
	idCollect: number;
	idGeneric: number; // este puede ser id customer o id
	title: string;
}

interface IGenerericCollect extends IPropsBasic, TObservations, TAdmissionDate {
	idDebts: number; //es el id de cuentas por pagar o cuentas por cobrar
	idCollect: number;
	amount: number; // es el monto pagado
	paymentDate: TDate; //fecha en que se realizo el pago
	remainingDebt?: number; //Es el monto que quedo de la deuda cuando se realizo el pago
	annulledPayment: SiNo; //Indica si el pago esta anulado
	montoDolar?: number,
	tipoDolar?: string
}

const defaultValues: IGenerericCollect = {
	action: 1,
	idEnterprise: 0,
	idDebts: 0,
	idCollect: 0,
	amount: 0,
	paymentDate: new Date(), //fecha en que se realizo el pago
	observations: '',
	montoDolar: 0,
	tipoDolar: '',
	annulledPayment: 'NO', //Indica si el pago esta anulado
	admissionDate: '',
};

const annulledPaymentItems = [
	{ label: 'SI', code: 'SI' },
	{ label: 'NO', code: 'NO' },
];

//leyend
// ! xs, extra - small: 0px
// ! sm, small: 600px
// ! md, medium: 900px
// ! lg, large: 1200px
// ! xl, extra - large: 1536px
const _xs = 12;
const _sm = 4;
const _md = 4;
const _xl = 4;
const _lg = 4;

const styleItem = {
	marginTop: '7px',
}

export default function PaymentCollector (props: IProps) {
	const route: string = props?.routeCollect === undefined ? '' : props?.routeCollect;
	const [idDebts, setIdDebts] = useState<number>(props.idDebts);
	const pathRoute: string = `${route}/${props.idEnterprise}/${idDebts}`;

	defaultValues.idEnterprise = props.idEnterprise;
	defaultValues.idCollect = props.idCollect;
	const { control, handleSubmit, getValues, reset, formState: { errors }, setValue, } = useForm<IGenerericCollect>({ defaultValues });

	const [showCancel, setShowCancel] = useState(true);
	const [activatedButton, setActivatedButton] = useState<boolean>(false);

	const [titleForm, setTitleForm] = useState<string>(props.title);
	const [showAdditional, setShowAdditional] = useState<boolean>(false);
	const { showErrorMessage } = useErrorMessage();
	const { searchDatas, ShowMessageSearch, data, countRow } = useSearchData();
	const { recordData, ShowSnackBarSave } = useRecordData();

	const [amountDebt, setAmountDebt] = useState<number>(0);
	const [amountDebtQuery, setAmountDebtQuery] = useState<string>('');
	const [amountPaid, setAmountPaid] = useState<number>(0);
	const [amountPaidQuery, setAmountPaidQuery] = useState<string>('');
	const [remainingDebt, setRemainingDebt] = useState<string>('0');
	const [remainingDebtQuery, setRemainingDebtQuery] = useState<string>('0,00');
	const [change, setChange] = useState(0);
	const { convertDateMysql, formatDateLantino } = useDateSetting();
	const { valueDecimal } = useEvaluateNumber();
	const { validateValue } = useValidValue();
	const [paymentDate, setPaymentDate] = useState<any>(new Date());
	const [amount, setAmount] = useState<string>('');
	const [annulledPayment, setAnnulledPayment] = useState<any | null>(annulledPaymentItems[0]);
	const [annulledPaymentInputValue, setAnnulledPaymentInputValue] = useState<any>('');
	const { checkTypeOf } = useListSelection();
	const [buttonSave, setButtonSave] = useState<boolean>(true);
	const [descriptionDeuda, setDescriptionDeuda] = useState<any | null>(null);
	const [listDeudas, setListDeudas] = useState<string[]>([]);
	const [totalRemainingDebt, setTotalRemainingDebt] = useState<string>('0,00');
	const [totalAccount, setTotalAccount] = useState<string>('0,00');
	const deudaCancelada = 'LA DEUDA YA FUE CANCELADA POR LO TANTO NO SE PUEDE REGISTRAR PAGOS.';
	const { openSnackBar, settingSnackBar } = useSnackBar()
	const { handleMonto, ShowExchange, montoDolar, tipoDolar } = useExchange()
	let loadDeudas: boolean = false
	let totalDeudas: boolean = false
	let loadData: boolean = false
	let loadPagos: boolean = false

	useEffect(() => {
		// ? Aquí se cargan las deudas pendientes que tenga el cliente
		// !BUSCAR LA LISTA DE ACREEDORES  O CLIENTES DEPENDIENDO LA RUTA QUE SE INDIQUE
		if (change > 0) {
			loadDeudas = false
		}
		if (!loadDeudas) {
			loadDeudas = true;
			(async (): Promise<any> => {
				const fieldSearch = `CONCAT('No cuenta: ',"${props.nameIdDebts}",'. ',"debtDescription",'=',"remainingDebtQuery") as label,"${props.nameIdDebts}" as value, "commonName"`;
				const ruta = `${props.routeBase}/search/filter/${props.idEnterprise}/${props.idGeneric}/${fieldSearch}`
				const titulo = `Cargando lista de ${props.title}`
				await searchDatas(ruta, titulo, false).then((dataFound) => {
					if (dataFound.rowAffect === 0) {
						return 0;
					}
					const _data = dataFound.data;
					const { commonName }: { commonName: string } = _data[0]
					setTitleForm(`${props.title.toUpperCase()} DE ${commonName}`)
					_data.map((valor: any) => {
						const [{ label, value }] = [...[valor]];
						if (idDebts === value) {
							setDescriptionDeuda(label);
							setDescriptionDeuda(() => label);
						}
					});

					setListDeudas(_data);
				});
			})();
		}
	}, [change]);

	useEffect(() => {
		// ? Aquí se busca el total de las deudas del cliente o acreedor
		if (change > 0) {
			totalDeudas = false
		}
		if (!totalDeudas) {
			totalDeudas = true;
			(async (): Promise<any> => {
				const ruta = `${props.routeBase}/search/total/${props.idEnterprise}/${props.idGeneric}`
				const titulo = 'Buscando total de deudas'
				await searchDatas(ruta, titulo, false).then(
					(dataFound) => {
						if (dataFound.rowAffect === 0) {
							return 0;
						}
						const _data = dataFound.data[0];
						setTotalRemainingDebt(_data.totalRemainingDebtQuery);
						setTotalAccount(_data.totalAccount);
					}
				);
			})();
		}
	}, [change, idDebts]);

	useEffect(() => {
		if (change > 0) {
			loadData = false
		}
		if (!loadData) {
			loadData = true;
			setButtonSave(true);
			setActivatedButton(false);
			const ruta = `${props.routeBase}/search/${props.idEnterprise}/${idDebts}`;
			const titulo = 'Cargando datos del formulario';
			(async (): Promise<any> => {
				await searchDatas(ruta, titulo, false).then((dataFound) => {
					if (dataFound.rowAffect === 0) {
						return 0;
					}
					let _data = dataFound.data[0];
					if (_data.errorFound) {
						throw Error(ERROR_SYSTEM);
					}
					if (_data.remainingDebt <= 0) {
						setButtonSave(false);
						setActivatedButton(true);
						settingSnackBar(deudaCancelada, 'error');
						openSnackBar();
					}
					setAmountPaidQuery(_data.amountPaidQuery);
					setAmountPaid(_data.amountPaid);

					setAmountDebtQuery(_data.amountDebtQuery);
					setAmountDebt(_data.amountDebt);

					setRemainingDebtQuery(_data.remainingDebtQuery);
					setRemainingDebt(_data.remainingDebt);
				});
			})();
		}
	}, [change, idDebts]);

	useEffect(() => {
		if (change > 0) {
			loadPagos = false
		}
		if (!loadPagos) {
			loadPagos = true;
			(async (): Promise<any> => {
				await searchDatas(pathRoute, 'Buscando pagos registrados')
			})();
		}
	}, [change, idDebts]);

	const myHandleSubmit = async (): Promise<any> => {
		let _amount: any = parseFloat(valueDecimal(amount));
		let _annulledPayment: any = checkTypeOf(getValues('annulledPayment'), 'annulledPayment');
		setValue('idDebts', idDebts);
		setValue('amount', _amount);
		setValue('paymentDate', paymentDate);
		setValue('annulledPayment', _annulledPayment);

		const dataRecord: IGenerericCollect = getValues();
		delete dataRecord.admissionDate;
		const _paymentDate: TDate = convertDateMysql(getValues('paymentDate'));
		dataRecord.paymentDate = _paymentDate;
		dataRecord.montoDolar = montoDolar
		dataRecord.tipoDolar = tipoDolar
		//openBackdrop('Registrando Datos');
		await recordData(dataRecord, route)
			.then((dataRegister) => {
				if (dataRegister.rowAffect > 0) {
					handleReset(); // reset after form submit
					setChange((preValue) => preValue + 1);
				}
				//closeBackdrop();
			})
			.catch(() => {
				//closeBackdrop();
				setChange((preValue) => preValue + 1);
			});
	};

	const { checkAmount, DialogSave } = useDialogSave({
		actionAccept: myHandleSubmit,
		message: '¿Desea registrar el pago?',
		messageCheckAmount: props.title.toUpperCase(),
	});

	const handleSave = async (): Promise<any> => {
		if (buttonSave === false) {
			settingSnackBar(deudaCancelada, 'error');
			setActivatedButton(true);
			openSnackBar();
			return 0;
		}
		checkAmount(parseFloat(amount), parseFloat(remainingDebt));
	};

	const handleCancelPayment = async (row: any) => {
		return await recordData({ idCollectNumber: row }, `${route}/cancel/`).then((dataRegister) => {
			if (dataRegister.rowAffect > 0) {
				setChange((preValue) => preValue + 1);
			}
		});
	};

	const handleAmount = (event: any): void => {
		let valor: string = event.target.value;
		setAmount(() => valor);
		handleMonto(valor)
	};

	const handleReset = () => {
		reset(defaultValues);
		setAmount(() => '');
		setPaymentDate(new Date());
	};

	const handleIdReceibable = (params: any) => {
		if (validateValue(params) === true) {
			setDescriptionDeuda(() => params['label']);
			setIdDebts(() => params['value']);
		}
	};

	const Resumen = (
		<>
			<Suspense fallback={<h1>Loading datos...</h1>}>
				<Grid container direction='row'>
					<Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: '15px' }}>
						<Suspense fallback={<h1>Loading datos...</h1>}>
							<Autocomplete
								value={descriptionDeuda}
								options={listDeudas}
								isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
								onChange={(event: any, newValue: any) => {
									handleIdReceibable(newValue);
								}}
								renderInput={(params) => (
									<TextField
										{...params}
										label='Deudas Pendientes'
										fullWidth
										helperText={showErrorMessage(errors.idDebts)}
									/>
								)}
							/>
						</Suspense>
					</Grid>
				</Grid>
				<SummaryAccounts
					idDebts={idDebts}
					totalRemainingDebt={totalRemainingDebt}
					totalAccount={totalAccount}
					amountDebtQuery={amountDebtQuery}
					amountPaidQuery={amountPaidQuery}
					remainingDebtQuery={remainingDebtQuery}
				/>
			</Suspense>
		</>
	);

	const GridData = (

		<Suspense fallback={<h1>Loading datos...</h1>}>
			<DataTableCrud
				title={`PAGOS DE ${titleForm} CUENTA N° ${idDebts}. CANTIDAD DE PAGOS REALIZADOS: ${countRow}`}
				titleColumns={titleColumnCollects()}
				recordData={data}
				columnEdit={false}
				columnDelete={false}
				columnCancel={true}
				idDelete={'idCollectNumber'}
				loading={true}
				keyField={'id'}
				actionCancel={handleCancelPayment}
			/>
		</Suspense>
	);

	return (
		<>
			<Suspense fallback={<h1>Loading datos...</h1>}>
				<DesigForm
					title={titleForm}
					saveData={handleSubmit(handleSave)}
					resetData={() => handleReset()}
					showButtonCancel={showCancel}
					watchDialog={props?.watchDialog}
					activatedButton={activatedButton}
					showButtonSave={buttonSave}>
					{ShowExchange}
					{Resumen}
					{DialogSave}
					{/* {ShowSnackBar}
					{ShowMessageSearch} */}
					<form onSubmit={handleSubmit(myHandleSubmit)} noValidate>
						<Controller
							name='action'
							control={control}
							defaultValue={props.action}
							render={({ field }) => <input type='hidden' id={field.name} {...field} />}
						/>

						<Controller
							name='idEnterprise'
							control={control}
							defaultValue={props.idEnterprise}
							render={({ field }) => <input type='hidden' id={field.name} {...field} />}
						/>

						<Controller
							name='idDebts'
							control={control}
							defaultValue={idDebts}
							render={({ field }) => <input type='hidden' id={field.name} {...field} value={idDebts} />}
						/>
						<Controller
							name='idCollect'
							control={control}
							render={({ field }) => <input type='hidden' id={field.name} {...field} />}
						/>

						<Grid container direction='column' alignItems='left' spacing={1} style={{ marginBottom: '15px' }}>
							<Grid container spacing={1} style={styleItem} >
								<Grid item={true} xs={_xs} sm={_sm} md={_md} xl={_xl} lg={_lg} style={styleItem}>
									<Controller
										name='paymentDate'
										control={control}
										rules={{
											validate: {
												checkDate: () => {
													let valid = formatDateLantino(paymentDate);
													if (valid === null) {
														return VALUE_REQUIRED;
													}
													if (valid === 'Invalid Date') {
														return DATE_INVALIDATE;
													}
												},
											},
										}}
										render={({ field }) => (
											<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
												<DatePicker
													label='Fecha de pago'
													openTo='day'
													views={['year', 'month', 'day']}
													value={paymentDate}
													onChange={(newValue: any) => {
														setPaymentDate(newValue);
													}}
													renderInput={(params: any) => (
														<TextField
															{...params}
															helperText={showErrorMessage(errors['paymentDate'])}
															fullWidth
															{...field}
														/>
													)}
												/>
											</LocalizationProvider>
										)}
									/>
								</Grid>
								<Grid item={true} xs={_xs} sm={_sm} md={_md} xl={_xl} lg={_lg} style={styleItem}>
									<Controller
										name='amount'
										control={control}
										rules={{
											validate: {
												checkItems: () => {
													if (validateValue(amount) === false || parseFloat(valueDecimal(amount)) <= 0) {
														return ERROR_ZERO;
													}
													if (parseFloat(valueDecimal(amount)) >= MAX_LENGTH_INT) {
														return MESSAGE_MAX_NUMERIC;
													}
												},
											},
										}}
										render={({ field }) => {
											return (
												<NumericFormat
													id={field.name}
													label='Monto a Pagar'
													variant='outlined'
													fullWidth
													thousandSeparator='.'
													decimalSeparator=','
													decimalScale={2}
													allowNegative={false}
													helperText={showErrorMessage(errors.amount)}
													value={amount}
													onChange={(e: any) => {
														field.onChange(e.value);
														handleAmount(e);
													}}
													customInput={TextField}
												/>
											);
										}}
									/>
								</Grid>
								<Grid item={true} xs={_xs} sm={_sm} md={_md} xl={_xl} lg={_lg} style={styleItem}>
									<Controller
										name='observations'
										control={control}
										rules={{
											maxLength: { value: 250, message: MAXLENGTH + 250 },
										}}
										render={({ field }) => (
											<TextField
												type='search'
												id={field.name}
												label='Observaciones'
												variant='outlined'
												{...field}
												helperText={showErrorMessage(errors.observations)}
												fullWidth
												multiline
											/>
										)}
									/>
								</Grid>
							</Grid>


							{showAdditional && (
								<Grid item={true}>
									<Suspense fallback={<h1>Loading data...</h1>}>
										<Controller
											name='annulledPayment'
											control={control}
											rules={{
												validate: {
													checkItems: () => {
														return annulledPaymentInputValue !== '' ? true : ERROR_LIST;
													},
												},
											}}
											render={({ field }) => (
												<Autocomplete
													value={annulledPayment}
													id={field.name}
													onChange={(event: any, newValue: any) => {
														setAnnulledPayment(newValue);
													}}
													onInputChange={(event, newInputValue) => {
														setAnnulledPaymentInputValue(newInputValue);
													}}
													options={annulledPaymentItems}
													getOptionLabel={(option) => option.label}
													renderInput={(params) => (
														<TextField
															{...params}
															label='Anular Pago'
															fullWidth
															helperText={showErrorMessage(errors.annulledPayment)}
														/>
													)}
												/>
											)}
										/>
									</Suspense>
								</Grid>
							)}
						</Grid>
					</form>

					<Card sx={{ width: 'auto' }}>
						<Grid container spacing={2} style={{ overflow: 'scroll', width: '100%' }}>
							<Grid item={true} style={{ width: '98%' }}>
								{GridData}
							</Grid>
						</Grid>
					</Card>
				</DesigForm>
			</Suspense>
		</>
	);
}
