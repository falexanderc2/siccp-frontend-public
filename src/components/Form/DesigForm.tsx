import LoadingButton from '@mui/lab/LoadingButton'
import SaveIcon from '@mui/icons-material/Save'
import Button from '@mui/material/Button'
import CancelIcon from '@mui/icons-material/Cancel'
import CloseIcon from '@mui/icons-material/Close'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { ReactNode, useEffect, useState, Suspense } from 'react'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'

interface IProps {
	title: string
	children: ReactNode
	showButtonSave?: boolean
	showButtonCancel: boolean
	activatedButton: boolean
	saveData: () => Promise<any>
	resetData: () => void
	watchDialog?: () => void
}

export const DesigForm = (props: IProps) => {
	const [dialogVisible, setDialogVisible] = useState<boolean>(true)
	const [loadingSave, setLoadingSave] = useState<boolean>(false)
	const checkSave = props?.showButtonSave !== undefined ? props?.showButtonSave : true
	const [showButtonSave, setShowButtonSave] = useState<boolean>(checkSave)
	const theme = useTheme()
	const fullScreen = useMediaQuery(theme.breakpoints.up('md'))

	useEffect(() => {
		setShowButtonSave(checkSave)
	}, [])

	const save = async () => {
		setLoadingSave(true)
		await props.saveData().then(() => {
			setLoadingSave(false)
		})
	}

	const reset = () => {
		props.resetData()
	}

	const header = (
		<span>
			<h4>{props.title}</h4>
		</span>
	)

	const hideDialog = () => {
		setDialogVisible(false)
		//props?.watchDialog && props?.watchDialog()
		props.watchDialog?.()//esto es igual a props?.watchDialog && props?.watchDialog()
	}

	const FooterDialog = (
		<div style={{ display: 'flex', gap: '5px' }}>
			{showButtonSave === true && (
				<Tooltip title='Guardar' placement='bottom' arrow>
					<LoadingButton
						color='success'
						onClick={save}
						loading={loadingSave}
						loadingPosition='start'
						startIcon={<SaveIcon />}
						variant='contained'
						disabled={props.activatedButton}
					/>
				</Tooltip>
			)}
			{props.showButtonCancel && (
				<Tooltip title='Cancelar' placement='bottom' arrow>
					<Button color='primary' onClick={reset} startIcon={<CloseIcon />} variant='contained' />
				</Tooltip>
			)}
			<Tooltip title='Cerrar' placement='bottom' arrow>
				<Button color='error' onClick={hideDialog} startIcon={<CancelIcon />} variant='contained' />
			</Tooltip>
		</div>
	)

	return (
		<Dialog open={dialogVisible} aria-labelledby='responsive-dialog-title' onClose={hideDialog} fullScreen={true}>
			<DialogContent sx={{ paddingTop: 0, paddingBottom: 0.1 }}>
				<DialogTitle id='responsive-dialog-title' sx={{ paddingTop: 0, paddingBottom: 0.1 }}>
					{props.title}
				</DialogTitle>
				<Card sx={{ width: 'auto', paddingTop: 0, paddingBottom: 0.1 }}>
					<CardContent sx={{ paddingTop: 0, paddingBottom: 0.1 }}>
						<Suspense fallback={<h1>Loading datos...</h1>}>
							<Box sx={{ flexGrow: 1, flexWrap: 'wrap', paddingTop: 0.1, paddingBottom: 0.1 }}>{props.children}</Box>
						</Suspense>
					</CardContent>
				</Card>
			</DialogContent>
			<DialogActions sx={{ justifyContent: 'center', alignItems: 'center' }}>{FooterDialog}</DialogActions>
		</Dialog>
	)
}
