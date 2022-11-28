import React, { useState } from 'react';
import {
    Button,
    Grid,
    Select,
    Stack,
    Typography,
    MenuItem,
    FormControl,
    InputLabel,
    Snackbar,
    Alert,
    Backdrop,
    // useMediaQuery,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { formatDateTime } from '../../utilities/formatDate';
import { useSelector } from 'react-redux';
import Service from '../../api/service';
import Loader from '../Loader';
import DocumentDonwloadRequestModal from '../DocumentDownloadRequestModal';

const useStyles = makeStyles(() => ({
    documentInfo: {
        maxWidth: 800,
        width: '100%',
        display: 'block',
        margin: 'auto',
    },
    docMoreInfo: {
        maxWidth: 600,
        width: '100%',
    },
    docLabel: {
        color: '#393E46',
        fontWeight: 'bold',
    },
    documentInfoGrid: {
        padding: 1,
        marginLeft: 20,
        '@media (max-width: 768px)': {
            marginLeft: 0,
        },
    },
    reqAccessBtn: {
        marginTop: 50,
    },
}));

export default function ViewDocumentDetails(props) {
    const [downloadImageIndex, setDownloadImageIndex] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success');
    const [isDownlaodRequestModalVisible, setIsDownloadRequestModalVisible] =
        useState(false);

    const documentProp = props?.document;
    const isDownloadAvailable = props?.isDownloadAvailable;
    const isDownloadRequestSent = props?.isDownloadRequestSent;
    const isDocPrivate = props?.isDocPrivate;

    const currentUser = useSelector((state) => state.auth.currentUser);
    const classes = useStyles();

    // const isLaptop = useMediaQuery('(min-width:1281px)');

    const getFileType = (fileType) => {
        switch (fileType) {
            case 'image':
                return 'Slika';
            case 'video':
                return 'Video';
            case 'document':
                return 'Dokument';
            case 'audio':
                return 'Audio';
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

    const handleDownloadChange = (event) => {
        setDownloadImageIndex(event.target.value);
    };

    const downloadFilesHandler = async () => {
        setIsLoading(true);
        await Service.downloadDocument(
            { docId: documentProp?._id },
            {
                responseType: 'blob',
            }
        )
            .then((res) => {
                const downloadDoc = res.data.document;
                setIsAlertVisible(true);
                setAlertType(res.data.status);
                setAlertMessage(res.data.message);
                const link = document.createElement('a');
                if (downloadDoc?.files.length > 1) {
                    link.href = downloadDoc?.files[downloadImageIndex];
                } else {
                    link.href = downloadDoc?.files[0];
                }
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                // if (downloadDoc?.files.length > 1) {
                //     // window.open(downloadDoc?.files[downloadImageIndex]);
                // } else {
                //     const link = document.createElement('a');
                //     link.href = downloadDoc?.files[0];
                //     document.body.appendChild(link);
                //     link.click();
                //     document.body.removeChild(link);

                //     // window.open(downloadDoc?.files[0]);
                // }
            })
            .catch((err) => {
                setAlertMessage(
                    err.response
                        ? err.response.data.message
                        : 'Konekcija sa serverom nije uspostavljena'
                );
                setIsAlertVisible(true);
                setAlertType(err.response ? err.response.data.status : 'error');
            });
        // console.clear();
        setIsLoading(false);
    };

    const handleOpenDownloadRequestModal = () => {
        setIsDownloadRequestModalVisible(true);
    };

    const handleCloseDownloadRequestModal = (isRequestSent, data) => {
        if (isRequestSent) {
            props.onChangeDownloadStatus(isRequestSent, data);
            setAlertMessage('Zahtjev za preuzimanje dokumenta je poslan');
            setIsAlertVisible(true);
            setAlertType('success');
        }
        setIsDownloadRequestModalVisible(false);
    };

    return (
        <div className={classes.documentInfo}>
            {isLoading && (
                <Backdrop
                    sx={{
                        color: '#fff',
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        backgroundColor: '#fff',
                    }}
                    open={isLoading}
                >
                    <Loader />
                </Backdrop>
            )}
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
            <Grid container justifyContent='center'>
                <Grid
                    container
                    spacing={2}
                    columns={16}
                    className={classes.documentInfoGrid}
                >
                    {isDownloadAvailable && !isDocPrivate && (
                        <div>
                            <Grid item xs={16}>
                                {documentProp?.files.length > 1 ? (
                                    <Stack direction='row' spacing={2}>
                                        <FormControl
                                            size='small'
                                            sx={{ minWidth: 130 }}
                                        >
                                            <InputLabel>
                                                Izaberi sliku
                                            </InputLabel>
                                            <Select
                                                label='Izaberi sliku'
                                                onChange={handleDownloadChange}
                                                defaultValue=''
                                            >
                                                {documentProp?.files.map(
                                                    (item, index) => {
                                                        return (
                                                            <MenuItem
                                                                name={item}
                                                                value={index}
                                                                key={index}
                                                            >
                                                                Slika {++index}
                                                            </MenuItem>
                                                        );
                                                    }
                                                )}
                                            </Select>
                                        </FormControl>
                                        <Button
                                            variant='contained'
                                            style={{
                                                textTransform: 'none',
                                                fontWeight: 'bold',
                                                height: 40,
                                            }}
                                            onClick={downloadFilesHandler}
                                            disabled={downloadImageIndex === -1}
                                        >
                                            Preuzmi
                                        </Button>
                                    </Stack>
                                ) : (
                                    <Button
                                        variant='contained'
                                        style={{
                                            textTransform: 'none',
                                            fontWeight: 'bold',
                                        }}
                                        onClick={downloadFilesHandler}
                                    >
                                        Preuzmi
                                    </Button>
                                )}
                            </Grid>
                        </div>
                    )}

                    {!isDownloadAvailable && !isDocPrivate && (
                        <Grid container justifyContent='center'>
                            {isDownloadRequestSent ? (
                                <Button
                                    variant='contained'
                                    style={{
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                    }}
                                    disabled
                                >
                                    Zahtjev za preuzimanje dokumenta je poslan
                                </Button>
                            ) : (
                                <Button
                                    variant='contained'
                                    style={{
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                    }}
                                    onClick={handleOpenDownloadRequestModal}
                                >
                                    Zatražite preuzimanje dokumenta
                                </Button>
                            )}
                        </Grid>
                    )}

                    <Grid item xs={16}>
                        <Stack direction='row' spacing={2}>
                            <Typography
                                variant='subtitle1'
                                className={classes.docLabel}
                            >
                                Opis dokumenta:{' '}
                            </Typography>
                            <Typography
                                variant='subtitle1'
                                sx={{ maxHeight: 200, overflow: 'auto' }}
                            >
                                {documentProp?.description}
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={16} sm={8}>
                        <Stack direction='row' spacing={2}>
                            <Typography
                                variant='subtitle1'
                                className={classes.docLabel}
                            >
                                Tip dokumenta:{' '}
                            </Typography>
                            <Typography variant='subtitle1'>
                                {getFileType(documentProp?.fileType)}
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={16} sm={8}>
                        <Stack direction='row' spacing={2}>
                            <Typography
                                variant='subtitle1'
                                className={classes.docLabel}
                            >
                                Veličina:{' '}
                            </Typography>

                            <Typography variant='subtitle1'>
                                {getFileSize(documentProp?.documentSize)}
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={16} sm={8}>
                        <Stack direction='row' spacing={2}>
                            <Typography
                                variant='subtitle1'
                                className={classes.docLabel}
                            >
                                Lokacija:{' '}
                            </Typography>
                            <Typography variant='subtitle1'>
                                {documentProp?.location}
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={16} sm={8}>
                        <Stack direction='row' spacing={2}>
                            <Typography
                                variant='subtitle1'
                                className={classes.docLabel}
                            >
                                Vrsta vrijednosti:{' '}
                            </Typography>
                            <Typography variant='subtitle1'>
                                {documentProp?.publicAccess
                                    ? 'Javno dostupan'
                                    : 'Nije javno dostupan'}
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={16} sm={8}>
                        <Stack direction='row' spacing={2}>
                            <Typography
                                variant='subtitle1'
                                className={classes.docLabel}
                            >
                                Ključne riječi:{' '}
                            </Typography>
                            <Typography variant='subtitle1'>
                                {documentProp?.keyWords}
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={16} sm={8}>
                        <Stack direction='row' spacing={2}>
                            <Typography
                                variant='subtitle1'
                                className={classes.docLabel}
                            >
                                Vlasništvo:{' '}
                            </Typography>
                            <Typography variant='subtitle1'>
                                {documentProp?.ownership}
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={16} sm={8}>
                        <Stack direction='row' spacing={2}>
                            <Typography
                                variant='subtitle1'
                                className={classes.docLabel}
                            >
                                Zadnja izmjena:{' '}
                            </Typography>
                            <Typography variant='subtitle1'>
                                {formatDateTime(documentProp?.lastEdit)}
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={16} sm={8}>
                        <Stack direction='row' spacing={2}>
                            <Typography
                                variant='subtitle1'
                                className={classes.docLabel}
                            >
                                Status:{' '}
                            </Typography>
                            <Typography variant='subtitle1'>
                                {documentProp?.active === true
                                    ? 'Aktivan'
                                    : 'Neaktivan'}
                            </Typography>
                        </Stack>
                    </Grid>
                    {(currentUser.role === 'admin' ||
                        currentUser.role === 'editor') && (
                        <Grid item xs={16} sm={8}>
                            <Stack direction='row' spacing={2}>
                                <Typography
                                    variant='subtitle1'
                                    className={classes.docLabel}
                                >
                                    Uploadovao/la:{' '}
                                </Typography>
                                <Typography variant='subtitle1'>
                                    {documentProp?.uploadedBy}
                                </Typography>
                            </Stack>
                        </Grid>
                    )}
                    {(currentUser.role === 'admin' ||
                        currentUser.role === 'editor') &&
                        documentProp?.editedBy && (
                            <Grid item xs={16} sm={8}>
                                <Stack direction='row' spacing={2}>
                                    <Typography
                                        variant='subtitle1'
                                        className={classes.docLabel}
                                    >
                                        Izmjenio/la:{' '}
                                    </Typography>
                                    <Typography variant='subtitle1'>
                                        {documentProp?.editedBy}
                                    </Typography>
                                </Stack>
                            </Grid>
                        )}
                </Grid>
            </Grid>

            {isDownlaodRequestModalVisible && (
                <DocumentDonwloadRequestModal
                    document={documentProp}
                    visible={isDownlaodRequestModalVisible}
                    onClose={handleCloseDownloadRequestModal}
                />
            )}
        </div>
    );
}
