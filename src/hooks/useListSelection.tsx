export default function useListSelection() {
	const checkTypeOf = (valueList: any, itemSearch: string): string => {
		if (valueList !== undefined) {
			if (typeof valueList === 'object') {
				return valueList[itemSearch].trim().toUpperCase()
			} else {
				return valueList.trim().toUpperCase()
			}
		} else {
			return ''
		}
	}

	const checkList = (valueList: any, itemsList: any, itemSearch: string): boolean => {
		let trueValue: string = ''
		if (valueList === undefined) {
			return false
		}
		trueValue = checkTypeOf(valueList, itemSearch)
		return itemsList.find((valueFind: any) => valueFind[itemSearch] === trueValue) === undefined ? false : true
	}
	return { checkTypeOf, checkList }
}
