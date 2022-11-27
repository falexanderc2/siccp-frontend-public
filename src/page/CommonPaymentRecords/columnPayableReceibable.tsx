import { CENTER_COLUMN, LEFT_COLUMN, RIGHT_COLUMN } from '../../setup/environment';

//export default function titleColumnsPays (widthColumn: number): any {
export const titleColumnsPays = (): any => {
	const titleColumn = [
		{
			field: 'id',
			headerName: 'ID',
			type: 'string',
			align: CENTER_COLUMN,
			width: 150
		},
		{
			field: 'commonName',
			headerName: 'Nombres',
			type: 'string',
			align: LEFT_COLUMN,
			width: 400
		},
		{
			field: 'debtDescription',
			headerName: 'Descripción deuda',
			type: 'string',
			align: LEFT_COLUMN,
			width: 400
		},
		{
			field: 'dateDebtsQuery',
			headerName: 'Fecha de adquisición',
			type: 'date',
			align: CENTER_COLUMN,
			width: 200
		},
		{
			field: 'amountDebtQuery',
			headerName: 'Total de la deuda',
			type: 'number',
			align: RIGHT_COLUMN,
			width: 150
		},
		{
			field: 'amountPaidQuery',
			headerName: 'Monto pagado',
			type: 'number',
			align: RIGHT_COLUMN,
			width: 150
		},

		{
			field: 'remainingDebtQuery',
			headerName: 'Deuda actual',
			type: 'number',
			align: RIGHT_COLUMN,
			width: 150
		},

		{
			field: 'debtPaid',
			headerName: 'Pagada(SI/NO)',
			type: 'string',
			align: CENTER_COLUMN,
			width: 150
		},
		{
			field: 'admissionDateQuery',
			headerName: 'Fecha de Ingreso',
			type: 'date',
			align: CENTER_COLUMN,
			width: 200
		}
	];

	return titleColumn;
}
