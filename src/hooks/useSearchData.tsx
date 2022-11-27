import { useState } from 'react';
import getData from '../services/getData';
import useToken from './useToken';
import useSnackBar from './useSnackBar';
import useBackdrop from './useBackdrop';
import useLogout from './useLogout';

export default function useSearchData () {
	const [data, setData] = useState<any[]>([]);
	const [countRow, setCountRow] = useState<number>(0);
	const [showData, setShowData] = useState<boolean>(false);
	const { headers } = useToken();
	const { ShowBackdrop, openBackdrop, closeBackdrop } = useBackdrop();
	const { ShowSnackBar, openSnackBar, settingSnackBar } = useSnackBar();
	const { showMessageLogout } = useLogout();

	const searchDatas = async (route: string, message: string = 'Buscando datos', changeData: boolean | undefined = true): Promise<any> => {
		openBackdrop(message);
		return await getData(route, headers)
			.then((dataFound) => {
				let _data = dataFound;
				if (_data.logout !== undefined && _data.logout) {
					settingSnackBar(showMessageLogout(), 'error');
					openSnackBar();
					if (changeData ?? (changeData)) {
						setCountRow(_data.rowAffect);
						setData(_data.data);
					}
					return _data;
				}
				if (_data.errorFound) {
					throw _data.messageInfo;
				}
				if (changeData ?? (changeData)) {
					setCountRow(_data.rowAffect);
					setData(_data.data);
				}
				closeBackdrop();
				return _data;
			})
			.then((result) => {
				if (changeData ?? (changeData)) {
					setShowData(true);
				}
				closeBackdrop();
				return result;
			})
			.catch((error: any) => {
				if (changeData ?? (changeData)) {
					setData([]);
					setCountRow(0);
				}
				closeBackdrop();
				const messageError = error.message !== undefined ? error.message : error;
				settingSnackBar(messageError, 'error');
				openSnackBar();
				//	throw new Error(error.message)
				return { rowAffect: 0 }; //?devuelvo este valor para simplicar el control de las funciones que llaman a esta función, de lo contrario habría que realizar una evaluación de del response ===undefined
			});
	};



	const ShowMessageSearch = (
		<>
			{ShowBackdrop}
			{ShowSnackBar}
		</>
	)

	return {
		searchDatas,
		data,
		countRow,
		showData,
		ShowMessageSearch
	};
}
