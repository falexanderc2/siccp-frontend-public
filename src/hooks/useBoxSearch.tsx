import { useState } from 'react';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';

interface IProps {
	buttonNew: boolean;
	placeholder: string;
	isSearch: () => Promise<any>;
	isOpen?: () => void;
}

export default function useBoxSearch (props: IProps) {
	const [keyWordSearch, setKeyWordSearch] = useState<string>('');
	const [loadingSearch, setLoadingSearch] = useState<boolean>(false);

	const clickSearch = async () => {
		setLoadingSearch(true);
		return await props.isSearch().then((response: any) => {
			setLoadingSearch(false)
		});
	};

	const clickNew = () => {
		props?.isOpen && props.isOpen();
	};

	const handleChange: (event: React.ChangeEvent<HTMLInputElement>) => any = (event) => {
		return setKeyWordSearch(event.currentTarget.value);
	};

	const handleKeyDown = (event: any) => {
		if (event.keyCode === 13) {
			clickSearch();
		}
	};

	const boxSearch = (
		<Grid container
			direction="row"
			justifyContent="space-around"
			alignItems="center" columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} columnGap={1} rowGap={1}
			style={{ marginBottom: '10px' }}>
			<Grid item={true} xs={6} sm={6} md={6} lg={10} xl={10} >
				<TextField
					id='keyWordSearch'
					type='search'
					fullWidth
					onChange={handleChange}
					placeholder={props.placeholder}
					onKeyDown={(e: any) => handleKeyDown(e)}
				/>
			</Grid>
			<Grid item={true} xs={'auto'} sm={'auto'} md={'auto'} lg={'auto'} xl={'auto'} >
				<Grid container direction="row" justifyContent="center" alignItems="center" columnGap={1}>
					<Tooltip title='Buscar' placement='bottom' arrow>
						<LoadingButton
							id='buttonSearch'
							color='primary'
							onClick={clickSearch}
							loading={loadingSearch}
							loadingPosition='start'
							startIcon={<SearchIcon />}
							variant='contained'
							size='large'
						/>
					</Tooltip>

					{props.buttonNew && (
						<Tooltip title='Agregar' placement='right' arrow>
							<Button
								color='success'
								onClick={clickNew}
								startIcon={<AddIcon />}
								variant='contained'
								size='large'
							/>
						</Tooltip>
					)}
				</Grid>
			</Grid>
		</Grid >
	);
	return { boxSearch, keyWordSearch };
}
