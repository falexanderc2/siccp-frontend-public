import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import useEvaluateNumber from './useEvaluateNumber';
import useFormato from './useFormato'
import useSnackBarSearch from './useSnackBarSearch';
import useBackdrop from './useBackdrop';
import queryExchange from '../services/queryExchange';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

//leyend
// ! xs, extra - small: 0px
// ! sm, small: 600px
// ! md, medium: 900px
// ! lg, large: 1200px
// ! xl, extra - large: 1536px
const _xs = 12;
const _sm = 6;
const _md = 6;
const _xl = 6;
const _lg = 6;

const styleItem = {
  marginTop: '7px',
}

let dolarOtros: number = (0.00)
let dolarBCV: number = (0.00)

export default function useExchange () {
  const { ShowSnackBarSearch, settingSnackBarSearch, openSnackBarSearch } = useSnackBarSearch();
  const { ShowBackdrop, openBackdrop, closeBackdrop } = useBackdrop();
  const { valueDecimal } = useEvaluateNumber();
  const [totalBolivarOficial, setTotalBolivarOficial] = useState<number>(0.00)
  const [totalBolivarParalelo, setTotalBolivarParalelo] = useState<number>(0.00)
  const [showDolar, setShowDolar] = useState<boolean>(false)
  const { formatDecimal } = useFormato()
  const [monto, setMonto] = useState<string>('')
  const [tipoDolar, setTipoDolar] = useState('OTROS');
  const [messageDolar, setMessageDolar] = useState<string>('Buscando valor del Dolar')
  const [montoDolar, setMontoDolar] = useState<number>(0)
  // let monto: string =''
  //let total: string = monto;
  let loadExchange: boolean = false

  useEffect(() => {
    //Buscar los valores del Exchange
    if (!loadExchange) {
      loadExchange = true;
      (async (): Promise<any> => {
        openBackdrop('Buscando valores del Dólar')
        try {
          const respose: any = await queryExchange()
          dolarBCV = respose.USD.sicad2
          dolarOtros = respose.USD.dolartoday
          setMontoDolar(dolarOtros)
          setShowDolar(true)
          closeBackdrop()
        } catch (error: any) {
          dolarBCV = 0
          dolarOtros = 0
          setMontoDolar(0)
          setMessageDolar('NO SE LOGRO OBTENER LOS VALORES DEL DOLAR')
          setShowDolar(false)
          closeBackdrop()
          settingSnackBarSearch(error.message, 'error')
          openSnackBarSearch()
        }
      })();
    }
  }, []);

  useEffect(() => {
    calcularMontoDolares()
  }, [monto])


  const handleMonto = (valor: string) => {
    setMonto(() => valor.length > 0 ? valueDecimal(valor) : '0');
  }

  const handleChangeOption = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valores: any = (event.target as HTMLInputElement).value
    setTipoDolar(valores);
    setMontoDolar(() => valores === 'OFICIAL' ? dolarBCV : dolarOtros)
  };

  const calcularMontoDolares = () => {
    const _montoDeuda: any = parseFloat(monto);
    if ((_montoDeuda > 0) && (dolarBCV > 0)) {
      const total1: number = _montoDeuda * dolarBCV;
      const total2: number = _montoDeuda * dolarOtros;
      setTotalBolivarOficial(total1)
      setTotalBolivarParalelo(total2)
    } else {
      setTotalBolivarOficial(0)
      setTotalBolivarParalelo(0)
    }
  }

  const OptionDolar = (
    <FormControl>
      <RadioGroup
        row
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={tipoDolar}
        onChange={handleChangeOption}
      >
        <FormControlLabel value="OFICIAL" control={<Radio />} label={`Dólar Oficial = ${formatDecimal(dolarBCV)}`} />
        <FormControlLabel value="OTROS" control={<Radio />} label={`Dólar Otros = ${formatDecimal(dolarOtros)}`} />
      </RadioGroup>
    </FormControl>
  );

  const ShowExchange = (
    <>
      {ShowBackdrop}
      {ShowSnackBarSearch}
      <Grid container spacing={1}>
        <Grid container spacing={1} style={styleItem} >
          <Grid item={true} xs={_xs} sm={_sm} md={_md} xl={_xl} lg={_lg} style={styleItem}>
            <Alert severity='info' >{showDolar ? (OptionDolar) : (<h4>{messageDolar}</h4>)}</Alert>
          </Grid>
          <Grid item={true} xs={_xs} sm={_sm} md={_md} xl={_xl} lg={_lg} style={styleItem}>
            <Alert severity='error'>{`Total Oficial Bs.= ${formatDecimal(totalBolivarOficial)} / Total Paralelo Bs. =  ${formatDecimal(totalBolivarParalelo)} `}</Alert>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
  return { handleMonto, ShowExchange, montoDolar, tipoDolar }
}


