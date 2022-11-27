import { consumers } from 'stream';
import { pathServidor } from './servidor';

export default async function getData (route: string, headers: any): Promise<any> {
	const urlBase = pathServidor + route;

	try {
		const response: any = await fetch(urlBase, { method: 'GET', headers });
		const dataFound = await response.json();
		if (!response.ok) {
			throw 'Error en la conexión'
		}
		if (dataFound.error >= 1) {
			throw dataFound.message//'No se obtuvo respuesta del servidor. Intentelo más tarde';
		}
		if (dataFound.logout) {
			return dataFound;
		}
		if (dataFound.errorFound) {
			throw dataFound.messageInfo;
		}
		if (dataFound.rowAffect === 0) {
			throw 'No se localizaron datos';
		}
		return dataFound; // ! envio el response porque los errores se manejan en las funciones que llaman a esta
	} catch (error: any) {
		let messageError: any;
		if (error.message !== undefined) {
			messageError = error.message;
			throw messageError;
		}
		if (error.response) {
			//	console.log('error.response', error.response);
			if (error.message !== undefined) {
				messageError = error.message;
				throw messageError;
			}
			if (error.response.data === undefined) {
				messageError = error.message;
				throw messageError;
			}
			//console.log('error.response', error.response.data.messageInfo);
			// La respuesta fue hecha y el servidor respondió con un código de estado
			// que esta fuera del rango de 2xx
			messageError = error.response.data.messageInfo;
		} else if (error.request) {
			//console.log('error.request');
			if (error.message !== undefined) {
				messageError = error.message;
				throw messageError;
			}
			// La petición fue hecha pero no se recibió respuesta
			// `error.request` es una instancia de XMLHttpRequest en el navegador y una instancia de
			// http.ClientRequest en node.js
			messageError = error.request;
		} else {
			// Algo paso al preparar la petición que lanzo un Error
			//console.log('otro error', error);
			messageError = error;
		}
		//console.log('The following error occurred: ', messageError);
		throw new Error(messageError);
	}
}
