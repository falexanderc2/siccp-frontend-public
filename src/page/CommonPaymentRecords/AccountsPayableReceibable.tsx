import Alert from '@mui/material/Alert';
import { NumericFormat } from 'react-number-format';
import { useEffect, useState, Suspense } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DesigForm } from '../../components/Form/DesigForm';
import useDateSetting from '../../hooks/useDateSetting';
import useDialogSave from '../../hooks/useDialogoSave';
import useErrorMessage from '../../hooks/useErrorMessage';
import useRecordData from '../../hooks/useRecordData';
import useSearchData from '../../hooks/useSearchData';
import useEvaluateNumber from '../../hooks/useEvaluateNumber';
import useValidValue from '../../hooks/useValidValue';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import esLocale from 'date-fns/locale/es';
import { IAccountsPayableReceibable, IPropsDbts } from '../../interfaces/commonInterfaces';
import { TDate } from '../../interfaces/interfaces';
import {
	ERROR_ZERO, MAXLENGTH, MAX_LENGTH_INT, MINLENGTH, VALUE_REQUIRED, ERROR_LIST, DATE_INVALIDATE, MESSAGE_MAX_NUMERIC,
} from '../../setup/environment';
import useExchange from '../../hooks/useExchange';
import useSnackBar from '../../hooks/useSnackBar'

const defaultValues: IAccountsPayableReceibable = {
	action: 1,
	idEnterprise: 0,
	idCommon: 0,
	idDebt: 0,
	debtDescription: '', //descripcion de la deuda
	dateDebts: undefined, //fecha en que se adquirio la deuda
	amountDebt: 0, //Es el monto total de la deuda
	numberOfPayments: 2, //Es el numeros de cuotas que se tienen para pagar la deuda
	amountToBePaidIninstallments: 0, //cantidad a pagar en cuotas
	//numberOfDaysForInstallments: 7, //cantidad de dias entre cuotas para cancelar la deuda,
	paymentStartDate: undefined, //fecha en que se comenzara a pagar la deuda
	paymentNumber: 0, //Cantidad de  cuotas canceladas
	amountPaid: 0, //Es total pagado de la deuda
	remainingDebt: 0, //Es la monto restante de la deuda
	observations: '',
	debtPaid: 'NO', //Indica si la deuda esta pagada
	admissionDate: '',
};
//leyend
// ! xs, extra - small: 0px
// ! sm, small: 600px
// ! md, medium: 900px
// ! lg, large: 1200px
// ! xl, extra - large: 1536px
const _xs = 12;
const _sm = 6;
const _md = 6;
const _xl = 3;
const _lg = 3;

const styleItem = {
	marginTop: '7px',
}

