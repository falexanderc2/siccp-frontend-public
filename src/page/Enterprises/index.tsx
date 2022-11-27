import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useState } from 'react';
import { DataTableCrud } from '../../components/DataTable/DataTableMiu';
import useBoxSearch from '../../hooks/useBoxSearch';
import useDeleteData from '../../hooks/useDeleteData';
import useSearchData from '../../hooks/useSearchData';
import { PLACEHOLDER_SEARCH } from '../../setup/environment';
import Enterprises from './Enterprises';
import { titleColumns } from './column';

export default function BeginEnterprises () {
	const pathRoute: string = 'enterprises';
	const [showNew, setShowNew] = useState<boolean>(false);
	const [showEdit, setShowEdit] = useState<boolean>(false);
	const [idEnterprise, setidEnterprise] = useState<number>(0);
	const { deleteRecord } = useDeleteData();
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
		setidEnterprise(row);
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
				<CardHeader title={'Empresas'} sx={{ marginLeft: '1%' }} />
				{/* {ShowMessageSearch}
				{ShowSnackBarDelete} */}
				{boxSearch}
				{showData && (
					<DataTableCrud
						title={'Listado de empresas. Total = ' + countRow}
						titleColumns={titleColumns()}
						recordData={data}
						columnEdit={true}
						columnDelete={true}
						idDelete={'idEnterprise'}
						loading={true}
						keyField={'id'}
						actionEdit={clickEdit}
						actionDelete={handleDeleteRecord}
					/>
				)}
			</Card>
			{showNew && <Enterprises idEnterprise={0} action={1} watchDialog={watchDialogNew} />}
			{showEdit && <Enterprises idEnterprise={idEnterprise} action={2} watchDialog={watchDialogEdit} />}
		</>
	);
}
