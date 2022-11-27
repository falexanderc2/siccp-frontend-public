import { useAppUserContext } from '../context/userContext';
export default function useLogout() {
	const { dataUser, dispatch } = useAppUserContext();
	const showMessageLogout = (): string => {
		setTimeout(() => {
			logout();
		}, 6000);
		return 'TOKEN VENCIDO. DEBE VOLVER A LONGEARSE';
	};

	const logout = () => {
		dispatch({
			type: 'LOGOUT',
			value: true,
		});
		window.location.replace('/login'); // ?se envia a esta ruta y se carga la pagina
	};

	return { showMessageLogout, logout };
}
