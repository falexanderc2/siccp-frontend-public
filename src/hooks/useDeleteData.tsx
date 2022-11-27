import deleteData from '../services/deleteData';
import useToken from './useToken';
import useSnackBar from './useSnackBar';
import useBackdrop from './useBackdrop';
import useLogout from './useLogout';

export default function useDeleteData () {
	const { ShowBackdrop, openBackdrop, closeBackdrop } = useBackdrop();
	const { ShowSnackBar, openSnackBar, settingSnackBar } = useSnackBar();
	const { headers } = useToken();
	const { showMessageLogout } = useLogout();
	const deleteRecord = async (route: string): Promise<any> => {
		openBackdrop();
		return await deleteData(route, headers)
			.then((dataDelete) => {
				if (dataDelete.logout !== undefined && dataDelete.logout) {
					settingSnackBar(showMessageLogout(), 'error');
					openSnackBar();
					return dataDelete;
				}
				if (dataDelete.errorFound) {
					throw dataDelete.messageInfo;
				}
				closeBackdrop();
				settingSnackBar(dataDelete.messageInfo, 'success');
				openSnackBar();
				return dataDelete;
			})
			.catch((error: any) => {
				const messageError = error.message !== undefined ? error.message : error;
				console.log('error recibido desde deleteRecord', messageError);
				closeBackdrop();
				settingSnackBar(messageError, 'error');
				openSnackBar();
				return { rowAffect: 0 }; //?devuelvo este valor para simplicar el control de las funciones que llaman a esta función, de lo contrario habría que realizar una evaluación de del response ===undefined
			});
	};

	const ShowSnackBarDelete = (
		<>
			{ShowBackdrop}
			{ShowSnackBar}
		</>
	)
	return { deleteRecord, ShowSnackBarDelete };
}
