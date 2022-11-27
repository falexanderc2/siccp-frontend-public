import { CENTER_COLUMN, LEFT_COLUMN } from '../../setup/environment';

//export default function titleColumns (widthColumn: number): any {
export const titleColumns = (): any => {
	const titleColumn: any[] = [
		{
			field: 'id',
			headerName: 'ID Empresa',
			align: CENTER_COLUMN,
			width: 150
		},
		{
			field: 'enterprisesName',
			headerName: 'Nombre de la empresa',
			align: LEFT_COLUMN,
			type: 'string',
			width: 300
		},
		{
			field: 'email',
			headerName: 'Email',
			align: LEFT_COLUMN,
			type: 'string',
			width: 300
		},
		{
			field: 'activated',
			headerName: 'Activado',
			align: CENTER_COLUMN,
			type: 'string',
			width: 100
		},
		{
			field: 'admissionDate',
			headerName: 'Fecha de Registro',
			align: CENTER_COLUMN,
			editable: false,
			type: 'date',
			width: 200
		}
	];
	return titleColumn;
}
