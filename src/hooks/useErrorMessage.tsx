
export default function useErrorMessage () {
  const showErrorMessage = (errors: any) => {
    return errors && <small style={{ color: 'red' }}> {errors.message}</small >
  }

  return { showErrorMessage }
}