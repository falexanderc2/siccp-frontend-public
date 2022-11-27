import { IBasicCommon, IDataPersonalCommon, IDebts, IPropsBasic } from './interfaces';

export type TIdCommon = {
	// se va a usar para creditors y customers
	idCommon: number | undefined;
};

export type TCustomerCreditor = 'CUSTOMER' | 'CREDITOR'
export interface ICreditorsCustomers extends TIdCommon, IBasicCommon, IDataPersonalCommon {
	commonName: string | undefined;
}

export interface IPropsCreditorsCustomers extends IPropsBasic, TIdCommon, IPropsRoute { }

export type TIdDebts = {
	// ? ESTE SE USARA PARA LAS CUENTAS POR COBRAR Y CUENTAS PAGAR
	idDebt: number;
};

type TListCustomerAcreditor = {
	pathRouteListSearch?: undefined | string; //indica en point de los clientes o acreedores, permite cargar el listado, puede tener 2 valores: credutors o customers
};

export interface IAccountsPayableReceibable extends TIdDebts, IBasicCommon, IDebts, TIdCommon { }

export interface IPropsDbts extends TIdDebts, IPropsBasic, IPropsRoute { nameId: string; titleCustomersAcreditor: undefined | string; }

export interface IPropsRoute extends TListCustomerAcreditor { pathRoute: string; title: string; } //se usa para la busqueda los clientes y los acreedores en los modulos de cuentas por pagar y cuentas por cobrar

export interface IProspCommonIndex extends IPropsRoute {
	// se utiliza para los props de IndexCustomersCreditors y IndexAccountsPayableReceibable
	//title: string; // titulo del formulario. Puede ser Pagar o Cobrar
	//pathRoute: string; // el end poit del api
	nameId: string; //es el nombre del campo de las cuentas por cobrar o cuentas por pagar puede ser idDebtToPay o idReceibable,IdCreditor,idCustomer
	keyField: any;
	keyFieldExtra?: undefined | string; //se utiliza cuado se desea abonar los pagos de cuentas por cobrar y cuentas por pagar y puede tener 2 valores idCustomer o idCreditor
	titleCustomersAcreditor?: undefined | string;
	routeCollect?: string; //es la ruta de collect o payment
}
