import { DataGrid, GridToolbar, GridColDef, GridApi } from '@mui/x-data-grid';
//import { DataGridPro, GridToolbar, GridColDef, GridApi } from '@mui/x-data-grid-pro';
import Grid from '@mui/material/Grid';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import IconButton from '@mui/material/IconButton';
import useSnackBar from '../../hooks/useSnackBar';
import React, { useEffect, useState, Suspense } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import AddTask from '@mui/icons-material/AddTask';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';


interface IProps {
	title: string;
	buttonExcel?: boolean;
	columnEdit?: boolean;
	columnDelete?: boolean;
	columnCancel?: boolean;
	columnButtonExtra?: boolean;
	titleColumns: any;
	recordData: any[]; //any[],
	loading?: boolean;
	idDelete?: string; // ! esto se utiliza para filtra los datos de las filas eliminadas
	width?: string;
	height?: string;
	keyField?: any;
	keyFieldExtra?: any;
	actionEdit?: (data: any) => void;
	actionDelete?: (data: any) => Promise<any>;
	actionCancel?: (data: any) => Promise<any>;
	actionButtonExtra?: (data: any) => void;
}

interface EditToolbarProps {
	apiRef: React.MutableRefObject<GridApi>;
}

export const DataTableCrud = (props: IProps): JSX.Element => {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
	const [cancelDialog, setCancelDialog] = useState<boolean>(false);
	const [selectedField, setSelectedField] = useState<any>(null);
	const width: string = props?.width !== undefined ? props?.width : 'auto';
	const height: string = props?.height !== undefined ? props?.height : 'auto';
	const [titleColumns, setTitleColumns] = useState<any[]>([]);
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
	const { ShowSnackBar, openSnackBar, settingSnackBar } = useSnackBar();
	const [pageSize, setPageSize] = useState<number>(50);
	const rowsPage = [50, 100];//maximo que muestra son 100 filas, en la versión premium se puede establecer otros valores
	let _titleColumns = props.titleColumns;
	let updateValue: boolean = false;

	useEffect(() => {
		if (updateValue === false) {
			updateValue = true;
			updateAction();
			setTitleColumns(_titleColumns);
		}
	}, []);

	useEffect(() => {
		if (props?.actionDelete !== undefined && props?.idDelete === undefined) {
			// @ts-ignore: Object is possibly 'null'.
			settingSnackBar(
				'NO SE INDICO EL ID PARA ELIMINAR LOS DATOS EN LA TABLA. AL ELIMINAR ALGUN DATO NO SE REFLEJARA DE FORMA AUTOMATICA. CONSULTE AL PROGRAMADOR ING. FELIX CARRASCO',
				'error'
			);
			openSnackBar();
		}

		(async (): Promise<any> => {
			props?.loading && setLoading(true);
			setData(props.recordData);
		})().then(() => {
			props?.loading && setLoading(false);
		});
	}, [props.recordData]);

	const handleEditClick = (keyField: any) => (event: any) => {
		event.stopPropagation();
		const { id }: { id: string } = keyField;
		return props?.actionEdit && props.actionEdit(id);
	};

	const confirmDelete = (keyField: any) => (event: any) => {
		event.stopPropagation();
		const { id }: { id: string } = keyField;
		setSelectedField(id);
		setDeleteDialog(true);
	};

	const confirmCancel = (rowSelected: any) => (event: any) => {
		event.stopPropagation();
		const { id }: { id: string } = rowSelected;
		setSelectedField(id);
		setCancelDialog(true);
	};

	const clickGoExtra = (rowSelected: any) => (event: any) => {
		event.stopPropagation();
		const { id }: { id: string } = rowSelected.row;
		//props?.keyFieldExtra && (paramExtract = rowSelected.row[props?.keyFieldExtra]);
		const paramExtract: any = props?.keyFieldExtra !== undefined ? rowSelected.row[props?.keyFieldExtra] : '';
		if (props?.keyFieldExtra === undefined) {
			return props?.actionButtonExtra && props.actionButtonExtra(id);
		} else {
			return props?.actionButtonExtra && props.actionButtonExtra({ id: id, paramExtract: paramExtract });
		}
	};

	const hideDeleteDialog = () => {
		setDeleteDialog(false);
	};
	const hideCancelDialog = () => {
		setCancelDialog(false);
	};

	const updateAction = () => {
		if ((props?.columnDelete !== undefined) && (props?.columnDelete !== false)) {
			_titleColumns.unshift({
				field: 'delete',
				type: 'actions',
				headerName: '',
				width: 30,
				cellClassName: 'actions',
				renderCell: (keyField: any) => (
					<>
						<Tooltip title='Eliminar' placement='bottom' arrow key='tooldelete'>
							<IconButton
								color='error'
								onClick={confirmDelete(keyField)}
								key='eliminar-button'
								size="small"
							>
								<DeleteIcon fontSize="inherit" />
							</IconButton>
						</Tooltip>
					</>
				),
			});
			//	setTitleColumns((prevState) => [...prevState, ..._titleColumns]); //de esta forma se utiliza useState con una matriz, existen otras formas pero en esta caso esta es la que más se adapta a mis necesidades
		}

		if ((props?.columnCancel !== undefined) && (props?.columnCancel !== false)) {
			_titleColumns.unshift({
				field: 'anular',
				type: 'actions',
				headerName: '',
				width: 30,
				cellClassName: 'actions',
				renderCell: (keyField: any) => (
					<>
						<Tooltip title='Anular Pago' placement='bottom' arrow key='toolanular'>
							<IconButton
								aria-label='anularCancelIcon'
								color='error'
								onClick={confirmCancel(keyField)}
								key='icon'
								size='small'
							>
								<CancelIcon fontSize="inherit" />
							</IconButton>
						</Tooltip>
					</>
				),
			});
			//	setTitleColumns((prevState) => [...prevState, ..._titleColumns]); //de esta forma se utiliza useState con una matriz, existen otras formas pero en esta caso esta es la que más se adapta a mis necesidades
		}
		if ((props?.columnButtonExtra !== undefined) && (props?.columnButtonExtra !== false)) {
			_titleColumns.unshift({
				field: 'payments',
				type: 'actions',
				headerName: '',
				width: 30,
				cellClassName: 'actions',
				renderCell: (rowSelected: any) => (
					<>
						<Tooltip title='Agregar pago' placement='bottom' arrow key='toolpayments'>
							<IconButton
								color='success'
								onClick={clickGoExtra(rowSelected)}
								size='small'
								key='payments-button'
							>
								<AddTask fontSize="inherit" />
							</IconButton>
						</Tooltip>
					</>
				),
			});
			//setTitleColumns((prevState) => [...prevState, ..._titleColumns]); //de esta forma se utiliza useState con una matriz, existen otras formas pero en esta caso esta es la que más se adapta a mis necesidades
		}
		if ((props?.columnEdit !== undefined) && (props?.columnEdit !== false)) {
			_titleColumns.unshift({
				field: 'update',
				type: 'actions',
				headerName: '',
				width: 30,
				cellClassName: 'actions',
				renderCell: (keyField: any) => (
					<>
						<Tooltip title='Modificar' placement='bottom' arrow key='toolmodificar'>
							<IconButton
								color='primary'
								onClick={handleEditClick(keyField)}
								key='update-button'
								size='small'
							>
								<EditIcon fontSize="inherit" />
							</IconButton>
						</Tooltip>
					</>
				),
			});
			//setTitleColumns((prevState) => [...prevState, ..._titleColumns]); //de esta forma se utiliza useState con una matriz, existen otras formas pero en esta caso esta es la que más se adapta a mis necesidades
		}

	};

	const clickDelete = async (): Promise<any> => {
		setDeleteDialog(false);
		setLoading(true);
		if (props?.actionDelete) {
			await props
				.actionDelete(selectedField)
				.then((response) => {
					if (response > 0 && props?.idDelete) {
						let id = '';
						props?.idDelete && (id = props?.idDelete);
						// @ts-ignore: Object is possibly 'null'.
						let _data = data.filter(
							//@ts-ignore undefined
							(val) => val[props?.idDelete] !== selectedField
						);
						setData(_data);
						setLoading(false);
					}
				})
				.then(() => {
					setLoading(false);
				});
		}
	};
	const clickCancel = async (): Promise<any> => {
		setCancelDialog(false);
		setLoading(true);
		if (props?.actionCancel) {
			await props.actionCancel(selectedField).then(() => setLoading(false));
		}
	};

	const deleteDialogFooter = (
		<>
			<IconButton
				color='primary'
				onClick={hideDeleteDialog}
				key='no-dialog1'
				size='large'
			>
				<HighlightOffRoundedIcon fontSize="inherit" />
			</IconButton>
			<IconButton
				color='error'
				onClick={clickDelete}
				key='update-button'
				size='large'
			>
				<CheckCircleOutlineRoundedIcon fontSize="inherit" />
			</IconButton>
		</>
	);

	const cancelDialogFooter = (
		<>
			<IconButton
				color='primary'
				onClick={hideCancelDialog}
				key='no-dialog2'
				size='large'>
				<HighlightOffRoundedIcon fontSize="inherit" />
			</IconButton>
			<IconButton color='error'
				onClick={clickCancel}
				key='update-button2'
				size='large'
			>
				<CheckCircleOutlineRoundedIcon fontSize="inherit" />
			</IconButton>
		</>
	);
	return (
		<Suspense fallback={<h1>Loading data...</h1>}>
			<div style={{ height: 400, width: '95%' }}>
				<div style={{ display: 'flex', height: '100%', width: '100%' }}>
					<div style={{ flexGrow: 1 }}>
						<Grid style={{ height: '100%', display: 'flex', overflow: 'scroll', width: '100%', margin: '1%' }}>
							<Grid style={{ flexGrow: 1, width: '100%', height: '100%' }}>
								{ShowSnackBar}
								<h4>{props.title}</h4>
								<DataGrid
									/* onSelectionModelChange={(id) => {
									const _selectedIDs = new Set(id);
									const _selectedRows = data.filter((row) =>
										_selectedIDs.has(row.id)
									);
					 
									setSelectedRows(_selectedRows);
								}} estos muestra los datos de la fila seleccionada. Pero hay que seleccionar la fila y no hacer click en el boton*/
									rows={data}
									columns={titleColumns}
									pageSize={pageSize}
									//autoPageSize //si se coloca toma el alto y ancho que pueda permitir la pagina, y muestra los valores estandares
									onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
									rowsPerPageOptions={rowsPage}
									pagination
									checkboxSelection={false}
									loading={data.length === 0}
									experimentalFeatures={{ newEditingApi: true }}
									//autoHeight//si se activa los titulos no quedan fijos
									//disableSelectionOnClick
									/*initialState={{ pinnedColumns: { left: [props.keyField], right: ['actions'] } }}*/
									// onRowClick={(param: any) => handleOnClick(param.row)}
									components={{ Toolbar: GridToolbar }}
								/>

								{/* dialog para Eliminar */}
								<Dialog
									key='dialog1'
									//fullScreen={fullScreen}
									open={deleteDialog}
									onClose={hideDeleteDialog}
									aria-labelledby='responsive-dialog-title'
									id='dialog-delete'>
									<DialogTitle id='responsive-dialog-title'>{'CONFIRMACIÓN'}</DialogTitle>
									<DialogContent>
										<DialogContentText>{<span>¿Está seguro de eliminar los datos?</span>}</DialogContentText>
									</DialogContent>
									<DialogActions>{deleteDialogFooter}</DialogActions>
								</Dialog>

								{/* Dialog para anular */}
								<Dialog
									// fullScreen={fullScreen}
									open={cancelDialog}
									onClose={hideCancelDialog}
									aria-labelledby='responsive-dialog-title'
									id='dialog-anular'>
									<DialogTitle id='responsive-dialog-title'>{'CONFIRMACIÓN'}</DialogTitle>
									<DialogContent>
										<DialogContentText>{<span>¿Está seguro de anular el pago?</span>}</DialogContentText>
									</DialogContent>
									<DialogActions>{cancelDialogFooter}</DialogActions>
								</Dialog>
							</Grid>
						</Grid>
					</div>
				</div>
			</div>
		</Suspense>
	);
};
