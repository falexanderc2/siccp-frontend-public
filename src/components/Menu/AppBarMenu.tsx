import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import PersonIcon from '@mui/icons-material/Person';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { useAppUserContext } from '../../context/userContext';
import menuOptions from '../../page/Menus/Menus';
import useLogout from '../../hooks/useLogout';
import ListItemIcon from '@mui/material/ListItemIcon';
import Logout from '@mui/icons-material/Logout';
import ManageAccounts from '@mui/icons-material/ManageAccounts';

const settings = [
	{ title: 'Perfil', icon: 'Logout' },
	{ title: 'Salir', icon: 'Logout' }];

export default function AppBarMenu () {
	const { dataUser, dispatch } = useAppUserContext();
	//console.log('userData desde AppBarMenu', dataUser)
	const menu = menuOptions(dataUser.typeUser);
	const navigate = useNavigate();
	const { logout } = useLogout();

	const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = (path: string) => {
		navigate(path, { replace: true });
		if (path === '/login') {
			handleLogoutClick();
		}
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		dispatch({ type: 'xvsf' });
		setAnchorElUser(null);
	};

	const handleLogoutClick = () => {
		navigate('/');
		dispatch({
			type: 'LOGOUT',
			value: true,
		});
	};

	const handleClickUser = (option: string) => {
		handleCloseUserMenu();
		switch (option) {
			case 'Salir': {
				/* window.location.replace('/login'); // ?se envia a esta ruta y se carga la pagina
				handleLogoutClick(); */
				logout();
				break;
			}
			case 'Perfil': {
				const perfil = dataUser.typeUser === 'ADMINISTRATOR' ? '/administrator/perfil' : '/enterprises/perfil';
				handleCloseNavMenu(perfil);
				break;
			}
			default: {
				break;
			}
		}
	};

	const menuUser = (
		<Box sx={{ flexGrow: 0 }}>
			<Tooltip title='Open settings'>
				<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
					<Chip
						avatar={
							<Avatar>
								<PersonIcon />
							</Avatar>
						}
						label={dataUser.userName}
						style={{ color: '#ffffff' }}
					/>
				</IconButton>
			</Tooltip>
			<Menu
				sx={{ mt: '45px' }}
				id='menu-appbar'
				anchorEl={anchorElUser}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				keepMounted
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				open={Boolean(anchorElUser)}
				onClose={handleCloseUserMenu}>
				{/* se desactivo esta opción porque no pude realizar el renderizado de los iconos
				{settings.map((setting, index) => (
					<MenuItem key={index} onClick={() => handleClickUser(setting.title)}>
						<ListItemIcon>
							<setting.icon />
						</ListItemIcon>
						<Typography textAlign='center'>{setting.title}</Typography>
					</MenuItem>
				))} */}
				<MenuItem onClick={() => handleClickUser('Perfil')}>
					<ListItemIcon>
						<ManageAccounts />
					</ListItemIcon>
					<Typography variant="inherit">Perfil</Typography>
				</MenuItem>
				<MenuItem onClick={() => handleClickUser('Salir')}>
					<ListItemIcon>
						<Logout />
					</ListItemIcon>
					<Typography variant="inherit">Salir</Typography>
				</MenuItem>
			</Menu>
		</Box>
	);

	const appBar = (
		<React.Suspense fallback={<h1>Loading data...</h1>}>
			<AppBar position='static'>
				<Container maxWidth='xl'>
					<Toolbar disableGutters>
						<Typography variant='h6' noWrap component='div' sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}>
							SICCP
						</Typography>
						<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
							<IconButton
								size='large'
								aria-label='account of current user'
								aria-controls='menu-appbar'
								aria-haspopup='true'
								onClick={handleOpenNavMenu}
								color='inherit'>
								<MenuIcon />
							</IconButton>
							<Menu
								id='menu-appbar'
								anchorEl={anchorElNav}
								anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'left',
								}}
								keepMounted
								transformOrigin={{
									vertical: 'top',
									horizontal: 'left',
								}}
								open={Boolean(anchorElNav)}
								onClose={handleCloseNavMenu}
								sx={{
									display: { xs: 'block', md: 'none' },
								}}>
								{menu.map((text, index) => (
									<MenuItem key={text.key} onClick={() => handleCloseNavMenu(text.path)}>
										<Typography textAlign='center'>{text.keyword}</Typography>
									</MenuItem>
								))}
							</Menu>
						</Box>
						<Typography
							variant='h6'
							noWrap
							component='div'
							sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
							SICCP
						</Typography>
						<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
							{menu.map((text, index) => (
								<Button
									key={text.key + index}
									onClick={() => handleCloseNavMenu(text.path)}
									sx={{ my: 2, color: 'white', display: 'block' }}>
									{text.keyword}
								</Button>
							))}
						</Box>
						{menuUser}
					</Toolbar>
				</Container>
			</AppBar>
		</React.Suspense>
	);

	return appBar;
}
