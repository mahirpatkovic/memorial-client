import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MaterialTable from '@material-table/core';
import {
    Snackbar,
    Alert,
    useMediaQuery,
    Tooltip,
    Box,
    Chip,
} from '@mui/material';
import { VisibilityOutlined } from '@mui/icons-material';
import { capitalizeWord } from '../../utilities/capitalizeWord';
import Service from '../../api/service';
import Loader from '../Loader';

function UsersApprovedDocumentsTable() {
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const currentUser = useSelector((state) => state.auth.currentUser);

    const isMobile = useMediaQuery('(max-width:540px)');
    const navigate = useNavigate();
    let isMounted = useRef(true);

    useEffect(() => {
        const fetchAllApprovedDocumentsHandler = async () => {
            await Service.getApprovedDocuments()
                .then((res) => {
                    if (isMounted.current) {
                        setDocuments(res.data.userFilteredDocs);
                        setIsLoading(false);
                    }
                })
                .catch((err) => {
                    setIsAlertVisible(true);
                    setErrorMessage(
                        err.response?.status === 500
                            ? 'Konekcija sa serverom nije uspostavljena'
                            : err.response.data.message
                    );
                    setIsLoading(false);
                });
        };

        fetchAllApprovedDocumentsHandler();
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

    const documentStatusShow = (docId) => {
        if (currentUser.approvedDocuments.includes(docId)) {
            return (
                <Chip
                    label='Odobren'
                    style={{
                        color: '#04297A',
                        backgroundColor: '#D0F2FF',
                        fontWeight: 'bold',
                    }}
                    size='small'
                />
            );
        } else if (currentUser.pendingDocuments.includes(docId)) {
            return (
                <Chip
                    label='Na čekanju'
                    style={{
                        color: '#B78103',
                        backgroundColor: '#FFF7CD',
                        fontWeight: 'bold',
                    }}
                    size='small'
                />
            );
        } else {
            return (
                <Chip
                    label='Javno dostupan'
                    style={{
                        color: '#007b55',
                        backgroundColor: '#C8FACD',
                        fontWeight: 'bold',
                    }}
                    size='small'
                />
            );
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
                status: documentStatusShow(document._id),
            };
        });

    const documentsColumns = [
        {
            title: 'Naziv dokumenta',
            field: 'documentName',
            width: '15%',
        },
        {
            title: 'Tip dokumenta',
            field: 'documentType',
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
        { title: 'Vlasništvo', field: 'ownership' },
        {
            title: 'Lokacija',
            field: 'location',
        },
        {
            title: 'Status',
            field: 'status',
            align: 'left',
            searchable: false,
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
            emptyDataSourceMessage: 'Vaša lista dokumenata je prazna',
            filterRow: {
                filterTooltip: 'Filter',
            },
        },
    };

    return (
        <div>
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
                        title='Vaša lista dokumenata'
                        options={tableOptions}
                        localization={tableLocalization}
                        style={{ marginTop: 10 }}
                    />
                </div>
            )}
        </div>
    );
}

export default UsersApprovedDocumentsTable;
