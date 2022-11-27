import { pathServidor } from './servidor';

export default async function deleteData (route: string, headers: any): Promise<any> {
	const urlBase = pathServidor + route;
	try {
		const response = await fetch(urlBase, { method: 'DELETE', headers: headers });
		const dataDelete = await response.json();
		if (dataDelete.logout) {
			return dataDelete;
		}
		if (dataDelete.errorFound) {
			throw dataDelete.messageInfo;
		}
		return dataDelete;
	} catch (error: any) {
		let messageError: any;
		if (error.response) {
			//console.log('error.response');
			// La respuesta fue hecha y el servidor respondió con un código de estado
			// que esta fuera del rango de 2xx
			messageError = error.response.data.messageInfo;
		} else if (error.request) {
			//	console.log('error.request');
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
