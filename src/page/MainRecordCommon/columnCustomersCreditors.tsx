import { CENTER_COLUMN, LEFT_COLUMN } from '../../setup/environment';

//export default function titleColumns (widthColumn: number): any {
export const titleColumns = (): any => {
	const titleColumn: any[] = [
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
			field: 'address',
			headerName: 'Dirección',
			type: 'string',
			align: LEFT_COLUMN,
			width: 200
		},
		{
			field: 'phone',
			headerName: 'Teléfono',
			type: 'string',
			align: LEFT_COLUMN,
			width: 200
		},
		{
			field: 'email',
			headerName: 'Email',
			type: 'string',
			align: LEFT_COLUMN,
			width: 300
		},
		{
			field: 'reputation',
			headerName: 'Reputación',
			type: 'string',
			align: CENTER_COLUMN,
			width: 100
		},
		{
			field: 'activated',
			headerName: 'Activado',
			type: 'string',
			align: CENTER_COLUMN,
			width: 100
		},
		{
			field: 'admissionDate',
			headerName: 'Fecha de Registro',
			type: 'date',
			align: CENTER_COLUMN,
			width: 200
		}
	];
	return titleColumn;
}
