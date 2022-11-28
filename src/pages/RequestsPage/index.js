import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Grid,
    Breadcrumbs,
    Typography,
    Stack,
    Chip,
    Tooltip,
    useMediaQuery,
    Box,
} from '@mui/material';
import MaterialTable from '@material-table/core';
import { DoneAll, Home, Notifications } from '@mui/icons-material';
import { requestsActions } from '../../store/requests';
import './style.css';
import { formatDateTime } from '../../utilities/formatDate';
import { capitalizeWord } from '../../utilities/capitalizeWord';

function RequestsPage() {
    const allRequests = useSelector((state) => state.requests.allRequests);
    const isMobile = useMediaQuery('(max-width:540px)');
    const dispatch = useDispatch();

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

    const requestsTableData =
        allRequests &&
        allRequests.map((request) => {
            return {
                id: request._id,
                userId: request.user?._id,
                docId: request.document?._id,
                documentName: capitalizeWord(request.document?.documentName),
                documentType: documentTypeHandler(request.document?.fileType),
                reason: request.reason && (
                    <Tooltip title={request.reason} placement='top-start'>
                        <Box>{request.reason}</Box>
                    </Tooltip>
                ),
                description: request.reason,
                requestedBy: capitalizeWord(
                    `${request.user?.firstName} ${request.user?.lastName}`
                ),
                type: request.type,
                typeTable:
                    request.type === 'access' ? (
                        <Chip
                            label='Pregled dokumenta'
                            style={{
                                color: '#7A0C2E',
                                backgroundColor: '#FFE7D9',
                                fontWeight: 'bold',
                            }}
                            size='small'
                        />
                    ) : (
                        <Chip
                            label='Preuzimanje dokumenta'
                            style={{
                                color: '#04297A',
                                backgroundColor: '#D0F2FF',
                                fontWeight: 'bold',
                            }}
                            size='small'
                        />
                    ),
                isApproved: !request.isApproved && (
                    <Chip
                        label='Na čekanju'
                        style={{
                            color: '#B78103',
                            backgroundColor: '#FFF7CD',
                            fontWeight: 'bold',
                        }}
                        size='small'
                    />
                ),
                createdAt: request.createdAt,
                createdAtTable: formatDateTime(request.createdAt),
            };
        });

    const requestsColumns = [
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
            title: 'Korisnik',
            field: 'requestedBy',
            sorting: false,
            width: '10%',
        },
        {
            title: 'Datum',
            field: 'createdAtTable',
            sorting: false,
            width: '15%',
        },
        {
            title: 'Opis',
            field: 'reason',
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
            title: 'Tip zahtjeva',
            field: 'typeTable',
            sorting: false,
            width: '5%',
            align: 'left',
            searchable: false,
        },
        {
            title: 'Odobren',
            field: 'isApproved',
            sorting: false,
        },
    ];

    const tableOptions = {
        actionsColumnIndex: -1,
        columnsButton: true,
        grouping: false,
        sorting: true,
        paging: true,
        pageSizeOptions: [5, 10, 20, 25, 50, 100],
        pageSize: 10,
        emptyRowsWhenPaging: false,
        rowStyle: {
            font: '15px Roboto',
        },
        headerStyle: {
            background: '#ddd',
            color: '#000',
            fontWeight: 'bold',
            paddingRight: 10,
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
            emptyDataSourceMessage: 'Lista zahtjeva je prazna',
            filterRow: {
                filterTooltip: 'Filter',
            },
        },
    };

    const handleOpenApproveRequestModal = (data) => {
        dispatch(requestsActions.setRequestModalVisible());
        dispatch(requestsActions.setSelectedRequest(data));
    };

    return (
        <div className='requestsPage'>
            <Grid container justifyContent='flex-start' sx={{ mb: 1 }}>
                <Breadcrumbs aria-label='breadcrumb'>
                    <NavLink
                        to='/'
                        style={{ textDecoration: 'none', color: 'grey' }}
                    >
                        <Home sx={{ mr: 0.5 }} fontSize='inherit' />
                        Početna
                    </NavLink>
                    <Stack
                        direction='row'
                        spacing={2}
                        style={{ color: '#393e46' }}
                    >
                        <Notifications
                            sx={{ mr: -1.2, marginTop: 0.3 }}
                            fontSize='inherit'
                        />
                        <Typography>Zahtjevi</Typography>
                    </Stack>
                </Breadcrumbs>
            </Grid>
            <MaterialTable
                columns={requestsColumns}
                data={requestsTableData}
                actions={[
                    {
                        icon: () => <DoneAll color='success' />,
                        tooltip: 'Pogledati',
                        onClick: (e, data) =>
                            handleOpenApproveRequestModal(data),
                    },
                ]}
                title='Lista zahjeva'
                options={tableOptions}
                localization={tableLocalization}
            />
        </div>
    );
}

export default RequestsPage;
