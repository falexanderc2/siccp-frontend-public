// TODO this report makes query of data clients and creditors
import { useState, Suspense } from 'react'
import { DataTableCrud } from '../../components/DataTable/DataTableMiu'
import { Controller, useForm } from 'react-hook-form';
import useErrorMessage from '../../hooks/useErrorMessage';
import useSearchData from '../../hooks/useSearchData';
import { TDate, TEnterprises } from '../../interfaces/interfaces';
import { TIdCommon } from '../../interfaces/commonInterfaces';
import { ERROR_LIST } from '../../setup/environment';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import { useAppUserContext } from '../../context/userContext';
import useValidValue from '../../hooks/useValidValue';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';
import CancelIcon from '@mui/icons-material/Cancel'
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { titleColumns } from './columns'

//leyend
// ! xs, extra - small: 0px
// ! sm, small: 600px
// ! md, medium: 900px
// ! lg, large: 1200px
// ! xl, extra - large: 1536px
const _xs = 6;
const _sm = 6;
const _md = 6;
const _xl = 4;
const _lg = 4;

const styleItem = {
  marginTop: '7px',
}

interface ISearch extends TEnterprises, TIdCommon {
  commonName: string,
  startDate: TDate,
  endDate: TDate,
  option: null | undefined | string
}
const defaultValues: ISearch = {
  idEnterprise: 0,
  idCommon: 0,
  commonName: '',
  startDate: undefined,
  endDate: undefined,
  option: null
}

const optionItems = [
  { label: '', value: null },
  { label: 'Clientes', value: 'receibables' },
  { label: 'Acreedores', value: 'debts_to_pays' },
];
export default function ReporteCustomersCreditor () {
  const { dataUser } = useAppUserContext();
  const [titleSearch, setTitleSearch] = useState<string>('')
  const { control, handleSubmit, reset, formState: { errors } } = useForm<ISearch>({ defaultValues });
  const { showErrorMessage } = useErrorMessage();
  const { validateValue } = useValidValue();
  const [optionReporte, setOptionReporte] = useState<any>('');
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const { searchDatas, data, countRow } = useSearchData();
  const [showData, setShowData] = useState<boolean>(false)
  const [pathEndPoint, setPathEndPoint] = useState<string>('')

  const clickSearch = async () => {
    setLoadingSearch(true);
    await searchDatas(`${pathEndPoint}/search/resumen/totales/${dataUser.id}`, 'Buscando datos')
    setLoadingSearch(false)
    setShowData(true)
  };

  const handleChangeOption = (params: any) => {
    if (validateValue(params) === true) {
      const valores = params['label']
      setOptionReporte(valores);
      setTitleSearch(() => valores === 'receibables' ? 'Reporte de cuentas por cobrar' : 'Reporte de cuentas por pagar')
      setPathEndPoint(params['value'])
    } else {
      hadleReset()
    }
  };

  const hadleReset = () => {
    reset()
  }
  const BottomSearch = (
    <>
      <Tooltip title='Buscar' placement='bottom' arrow>
        <LoadingButton
          id='buttonSearch'
          color='primary'
          onClick={handleSubmit(clickSearch)}
          loading={loadingSearch}
          loadingPosition='start'
          startIcon={<SearchIcon />}
          variant='contained'
        />
      </Tooltip>
      <Tooltip title='Cancelar' placement='bottom' arrow>
        <Button color='primary' onClick={hadleReset} startIcon={<CancelIcon />} variant='contained' />
      </Tooltip>
    </>
  )

  const ShowResult = (
    <Card sx={{ width: '100%' }}>
      <CardHeader title={'Tabla de Resultados'} sx={{ marginLeft: '1%' }} />
      {showData && (
        <DataTableCrud
          title={`Total datos encontrados: ${countRow}`}
          titleColumns={titleColumns()}
          columnEdit={false}
          columnDelete={false}
          loading={true}
          recordData={data}
        />
      )}
    </Card>
  )

  return (
    <>
      <Suspense fallback={<h1>Loading profile...</h1>}>
        <Card sx={{ width: '100%' }}>
          <CardHeader title={titleSearch} />
          {/* {ShowMessageSearch} */}
          <form onSubmit={handleSubmit(clickSearch)} noValidate>
            <Controller
              name='idEnterprise'
              control={control}
              defaultValue={dataUser.id}
              render={({ field }) => <input type='hidden' id={field.name} {...field} />}
            />

            <Grid container spacing={1} sx={{ margin: '0.5%', marginTop: '0px' }}>
              <Grid container spacing={1} style={styleItem}>
                <Grid item={true} xs={_xs} sm={_sm} md={_md} xl={_xl} lg={_lg} style={styleItem}>
                  <Controller
                    name='option'
                    control={control}
                    rules={{
                      validate: {
                        checkItems: () => {
                          if (optionReporte === '' || optionReporte === null) {
                            return ERROR_LIST;
                          }
                        },
                      },
                    }}
                    render={({ field }) => (
                      <Autocomplete
                        value={optionReporte}
                        options={optionItems}
                        id={field.name}
                        onChange={(event: any, newValue: any) => {
                          handleChangeOption(newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label='Opciones de Reporte'
                            fullWidth
                            helperText={showErrorMessage(errors.option)}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>

                <Grid item={true} xs={_xs} sm={_sm} md={_md} xl={_xl} lg={_lg} style={styleItem}>
                  {BottomSearch}
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Card>
      </Suspense >
      {showData && ShowResult}
    </>
  )

}