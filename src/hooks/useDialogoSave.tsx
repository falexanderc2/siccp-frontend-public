import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { red, green, blue } from '@mui/material/colors';
import { IconButton } from '@mui/material';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';

const Root = styled('div')(({ theme }) => ({
	padding: theme.spacing(1),
	[theme.breakpoints.down('md')]: {
		backgroundColor: red[500],
	},
	[theme.breakpoints.up('md')]: {
		backgroundColor: blue[500],
	},
	[theme.breakpoints.up('lg')]: {
		backgroundColor: green[500],
	},
}));

interface TProps {
	message?: string;
	messageCheckAmount?: string;
	actionAccept?: () => Promise<any>;
}

export default function useDialogSave (props: TProps) {
	const [message, setMessage] = useState<string>('¿Desea almacenar los datos?');
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.up('md'));
	const [cancelDialog, setCancelDialog] = useState<boolean>(false);

	const handleAccept = () => {
		props?.actionAccept && props?.actionAccept();
		hideCancelDialog();
	};

	const hideCancelDialog = () => {
		setCancelDialog(false);
	};
	const cancelDialogFooter = (
		<>
			<IconButton
				color='primary'
				onClick={hideCancelDialog}
				key='no-dialog1'
				size='large'
			>
				<HighlightOffRoundedIcon fontSize="inherit" />
			</IconButton>
			<IconButton
				color='primary'
				onClick={handleAccept}
				key='update-button'
				size='large'
			>
				<CheckCircleOutlineRoundedIcon fontSize="inherit" />
			</IconButton>
		</>
	);

	const cancelDialogAceptar = (
		<Button color='primary' onClick={hideCancelDialog} variant='contained'>
			Aceptar
		</Button>
	);

	const DialogSave = (
		<Dialog
			//fullScreen={fullScreen}
			open={cancelDialog}
			onClose={hideCancelDialog}
			aria-labelledby='responsive-dialog-title'
			id='dialog-anular'>
			<DialogTitle id='responsive-dialog-title'>{'CONFIRMACIÓN'}</DialogTitle>
			<DialogContent>
				<DialogContentText>{<span>{message}</span>}</DialogContentText>
			</DialogContent>
			<DialogActions>{cancelDialogFooter}</DialogActions>
		</Dialog>
	);

	const asking = () => {
		setCancelDialog(true);
	};

	const checkAmount = (amount: number, remainingDebt: number) => {
		if (amount > remainingDebt) {
			const resultado = amount - remainingDebt;
			setMessage(
				`EL VALOR A PAGAR ES MAYOR QUE LA DEUDA, POR LO TANTO SE CREARA UNA CUENTA POR ${props.messageCheckAmount} POR UN VALOR DE ${resultado}. ¿DESEA CONTINUAR?`
			);
		} else {
			props?.message !== undefined && setMessage(props?.message);
		}
		asking();
	};

	return { asking, checkAmount, DialogSave };
}
