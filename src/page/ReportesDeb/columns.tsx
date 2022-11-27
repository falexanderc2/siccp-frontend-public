import { CENTER_COLUMN, LEFT_COLUMN, RIGHT_COLUMN } from '../../setup/environment';

export const titleColumns = (): any => {
  const titleColumn = [

    {
      field: 'id',
      headerName: 'N°',
      type: 'string',
      align: CENTER_COLUMN,
      width: 100
    },
    {
      field: 'idReceibable',
      headerName: 'N° Cuenta',
      type: 'string',
      align: CENTER_COLUMN,
      width: 100
    },
    {
      field: 'numeroPago',
      headerName: 'N° de Pago',
      type: 'string',
      align: CENTER_COLUMN,
      width: 100
    },
    {
      field: 'paymentDateQuery',
      headerName: 'Fecha',
      type: 'string',
      align: RIGHT_COLUMN,
      width: 100
    },
    {
      field: 'idCommon',
      headerName: 'ID',
      type: 'string',
      align: LEFT_COLUMN,
      width: 100
    },
    {
      field: 'commonName',
      headerName: 'Nombres',
      type: 'string',
      align: LEFT_COLUMN,
      width: 400
    },
    {
      field: 'amountQuery',
      headerName: 'Monto Pagado',
      type: 'number',
      align: RIGHT_COLUMN,
      width: 150
    },
    {
      field: 'tipoDolar',
      headerName: 'Tipo dólar',
      type: 'string',
      align: LEFT_COLUMN,
      width: 100
    },

    {
      field: 'montoDolarQuery',
      headerName: 'Monto dólar',
      type: 'number',
      align: RIGHT_COLUMN,
      width: 150
    }
  ];

  return titleColumn;
}
