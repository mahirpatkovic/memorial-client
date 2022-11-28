import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    Grid,
    Breadcrumbs,
    Typography,
    Stack,
    Tooltip,
    Box,
    Snackbar,
    Alert,
    useMediaQuery,
} from '@mui/material';
import { Home, History, VisibilityOutlined } from '@mui/icons-material';
import Service from '../../api/service';
import Loader from '../../components/Loader';
import MaterialTable from '@material-table/core';
import { capitalizeWord } from '../../utilities/capitalizeWord';
import moment from 'moment';
import 'moment/locale/bs';
import './style.css';

function ViewHistory() {
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width:540px)');
    const isMounted = useRef(true);

    useEffect(() => {
        const fetchUserHistoryReview = async () => {
            await Service.getUserHistoryReview()
                .then((res) => {
                    if (isMounted.current) {
                        const userDocs = res.data.userDocs;
                        let userReviewDocs = res.data.userReviewDocs;
                        let newReviewArr = [];
                        for (let usr of userDocs) {
                            userReviewDocs.forEach((doc) => {
                                if (doc._id === usr.docId) {
                                    newReviewArr.push({
                                        ...doc,
                                        timeVisited: usr.time,
                                    });
                                }
                            });
                        }
                        setDocuments(newReviewArr);
                        setIsLoading(false);
                    }
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

        fetchUserHistoryReview();
        return () => {
            isMounted.current = false;
        };
    }, []);

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
                documentLastVisit: document.timeVisited && (
                    <Stack direction='row' spacing={1}>
                        <History fontSize='small' />
                        <Typography fontSize={15}>
                            {moment(document.timeVisited)
                                .locale('bs')
                                .fromNow()}
                        </Typography>
                    </Stack>
                ),
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
        {
            title: 'Posljednji pregled',
            field: 'documentLastVisit',
            sorting: false,
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
        paging: false,
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
            emptyDataSourceMessage:
                'Lista posljednjih posjećenih dokumenata je prazna',
            filterRow: {
                filterTooltip: 'Filter',
            },
        },
    };

    return (
        <div className='historyPage'>
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
                                <History
                                    sx={{ mr: -1.2, marginTop: 0.3 }}
                                    fontSize='inherit'
                                />
                                <Typography>Historija pregleda</Typography>
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
                        title='Lista posljednjih posjećenih dokumenata'
                        options={tableOptions}
                        localization={tableLocalization}
                        style={{ marginTop: 10 }}
                    />
                </div>
            )}
        </div>
    );
}

export default ViewHistory;
