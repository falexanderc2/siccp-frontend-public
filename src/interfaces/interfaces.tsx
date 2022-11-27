//TODO DECLARACION DE INTERFACES BASICO Y COMUNES ENTRE ENTIDADES

// !DECLARACION DE LOS TYPES
export type SiNo = 'SI' | 'NO' | string;
export type TDate = Date | undefined;
export type TId = { id: number };
export type TEnterprises = { idEnterprise: number; };

export type TObservations = { observations: string | undefined; };

type TReputation = { reputation: string | undefined; };

export type TAction = { action?: number; };
export type TAdmissionDate = { admissionDate?: string | undefined; };
export type TEmail = { email?: string | undefined };
export type TPassword = { password?: string; };

type TPasswordConfirmation = { passwordConfirmation?: string; }
type TCreditor = { idCreditor: number; };

export type TDbtsToPay = { idDebtToPay: number; };

type TDebitPayments = { idPaymentNumber: number; };

type TCollectDebts = { idCollectNumber: number; };

export type TReceibables = { idReceibable: number; };

export type TCustomer = { idCustomer: number; };
type TActivated = { activated?: SiNo; };
//! DECLARACION DE LAS INTERFACES

export interface IAdministrator extends TId, TEmail, TPassword, TPasswordConfirmation, TAdmissionDate, TAction, TActivated {
	userName: string
}
export interface IBasicCommon extends TEnterprises, TAction, TAdmissionDate, TActivated {

}
export interface IEnterprises extends IBasicCommon, TEmail, TPassword, TPasswordConfirmation {
	enterprisesName: string;
}

export interface IDataPersonalCommon extends TObservations, TReputation, TEmail {
	phone: string;
	address: string;
}

//TODO DECLARACION DE INTERFACES DE LAS ENTIDADES

export interface ICustomers extends TCustomer, IBasicCommon, IDataPersonalCommon {
	customerName: string;
}

export interface ICreditors extends TCreditor, IBasicCommon, IDataPersonalCommon {
	creditorName: string | undefined;
}

export interface IDebts extends TObservations {
	debtDescription: string; //descripcion de la deuda
	dateDebts: TDate; //fecha en que se adquirio la deuda
	amountDebt: number | string; //Es el monto total de la deuda
	numberOfPayments: number | string; //Es el numeros de cuotas que se tienen para pagar la deuda
	amountToBePaidIninstallments: number | string; //cantidad a pagar en cuotas
	//numberOfDaysForInstallments: number; //cantidad de dias entre cuotas para cancelar la deuda,
	paymentStartDate: TDate; //fecha en que se comenzara a pagar la deuda
	paymentNumber?: number | string; //Cantidad de  cuotas canceladas
	amountPaid?: number | string; //Es total pagado de la deuda
	remainingDebt?: number | string; //Es la monto restante de la deuda
	debtPaid?: SiNo; //Indica si la deuda esta pagada
}

export interface IDbtsToPays extends TDbtsToPay, IBasicCommon, IDebts, TCreditor { }

export interface IReceibables extends TReceibables, IBasicCommon, IDebts, TCustomer { }

//  TODO DECLARACIONES DE PROPS DE FORMULARIOS DE LAS ENTIDADES

export interface IPropsBasic extends TEnterprises, TAction {
	watchDialog?: () => void;
}

export interface IPropsBasicAdministrator extends TId, TAction {
	watchDialog?: () => void;
}

export interface IPropsCustomers extends TCustomer, IPropsBasic { }

export interface IPropsCreditors extends TCreditor, IPropsBasic { }

export interface IPropsDbtsToPays extends TDbtsToPay, IPropsBasic { }
export interface IPropsReceibables extends TReceibables, IPropsBasic { }


interface commonValue {
	amount: number | string; // es el monto pagado
	paymentDate: TDate; //fecha en que se realizo el pago
	remainingDebt?: number | string; //Es el monto que quedo de la deuda cuando se realizo el pago
	annulledPayment: SiNo; //Indica si el pago esta anulado

}
export interface IDebitPayments extends TDebitPayments, TDbtsToPay, TEnterprises, commonValue, TAction, TObservations, TAdmissionDate {
}

export interface ICollectDebts extends TCollectDebts, TReceibables, TEnterprises, commonValue, TAction, TObservations, TAdmissionDate {

}

// TODO ESTA DECLARACION EN PARA EL LOGIN
