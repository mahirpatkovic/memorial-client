import React, { useEffect, useState } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Grid,
    Breadcrumbs,
    Stack,
    Typography,
    Paper,
    Snackbar,
    Alert,
    Button,
} from '@mui/material';
import { Home, DocumentScanner } from '@mui/icons-material';
import Loader from '../../components/Loader';
import Service from '../../api/service';
import { makeStyles } from '@mui/styles';
import privateDocImage from '../../assets/privateDoc.png';
import './style.css';
import ViewDocumentDetails from '../../components/ViewDocumentDetails';
import DocumentAccessRequestModal from '../../components/DocumentAccessRequestModal';
import ShowDocumentFile from '../../components/ShowDocumentFile';
import DownloadUsersTable from '../../components/DownloadUsersTable/DownloadUsersTable';

const useStyles = makeStyles(() => ({
    reqAccessBtn: {
        marginTop: 30,
        marginBottom: 30,
    },
}));

function ViewDocumentPage() {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [document, setDocument] = useState(null);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('error');
    const [isDocPrivate, setIsDocPrivate] = useState(true);
    const [isDocAccessRequestModalVisible, setIsDocAccessRequestModalVisible] =
        useState(false);
    const [isRequestSent, setIsRequestSent] = useState(false);
    const [isDownloadAvailable, setIsDownloadAvailable] = useState(false);
    const [isDownloadRequestSent, setIsDownloadRequestSent] = useState(false);
    const currentUser = useSelector((state) => state.auth.currentUser);

    const classes = useStyles();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSelectedDocument = async () => {
            await Service.getDocument({ id })
                .then((res) => {
                    setDocument(res.data.document);
                    if (
                        currentUser.role === 'reader' &&
                        !res.data.document.active
                    ) {
                        navigate('/');
                    }

                    if (res.data.document.publicAccess === true) {
                        setIsDocPrivate(false);
                    }
                    if (
                        currentUser.role === 'editor' ||
                        currentUser.role === 'admin' ||
                        currentUser.approvedDocuments.includes(id)
                    ) {
                        setIsDocPrivate(false);
                    }

                    if (currentUser.pendingDocuments.includes(id)) {
                        setIsRequestSent(true);
                    }

                    if (
                        currentUser.role === 'editor' ||
                        currentUser.role === 'admin' ||
                        currentUser.approvedDownload.includes(id)
                    ) {
                        setIsDownloadAvailable(true);
                    }

                    if (currentUser.pendingDownload.includes(id)) {
                        setIsDownloadRequestSent(true);
                    }

                    setIsLoading(false);
                })
                .catch((err) => {
                    setAlertMessage(
                        err.response
                            ? err.response.data.message
                            : 'Konekcija sa serverom nije uspostavljena'
                    );
                    setIsAlertVisible(true);
                    setAlertType('error');
                    navigate('/dokumenti');
                    setIsLoading(false);
                });
        };
        fetchSelectedDocument();
    }, [id, navigate, currentUser]);

    const handleOpenDocAccessRequestModal = () => {
        setIsDocAccessRequestModalVisible(true);
    };

    const handleCloseDocAccessRequestModal = (isRequestSent, sentMessage) => {
        if (isRequestSent === true) {
            setIsRequestSent(true);
            setAlertMessage(sentMessage);
            setIsAlertVisible(true);
            setAlertType('success');
        }
        setIsDocAccessRequestModalVisible(false);
    };

    const handleChangeDownloadRequestStatus = () => {
        setIsDownloadRequestSent(true);
    };

    return (
        <div>
            {isLoading ? (
                <Loader loaderColor={`black`} />
            ) : (
                <div
                    className='viewDocumentPage'
                    onContextMenu={(e) => e.preventDefault()}
                >
                    {isAlertVisible && (
                        <Snackbar
                            open={isAlertVisible}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            autoHideDuration={6000}
                            onClose={() => setIsAlertVisible(false)}
                        >
                            <Alert
                                onClose={() => setIsAlertVisible(false)}
                                severity={alertType}
                                sx={{ width: '100%', font: '14px Roboto' }}
                            >
                                {alertMessage}
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
                                <DocumentScanner
                                    sx={{ mr: -1.2, marginTop: 0.3 }}
                                    fontSize='inherit'
                                />
                                <Typography>Pregled</Typography>
                            </Stack>
                        </Breadcrumbs>
                    </Grid>
                    <Grid container justifyContent='center'>
                        <Paper
                            style={{
                                padding: 10,
                                marginTop: 20,
                                backgroundColor: isDocPrivate
                                    ? '#393e46'
                                    : '#fff',
                            }}
                        >
                            <Stack direction='row' spacing={2}>
                                <Typography
                                    variant='h6'
                                    style={{
                                        color: isDocPrivate
                                            ? '#fff'
                                            : '#393e46',
                                    }}
                                >
                                    Naziv dokumenta:{' '}
                                </Typography>
                                <Typography
                                    variant='h6'
                                    style={{
                                        color: isDocPrivate
                                            ? '#fff'
                                            : '#393e46',
                                    }}
                                >
                                    {document?.documentName}
                                </Typography>
                            </Stack>
                        </Paper>
                    </Grid>
                    <Grid container justifyContent='center'>
                        {isDocPrivate ? (
                            <div className='documentFile'>
                                <img
                                    src={privateDocImage}
                                    className='privateDocImage'
                                    alt='locked Document'
                                />
                            </div>
                        ) : (
                            <ShowDocumentFile document={document} />
                        )}
                    </Grid>
                    {isDocPrivate && (
                        <Grid
                            container
                            justifyContent='center'
                            className={classes.reqAccessBtn}
                        >
                            {isRequestSent ? (
                                <Button
                                    variant='contained'
                                    style={{
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                    }}
                                    disabled
                                >
                                    Zahtjev za pregled dokumenta je poslan
                                </Button>
                            ) : (
                                <Button
                                    variant='contained'
                                    style={{
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                    }}
                                    onClick={handleOpenDocAccessRequestModal}
                                >
                                    Zatražite pregled dokumenta
                                </Button>
                            )}
                        </Grid>
                    )}

                    <ViewDocumentDetails
                        document={document}
                        isDownloadAvailable={isDownloadAvailable}
                        isDownloadRequestSent={isDownloadRequestSent}
                        isDocPrivate={isDocPrivate}
                        onChangeDownloadStatus={
                            handleChangeDownloadRequestStatus
                        }
                    />
                    {(currentUser?.role === 'editor' ||
                        currentUser?.role === 'admin') && (
                        <DownloadUsersTable users={document.downloadedBy} />
                    )}

                    {isDocAccessRequestModalVisible && (
                        <DocumentAccessRequestModal
                            document={document}
                            visible={isDocAccessRequestModalVisible}
                            onClose={handleCloseDocAccessRequestModal}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default ViewDocumentPage;
