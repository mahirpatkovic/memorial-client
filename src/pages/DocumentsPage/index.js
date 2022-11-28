import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Grid, Breadcrumbs, Typography, Stack } from '@mui/material';
import { Home, DocumentScanner } from '@mui/icons-material';
import DocumentsTable from '../../components/DocumentsTable';
import './style.css';

function DocumentsPage() {
    const currentUser = useSelector((state) => state.auth.currentUser);
    return (
        <div className='documentsPage'>
            <Grid container justifyContent='flex-start'>
                <Breadcrumbs aria-label='breadcrumb'>
                    <NavLink
                        to='/'
                        style={{
                            textDecoration: 'none',
                            color: 'grey',
                        }}
                    >
                        <Home sx={{ mr: 0.5 }} fontSize='inherit' />
                        Početna
                    </NavLink>
                    <Stack
                        direction='row'
                        spacing={2}
                        style={{ color: '#393e46' }}
                    >
                        <DocumentScanner
                            sx={{ mr: -1.2, marginTop: 0.3 }}
                            fontSize='inherit'
                        />
                        <Typography>Dokumenti</Typography>
                    </Stack>
                </Breadcrumbs>
            </Grid>
            {currentUser.role === 'admin' && (
                <DocumentsTable style={{ marginTop: 50 }} />
            )}
        </div>
    );
}

export default DocumentsPage;
