import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MaterialTable from '@material-table/core';
import {
    Snackbar,
    Alert,
    useMediaQuery,
    Tooltip,
    Box,
    Chip,
    IconButton,
    Grid,
    Button,
} from '@mui/material';
import {
    DeleteOutlined,
    EditOutlined,
    VisibilityOutlined,
    CheckBox,
    CheckBoxOutlineBlank,
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';

import Service from '../../api/service';
import Loader from '../Loader';
import DocumentPublicAccessModal from '../DocumentPublicAccessModal';
import DocumentPublicAccessForbidModal from '../DocumentPublicAccessForbidModal';
import DocumentDeleteModal from '../DocumentDeleteModal';
import DocumentsTableFilters from '../DocumentsTableFilters';
import { capitalizeWord } from '../../utilities/capitalizeWord';

const useStyles = makeStyles((theme) => ({
    newDocBtn: {
        textTransform: 'none',
        fontWeight: 'bold',
        marginBottom: 15,
    },
}));
function DocumentsTable() {
    const [documents, setDocuments] = useState([]);
    const [allDocuments, setAllDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedRow, setSelectedRow] = useState(null);
    const [
        isVisibleDocAccessApprovedModal,
        setIsVisibleDocAccessApprovedModal,
    ] = useState(false);
    const [
        isVisibleDocAccessForbiddenModal,
        setIsVisibleDocAccessForbiddenModal,
    ] = useState(false);
    const [isDeleteDocModalVisible, setIsDeleteDocModalVisible] =
        useState(false);
    const [biggestDoc, setBiggestDoc] = useState(0);

    const isMobile = useMediaQuery('(max-width:540px)');
    const navigate = useNavigate();
    const classes = useStyles();
    let isMounted = useRef(true);

    useEffect(() => {
        const fetchAllDocumentsHandler = async () => {
            await Service.getAllDocuments()
                .then((res) => {
                    if (isMounted.current) {
                        setDocuments(res.data.allDocuments);
                        setAllDocuments(res.data.allDocuments);

                        let docSizes = [];
                        for (let doc of res.data.allDocuments) {
                            docSizes.push(Number(doc.documentSize));
                        }
                        setBiggestDoc(Math.max(...docSizes));
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

        fetchAllDocumentsHandler();
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

    const getFileSize = (fileSize) => {
        if (fileSize?.length > 6) {
            return `${Number(fileSize / 1000000).toFixed(2)} MB`;
        }
        if (fileSize?.length > 9) {
            return `${Number(fileSize / 1000000000).toFixed(2)} GB`;
        } else {
            return `${Number(fileSize / 1000).toFixed(2)} kB`;
        }
    };

    const handleOpenDocumentPublicAccessApproveModal = (data) => {
        setIsVisibleDocAccessApprovedModal(true);
        setSelectedRow(data);
    };
    const handleCloseDocumentAccessApproveModal = (data, isOk) => {
        if (isOk) {
            let tmpDocData = [...documents];
            tmpDocData.forEach((doc) => {
                if (doc._id === data._id) {
                    return (doc.publicAccess = true);
                }
            });
            setDocuments(tmpDocData);
        }
        setIsVisibleDocAccessApprovedModal(false);
        setSelectedRow(null);
    };

    const handleOpenDocumentPublicAccessForbidModal = (data) => {
        setIsVisibleDocAccessForbiddenModal(true);
        setSelectedRow(data);
    };

    const handleCloseDocumentPublicAccessForbidModal = (data, isOk) => {
        if (isOk) {
            let tmpDocData = [...documents];
            tmpDocData.forEach((doc) => {
                if (doc._id === data._id) {
                    return (doc.publicAccess = false);
                }
            });
            setDocuments(tmpDocData);
        }
        setIsVisibleDocAccessForbiddenModal(false);
        setSelectedRow(null);
    };

    const handleOpenDeleteDocModal = (data) => {
        setIsDeleteDocModalVisible(true);
        setSelectedRow(data);
    };

    const handleCloseDeleteDocModal = (data, isOk) => {
        if (isOk) {
            let tmpDocData = [...documents];
            tmpDocData.forEach((doc) => {
                if (doc._id === data._id) {
                    return (doc.active = false);
                }
            });
            setDocuments(tmpDocData);
        }
        setIsDeleteDocModalVisible(false);
        setSelectedRow(null);
    };

    const documentsTableData =
        documents &&
        documents.map((document) => {
            return {
                id: document._id,
                documentName: capitalizeWord(document.documentName),
                documentType: documentTypeHandler(document.fileType),
                size: getFileSize(document.documentSize),
                initialSize: document.documentSize,
                active: document.active ? (
                    <Chip
                        label='Aktivan'
                        style={{
                            color: '#007b55',
                            backgroundColor: '#C8FACD',
                            fontWeight: 'bold',
                        }}
                        size='small'
                    />
                ) : (
                    <Chip
                        label='Neaktivan'
                        style={{
                            color: '#B72136',
                            backgroundColor: '#FFE7D9',
                            fontWeight: 'bold',
                        }}
                        size='small'
                    />
                ),
                removed: !document.active,
                description: document.description && (
                    <Tooltip title={document.description} placement='top-start'>
                        <Box>{document.description}</Box>
                    </Tooltip>
                ),
                ownership: capitalizeWord(document.ownership),
                location: capitalizeWord(document.location),
                publicAccess:
                    document.publicAccess === true ? (
                        <IconButton
                            onClick={() =>
                                handleOpenDocumentPublicAccessForbidModal(
                                    document
                                )
                            }
                            disabled={!document.active}
                        >
                            <CheckBox
                                style={{
                                    color: document.active && '#00ab55',
                                    cursor: 'pointer',
                                }}
                            />
                        </IconButton>
                    ) : (
                        <IconButton
                            onClick={() =>
                                handleOpenDocumentPublicAccessApproveModal(
                                    document
                                )
                            }
                            disabled={!document.active}
                        >
                            <CheckBoxOutlineBlank
                                style={{ cursor: 'pointer' }}
                            />
                        </IconButton>
                    ),
            };
        });

    const documentsColumns = [
        {
            title: 'Naziv dokumenta',
            field: 'documentName',
            width: '15%',
            // customSort: (a, b) => a.documentName - b.documentName,
        },
        {
            title: 'Tip dokumenta',
            field: 'documentType',
            width: '10%',
        },
        {
            title: 'Veličina',
            field: 'size',
            type: 'numeric',
            align: 'left',
            searchable: false,
            customSort: (a, b) => a.initialSize - b.initialSize,
        },
        {
            title: 'Status',
            field: 'active',
            align: 'left',
            searchable: false,
            sorting: false,
        },
        {
            title: 'Opis',
            field: 'description',
            sorting: false,
            // width: '25%',
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
            title: 'Dozvoli javni pregled',
            field: 'publicAccess',
            width: '8%',
            align: 'center',
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
        rowStyle: (rowData) => ({
            backgroundColor: selectedRow?._id === rowData.id ? '#ccc' : '',
            color: rowData.removed && 'grey',
            font: '15px Roboto',
        }),
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
            emptyDataSourceMessage: 'Lista dokumenata je prazna',
            filterRow: {
                filterTooltip: 'Filter',
            },
        },
    };

    const filterDocsHandler = (data) => {
        const { docLastChangeValue, docValue, fileTypeValues, rangeValue } =
            data;
        let tmpDocArr = [...allDocuments];

        if (fileTypeValues.length > 0) {
            tmpDocArr = tmpDocArr.filter(
                (doc) => fileTypeValues.includes(doc.fileType) && doc
            );
        }

        if (rangeValue.length > 0) {
            tmpDocArr = tmpDocArr.filter(
                (doc) =>
                    Number(doc.documentSize) >= rangeValue[0] &&
                    Number(doc.documentSize) <= rangeValue[1]
            );
        }

        if (docValue) {
            tmpDocArr = tmpDocArr.filter((doc) =>
                docValue === 'public' ? doc.publicAccess : !doc.publicAccess
            );
        }

        if ((docLastChangeValue[0] && docLastChangeValue[1]) !== null) {
            const start = new Date(docLastChangeValue[0]);
            const end = new Date(docLastChangeValue[1]);
            tmpDocArr = tmpDocArr.filter(
                (doc) =>
                    start <= new Date(doc.lastEdit).getTime() &&
                    end >= new Date(doc.lastEdit).getTime()
            );
        }

        setDocuments(tmpDocArr);
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
                    <Grid>
                        <DocumentsTableFilters
                            biggestDoc={biggestDoc}
                            onApplyFilters={filterDocsHandler}
                            onResetFilters={() => setDocuments(allDocuments)}
                        />
                    </Grid>
                    <Grid container justifyContent='flex-end'>
                        <Button
                            variant='contained'
                            className={classes.newDocBtn}
                            onClick={() => navigate('/novidokument')}
                        >
                            Novi dokument
                        </Button>
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
                            {
                                icon: () => <EditOutlined />,
                                tooltip: 'Urediti',
                                onClick: (e, data) =>
                                    navigate(`/izmjena/${data.id}`),
                            },
                            (rowData) => ({
                                icon: () => <DeleteOutlined />,
                                tooltip: rowData.removed ? '' : 'Deaktivirati',
                                onClick: (e, data) =>
                                    handleOpenDeleteDocModal(data),
                                disabled: rowData.removed,
                            }),
                        ]}
                        title='Lista dokumenata'
                        options={tableOptions}
                        localization={tableLocalization}
                    />
                    {isVisibleDocAccessApprovedModal && (
                        <DocumentPublicAccessModal
                            visible={isVisibleDocAccessApprovedModal}
                            onClose={handleCloseDocumentAccessApproveModal}
                            selected={selectedRow}
                        />
                    )}
                    {isVisibleDocAccessForbiddenModal && (
                        <DocumentPublicAccessForbidModal
                            visible={isVisibleDocAccessForbiddenModal}
                            onClose={handleCloseDocumentPublicAccessForbidModal}
                            selected={selectedRow}
                        />
                    )}
                    {isDeleteDocModalVisible && (
                        <DocumentDeleteModal
                            visible={isDeleteDocModalVisible}
                            onClose={handleCloseDeleteDocModal}
                            selected={selectedRow}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default DocumentsTable;
