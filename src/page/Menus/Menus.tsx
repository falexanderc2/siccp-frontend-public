import BeginEnterprises from '../Enterprises'
import IndexCustomersCreditors from '../MainRecordCommon/IndexCustomersCreditors'
import IndexAccountsPayableReceibable from '../CommonPaymentRecords/IndexAccountsPayableReceibable'
import BeginAdministrator from '../Administrator';
import ReporteCustomersCreditor from '../ReportesCustomersCreditor/ReporteCustomersCreditor'
import ReporteCollector from '../ReportesDeb/ReportDebt';


export default function menuOptions (typeLogin: string): any[] {
	let routes: any[any];
	if (typeLogin === 'ADMINISTRATOR') {
		const _routes = [
			{
				key: 1,
				path: '/administrator',
				keyword: 'Administrador',
				_component: () => BeginAdministrator()
			},
			{
				key: 2,
				path: '/enterprises',
				keyword: 'Empresas',
				_component: () => BeginEnterprises()
			},
		]
		return _routes
	}
	if (typeLogin === 'ENTERPRISES') {
		const _routes: any = [{
			key: 1,
			path: '/customers',
			keyword: 'Clientes',
			_component: () =>
				IndexCustomersCreditors({
					title: 'Clientes',
					pathRoute: 'customers',
					nameId: 'idCustomer',
					keyField: 'id'
				})
		},
		{
			key: 2,
			path: '/creditors',
			keyword: 'Acreedores',
			_component: () =>
				IndexCustomersCreditors({
					title: 'Acreedores',
					pathRoute: 'creditors',
					nameId: 'idCreditor',
					keyField: 'id'
				})
		},
		{
			key: 3,
			path: '/dbts_to_pays',
			keyword: 'Cuentas por Pagar',
			_component: () =>
				IndexAccountsPayableReceibable({
					title: 'Pagar',
					pathRoute: 'debts_to_pays',
					nameId: 'idDebtToPay',
					keyField: 'id',
					pathRouteListSearch: 'creditors',
					routeCollect: 'debit_payments',
					keyFieldExtra: 'idCreditor',
					titleCustomersAcreditor: 'Listados de Acreedores'
				})
		},
		{
			key: 4,
			path: '/receibables',
			keyword: 'Cuentas por Cobrar',
			_component: () =>
				IndexAccountsPayableReceibable({
					title: 'Cobrar',
					pathRoute: 'receibables',
					nameId: 'idReceibable',
					keyField: 'id',
					pathRouteListSearch: 'customers',
					routeCollect: 'collectdebts',
					keyFieldExtra: 'idCustomer',
					titleCustomersAcreditor: 'Listados de Clientes'
				})
		},
		{
			key: 5,
			path: '/report_receibables',
			keyword: 'Reportes deudas',
			_component: () =>
				ReporteCustomersCreditor()
		},
		{
			key: 6,
			path: '/report_pay',
			keyword: 'Reportes Pagos',
			_component: () =>
				ReporteCollector()
		}
		]
		routes = _routes;
	}

	return routes
}
