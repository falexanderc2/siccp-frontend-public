import { CENTER_COLUMN, LEFT_COLUMN, RIGHT_COLUMN } from '../../setup/environment';

//export default function titleColumnCollects (widthColumn: number): any {
export const titleColumnCollects = (): any => {
	const titleColumn: any[] = [
		{
			field: 'id',
			headerName: 'N° Pago',
			type: 'string',
			align: CENTER_COLUMN,
			width: 100
		},
		{
			field: 'paymentDateQuery',
			headerName: 'Fecha de Pago',
			type: 'string',
			align: CENTER_COLUMN,
			width: 200
		},
		{
			field: 'amountQuery',
			headerName: 'Monto Pagado',
			type: 'number',
			align: RIGHT_COLUMN,
			width: 200
		},
		{
			field: 'tipoDolar',
			headerName: 'Tipo Dolar',
			type: 'string',
			align: CENTER_COLUMN,
			width: 100
		},
		{
			field: 'montoDolar',
			headerName: 'Monto Dolar',
			type: 'number',
			align: RIGHT_COLUMN,
			width: 80
		},
		{
			field: 'remainingDebtQuery',
			headerName: 'Total de la deuda',
			type: 'number',
			align: RIGHT_COLUMN,
			width: 150
		},
		{
			field: 'observations',
			headerName: 'Observaciones',
			type: 'string',
			align: LEFT_COLUMN,
			width: 300
		},
		{
			field: 'annulledPayment',
			headerName: 'Anulado',
			type: 'string',
			align: CENTER_COLUMN,
			width: 100
		},
		{
			field: 'admissionDateQuery',
			headerName: 'Fecha de Registro',
			type: 'date',
			align: CENTER_COLUMN,
			width: 200
		}
	];
	return titleColumn;
}