export default function AccountsPayableReceibable (props: IPropsDbts) {
	const route: string = props.pathRoute; //`debts_to_pays`;
	const pathRoute: string = `${route}/search/${props.idEnterprise}/${props.idDebt}`;
	const pathRouteListSearch = props?.pathRouteListSearch !== undefined ? props?.pathRouteListSearch : ''; // se usa para buscar lista de clientes y acreedores
	defaultValues.idEnterprise = props.idEnterprise;
	defaultValues.idDebt = props.idDebt;
	const { control, handleSubmit, getValues, reset, formState: { errors }, setValue } = useForm<IAccountsPayableReceibable>({ defaultValues });
	const { convertDateMysql, formatDateLantino } = useDateSetting();
	const [showCancel, setShowCancel] = useState(true);
	const [activatedButton, setActivatedButton] = useState<boolean>(false);
	const [titleForm, setTitleForm] = useState(`Ingresando Cuentas por ${props.title}`);
	const [showAdditional, setShowAdditional] = useState<boolean>(false);
	const { showErrorMessage } = useErrorMessage();
	const { searchDatas } = useSearchData();
	const { recordData } = useRecordData();
	const [listCommon, setListCommon] = useState<any>([]);
	const { valueDecimal, valueInteger } = useEvaluateNumber();
	const { validateValue } = useValidValue();

	const [amountToBePaidIninstallments, setAmountToBePaidIninstallments] = useState<any>('');
	const [idCommon, setIdCommon] = useState<string>('0');
	const [commonName, setCommonName] = useState<any | null>(null);
	const [dateDebts, setDateDebts] = useState<any>(new Date());
	const [paymentStartDate, setPaymentStartDate] = useState<any>(new Date());
	const [amountDebt, setAmountDebt] = useState<string>('');
	const [numberOfPayments, setNumberOfPayments] = useState<string>('2');
	//const [numberOfDaysForInstallments, setNumberOfDaysForInstallments] = useState<any>('0');
	const [activatedEdit, setActivatedEdit] = useState<boolean>(false);
	const { handleMonto, ShowExchange } = useExchange()
	const { ShowSnackBar, openSnackBar, settingSnackBar } = useSnackBar()

	let loadList: boolean = false
	let loadData: boolean = false

	const formatoFecha = '__/__/____';

	useEffect(() => {
		// !BUSCAR LA LISTA DE ACREEDORES  O CLIENTES DEPENDIENDO LA RUTA QUE SE INDIQUE
		if (!loadList) {
			(async (): Promise<any> => {
				loadList = true
				const fieldSearch: string = '"commonName" as label,"id" as value';
				await searchDatas(`${pathRouteListSearch}/search/filters/${props.idEnterprise}/${fieldSearch}`, `Buscando ${props.titleCustomersAcreditor}`, false).then(
					(dataFound) => {
						if (dataFound.data !== undefined) {
							setListCommon(dataFound.data)
						}
					})
			})();
		}
		return () => {
			loadList = true
		}
	}, []);

	useEffect(() => {
		if (!loadData) {
			loadData = true
			setNumberOfPayments('2');
			//setNumberOfDaysForInstallments(7);
			if (props?.action === 2) {
				setShowCancel(false);
				const messageData = `Actualizando datos de la cuenta por ${props.title} No: ${props.idDebt}`
				setTitleForm(messageData);
				(async (): Promise<any> => {
					await searchDatas(pathRoute, messageData).then((dataFound) => {
						if (dataFound === undefined) {
							setActivatedButton(true);
							return 0;
						}
						const _data = dataFound.data[0];
						setValue('idCommon', _data.idCommon);
						setValue('debtDescription', _data.debtDescription);
						setValue('dateDebts', new Date(_data.dateDebts));
						setValue('amountDebt', _data.amountDeb);
						setValue('numberOfPayments', _data.numberOfPayments);
						setValue('amountToBePaidIninstallments', _data.amountToBePaidIninstallmentsQuery);
						//setValue('numberOfDaysForInstallments', _data.numberOfDaysForInstallments);
						setValue('paymentStartDate', new Date(_data.paymentStartDate));
						setValue('paymentNumber', _data.paymentNumber);
						setValue('amountPaid', _data.amountPaidQuery);
						setValue('remainingDebt', _data.remainingDebtQuery);
						setValue('observations', _data.observations);
						setValue('debtPaid', _data.debtPaid);
						setIdCommon(_data.idCommon);
						setCommonName(_data.commonName);
						setDateDebts(new Date(_data.dateDebts));
						setPaymentStartDate(new Date(_data.paymentStartDate));
						setAmountToBePaidIninstallments(_data.amountToBePaidIninstallmentsQuery);
						setAmountDebt(_data.amountDebtQuery);
						setNumberOfPayments(_data.numberOfPayments);
						//setNumberOfDaysForInstallments(_data.numberOfDaysForInstallments);
						setShowAdditional(true);
						if (_data.paymentNumber > 0) {
							setActivatedEdit(true);
							settingSnackBar(
								'No se puede cambiar el monto de la deuda porque existen pagos registrados',
								'error'
							);
							openSnackBar();
						}
					});
				})();
			}
		}
	}, []);

	const myHandleSubmit = async () => {
		calculatingAmountsForQuotas();
		let _amountDebt: any = parseFloat(valueDecimal(amountDebt));
		let _numberOfPayments: any = parseInt(valueInteger(numberOfPayments));
		let _idCommon: number = parseInt(idCommon);
		setValue('amountDebt', _amountDebt);
		setValue('dateDebts', dateDebts);
		setValue('paymentStartDate', paymentStartDate);
		setValue('numberOfPayments', _numberOfPayments);
		setValue('amountToBePaidIninstallments', amountToBePaidIninstallments);
		//setValue('numberOfDaysForInstallments', numberOfDaysForInstallments);

		const dataRecord: IAccountsPayableReceibable = getValues();
		delete dataRecord.admissionDate;
		delete dataRecord.paymentNumber;
		delete dataRecord.amountPaid;
		delete dataRecord.debtPaid;
		delete dataRecord.remainingDebt;

		const _dateDebts: TDate = convertDateMysql(getValues('dateDebts'));
		const _paymentStartDate: TDate = convertDateMysql(getValues('paymentStartDate'));
		dataRecord.idCommon = _idCommon;
		dataRecord.dateDebts = _dateDebts;
		dataRecord.paymentStartDate = _paymentStartDate;

		await recordData(dataRecord, route).then((dataRegister) => {
			if (dataRegister.rowAffect > 0) {
				if (props.action === 1) {
					handleReset(); // reset after form submit
				}
			}
		});
	};

	const { asking, DialogSave } = useDialogSave({
		actionAccept: myHandleSubmit,
	});

	const calculatingAmountsForQuotas = () => {
		// !calcula los montos por cuotas
		let _amountDebt: number = amountDebt.length === 0 ? 0 : parseFloat(valueDecimal(amountDebt));
		let _numberOfPayments: number = numberOfPayments.length === 0 ? 0 : parseInt((numberOfPayments))

		setAmountToBePaidIninstallments(0);
		if ((_amountDebt > 0) && (_numberOfPayments > 0)) {
			let result: number = _amountDebt / _numberOfPayments;
			setAmountToBePaidIninstallments(result);
		}
	};
	const handleAmountDebt = (event: any): void => {
		let valor: string = event.target.value;
		setAmountDebt(() => valor);
		handleMonto(valor)
	};

	const handleNumberOfPayment = (event: any): void => {
		let valor: string = event.target.value;
		if (valor.length === 0) {
			setNumberOfPayments('1')
		} else {
			setNumberOfPayments(() => valor);
		}
	};

	const handleReset = () => {
		reset();
		setAmountDebt(() => '');
		setAmountToBePaidIninstallments(() => defaultValues.amountToBePaidIninstallments);
		setDateDebts(new Date());
		setPaymentStartDate(new Date());
		setNumberOfPayments(defaultValues.numberOfPayments.toString());
		//setNumberOfDaysForInstallments(() => defaultValues.numberOfDaysForInstallments);
		setCommonName(() => null);
		setIdCommon(() => '0');
	};

	const handleIdCommon = (params: any) => {
		if (validateValue(params) === true) {
			setCommonName(() => params['label']);
			setIdCommon(() => params['value']);
		} else {
			setCommonName(() => null);
			setIdCommon(() => '0');
		}
	};

	return (
		<>
			<Suspense fallback={<h1>Loading profile...</h1>}>
				<DesigForm
					title={titleForm}
					saveData={handleSubmit(asking)}
					resetData={() => handleReset()}
					showButtonCancel={showCancel}
					watchDialog={props?.watchDialog}
					activatedButton={activatedButton}>
					{/* {ShowMessageSearch}
					{ShowSnackBarSave} */}
					{DialogSave}
					{/*  {ShowSnackBar} */}
					{ShowExchange}
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
							name='idDebt'
							control={control}
							defaultValue={props?.idDebt}
							render={({ field }) => <input type='hidden' id={field.name} {...field} />}
						/>
						<Grid container spacing={1}>
							<Grid container spacing={1} style={styleItem}>
								<Grid item={true} xs={_xs} sm={_sm} md={_md} xl={_xl} lg={_lg} style={styleItem}>
									<Suspense fallback={<h1>Loading data of List...</h1>}>
										<Controller
											name='idCommon'
											control={control}
											rules={{
												validate: {
													checkItems: () => {
														if (commonName === '') {
															return ERROR_LIST;
														}
													},
												},
											}}
											render={({ field }) => (
												<Suspense fallback={<h1>Loading data of List...</h1>}>
													<Autocomplete
														value={commonName}
														options={listCommon}
														isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
														id={field.name}
														onChange={(event: any, newValue: any) => {
															handleIdCommon(newValue);
														}}
														renderInput={(params) => (
															<TextField
																{...params}
																{...field}
																label={props.titleCustomersAcreditor}
																fullWidth
																helperText={showErrorMessage(errors.idCommon)}
															/>
														)}
													/>
												</Suspense>
											)}
										/>

									</Suspense>
								</Grid>
								<Grid item={true} xs={_xs} sm={_sm} md={_md} xl={_xl} lg={_lg} style={styleItem}>
									<Controller
										name='debtDescription'
										control={control}
										rules={{
											required: VALUE_REQUIRED,
											minLength: { value: 5, message: MINLENGTH + 5 },
											maxLength: { value: 250, message: MAXLENGTH + 250 },
										}}
										render={({ field }) => (
											<TextField
												type='search'
												id={field.name}
												label='Descripción de la Cuenta'
												variant='outlined'
												{...field}
												multiline
												helperText={showErrorMessage(errors.debtDescription)}
												fullWidth
											/>
										)}
									/>
								</Grid>


								<Grid item={true} xs={_xs} sm={_sm} md={_md} xl={_xl} lg={_lg} style={styleItem}>
									<Controller
										name={'dateDebts'}
										control={control}
										rules={{
											validate: {
												checkDate: () => {
													let valid = formatDateLantino(dateDebts);
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
													mask={formatoFecha}
													disableFuture
													label='Fecha de adquisición de la deuda'
													openTo='day'
													views={['year', 'month', 'day']}
													value={dateDebts}
													onChange={(newValue: any) => {
														setDateDebts(newValue);
													}}
													renderInput={(params) => (
														<TextField
															{...params}
															{...field}
															helperText={showErrorMessage(errors['dateDebts'])}
															fullWidth
														/>
													)}
												/>
											</LocalizationProvider>
										)}
									/>
								</Grid>

								<Grid item={true} xs={_xs} sm={_sm} md={_md} xl={_xl} lg={_lg} style={styleItem}>
									<Controller
										name='amountDebt'
										control={control}
										rules={{
											validate: {
												checkItems: () => {
													if (
														validateValue(amountDebt) === false ||
														parseFloat(valueDecimal(amountDebt)) <= 0
													) {
														return ERROR_ZERO;
													}
													if (parseFloat(valueDecimal(amountDebt)) >= MAX_LENGTH_INT) {
														return MESSAGE_MAX_NUMERIC;
													}
												},
											},
										}}
										render={({ field }) => {
											return (
												<NumericFormat
													id={field.name}
													label='Monto de la deuda'
													variant='outlined'
													fullWidth
													thousandSeparator='.'
													//isNumericString
													decimalSeparator=','
													decimalScale={2}
													allowNegative={false}
													disabled={activatedEdit}
													helperText={showErrorMessage(errors.amountDebt)}
													/* {...field} */
													value={amountDebt}
													onChange={(e: any) => {
														field.onChange(e.value);
														handleAmountDebt(e);
														calculatingAmountsForQuotas();
													}}
													onBlur={() => {
														calculatingAmountsForQuotas();
													}}
													customInput={TextField}
												/>
											);
										}}
									/>
								</Grid>
							</Grid>

							<Grid container spacing={1} style={styleItem} justifyContent="center" alignItems="center">
								<Grid item={true} xs={_xs} sm={_sm} md={_md} xl={_xl} lg={_lg} style={styleItem}>
									<Controller
										name='numberOfPayments'
										control={control}
										rules={{
											validate: {
												checkItems: () => {
													if (
														validateValue(numberOfPayments) === false ||
														parseInt(valueInteger(numberOfPayments)) <= 0
													) {
														return ERROR_ZERO;
													}
													if (parseInt(valueInteger(numberOfPayments)) > 20) {
														return 'Las cuotas de pago no deben ser mayores a 20';
													}
												},
											},
										}}
										render={({ field }) => {
											return (
												<NumericFormat
													id={field.name}
													label='Número de Cuotas para pagar la deuda'
													variant='outlined'
													fullWidth
													allowNegative={false}
													helperText={showErrorMessage(errors.numberOfPayments)}
													/* {...field} */
													value={numberOfPayments}
													onChange={(e: any) => {
														field.onChange(e.value);
														handleNumberOfPayment(e);
														calculatingAmountsForQuotas();
													}}
													onBlur={() => {
														calculatingAmountsForQuotas();
													}}
													customInput={TextField}
												/>
											);
										}}
									/>
								</Grid>
								<Grid item={true} xs={_xs} sm={_sm} md={_md} xl={_xl} lg={_lg} style={styleItem}>
									<Controller
										name='amountToBePaidIninstallments'
										control={control}
										render={({ field }) => {
											return (
												<NumericFormat
													id={field.name}
													label='Monto por cuotas'
													/* {...field} */
													variant='outlined'
													fullWidth
													thousandSeparator='.'
													//isNumericString
													decimalSeparator=','
													decimalScale={2}
													disabled={true}
													allowNegative={false}
													/* 	{...field} */
													value={amountToBePaidIninstallments}
													customInput={TextField}
												/>
											);
										}}
									/>
								</Grid>

								<Grid item={true} xs={_xs} sm={_sm} md={_md} xl={_xl} lg={_lg} style={styleItem}>
									<Controller
										name='paymentStartDate'
										control={control}
										rules={{
											validate: {
												checkDate: () => {
													let valid = formatDateLantino(paymentStartDate);
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
													mask={formatoFecha}
													label='Fecha inicio de pago'
													openTo='day'
													views={['year', 'month', 'day']}
													value={paymentStartDate}
													onChange={(newValue) => {
														setPaymentStartDate(newValue);
													}}
													renderInput={(params) => (
														<TextField
															{...params}
															helperText={showErrorMessage(errors['paymentStartDate'])}
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
								<Grid container spacing={1} style={styleItem} justifyContent="center" alignItems="center">
									<Grid item={true} xs={_xs} sm={_sm} md={_md} xl={_xl} lg={_lg} style={styleItem}>
										<h4>Cuotas pagadas</h4>
										<Alert severity='success'>{getValues('paymentNumber')}</Alert>
									</Grid>

									<Grid item={true} xs={_xs} sm={_sm} md={_md} xl={_xl} lg={_lg} style={styleItem}>
										<h4>Total pagado</h4>
										<Alert severity='warning'>{getValues('amountPaid')}</Alert>
									</Grid>

									<Grid item={true} xs={_xs} sm={_sm} md={_md} xl={_xl} lg={_lg} style={styleItem}>
										<h4>Restante de la deuda</h4>
										<Alert severity='error'>{getValues('remainingDebt')}</Alert>
									</Grid>

									<Grid item={true} xs={_xs} sm={_sm} md={_md} xl={_xl} lg={_lg} style={styleItem}>
										<h4>Deuda cancelada</h4>
										<Alert severity='info'>{getValues('debtPaid')}</Alert>
									</Grid>
								</Grid>
							)}
						</Grid>
					</form>
				</DesigForm>
			</Suspense>
		</>
	);
}
