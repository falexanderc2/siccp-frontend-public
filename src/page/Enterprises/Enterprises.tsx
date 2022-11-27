import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DesigForm } from '../../components/Form/DesigForm';
import useDialogSave from '../../hooks/useDialogoSave';
import useErrorMessage from '../../hooks/useErrorMessage';
import useRecordData from '../../hooks/useRecordData';
import useSearchData from '../../hooks/useSearchData';
import { IEnterprises, IPropsBasic } from '../../interfaces/interfaces';
import { MAXLENGTH, MINLENGTH, VALUE_REQUIRED } from '../../setup/environment';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

const defaultValues: IEnterprises = {
	action: 1,
	idEnterprise: 0,
	enterprisesName: '',
	password: '',
	passwordConfirmation: '',
	email: '',
	activated: 'SI',
	admissionDate: '',
};
export default function Enterprises (props: IPropsBasic) {
	let loadUseEffect: boolean = false
	const route: string = `enterprises`;
	const pathRoute: string = `${route}/search/${props.idEnterprise}`;
	const [showCancel, setShowCancel] = useState(true);
	const [titleForm, setTitleForm] = useState('Ingresando Empresas');
	const [activatedButton, setActivatedButton] = useState<boolean>(false);
	const disabledEmail: boolean = props.action === 1 ? false : true;
	const { control, handleSubmit, getValues, reset, formState: { errors }, setValue, } = useForm<IEnterprises>({ defaultValues });
	const { searchDatas } = useSearchData();
	const { recordData } = useRecordData();
	const { showErrorMessage } = useErrorMessage();

	useEffect(() => {
		if (props?.action === 2) {
			if (!loadUseEffect) {
				loadUseEffect = true
				setShowCancel(false);
				setTitleForm('Actualizando Empresas');
				(async (): Promise<any> => {
					await searchDatas(`${pathRoute}`, 'Buscando los datos').then((dataFound) => {
						if (dataFound === undefined) {
							setActivatedButton(true);
							return 0;
						}

						const _data = dataFound.data[0];
						setValue('action', props.action);
						setValue('idEnterprise', _data.idEnterprise);
						setValue('enterprisesName', _data.enterprisesName);
						setValue('email', _data.email);
						setValue('activated', _data.activated);
					});
				})();
			}
		}
	}, []);

	const myHandleSubmit = async () => {
		const dataRecord: IEnterprises = getValues();
		delete dataRecord.admissionDate;
		delete dataRecord.passwordConfirmation;
		await recordData(dataRecord, route).then((response) => {
			if (response.rowAffect > 0) {
				if (props.action === 1) {
					reset(); // reset after form submit
				}
			}
		});
	};

	const { asking, DialogSave } = useDialogSave({
		actionAccept: myHandleSubmit,
	});

	return (
		<div>
			<DesigForm
				title={titleForm}
				saveData={handleSubmit(asking)}
				resetData={reset}
				showButtonCancel={showCancel}
				watchDialog={props?.watchDialog}
				activatedButton={activatedButton}>
				{DialogSave}
				{/* 	{ShowSnackBarSave}
				{ShowMessageSearch} */}
				<form onSubmit={handleSubmit(myHandleSubmit)} noValidate>
					<Controller
						name='action'
						control={control}
						defaultValue={props.action}
						render={({ field }) => <input type='hidden' id={field.name} {...field} />}
					/>
					<Controller
						name='activated'
						control={control}
						defaultValue='SI'
						render={({ field }) => <input type='hidden' id={field.name} {...field} />}
					/>
					<Controller
						name='idEnterprise'
						control={control}
						defaultValue={props.idEnterprise}
						render={({ field }) => <input type='hidden' id={field.name} {...field} />}
					/>
					<Grid container spacing={2} direction='column' >
						<Grid item={true} style={{ marginTop: '5px' }}>
							<Controller
								name='enterprisesName'
								control={control}
								rules={{
									required: VALUE_REQUIRED,
									minLength: { value: 3, message: MINLENGTH + 3 },
									maxLength: { value: 60, message: MAXLENGTH + 60 },
								}}
								render={({ field }) => (
									<TextField
										type='search'
										id={field.name}
										label='Nombre de la empresa'
										variant='outlined'
										{...field}
										helperText={showErrorMessage(errors.enterprisesName)}
										fullWidth
									/>
								)}
							/>
						</Grid>

						<Grid item={true}>
							<Controller
								name='password'
								control={control}
								rules={{
									required: VALUE_REQUIRED,
									minLength: { value: 3, message: MINLENGTH + 3 },
									maxLength: { value: 20, message: MAXLENGTH + 20 },
								}}
								render={({ field }) => (
									<TextField
										type='password'
										id={field.name}
										label='Password'
										variant='outlined'
										{...field}
										helperText={showErrorMessage(errors.password)}
										fullWidth
									/>
								)}
							/>
						</Grid>

						<Grid item={true}>
							<Controller
								name='passwordConfirmation'
								control={control}
								rules={{
									required: VALUE_REQUIRED,
									minLength: { value: 3, message: MINLENGTH + 3 },
									maxLength: { value: 20, message: MAXLENGTH + 20 },
									validate: {
										matchesPreviousPassword: (value) => {
											const { password } = getValues();
											return password === value || 'Password y confirmación debe coincidir!';
										},
									},
								}}
								render={({ field }) => (
									<TextField
										type='password'
										id={field.name}
										label='Confirmación de Password'
										variant='outlined'
										{...field}
										helperText={showErrorMessage(errors.passwordConfirmation)}
										fullWidth
									/>
								)}
							/>
						</Grid>

						<Grid item={true}>
							<Controller
								name='email'
								control={control}
								rules={{
									required: VALUE_REQUIRED,
									minLength: { value: 3, message: MINLENGTH + 3 },
									maxLength: { value: 50, message: MAXLENGTH + 50 },
									pattern: {
										value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
										message: 'El valor ingresado no coincide con el formato de correo electrónico',
									},
								}}
								render={({ field }) => (
									<TextField
										disabled={disabledEmail}
										type='search'
										id={field.name}
										label='Email'
										variant='outlined'
										{...field}
										helperText={showErrorMessage(errors.email)}
										fullWidth
									/>
								)}
							/>
						</Grid>
					</Grid>
				</form>
			</DesigForm>
		</div>
	);
}
