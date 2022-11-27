import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useState } from 'react';
import { DataTableCrud } from '../../components/DataTable/DataTableMiu';
import useBoxSearch from '../../hooks/useBoxSearch';
import useDeleteData from '../../hooks/useDeleteData';
import useSearchData from '../../hooks/useSearchData';
import { PLACEHOLDER_SEARCH } from '../../setup/environment';
import Administrator from './Administrator';
import { titleColumns } from './column';
import { useAppUserContext } from '../../context/userContext';

export default function BeginAdministrator () {
	const { dataUser } = useAppUserContext();
	const pathRoute: string = 'administrators';
	const [showNew, setShowNew] = useState<boolean>(false);
	const [showEdit, setShowEdit] = useState<boolean>(false);
	const [id, setId] = useState<number>(0);
	const { deleteRecord, ShowSnackBarDelete } = useDeleteData();
	const { searchDatas, data, countRow, showData, ShowMessageSearch } = useSearchData();

	const isOpenDialog = () => {
		setShowNew(true);
	};

	const searchData = async (): Promise<any> => {
		return await searchDatas(`${pathRoute}/${keyWordSearch}`, 'Cargando Datos');
	};

	const { boxSearch, keyWordSearch } = useBoxSearch({
		placeholder: PLACEHOLDER_SEARCH,
		buttonNew: true,
		isSearch: searchData,
		isOpen: isOpenDialog,
	});

	const clickEdit = (row: any) => {
		setId(row);
		setShowEdit(true);
	};

	const watchDialogEdit = () => {
		setShowEdit(false);
	};

	const watchDialogNew = () => {
		setShowNew(false);
	};

	const handleDeleteRecord = async (row: any): Promise<number> => {
		return await deleteRecord(`${pathRoute}/${row}`).then((dataFound) => {
			return dataFound.rowAffect;
		});
	};

	return (
		<>
			<Card sx={{ width: '100%' }}>
				<CardHeader title={'Administrador'} sx={{ marginLeft: '1%' }} />
				{/* 	{ShowMessageSearch}
				{ShowSnackBarDelete} */}
				{boxSearch}
				{showData && (
					<DataTableCrud
						title={'Listado de administradores. Total = ' + countRow}
						titleColumns={titleColumns()}
						recordData={data}
						columnEdit={true}
						columnDelete={true}
						idDelete={'id'}
						loading={true}
						keyField={'id'}
						actionEdit={clickEdit}
						actionDelete={handleDeleteRecord}
					/>
				)}
			</Card>
			{showNew && <Administrator id={0} action={1} watchDialog={watchDialogNew} />}
			{showEdit && <Administrator id={id} action={2} watchDialog={watchDialogEdit} />}
		</>
	);
}
