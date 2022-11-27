export default function useFormato () {
  const localCurrent: string = 'de-DE'//controla el formato de los numeros

  const formatDecimal = (param: number = 0) => {
    let valor: any = param
    if (param > 0) {
      valor = param.toLocaleString(localCurrent)
    }
    return valor
  }
  return { formatDecimal }
}