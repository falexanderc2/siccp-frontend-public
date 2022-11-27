import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useState, Suspense } from 'react';
import { DataTableCrud } from '../../components/DataTable/DataTableMiu';
import useBoxSearch from '../../hooks/useBoxSearch';
import useDeleteData from '../../hooks/useDeleteData';
import useSearchData from '../../hooks/useSearchData';
import { PLACEHOLDER_SEARCH } from '../../setup/environment';
import { useAppUserContext } from '../../context/userContext';
import CustomersCreditors from './CustomersCreditors';
import { IProspCommonIndex } from '../../interfaces/commonInterfaces';
import { titleColumns } from './columnCustomersCreditors';

export default function IndexCustomersCreditors (props: IProspCommonIndex) {
	const { dataUser } = useAppUserContext();
	const pathRoute: string = `${props.pathRoute}/${dataUser.id}`;
	const [showNew, setShowNew] = useState<boolean>(false);
	const [showEdit, setShowEdit] = useState<boolean>(false);
	const [id, setId] = useState<number>(0);
	const { deleteRecord } = useDeleteData();
	const { searchDatas, data, countRow, showData } = useSearchData();


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
		return await deleteRecord(`${pathRoute}/${row}`).then((dataFound) => dataFound.rowAffect);
	};

	return (
		<>
			<Suspense fallback={<h1>Loading profile...</h1>}>
				<Card sx={{ width: '100%' }}>
					<CardHeader title={props.title} sx={{ marginLeft: '1%' }} />
					{/* {ShowMessageSearch}
					{ShowSnackBarDelete} */}
					{boxSearch}
					{showData && (
						<Suspense fallback={<h1>Loading data...</h1>}>
							<DataTableCrud
								title={'Listado de empresas. Total = ' + countRow}
								titleColumns={titleColumns()}
								recordData={data}
								columnEdit={true}
								columnDelete={true}
								idDelete={props.nameId}
								loading={true}
								keyField={props.keyField}
								actionEdit={clickEdit}
								actionDelete={handleDeleteRecord}
							/>
						</Suspense>
					)}
				</Card>
			</Suspense>
			{showNew && (
				<CustomersCreditors
					idEnterprise={dataUser.id}
					idCommon={0}
					action={1}
					title={props.title}
					pathRoute={props.pathRoute}
					watchDialog={watchDialogNew}
				/>
			)}
			{showEdit && (
				<CustomersCreditors
					idEnterprise={dataUser.id}
					idCommon={id}
					title={props.title}
					pathRoute={props.pathRoute}
					action={2}
					watchDialog={watchDialogEdit}
				/>
			)}
		</>
	);
}
