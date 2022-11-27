import { useState } from 'react';

export default function useForms (initValues: any) {
  const [values, setValues] = useState(initValues)

  const handleInputChange = (fieldName: string) => ((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues({ ...values, [fieldName]: event.currentTarget.value });
  })

  const initDefaultValue = (initValues: any) => {
    setValues(initValues)
  }

  return { values, handleInputChange, initDefaultValue }
}
