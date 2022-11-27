import { forwardRef, useState, useRef } from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { VariantType, useSnackbar, SnackbarMessage } from 'notistack';


/* const Alert = forwardRef(function Alert (props: any, ref: any) {
	return (
		<MuiAlert elevation={6} ref={ref} variant='filled'>
			{props._message}
		</MuiAlert>
	);
}); */

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert (
	props,
	ref,
) {
	return <MuiAlert elevation={6} ref={ref}
		variant="filled" {...props} />;
});

export default function useSnackBar () {
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const [open, setOpen] = useState<boolean>(false);
	const [message, setMessage] = useState<any>('');
	const [typeSummary, setTypeSummary] = useState<any>('success');
	const _ref = useRef(null);
	let messageSnackbar: SnackbarMessage = '';
	let colorMessage: VariantType = 'info'

	const action = (snackbarId: any) => (
		<>
			<IconButton
				size="small"
				onClick={() => { closeSnackbar(snackbarId) }}
			>
				<CloseIcon fontSize="small" />
			</IconButton>
		</>
	);

	const openSnackBar = () => {
		//setOpen(true);
		enqueueSnackbar(messageSnackbar, {
			variant: colorMessage,
			anchorOrigin: {
				vertical: 'top',
				horizontal: 'right'
			},
			action: action,
			autoHideDuration: 6000

		})
	};

	const handleClose = (event: any): void => {
		setOpen(false);
	};

	const settingSnackBar = (_message: any, _typeSummary: any): void => {
		setMessage(_message);
		messageSnackbar = _message
		colorMessage = _typeSummary
		setTypeSummary(_typeSummary);
	};

	const ShowSnackBar = (
		<Stack spacing={2} sx={{ width: '100%' }}>
			<Snackbar
				open={open}
				autoHideDuration={6000}
				onClose={handleClose}
				ref={_ref}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}>
				<Alert onClose={handleClose} severity={typeSummary} sx={{ width: '100%' }}>
					{message}
				</Alert>
			</Snackbar>
		</Stack>
	);

	return { ShowSnackBar, openSnackBar, settingSnackBar };
}
