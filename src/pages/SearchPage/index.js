import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import MaterialTable from '@material-table/core';
import {
    Snackbar,
    Alert,
    useMediaQuery,
    Tooltip,
    Box,
    Grid,
    Breadcrumbs,
    Stack,
    Typography,
} from '@mui/material';
import { Search, VisibilityOutlined, Home } from '@mui/icons-material';
import Loader from '../../components/Loader';
import './style.css';
import { useSelector } from 'react-redux';
import Service from '../../api/service';
import { capitalizeWord } from '../../utilities/capitalizeWord';

function SearchPage() {
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const isMobile = useMediaQuery('(max-width:540px)');
    const navigate = useNavigate();

    const searchQuery = useSelector((state) => state.docs.searchQuery);

    useEffect(() => {
        setIsLoading(true);
        const fetchSearchedDocs = async () => {
            await Service.searchDocument({ query: searchQuery })
                .then((res) => {
                    setDocuments(res.data.documents);
                    setIsLoading(false);
                })
                .catch((err) => {
                    setIsAlertVisible(true);
                    setErrorMessage(
                        err.response
                            ? err.response.data.message
                            : 'Konekcija sa serverom nije uspostavljena'
                    );
                });
        };

        fetchSearchedDocs();
    }, [searchQuery]);

    const documentTypeHandler = (type) => {
        switch (type) {
            case 'document':
                return 'Dokument';
            case 'audio':
                return 'Audio';
            case 'video':
                return 'Video';
            case 'image':
                return 'Slika';
            default:
                break;
        }
    };

    const documentsTableData =
        documents &&
        documents.map((document) => {
            return {
                id: document._id,
                documentName: capitalizeWord(document.documentName),
                documentType: documentTypeHandler(document.fileType),
                description: document.description && (
                    <Tooltip title={document.description} placement='top-start'>
                        <Box>{document.description}</Box>
                    </Tooltip>
                ),
                ownership: capitalizeWord(document.ownership),
                location: capitalizeWord(document.location),
            };
        });

    const documentsColumns = [
        {
            title: 'Naziv dokumenta',
            field: 'documentName',
            sorting: false,
            width: '20%',
        },
        {
            title: 'Tip dokumenta',
            field: 'documentType',
            sorting: false,
            width: '10%',
        },
        {
            title: 'Opis',
            field: 'description',
            sorting: false,
            width: '35%',
            align: 'left',
            searchable: false,
            cellStyle: {
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                maxWidth: 200,
            },
        },
        { title: 'Vlasništvo', field: 'ownership', sorting: false },
        {
            title: 'Lokacija',
            field: 'location',
            sorting: false,
        },
    ];

    const tableOptions = {
        actionsColumnIndex: -1,
        columnsButton: true,
        grouping: false,
        sorting: true,
        paging: true,
        pageSizeOptions: [5, 10, 20],
        pageSize: 10,
        emptyRowsWhenPaging: false,
        rowStyle: {
            font: '15px Roboto',
        },
        headerStyle: {
            background: '#ddd',
            color: '#000',
            fontWeight: 'bold',
            paddingRight: 15,
        },
    };

    const tableLocalization = {
        pagination: {
            labelDisplayedRows: '',
            previousTooltip: 'Prethodna',
            nextTooltip: 'Sljedeća',
            lastTooltip: 'Posljednja',
            firstTooltip: 'Prva',
            labelRowsPerPage: !isMobile && 'Redova po stranici',
            labelRowsSelect: '',
        },
        toolbar: {
            nRowsSelected: '{0} row(s) selected',
            searchPlaceholder: 'Pretraga...',
            showColumnsTitle: 'Prikaži kolone',
            addRemoveColumns: 'Dadaj ili ukloni kolonu',
        },
        header: {
            actions: 'Opcije',
        },
        body: {
            emptyDataSourceMessage: 'Lista pretraživanja je prazna',
            filterRow: {
                filterTooltip: 'Filter',
            },
        },
    };

    return (
        <div className='searchPage'>
            {isLoading ? (
                <Loader loaderColor={`black`} />
            ) : (
                <div>
                    {isAlertVisible && (
                        <Snackbar
                            open={isAlertVisible}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            autoHideDuration={8000}
                            onClose={() => setIsAlertVisible(false)}
                        >
                            <Alert
                                onClose={() => setIsAlertVisible(false)}
                                severity='error'
                                sx={{ width: '100%' }}
                            >
                                {errorMessage}
                            </Alert>
                        </Snackbar>
                    )}
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
                                <Search
                                    sx={{ mr: -1.2, marginTop: 0.3 }}
                                    fontSize='inherit'
                                />
                                <Typography>Pretraga</Typography>
                            </Stack>
                        </Breadcrumbs>
                    </Grid>
                    <MaterialTable
                        columns={documentsColumns}
                        data={documentsTableData}
                        actions={[
                            {
                                icon: () => <VisibilityOutlined />,
                                tooltip: 'Pogledati',
                                onClick: (e, data) =>
                                    navigate(`/pregled/${data.id}`),
                            },
                        ]}
                        title='Lista dokumenata'
                        options={tableOptions}
                        localization={tableLocalization}
                        style={{ marginTop: 10 }}
                    />
                </div>
            )}
        </div>
    );
}

export default SearchPage;
