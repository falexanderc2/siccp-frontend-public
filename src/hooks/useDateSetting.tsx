import { TDate } from '../interfaces/interfaces';

// TODO Este hook permite configurar las fechas, las funciones monthNavigatorTemplate y yearNavigatorTemplate
//! son necesarias porque daria error fatal cuando seleccionamos una año de la lista del control

export default function useDateSetting() {
	const convertDateMysql = (date: TDate): TDate => {
		let result: TDate = date;
		try {
			// @ts-ignore: Object is possibly 'null'.
			result = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
		} catch (error: any) {
			console.log('error en fecha', error);
			throw new Error(error.message);
		}
		return result;
	};
	const formatDateLantino = (date: TDate): any => {
		// @ts-ignore: Object is possibly undefined
		if (date === null || date === undefined) {
			return null;
		}
		if (new Date(date).toString() === 'Invalid Date' || new Date(date).toString() === 'NaN') {
			return 'Invalid Date';
		}
		let _month: any = date?.getMonth() + 1;
		let month: any = _month > 9 ? _month.toString() : 0 + _month.toString();
		// @ts-ignore: Object is possibly undefined
		let day: any = date?.getDate() > 9 ? date?.getDate().toString() : 0 + date?.getDate().toString();
		// @ts-ignore: Object is possibly undefined
		let year: any = date?.getFullYear().toString();
		return day + '/' + month.toString() + '/' + year;
	};

	return { convertDateMysql, formatDateLantino };
}
