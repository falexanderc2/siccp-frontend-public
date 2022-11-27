export default function useEvaluateNumber () {

	const valueDecimal = (value: string): string => {
		let valor: string = ''
		if (value.length > 0) {
			valor = value.toString().replace(/[.]/g, '')
			valor = valor.toString().replace(/[,]/g, '.')
		}
		return valor
	}

	const valueInteger = (value: string): string => {
		let valor: string = ''
		if (value.length > 0) {
			valor = value.toString().replace(/[.]/g, '')
			valor = valor.toString().replace(/[,]/g, '')
		}
		return valor
	}

	return { valueDecimal, valueInteger }
}
