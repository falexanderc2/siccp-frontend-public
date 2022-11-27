import { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function useBackdrop () {
	const [open, setOpen] = useState<boolean>(false);
	const [message, setMessage] = useState<string>('Procesando...!')

	const closeBackdrop = () => {
		setOpen(false);
	};
	const openBackdrop = (_message?: string) => {
		_message && setMessage(_message)
		setOpen(true);
	};
	const ShowBackdrop = (
		<div>
			<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
				<h4>{message}</h4>
				<CircularProgress color='inherit' />
			</Backdrop>
		</div>
	);
	return { ShowBackdrop, openBackdrop, closeBackdrop };
}
