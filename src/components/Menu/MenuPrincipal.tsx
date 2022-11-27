import { useEffect, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAppUserContext } from '../../context/userContext';
import { IPropsUser } from '../../interfaces/loginInterfaces';
import menuOptions from '../../page/Menus/Menus';
import AppBarMenu from './AppBarMenu';
import Enterprises from '../../page/Enterprises/Enterprises';
import Administrator from '../../page/Administrator/Administrator';

interface IProps {
	dataUser: IPropsUser;
}
const MenuPrincipal = (props: IProps) => {
	let loadUseEffect = false;
	const { dataUser, dispatch } = useAppUserContext();
	const menu = menuOptions(dataUser.typeUser);

	useEffect(() => {
		if (!loadUseEffect) {
			loadUseEffect = true;
			(async () => {
				if (dataUser !== undefined) {
					await dispatch({
						type: 'LOGING',
						value: props.dataUser,
					});
				}
			})();
		}
	}, []);

	return (
		<Suspense fallback={<h1>Loading data...</h1>}>
			{!dataUser.logout && <>{<AppBarMenu />}</>}
			<Routes>
				{menu.map((text, index) => (
					<Route path={text.path} element={<text._component />} key={text.key + index + 1}></Route>
				))}
				<Route
					path='/enterprises/perfil'
					element={<Enterprises idEnterprise={dataUser.id} action={2} />}
					key='enterprises-perfil'
				/>
				<Route
					path='/administrator/perfil'
					element={<Administrator id={dataUser.id} action={2} />}
					key='administrator-perfil'
				/>
				<Route
					path='*'
					element={
						<main style={{ padding: '1rem' }}>
							{' '}
							<p></p>
						</main>
					}
				/>
			</Routes>
		</Suspense>
	);
};
export default MenuPrincipal;
