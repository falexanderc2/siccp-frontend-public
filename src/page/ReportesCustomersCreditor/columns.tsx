import { CENTER_COLUMN, LEFT_COLUMN, RIGHT_COLUMN } from '../../setup/environment';

export const titleColumns = (): any => {
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
      field: 'totalAmountDebtQuery',
      headerName: 'Total de la deuda',
      type: 'number',
      align: RIGHT_COLUMN,
      width: 150
    },
    {
      field: 'totalAmountPaidQuery',
      headerName: 'Total pagado',
      type: 'number',
      align: RIGHT_COLUMN,
      width: 150
    },

    {
      field: 'totalRemainingDebtQuery',
      headerName: 'Deuda actual',
      type: 'number',
      align: RIGHT_COLUMN,
      width: 150
    }
  ];

  return titleColumn;
}
