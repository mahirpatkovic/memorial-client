import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Home, History, Timeline, DocumentScanner } from '@mui/icons-material';
import logo from '../../assets/blackLogo.png';
import femaleLogo from '../../assets/femaleLogo.png';
import maleLogo from '../../assets/maleLogo.png';
import './style.css';
import { Stack } from '@mui/material';

function Sidebar() {
    const currentUser = useSelector((state) => state.auth.currentUser);

    return (
        <div className='sidebar'>
            <img src={logo} alt='logo' className='logo' />
            <h5 className='heading'>Digitalna biblioteka</h5>
            <Stack
                direction='row'
                spacing={2}
                justifyContent='center'
                className='userNameIcon'
            >
                <img
                    src={
                        currentUser?.gender === 'female' ? femaleLogo : maleLogo
                    }
                    alt='user avatar'
                    className='userAvatar'
                />
                <h4 className='currentUser'>{`${currentUser?.firstName} ${currentUser?.lastName}`}</h4>
            </Stack>
            <NavLink
                to='/'
                className={({ isActive }) =>
                    isActive ? 'sidebarRow active' : 'sidebarRow'
                }
            >
                <Home className='material-icons' />
                <h5>Početna</h5>
            </NavLink>

            {(currentUser.role === 'reader' ||
                currentUser.role === 'editor') && (
                <NavLink
                    to='/historijapregleda'
                    className={({ isActive }) =>
                        isActive ? 'sidebarRow active' : 'sidebarRow'
                    }
                >
                    <History className='material-icons' />
                    <h5>Historija pregleda</h5>
                </NavLink>
            )}
            {(currentUser.role === 'admin' ||
                currentUser.role === 'editor') && (
                <NavLink
                    to='/statistika'
                    className={({ isActive }) =>
                        isActive ? 'sidebarRow active' : 'sidebarRow'
                    }
                >
                    <Timeline className='material-icons' />
                    <h5>Statistika pretraživanja</h5>
                </NavLink>
            )}
            {currentUser.role === 'admin' && (
                <NavLink
                    to='/dokumenti'
                    className={({ isActive }) =>
                        isActive ? 'sidebarRow active' : 'sidebarRow'
                    }
                >
                    <DocumentScanner className='material-icons' />
                    <h5>Dokumenti</h5>
                </NavLink>
            )}
        </div>
    );
}

export default Sidebar;
