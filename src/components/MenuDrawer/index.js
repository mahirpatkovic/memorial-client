import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Drawer, Divider, Grid } from '@mui/material';
import { History, Timeline, Home, DocumentScanner } from '@mui/icons-material';
import logo from '../../assets/blackLogo.png';
import './style.css';

function MenuDrawer(props) {
    const currentUser = useSelector((state) => state.auth.currentUser);

    const closeDrawerOnSelectLink = () => {
        props.onClose();
    };

    const list = () => (
        <div role='presentation'>
            <NavLink
                to='/'
                className={({ isActive }) =>
                    isActive ? 'menuRow active' : 'menuRow'
                }
                onClick={closeDrawerOnSelectLink}
            >
                <div className='menuRow'>
                    <Home className='material-icons' />
                    <h4>Početna</h4>
                </div>
            </NavLink>
            {(currentUser.role === 'reader' ||
                currentUser.role === 'editor') && (
                <NavLink
                    to='/historijapregleda'
                    className={({ isActive }) =>
                        isActive ? 'menuRow active' : 'menuRow'
                    }
                    onClick={closeDrawerOnSelectLink}
                >
                    <div className='menuRow'>
                        <History className='material-icons' />
                        <h4>Historija pregleda</h4>
                    </div>
                </NavLink>
            )}
            {(currentUser.role === 'admin' ||
                currentUser.role === 'editor') && (
                <NavLink
                    to='/statistika'
                    className={({ isActive }) =>
                        isActive ? 'menuRow active' : 'menuRow'
                    }
                    onClick={closeDrawerOnSelectLink}
                >
                    <div className='menuRow'>
                        <Timeline className='material-icons' />
                        <h4>Statistika</h4>
                    </div>
                </NavLink>
            )}
            {currentUser.role === 'admin' && (
                <NavLink
                    to='/dokumenti'
                    className={({ isActive }) =>
                        isActive ? 'menuRow active' : 'menuRow'
                    }
                    onClick={closeDrawerOnSelectLink}
                >
                    <div className='menuRow'>
                        <DocumentScanner className='material-icons' />
                        <h4>Dokumenti</h4>
                    </div>
                </NavLink>
            )}

            <Divider light={true} variant='middle' sx={{ marginTop: 1 }} />
        </div>
    );
    return (
        <div>
            <Drawer
                anchor='left'
                open={props.visible}
                onClose={props.onClose}
                sx={{ width: 500 }}
                className='drawerContent'
            >
                <div className='profile__avatar'>
                    <img alt='logo' src={logo} />
                    <h5 className='headingDrawer'>Digitalna biblioteka</h5>
                    <div className='currentUserDrawer'>
                        <h4 className='userName'>{`${currentUser?.firstName} ${currentUser?.lastName}`}</h4>
                        <h4 className='userEmail'>{currentUser.email}</h4>
                    </div>
                </div>
                <Divider
                    light={true}
                    variant='middle'
                    sx={{ marginBottom: 1 }}
                />
                {list()}
                <div className='footerContent'>
                    <Grid container justifyContent='center'>
                        <h4
                            style={{ width: 170, color: 'grey' }}
                            className='signature'
                        >
                            Digitalna Biblioteka ©2022 Developed by General IT
                            and Software Solutions d.o.o. Sarajevo
                        </h4>
                    </Grid>
                </div>
            </Drawer>
        </div>
    );
}

export default MenuDrawer;
