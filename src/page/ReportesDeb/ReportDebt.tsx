// TODO this report makes query of data clients and creditors
import { useState, useEffect, Suspense } from 'react'
import { DataTableCrud } from '../../components/DataTable/DataTableMiu'
import { Controller, useForm } from 'react-hook-form';
import useErrorMessage from '../../hooks/useErrorMessage';
import useSearchData from '../../hooks/useSearchData';
import { TDate, TEnterprises } from '../../interfaces/interfaces';
import { VALUE_REQUIRED, ERROR_LIST, DATE_INVALIDATE } from '../../setup/environment';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import esLocale from 'date-fns/locale/es';
import { useAppUserContext } from '../../context/userContext';
import useValidValue from '../../hooks/useValidValue';
import useDateSetting from '../../hooks/useDateSetting';
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
const _xs = 12;
const _sm = 6;
const _md = 6;
const _xl = 2.3;
const _lg = 2.3;

const styleItem = {
  marginTop: '7px',
}

interface ISearch extends TEnterprises {
  idCommon: string
  commonName: string,
  startDate: TDate,
  endDate: TDate,
  option: null | undefined | string
}
const defaultValues: ISearch = {
  idEnterprise: 0,
  idCommon: '0',
  commonName: '',
  startDate: undefined,
  endDate: undefined,
  option: null
}

