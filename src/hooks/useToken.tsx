import { useAppUserContext } from '../context/userContext';

export default function useToken() {
	const { dataUser } = useAppUserContext();
	let _headers: string = '';
	if (dataUser !== undefined) {
		_headers = dataUser.token;
	}

	const headers = {
		Authorization: `Bearer ${_headers}`,
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
		Accept: '*/*'
	};
	return { headers };
}
