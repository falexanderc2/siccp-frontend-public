import { useEffect, useState, Suspense } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DesigForm } from '../../components/Form/DesigForm';
import useDialogSave from '../../hooks/useDialogoSave';
import useErrorMessage from '../../hooks/useErrorMessage';
import useListSelection from '../../hooks/useListSelection';
import useRecordData from '../../hooks/useRecordData';
import useSearchData from '../../hooks/useSearchData';
import { IPropsCreditorsCustomers, ICreditorsCustomers } from '../../interfaces/commonInterfaces';
import { MAXLENGTH, MINLENGTH, VALUE_REQUIRED, ERROR_LIST } from '../../setup/environment';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import useValidValue from '../../hooks/useValidValue';

const reputationItems = [
	{ label: 'SIN EVALUACION', value: '1' },
	{ label: 'REGULAR', value: '2' },
	{ label: 'BUENO', value: '3' },
	{ label: 'MUY BUENO', value: '4' },
	{ label: 'EXCELENTE', value: '5' },
	{ label: 'MALO', value: '-1' },
];

const activatedItems = [
	{ label: 'SI', value: 'SI' },
	{ label: 'NO', value: 'NO' },
];

const defaultValues: ICreditorsCustomers = {
	action: 1,
	idEnterprise: 0,
	idCommon: 0,
	commonName: '',
	phone: '',
	address: '',
	email: '',
	observations: '',
	reputation: 'SIN EVALUACION',
	activated: 'SI',
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
const _xl = 2.4;
const _lg = 2.4;

const styleItem = {
	marginTop: '7px',
}

export default function CustomersCreditors (props: IPropsCreditorsCustomers) {
	let loadUseEffect: boolean = false
	const route: string = props.pathRoute;
	const pathRoute: string = `${route}/search/${props.idEnterprise}/${props.idCommon}`;
	defaultValues.idEnterprise = props.idEnterprise;
	defaultValues.idCommon = props.idCommon;
	const { control, handleSubmit, getValues, reset, formState: { errors }, setValue, } = useForm<ICreditorsCustomers>({ defaultValues });
	const { checkTypeOf } = useListSelection();
	const [showCancel, setShowCancel] = useState(true);
	const [activatedButton, setActivatedButton] = useState<boolean>(false);
	const [titleForm, setTitleForm] = useState('Ingresando ' + props.title);
	const [showAdditional, setShowAdditional] = useState<boolean>(false);
	const { showErrorMessage } = useErrorMessage();
	const [reputation, setReputation] = useState<string[]>([]);
	const [reputationInputValue, setReputationInputValue] = useState<any | null>(null);
	const [activated, setActivated] = useState<any | null>(activatedItems[0]);
	const [activatedInputValue, setActivatedInputValue] = useState<any>('SI');
	const { searchDatas, ShowMessageSearch } = useSearchData();
	const { recordData, ShowSnackBarSave } = useRecordData();
	const { validateValue } = useValidValue();

	useEffect(() => {
		setValue('action', props.action);
		if (!loadUseEffect) {
			loadUseEffect = true
			if (props?.action === 2) {
				setShowCancel(false);
				setTitleForm('Actualizando ' + props.title);
				(async (): Promise<any> => {
					await searchDatas(`${pathRoute}`, `Buscando datos de ${props.title}`).then((dataFound) => {
						if (dataFound === undefined) {
							setActivatedButton(true);
							return 0;
						}
						const _data = dataFound.data[0];
						setValue('idCommon', _data.id);
						setValue('commonName', _data.commonName);
						setValue('address', _data.address);
						setValue('phone', _data.phone);
						setValue('email', _data.email);
						setValue('observations', _data.observations);
						setValue('reputation', _data.reputation);
						setValue('activated', _data.activated);
						setTitleForm('Actualizando Clientes No: ' + props.idCommon);
						setReputationInputValue(() => _data.reputation);
						setActivatedInputValue(() => _data.activated);
						setShowAdditional(true);
					});
				})();
			}
		}
	}, []);

	const handleReputation = (params: any) => {
		if (validateValue(params) === true) {
			setReputationInputValue(() => params['label']);
			setReputation(() => params['value']);
		}
	};

	const handleActivated = (params: any) => {
		if (validateValue(params) === true) {
			setActivatedInputValue(() => params['label']);
			setActivated(() => params['value']);
		}
	};

	const myHandleSubmit = async () => {
		const dataRecord: ICreditorsCustomers = getValues();
		delete dataRecord.admissionDate;
		let _activated: any = checkTypeOf(getValues('activated'), 'activated');
		let _reputation: any = checkTypeOf(getValues('reputation'), 'reputation');
		dataRecord.reputation = _reputation;
		dataRecord.activated = _activated;
		dataRecord.reputation = reputationInputValue;
		dataRecord.activated = activatedInputValue;
		await recordData(dataRecord, route).then((response) => {
			if (response.rowAffect > 0) {
				if (props.action === 1) {
					reset();
				}
			}
		});
	};

	const { asking, DialogSave } = useDialogSave({
		actionAccept: myHandleSubmit,
	});

	return (
		<>
			<Suspense fallback={<h1>Loading data...</h1>}>
				<DesigForm
					title={titleForm}
					saveData={handleSubmit(asking)}
					resetData={reset}
					showButtonCancel={showCancel}
					watchDialog={props?.watchDialog}
					activatedButton={activatedButton}>
					{DialogSave}
					{/* {ShowSnackBarSave}
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
							name='idCommon'
							control={control}
							defaultValue={props.idCommon}
							render={({ field }) => <input type='hidden' id={field.name} {...field} />}
						/>

						<Grid container spacing={1} direction='column' >
							<Grid container spacing={1} style={styleItem}>
								<Grid item={true} xs={_xs} sm={_sm} md={_md} xl={_xl} lg={_lg} style={styleItem}>
									<Controller
										name='commonName'
										control={control}
										rules={{
											required: VALUE_REQUIRED,
											minLength: { value: 3, message: MINLENGTH + 3 },
											maxLength: { value: 150, message: MAXLENGTH + 150 },
										}}
										render={({ field }) => (
											<TextField
												type='search'
												id={field.name}
												label='Nombres'
												variant='outlined'
												{...field}
												helperText={showErrorMessage(errors.commonName)}
												multiline
												fullWidth
											/>
										)}
									/>
								</Grid>

								<Grid item={true} xs={_xs} sm={_sm} md={_md} xl={_xl} lg={_lg} style={styleItem}>
									<Controller
										name='address'
										control={control}
										rules={{
											maxLength: { value: 150, message: MAXLENGTH + 150 },
										}}
										render={({ field }) => (
											<TextField
												type='search'
												id={field.name}
												label='Dirección'
												variant='outlined'
												{...field}
												helperText={showErrorMessage(errors.address)}
												fullWidth
												multiline
											/>
										)}
									/>
								</Grid>

								<Grid item={true} xs={_xs} sm={_sm} md={_md} xl={_xl} lg={_lg} style={styleItem}>
									<Controller
										name='phone'
										control={control}
										rules={{
											maxLength: { value: 40, message: MAXLENGTH + 40 },
										}}
										render={({ field }) => (
											<TextField
												type='search'
												id={field.name}
												label='N° de teléfonos'
												variant='outlined'
												{...field}
												helperText={showErrorMessage(errors.phone)}
												fullWidth
											/>
										)}
									/>
								</Grid>

								<Grid item={true} xs={_xs} sm={_sm} md={_md} xl={_xl} lg={_lg} style={styleItem}>
									<Controller
										name='email'
										control={control}
										rules={{
											maxLength: { value: 40, message: MAXLENGTH + 40 },
											pattern: {
												value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
												message: 'Formato de correo electrónico incorrecto',
											},
										}}
										render={({ field }) => (
											<TextField
												type='search'
												id={field.name}
												label='Email'
												variant='outlined'
												{...field}
												helperText={showErrorMessage(errors.email)}
												fullWidth
												multiline
											/>
										)}
									/>
								</Grid>
								<Grid item={true} xs={12} sm={12} md={12} xl={_xl} lg={_lg} style={styleItem}>
									<Controller
										name='reputation'
										control={control}
										rules={{
											validate: {
												checkItems: () => {
													if (reputationInputValue === '' || reputationInputValue === null) {
														return ERROR_LIST;
													}
												},
											},
										}}
										render={({ field }) => (
											<Suspense fallback={<h1>Loading datos...</h1>}>
												<Autocomplete
													value={reputationInputValue}
													options={reputationItems}
													id={field.name}
													onChange={(event: any, newValue: any) => {
														handleReputation(newValue);
													}}
													renderInput={(params) => (
														<TextField
															{...params}
															label='Reputación'
															fullWidth
															helperText={showErrorMessage(errors.reputation)}
														/>
													)}
												/>
											</Suspense>
										)}
									/>
								</Grid>
							</Grid>
							<Grid container spacing={1} style={styleItem}>
								{showAdditional && (
									<Grid item={true} xs={12} sm={6} md={6} xl={6} lg={6} style={styleItem}>
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
								)}
								{showAdditional && (
									<Grid item={true} xs={12} sm={6} md={6} xl={6} lg={6} style={styleItem}>
										<Controller
											name='activated'
											control={control}
											rules={{
												validate: {
													checkItems: () => {
														if (activatedInputValue === '' || activatedInputValue === null) {
															return ERROR_LIST;
														}
													},
												},
											}}
											render={({ field }) => (
												<Autocomplete
													value={activatedInputValue}
													options={activatedItems}
													id={field.name}
													isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
													onChange={(event: any, newValue: any) => {
														handleActivated(newValue);
													}}
													renderInput={(params) => (
														<TextField
															{...params}
															label='Activado'
															fullWidth
															helperText={showErrorMessage(errors.activated)}
														/>
													)}
												/>
											)}
										/>
									</Grid>
								)}
							</Grid>
						</Grid>
					</form>
				</DesigForm>
			</Suspense>
		</>
	);
}
