import useBackdrop from '../../hooks/useBackdrop';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import { blue } from '@mui/material/colors';
import PersonIcon from '@mui/icons-material/Person';
import ManageAccounts from '@mui/icons-material/ManageAccounts';
import BusinessCenter from '@mui/icons-material/BusinessCenter';
import LoadingButton from '@mui/lab/LoadingButton';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import IconVpnKey from '@mui/icons-material/VpnKey';
import { useState, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { MAXLENGTH, MINLENGTH, VALUE_REQUIRED, } from '../../setup/environment';
import useErrorMessage from '../../hooks/useErrorMessage';
import useSnackBar from '../../hooks/useSnackBar';
import TextField from '@mui/material/TextField';
import { AppProvider } from '../../context/userContext';
import { SYSTEM_NAME, MADE_BY } from '../../services/servidor';
import MenuPrincipal from '../../components/Menu/MenuPrincipal';
import postData from '../../services/postData';
import { ILogin, IPropsUser, defaultValueUser } from '../../interfaces/loginInterfaces';
import Link from '@mui/material/Link';
import { PATH_ENTERPRISES, PATH_ADMINISTRATOR } from '../../services/servidor';
import './login.css'

const defaultValues: ILogin = {
	email: '',
	password: '',
};


type typeUsers = 'ADMINISTRATOR' | 'ENTERPRISES';

// ! NOTA: en este hooks se utilizo un useRef y no un useState porque el useState no se actualiza de forma instantanea es de forma asincrona y se debia hacer 2 veces el proceso de validación de usuario para que tomará el primer valor que se introducia, por el contrario el useRef se autualiza de forma sincrona lo que permite que los valores sean correcto desde el primer intento

export default function Login () {
	const [route, setRoute] = useState<string>(PATH_ENTERPRISES)
	const [title, setTitle] = useState<string>('MODULO PARA EMPRESAS')
	const [typeUser, setTypeUser] = useState<typeUsers>('ENTERPRISES')
	const { openSnackBar, settingSnackBar } = useSnackBar();
	const { control, handleSubmit, getValues, setValue, formState: { errors }, } = useForm<ILogin>({ defaultValues });
	const { showErrorMessage } = useErrorMessage();
	const [login, setLogin] = useState<boolean>(false);
	const { ShowBackdrop, openBackdrop, closeBackdrop } = useBackdrop();
	const userLogin = useRef<IPropsUser>(defaultValueUser);

	const handleUser = (optionUser: typeUsers) => {
		const email = optionUser === 'ADMINISTRATOR' ? '' : ''
		setTypeUser(optionUser)
		setRoute(optionUser === 'ADMINISTRATOR' ? PATH_ADMINISTRATOR : PATH_ENTERPRISES)
		setValue('email', email)
		setTitle(optionUser === 'ADMINISTRATOR' ? 'MODULO PARA ADMINISTRADOR' : 'MODULO PARA EMPRESAS')

	}
	const myHandleSubmit = async () => {
		let message: '';
		const dataSearch: ILogin = getValues();
		(async (): Promise<any> => {
			openBackdrop();
			const headers = {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				Accept: '*/*',
			};
			let _data: any;
			await postData(dataSearch, `${route}`, headers)
				.then((data) => {
					_data = data;
					message = _data.messageInfo;
					if (!_data.errorFound) {
						if ((_data.token === undefined) || (_data.token === null)) {
							throw 'Ocurrio un error en el asignamiento de token. El usuario no le asignaron token.! Intentelo más tarde.';
						}
						let _dataUser: IPropsUser = _data
						_dataUser.logout = false
						_dataUser.typeUser = typeUser
						userLogin.current = _dataUser;
						if (userLogin.current.activated !== 'SI') {
							throw 'El usuario esta bloqueado. Comuniquese con el administrador del sistema.';
						}
						settingSnackBar(message, 'success');
						openSnackBar();
						closeBackdrop();
						setLogin(() => true);
					} else {
						throw data.messageInfo;
					}
				})
				.catch((error: any) => {
					closeBackdrop();
					setLogin(() => false);
					settingSnackBar(error.message, 'error');
					openSnackBar();
				});
		})();
	};

	const menuUser = (
		<div style={{ marginTop: '12px', marginBottom: '3rem' }}>
			<Tooltip title='Entrar como empresa' placement='bottom' arrow>
				<Link
					component="button"
					variant="button"
					onClick={() => {
						handleUser('ENTERPRISES');
					}}
				>
					<Avatar sx={{ bgcolor: 'teal', marginRight: '12px' }} aria-label='recipe'>
						<BusinessCenter />
					</Avatar>
				</Link>
			</Tooltip>
			<Tooltip title='Entrar como Administrador del sitio' placement='bottom' arrow>
				<Link
					component="button"
					variant="button"
					onClick={() => {
						handleUser('ADMINISTRATOR');
					}}
				>
					<Avatar sx={{ bgcolor: blue[500] }} aria-label='recipe'>
						<ManageAccounts />
					</Avatar>
				</Link>
			</Tooltip>
		</div>
	)

	const formLogin = (
		<div className='login'>
			<Card sx={{ maxWidth: 'auto' }}>
				<Grid container direction='column' justifyContent='center' spacing={1}
					style={{ justifyContent: 'center' }}>
					{ShowBackdrop}
					{/* {ShowSnackBar} */}
					<Grid item={true} >
						<CardHeader
							avatar={
								<Avatar sx={{ bgcolor: blue[500] }} aria-label='recipe'>
									<PersonIcon />
								</Avatar>
							}
							title={`${SYSTEM_NAME} (${title})`}
							subheader={MADE_BY}
						/>
					</Grid>
					<CardContent>

						<form onSubmit={handleSubmit(myHandleSubmit)} noValidate>
							<Grid container direction='column' rowGap={2}>
								<Grid item={true} style={{ marginLeft: '10px', marginRight: '10px' }} >
									<Controller
										name='email'
										control={control}
										rules={{
											required: VALUE_REQUIRED,
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

											/>
										)}
									/>

								</Grid>

								<Grid item={true} style={{ marginLeft: '10px', marginRight: '10px' }} >
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
									<CardActions disableSpacing style={{ justifyContent: 'center' }}>
										<Tooltip title='Entrar' placement='bottom' arrow>
											<LoadingButton
												color='primary'
												type='submit'
												//loading={loadingSearch}
												loadingPosition='start'
												startIcon={<IconVpnKey />}
												variant='contained'
											//	disabled={activatedButton}
											>
												Entrar
											</LoadingButton>
										</Tooltip>
									</CardActions>
								</Grid>
							</Grid>
						</form>
					</CardContent>
				</Grid>
				<Grid container direction='row' justifyContent='center' spacing={1}>
					<Grid item={true}>
						{menuUser}
					</Grid>
				</Grid>
			</Card>
		</div >
	);

	return (
		<>
			{!login && formLogin}
			{login && (
				<AppProvider>
					<MenuPrincipal dataUser={userLogin.current} />
				</AppProvider>
			)}
		</>
	);
}
