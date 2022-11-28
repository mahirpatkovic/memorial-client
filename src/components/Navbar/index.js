import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    MenuOpen,
    Notifications,
    ExpandMore,
    PersonOutlined,
    Logout,
} from '@mui/icons-material';
import {
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
    useMediaQuery,
    Stack,
    AppBar,
    Box,
    IconButton,
    Toolbar,
    Backdrop,
    Snackbar,
    Alert,
    Badge,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { authActions } from '../../store/auth';
import femaleLogo from '../../assets/femaleLogo.png';
import maleLogo from '../../assets/maleLogo.png';
import MenuDrawer from '../MenuDrawer';
import './style.css';
import Service from '../../api/service';
import Loader from '../Loader';
import Searchbar from '../SearchBar';
import NotificationsMenu from '../NotificationsMenu';

const useStyles = makeStyles(() => ({
    searchFieldButton: {
        textTransform: 'none',
        fontWeight: 'bold',
    },
    searchFieldIcon: {
        marginRight: 10,
    },
    navbar: {
        width: '85%',
        position: 'fixed',
        zIndex: 10,
        backdropFilter: 'blur(10px)',
        // boxShadow: '0 4px 10px -2px #ddd',
        '@media (max-width: 1280px)': {
            width: '100%',
        },
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    navbarIcons: {
        color: '#393e46;',
        zIndex: 11,
    },
    searchField: {
        width: '83%',
        marginTop: 10,
        padding: 10,
        '@media (max-width: 1280px)': {
            width: '98%',
        },
    },
}));

function Navbar() {
    const [openMenu, setOpenMenu] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [openNotificationMenu, setOpenNotificationMenu] = useState(null);

    const currentUser = useSelector((state) => state.auth.currentUser);
    const allRequests = useSelector((state) => state.requests.allRequests);

    const isTabletMobile = useMediaQuery('(max-width:1280px)');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const classes = useStyles();

    const openDrawerHandler = () => {
        setIsDrawerOpen(true);
    };

    const closeDrawerHandler = () => {
        setIsDrawerOpen(false);
    };

    const handleOpenMenu = (event) => {
        setOpenMenu(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpenMenu(null);
    };

    const handleOpenNotificationMenu = (event) => {
        setOpenNotificationMenu(event.currentTarget);
    };

    const handleCloseNotificationMenu = () => {
        setOpenNotificationMenu(null);
    };

    const logoutHandler = () => {
        setIsLoading(true);
        Service.logout()
            .then(() => {
                localStorage.clear();
                dispatch(authActions.logout());
                navigate('/login');
            })
            .catch((err) => {
                setErrorMessage(
                    err.response
                        ? 'Problem prilikom odjavljivanja'
                        : 'Konekcija sa serverom nije uspostavljena'
                );
                setIsAlertVisible(true);
            });
        setIsLoading(false);
    };

    return (
        <div>
            {isLoading && (
                <Backdrop
                    sx={{
                        color: '#fff',
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                    open={isLoading}
                >
                    <Loader loaderColor={`black`} />
                </Backdrop>
            )}
            {isAlertVisible && (
                <Snackbar
                    open={isAlertVisible}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    autoHideDuration={6000}
                    onClose={() => setIsAlertVisible(false)}
                >
                    <Alert
                        onClose={() => setIsAlertVisible(false)}
                        severity='error'
                        sx={{ width: '100%', font: '14px Roboto' }}
                    >
                        {errorMessage}
                    </Alert>
                </Snackbar>
            )}
            <Box sx={{ flexGrow: 1 }}>
                <AppBar
                    position='static'
                    className={classes.navbar}
                    elevation={0}
                >
                    <Toolbar>
                        {isTabletMobile && (
                            <IconButton
                                size='large'
                                edge='start'
                                color='inherit'
                                aria-label='open drawer'
                                sx={{ mr: 2 }}
                                onClick={openDrawerHandler}
                            >
                                <MenuOpen className={classes.navbarIcons} />
                            </IconButton>
                        )}
                        <Searchbar />
                        <Box sx={{ flexGrow: 1 }} />
                        <Box>
                            {(currentUser.role === 'editor' ||
                                currentUser.role === 'admin') && (
                                <>
                                    <IconButton
                                        size='large'
                                        aria-label='show 17 new notifications'
                                        color='inherit'
                                        onClick={handleOpenNotificationMenu}
                                    >
                                        <Badge
                                            badgeContent={allRequests?.length}
                                            color='error'
                                        >
                                            <Notifications
                                                className={classes.navbarIcons}
                                            />
                                        </Badge>
                                    </IconButton>
                                    <NotificationsMenu
                                        isOpen={openNotificationMenu}
                                        onClose={handleCloseNotificationMenu}
                                    />
                                </>
                            )}
                            <IconButton
                                size='large'
                                edge='end'
                                aria-label='account of current user'
                                aria-haspopup='true'
                                color='inherit'
                                onClick={handleOpenMenu}
                            >
                                <ExpandMore className={classes.navbarIcons} />
                            </IconButton>
                            <Menu
                                anchorEl={openMenu}
                                open={Boolean(openMenu)}
                                onClose={handleCloseMenu}
                                onClick={handleCloseMenu}
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
                                        '& .MuiAvatar-root': {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                        '&:before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgcolor: 'background.paper',
                                            transform:
                                                'translateY(-50%) rotate(45deg)',
                                            zIndex: 0,
                                        },
                                    },
                                }}
                                transformOrigin={{
                                    horizontal: 'right',
                                    vertical: 'top',
                                }}
                                anchorOrigin={{
                                    horizontal: 'right',
                                    vertical: 'bottom',
                                }}
                            >
                                <Stack
                                    direction='row'
                                    spacing={2}
                                    justifyContent='center'
                                >
                                    <img
                                        src={
                                            currentUser?.gender === 'female'
                                                ? femaleLogo
                                                : maleLogo
                                        }
                                        alt='user avatar'
                                        className='userAvatarNavMenu'
                                    />
                                    <div>
                                        <p className='currentUserMenu'>
                                            {currentUser?.firstName}{' '}
                                            {currentUser?.lastName}
                                        </p>
                                        <p className='currentUserMenuEmail'>
                                            {currentUser?.email}
                                        </p>
                                    </div>
                                </Stack>

                                <Divider />
                                <NavLink
                                    to='/profil'
                                    style={{
                                        color: 'black',
                                        textDecoration: 'none',
                                    }}
                                >
                                    <MenuItem style={{ height: 50 }}>
                                        <ListItemIcon>
                                            <PersonOutlined
                                                sx={{ color: '#393e46' }}
                                            />
                                        </ListItemIcon>
                                        Profil
                                    </MenuItem>
                                </NavLink>
                                <MenuItem
                                    onClick={logoutHandler}
                                    style={{ height: 50 }}
                                >
                                    <ListItemIcon>
                                        <Logout sx={{ color: '#393e46' }} />
                                    </ListItemIcon>
                                    Odjava
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>
            {isDrawerOpen && (
                <MenuDrawer
                    visible={isDrawerOpen}
                    onClose={closeDrawerHandler}
                />
            )}
        </div>
    );
}

export default Navbar;
