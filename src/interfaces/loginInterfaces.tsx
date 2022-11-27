import { TEmail, TPassword, TId } from './interfaces';

export interface ILogin extends TEmail, TPassword { }

export interface IPropsUser extends TId {
	//idEnterprise: number | null; // ? puede ser el indicador del idEnterprises o del Administrador del sitio
	userName: string;
	email: string;
	activated: string;
	token?: string;
	logout?: boolean;
	typeUser: 'ADMINISTRATOR' | 'ENTERPRISES';
}

export const defaultValueUser: IPropsUser = {
	id: 0,
	userName: '',
	email: '',
	activated: '',
	token: '',
	logout: true,
	typeUser: 'ENTERPRISES',
};
