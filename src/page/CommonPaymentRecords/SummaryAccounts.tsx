import Alert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';


const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
}));

interface IProps {
	idDebts: number | undefined;
	totalRemainingDebt: string;
	totalAccount: string;
	amountDebtQuery: string;
	amountPaidQuery: string;
	remainingDebtQuery: string;
}

//leyend
// ! xs, extra - small: 0px
// ! sm, small: 600px
// ! md, medium: 900px
// ! lg, large: 1200px
// ! xl, extra - large: 1536px
const _xs = 12;
const _sm = 5;
const _md = 5;
const _xl = 2.4;
const _lg = 2.4;

const styleItem = {
	marginTop: '7px',
}

export const SummaryAccounts = (props: IProps) => {
	return (
		<Grid container direction='row' spacing={1} style={{ marginBottom: '15px' }}>
			<Grid item={true} xs={_xs} sm={_sm} md={_md} xl={_xl} lg={_lg} style={styleItem}>
				<h5>Deuda General</h5>
				<Item>
					<Alert severity='info'>{props.totalRemainingDebt}</Alert>
				</Item>
			</Grid>
			<Grid item={true} xs={_xs} sm={_sm} md={_md} xl={_xl} lg={_lg} style={styleItem}>
				<h5>Cuentas Pendientes</h5>
				<Item>
					<Alert severity='info'>{props.totalAccount}</Alert>
				</Item>
			</Grid>
			<Grid item={true} xs={_xs} sm={_sm} md={_md} xl={_xl} lg={_lg} style={styleItem}>
				<h5>Deuda Cuenta No: {props.idDebts}</h5>
				<Item>
					<Alert severity='error'>{props.amountDebtQuery}</Alert>
				</Item>
			</Grid>
			<Grid item={true} xs={_xs} sm={_sm} md={_md} xl={_xl} lg={_lg} style={styleItem}>
				<h5>Total Pagado Cuenta No: {props.idDebts}</h5>
				<Item>
					<Alert severity='success'>{props.amountPaidQuery}</Alert>
				</Item>
			</Grid>
			<Grid item={true} xs={_xs} sm={_sm} md={_md} xl={_xl} lg={_lg} style={styleItem}>
				<h5>Deudas Restantes Cuenta No: {props.idDebts}</h5>
				<Item>
					<Alert severity='warning'>{props.remainingDebtQuery}</Alert>
				</Item>
			</Grid>
		</Grid>
	);
};
