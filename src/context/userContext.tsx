import React, { ReactNode, useContext, useReducer } from 'react';
import { IPropsUser, defaultValueUser } from '../interfaces/loginInterfaces';

//const ContextUser = React.createContext<IPropsUser>(defaultValueUser);
const ContextUser = React.createContext<any>(defaultValueUser);

const useAppUserContext = () => {
	return useContext(ContextUser);
};

const reducer = (state: IPropsUser, action: any) => {
	//console.log('entrando al reducer', action);
	switch (action.type) {
		case 'LOGOUT': {
			//	console.log('entro en salir', state);
			return { ...state, ...defaultValueUser };
		}
		case 'LOGING': {
			//	console.log('entro a Login en el reducer');
			//return { ...state, dataUser: [...state.dataUser, action.value.userName] };
			return { ...state, ...action.value };
		}
		default: {
			/* 	for (const [key, value] of Object.entries(state)) {
				console.log(key, '<==>', value);
			} */
			//	console.log('entro a consultar en el reducer', state);
			return state;
		}
	}
	//return state;
};

interface AuxProps {
	children: ReactNode; //| ReactChild | ReactChildren;
}

const AppProvider = ({ children }: AuxProps) => {
	const [state, dispatch] = useReducer(reducer, defaultValueUser);
	return (
		<ContextUser.Provider value={{ dataUser: state, dispatch }}>{children}</ContextUser.Provider>
	);
};

export { useAppUserContext, AppProvider, ContextUser };
