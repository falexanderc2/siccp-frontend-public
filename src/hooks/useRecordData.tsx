import postData from '../services/postData';
import useToken from './useToken';
import useSnackBar from './useSnackBar';
import useBackdrop from './useBackdrop';
import useLogout from './useLogout';

export default function useRecordData () {
	const { headers } = useToken();
	const { ShowBackdrop, openBackdrop, closeBackdrop } = useBackdrop();
	const { ShowSnackBar, openSnackBar, settingSnackBar } = useSnackBar();
	const { showMessageLogout } = useLogout();
	const recordData = async (params: Object, route: string): Promise<any> => {
		openBackdrop();
		return await postData(params, route, headers)
			.then((dataRegister) => {
				if (dataRegister.logout !== undefined && dataRegister.logout) {
					settingSnackBar(showMessageLogout(), 'error');
					openSnackBar();
					return dataRegister;
				}
				if (dataRegister.errorFound) {
					throw dataRegister.messageInfo;
				}
				closeBackdrop();
				settingSnackBar(dataRegister.messageInfo, 'success');
				openSnackBar();
				return dataRegister;
			})
			.catch((error: any) => {
				const messageError = error.message !== undefined ? error.message : error;
				closeBackdrop();
				settingSnackBar(messageError, 'error');
				openSnackBar();
				return { rowAffect: 0 }; //?devuelbo este valor para simplicar el control de las funciones que llaman a esta función, de lo contrario habría que realizar una evaluación de del response ===undefined
			});
	};

	const ShowSnackBarSave = (
		<>
			{ShowBackdrop}
			{ShowSnackBar}
		</>
	)
	return {
		recordData,
		ShowSnackBarSave
	};
}
