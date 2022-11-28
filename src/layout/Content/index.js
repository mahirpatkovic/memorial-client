import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Grid } from '@mui/material';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import './style.css';

function ContentHome() {
    const isUserLoggedIn = useSelector((state) => state.auth.isAuthenticated);
    return (
        <div>
            <div className='mainHomeBody'>
                <Sidebar />
                <div className='dashboardBody'>
                    {isUserLoggedIn && <Navbar />}
                    <div className='contentBody'>
                        <Outlet />
                    </div>
                    <div className='contentFooter'>
                        <Grid container justifyContent='center'>
                            <p>
                                Digitalna Biblioteka ©2022 Developed by General
                                IT and Software Solutions d.o.o. Sarajevo
                            </p>
                        </Grid>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContentHome;