const optionItems = [
  { label: '', value: null },
  { label: 'Cobros', value: 'collectdebts' },
  { label: 'Pagos', value: 'debit_payments' },
];
export default function ReporteCollector () {
  const { dataUser } = useAppUserContext();

  const [title, setTitle] = useState<string>('Listado')
  const [titleSearch, setTitleSearch] = useState<string>('')
  const { control, handleSubmit, getValues, reset, formState: { errors } } = useForm<ISearch>({ defaultValues });
  const [listCommon, setListCommon] = useState<string[]>([]);
  const { showErrorMessage } = useErrorMessage();
  const { validateValue } = useValidValue();
  const [idCommon, setIdCommon] = useState<string>('0');
  const [commonName, setCommonName] = useState<any | null>(null);
  const [startDate, setStartDate] = useState<any>(new Date());
  const [endDate, setEndDate] = useState<any>(new Date());
  const { convertDateMysql, formatDateLantino } = useDateSetting();
  const [optionReporte, setOptionReporte] = useState<any>('');
  const [pathRouteListSearch, setPathRouteListSearch] = useState('');
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const { searchDatas, data, countRow } = useSearchData();
  const [showData, setShowData] = useState<boolean>(false)
  const [pathEndPoint, setPathEndPoint] = useState<string>('')

  useEffect(() => {
    // !BUSCAR LA LISTA DE ACREEDORES  O CLIENTES DEPENDIENDO LA RUTA QUE SE INDIQUE
    if (pathRouteListSearch.length > 0) {
      (async (): Promise<any> => {
        const fieldSearch: string = '"commonName" as label,"id" as value';
        setListCommon([])
        await searchDatas(`${pathRouteListSearch}/search/filters/${dataUser.id}/${fieldSearch}`, `Buscando ${optionReporte}`, false).then(
          (dataFound) => {
            if (dataFound.data !== undefined) {
              setListCommon(dataFound.data)
            }
          })
      })();
    }
  }, [pathRouteListSearch])

  const clickSearch = async () => {
    setLoadingSearch(true);
    const _path = idCommon === '0' ? `${pathEndPoint}/resumen/${dataUser.id}/${convertDateMysql(startDate)}/${convertDateMysql(endDate)}` : `${pathEndPoint}/resumen/${dataUser.id}/${convertDateMysql(startDate)}/${convertDateMysql(endDate)}/${idCommon}`
    await searchDatas(_path, 'Buscando datos')
    //await searchDatas(`${pathEndPoint}/resumen/${dataUser.id}/${idCommon}/'2022-11-22'/'2022-11-22'`, 'Buscando datos')
    setLoadingSearch(false)
    setShowData(true)
  };

  const handleIdCommon = (params: any) => {
    if (validateValue(params) === true) {
      setCommonName(() => params['label']);
      setIdCommon(() => params['value']);
    } else {
      setCommonName(() => null);
      setIdCommon(() => '0');
    }
  };

  const handleChangeOption = (params: any) => {
    if (validateValue(params) === true) {
      const valores = params['value']
      setOptionReporte(params['label'])

      setTitle(() => valores === 'collectdebts' ? 'Listados de clientes' : 'Listados de acreedores');
      setPathRouteListSearch(() => valores === 'collectdebts' ? 'customers' : 'creditors');
      setTitleSearch(() => valores === 'collectdebts' ? 'Reporte de cobros' : 'Reporte de pagos')
      setPathEndPoint(valores)
    } else {
      hadleReset()
    }
  };

  const hadleReset = () => {
    reset()
    setStartDate(null)
    setEndDate(null)
    setCommonName(() => null);
    setIdCommon(() => '0');

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
          {/*  {ShowMessageSearch} */}
          <form onSubmit={handleSubmit(clickSearch)} noValidate>
            <Controller
              name='idEnterprise'
              control={control}
              defaultValue={dataUser.id}
              render={({ field }) => <input type='hidden' id={field.name} {...field} />}
            />

            <Grid container spacing={1} sx={{ margin: '1%' }}>
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
                            label='Opción del Reporte'
                            fullWidth
                            helperText={showErrorMessage(errors.option)}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>

                <Grid item={true} xs={_xs} sm={_sm} md={_md} xl={_xl} lg={_lg} style={styleItem}>
                  <Suspense fallback={<h1>Loading data of List...</h1>}>
                    <Controller
                      name='idCommon'
                      control={control}
                      /*  rules={{
                         validate: {
                           checkItems: () => {
                             if (dataSearch.commonName === '') {
                               return ERROR_LIST;
                             }
                           },
                         },
                       }} */
                      render={({ field }) => (
                        <Autocomplete
                          value={commonName}
                          options={listCommon}
                          isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
                          id={field.name}
                          onChange={(event: any, newValue: any) => {
                            handleIdCommon(newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              {...field}
                              label={title}
                              fullWidth
                            // helperText={showErrorMessage(errors.idCommon)}
                            />
                          )}
                        />
                      )}
                    />
                  </Suspense>
                </Grid>
                <Grid item={true} xs={_xs} sm={_sm} md={_md} xl={_xl} lg={_lg} style={styleItem}>
                  <Controller
                    name='startDate'
                    control={control}
                    rules={{
                      validate: {
                        checkDate: () => {
                          let valid = formatDateLantino(startDate);
                          if (valid === null) {
                            return VALUE_REQUIRED;
                          }
                          if (valid === 'Invalid Date') {
                            return DATE_INVALIDATE;
                          }
                        },
                      },
                    }}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
                        <DatePicker
                          label='Fecha Inicio'
                          openTo='day'
                          views={['year', 'month', 'day']}
                          value={startDate}
                          onChange={(newValue: any) => {
                            setStartDate(newValue);
                          }}
                          renderInput={(params: any) => (
                            <TextField
                              {...params}
                              helperText={showErrorMessage(errors['startDate'])}
                              fullWidth
                              {...field}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                </Grid>
                <Grid item={true} xs={_xs} sm={_sm} md={_md} xl={_xl} lg={_lg} style={styleItem}>
                  <Controller
                    name='endDate'
                    control={control}
                    rules={{
                      validate: {
                        checkDate: () => {
                          let valid = formatDateLantino(endDate);
                          if (valid === null) {
                            return VALUE_REQUIRED;
                          }
                          if (valid === 'Invalid Date') {
                            return DATE_INVALIDATE;
                          }
                        },
                      },
                    }}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
                        <DatePicker
                          label='Fecha final'
                          openTo='day'
                          views={['year', 'month', 'day']}
                          value={endDate}
                          onChange={(newValue: any) => {
                            setEndDate(newValue);
                          }}
                          renderInput={(params: any) => (
                            <TextField
                              {...params}
                              helperText={showErrorMessage(errors['endDate'])}
                              fullWidth
                              {...field}
                            />
                          )}
                        />
                      </LocalizationProvider>
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