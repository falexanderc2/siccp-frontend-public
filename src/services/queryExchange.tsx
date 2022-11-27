
export default async function queryExchange (): Promise<any> {
  const URL = "https://s3.amazonaws.com/dolartoday/data.json"
  try {
    const response: any = await fetch(URL);
    if (!response.ok) {
      throw 'Error en la conexión'
    }
    const dataFound = await response.json();
    return dataFound
  } catch (error: any) {
    throw new Error(`ERROR CONSULTANDO DOLAR: ${error}`)
  }

}