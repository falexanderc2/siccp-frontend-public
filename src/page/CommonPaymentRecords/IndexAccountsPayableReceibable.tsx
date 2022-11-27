import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useState, useEffect, Suspense } from 'react';
import { DataTableCrud } from '../../components/DataTable/DataTableMiu';
import useBoxSearch from '../../hooks/useBoxSearch';
import useDeleteData from '../../hooks/useDeleteData';
import useSearchData from '../../hooks/useSearchData';
import { PLACEHOLDER_SEARCH } from '../../setup/environment';
import { useAppUserContext } from '../../context/userContext';
import PaymentCollector from './PaymentCollector';
import AccountsPayableReceibable from './AccountsPayableReceibable';
import { IProspCommonIndex } from '../../interfaces/commonInterfaces';
import { titleColumnsPays } from './columnPayableReceibable';

export default function IndexAccountsPayableReceibable (props: IProspCommonIndex) {
	const { dataUser, dispatch } = useAppUserContext();
	const pathRoute: string = `${props.pathRoute}/${dataUser.id}`;
	const [showNew, setShowNew] = useState<boolean>(false);
	const [showEdit, setShowEdit] = useState<boolean>(false);
	const [id, setId] = useState<number>(0);
	const { deleteRecord, ShowSnackBarDelete } = useDeleteData();
	const { searchDatas, data, countRow, showData, ShowMessageSearch } = useSearchData();
	const [showPayments, setShowPayments] = useState<boolean>(false);
	const [idCommon, setIdCommon] = useState<number>(0);
	const [idDebt, setIdDebt] = useState<number>(0);

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
		setIdDebt(row);
		setShowEdit(true);
	};
	const clickPayment = (row: any) => {
		setIdDebt(row['id']);
		setIdCommon(row['paramExtract']);
		setShowPayments(true);
	};
	const watchDialogEdit = () => {
		setShowEdit(false);
	};

	const watchDialogNew = () => {
		setShowNew(false);
	};

	const watchDialogPayment = () => {
		setShowPayments(false);
	};

	const handleDeleteRecord = async (row: any): Promise<number> => {
		return await deleteRecord(`${pathRoute}/${row}`).then((dataFound) => {
			return dataFound.rowAffect;
		});
	};

	return (
		<>
			<Suspense fallback={<h1>Loading data...</h1>}>
				<Card sx={{ width: '100%' }}>
					<CardHeader title={'Cuentas por ' + props.title} sx={{ marginLeft: '1%' }} />
					{/* 	{ShowSnackBarDelete}
					{ShowMessageSearch} */}
					{boxSearch}
					{showData && (
						<Suspense fallback={<h1>Loading data...</h1>}>
							<DataTableCrud
								title={'Listado de Cuentas por ' + props.title + '. Total= ' + countRow}
								/* titleColumns={titleColumnsPays(calcularWidth(10))} */
								titleColumns={titleColumnsPays()}
								recordData={data}
								columnEdit={true}
								columnDelete={true}
								columnButtonExtra={true}
								idDelete={props.nameId}
								loading={true}
								keyField={props.keyField}
								keyFieldExtra={props?.keyFieldExtra}
								actionEdit={clickEdit}
								actionDelete={handleDeleteRecord}
								actionButtonExtra={clickPayment}
							/>
						</Suspense>
					)}
				</Card>
			</Suspense>
			{showNew && (
				<AccountsPayableReceibable
					idEnterprise={dataUser.id}
					action={1}
					idDebt={0}
					title={props.title}
					pathRoute={props.pathRoute}
					nameId={props.nameId}
					titleCustomersAcreditor={props?.titleCustomersAcreditor}
					pathRouteListSearch={props?.pathRouteListSearch}
					watchDialog={watchDialogNew}
				/>
			)}
			{showEdit && (
				<AccountsPayableReceibable
					idEnterprise={dataUser.id}
					action={2}
					idDebt={idDebt}
					title={props.title}
					pathRoute={props.pathRoute}
					nameId={props.nameId}
					titleCustomersAcreditor={props?.titleCustomersAcreditor}
					pathRouteListSearch={props?.pathRouteListSearch}
					watchDialog={watchDialogEdit}
				/>
			)}
			{showPayments && (
				<PaymentCollector
					idEnterprise={dataUser.id}
					routeBase={props.pathRoute}
					watchDialog={watchDialogPayment}
					idDebts={idDebt}
					idCollect={idDebt}
					idGeneric={idCommon}
					nameIdDebts={props.nameId}
					routeCollect={props?.routeCollect}
					title={'Registros de Pagos'}
				/>
			)}
		</>
	);
}
