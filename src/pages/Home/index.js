import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, Breadcrumbs, Typography, Stack } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import UsersTable from '../../components/UsersTable';
import './style.css';
import DocumentsTable from '../../components/DocumentsTable';
import UsersApprovedDocumentsTable from '../../components/UsersApprovedDocumentsTable';

function Home() {
    const currentUser = useSelector((state) => state.auth.currentUser);

    return (
        <div role='presentation' className='homePage'>
            <Grid container justifyContent='flex-start'>
                <Breadcrumbs aria-label='breadcrumb'>
                    <Stack
                        direction='row'
                        spacing={2}
                        style={{ color: '#393e46' }}
                    >
                        <HomeIcon
                            sx={{ mr: -1.5, marginTop: 0.1 }}
                            fontSize='inherit'
                        />
                        <Typography>Početna</Typography>
                    </Stack>
                </Breadcrumbs>
            </Grid>

            {currentUser.role === 'admin' && <UsersTable />}
            {currentUser.role === 'editor' && <DocumentsTable />}
            {currentUser.role === 'reader' && <UsersApprovedDocumentsTable />}
        </div>
    );
}

export default Home;
