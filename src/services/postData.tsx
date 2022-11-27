// TODO Perform requests to the server to store the data of the forms.
import { pathServidor } from './servidor';

export default async function postData (params: Object, route: string, headers: any): Promise<any> {
	const urlBase = pathServidor + route;
	try {
		const response: any = await fetch(urlBase, { method: 'POST', headers, body: JSON.stringify(params) });
		const dataRegister: any = await response.json();
		if (dataRegister.error >= 1) {
			throw dataRegister.message//'No se obtuvo respuesta del servidor. Intentelo más tarde';
		}
		if (dataRegister.logout) {
			return dataRegister;
		}
		if (dataRegister.errorFound) {
			throw dataRegister.messageInfo;
		}
		return dataRegister;
	} catch (error: any) {
		let messageError: any = error.message;

		if (error.response) {
			//console.log('error.response', error.response);
			if (error.response.data === undefined) {
				messageError = error.message;
				throw messageError;
			}
			// La respuesta fue hecha y el servidor respondió con un código de estado
			// que esta fuera del rango de 2xx
			messageError = error.response.data.messageInfo;
		} else if (error.request) {
			//console.log('error.request');
			// La petición fue hecha pero no se recibió respuesta
			// `error.request` es una instancia de XMLHttpRequest en el navegador y una instancia de
			// http.ClientRequest en node.js
			messageError = error.request;
		} else {
			// Algo paso al preparar la petición que lanzo un Error
			//console.log('otro error', messageError);
			messageError = error;
		}
		//console.log('The following error occurred: ', messageError);
		throw new Error(messageError);
	}
}
