export default function useValidValue () {
  const validateValue = (value: any): boolean => {
    // !esta función evalua si el valor pasado es null, vacio o indefinido
    //! retorna true  si el valor es correcto y false si no lo es
    let result: boolean = true
    if ((value === null) || (value === undefined) || (value === '')) {
      result = false
    }
    return result
  }
  return { validateValue }
}