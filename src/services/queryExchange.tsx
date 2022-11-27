
export default async function queryExchange (tipoDolar: 'OFICIAL' | 'OTROS' = 'OFICIAL'): Promise<any> {
  //const URL = "https://s3.amazonaws.com/dolartoday/data.json" //dolar today
  const user = 'FELIX_031122'
  const tokenUser = 'Jdw6H5aj9LKj809jYqZM'
  const today = new Date().toLocaleDateString('fr-CA', { year: "numeric", month: "numeric", day: "numeric" })
  const tipo: string = tipoDolar === 'OFICIAL' ? 'bcv' : 'enparalelovzla'
  const URL = `https://exchangemonitor.net/api/historico?user=${user}&token=${tokenUser}&type=ve&id=${tipo}&from=${today}&to=${today}`
  // const URL = `https://exchangemonitor.net/api/historico?user=${user}&token=${tokenUser}&type=ve&id=bcv&from=2022-11-18&to=2022-11-18`

  try {
    const response: any = await fetch(URL);
    const dataFound = await response.json();
    if (!dataFound.succes) {
      throw dataFound.error.toUpperCase()
    }
    return dataFound.data[0].close
  } catch (error: any) {
    throw new Error(`ERROR CONSULTANDO DOLAR: ${error}`)
  }

}