import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Grid,
    InputLabel,
    OutlinedInput,
    Typography,
    FormControlLabel,
    Checkbox,
    Button,
    Alert,
    AlertTitle,
    Snackbar,
    Backdrop,
} from '@mui/material';
import Service from '../../api/service';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Delete, Edit, HighlightOff } from '@mui/icons-material';
import Loader from '../Loader';
import './style.css';
import DocumentRemoveModal from '../DocumentRemoveModal';

function DocumentInfoEdit(props) {
    const { id } = useParams();
    const [isFileAlertVisible, setIsFileAlertVisible] = useState(false);
    const [isEditAlertVisible, setIsEditAlertVisible] = useState(false);
    const [editMessage, setEditMessage] = useState('');
    const [editAlertType, setEditAlertType] = useState('success');
    const [isLoading, setIsLoading] = useState(false);
    const [isRemoveDocModalVisible, setIsRemoveDocModalVisible] =
        useState(false);

    const document = props?.document;
    const isEditEnabled = props?.isEditEnabled;
    const files = props?.files;
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        documentName: Yup.string().required('Naziv dokumenta je obavezan'),
        description: Yup.string().required('Opis dokumenta je obavezan'),
        ownership: Yup.string().required('Vlasništvo dokumenta je obavezno'),
        publicAccess: Yup.bool(),
        location: Yup.string().required('Lokacija je obavezna'),
        active: Yup.bool(),
        keyWords: Yup.string().required('Ključne riječi su obavezne'),
    });

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            documentName: document?.documentName,
            description: document?.description,
            ownership: document?.ownership,
            publicAccess: document?.publicAccess,
            location: document?.location,
            active: document?.active,
            keyWords: document?.keyWords,
        },
        resolver: yupResolver(validationSchema),
    });

    const handleEditDocument = async (values) => {
        setIsLoading(true);
        if (files.length > 0) {
            setIsFileAlertVisible(false);
            let formData = new FormData();

            for (let file of files) {
                formData.append('files', file);
            }

            Object.keys(values).forEach((key) =>
                formData.append(key, values[key])
            );

            formData.append('docId', id);

            await Service.editDocument(formData)
                .then((res) => {
                    setIsEditAlertVisible(true);
                    setEditMessage(res.data.message);
                    setEditAlertType('success');
                    props.onShowPreview();
                    props.onSwitchDisable();
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth',
                    });
                })
                .catch((err) => {
                    setIsEditAlertVisible(true);
                    setEditMessage(
                        err.response
                            ? err.response.data.message
                            : 'Konekcija sa serverom nije uspostavljena'
                    );
                    setEditAlertType('error');
                });
        } else {
            setIsFileAlertVisible(true);
        }
        setIsLoading(false);
    };

    const handleOpenRemoveDocModal = () => {
        setIsRemoveDocModalVisible(true);
    };

    const handleCloseRemoveDocModal = (data, isOk) => {
        if (isOk) {
            setIsEditAlertVisible(true);
            setEditAlertType(data.status ? data.status : 'error');
            setEditMessage(data.message ? data.message : data);
            setTimeout(() => {
                navigate('/dokumenti');
            }, 1000);
        }
        setIsRemoveDocModalVisible(false);
    };

    return (
        <div className='editDocumentInfo'>
            {isEditAlertVisible && (
                <Snackbar
                    open={isEditAlertVisible}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    autoHideDuration={6000}
                    onClose={() => setIsEditAlertVisible(false)}
                >
                    <Alert
                        onClose={() => setIsEditAlertVisible(false)}
                        severity={editAlertType}
                        sx={{ width: '100%' }}
                    >
                        {editMessage}
                    </Alert>
                </Snackbar>
            )}
            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={isLoading}
            >
                <Loader />
            </Backdrop>
            {isFileAlertVisible && (
                <Grid container justifyContent='center'>
                    <Alert
                        severity='error'
                        action={
                            <HighlightOff
                                onClick={() => setIsFileAlertVisible(false)}
                                style={{ cursor: 'pointer' }}
                            />
                        }
                        style={{ marginBottom: 15 }}
                    >
                        <AlertTitle>
                            Fajl prilog je obavezan, molimo uploadujte fajl
                        </AlertTitle>
                    </Alert>
                </Grid>
            )}
            <Grid container spacing={2} columns={16} sx={{ padding: 1 }}>
                <Grid item xs={16}>
                    <InputLabel>Naziv dokumenta</InputLabel>
                    <OutlinedInput
                        id='documentName'
                        fullWidth
                        disabled={isEditEnabled ? false : true}
                        {...register('documentName')}
                        error={errors.documentName ? true : false}
                    />
                    <Typography
                        variant='inherit'
                        color='red'
                        sx={{
                            font: '12px Roboto',
                        }}
                    >
                        {errors.documentName?.message}
                    </Typography>
                </Grid>
                <Grid item xs={16} sm={8}>
                    <InputLabel>Opis</InputLabel>
                    <OutlinedInput
                        id='description'
                        type='text'
                        fullWidth
                        required
                        disabled={isEditEnabled ? false : true}
                        variant='outlined'
                        multiline
                        rows={4}
                        {...register('description', { required: true })}
                        error={errors.description ? true : false}
                    />
                    <Typography
                        variant='inherit'
                        color='red'
                        sx={{
                            font: '12px Roboto',
                        }}
                    >
                        {errors.description?.message}
                    </Typography>
                </Grid>
                <Grid item xs={16} sm={8}>
                    <InputLabel>Vlasništvo</InputLabel>
                    <OutlinedInput
                        id='ownership'
                        type='text'
                        fullWidth
                        required
                        disabled={isEditEnabled ? false : true}
                        variant='outlined'
                        {...register('ownership', { required: true })}
                        error={errors.ownership ? true : false}
                    />
                    <Typography
                        variant='inherit'
                        color='red'
                        sx={{
                            font: '12px Roboto',
                        }}
                    >
                        {errors.ownership?.message}
                    </Typography>
                    <FormControlLabel
                        label='Javno dostupan'
                        disabled={isEditEnabled ? false : true}
                        control={
                            <Controller
                                name='publicAccess'
                                control={control}
                                defaultValue={false}
                                render={({ field: { value, ...field } }) => (
                                    <Checkbox
                                        {...field}
                                        disabled={isEditEnabled ? false : true}
                                        checked={!!value}
                                        sx={{
                                            '& .MuiSvgIcon-root': {
                                                fontSize: 28,
                                            },
                                        }}
                                        onChange={(e, value) =>
                                            field.onChange(value)
                                        }
                                    />
                                )}
                            />
                        }
                        labelPlacement='start'
                        sx={{ marginTop: 1.5, marginLeft: 0 }}
                    />
                </Grid>
                <Grid item xs={16} sm={8}>
                    <InputLabel>Lokacija</InputLabel>
                    <OutlinedInput
                        id='location'
                        type='text'
                        fullWidth
                        required
                        disabled={isEditEnabled ? false : true}
                        variant='outlined'
                        {...register('location', { required: true })}
                        error={errors.location ? true : false}
                    />
                    <Typography
                        variant='inherit'
                        color='red'
                        sx={{
                            font: '12px Roboto',
                        }}
                    >
                        {errors.location?.message}
                    </Typography>
                </Grid>
                <Grid item xs={16} sm={8}>
                    <FormControlLabel
                        id='active'
                        disabled={isEditEnabled ? false : true}
                        label='Status'
                        control={
                            <Controller
                                name='active'
                                control={control}
                                defaultValue={false}
                                render={({ field: { value, ...field } }) => (
                                    <Checkbox
                                        {...field}
                                        disabled={isEditEnabled ? false : true}
                                        checked={!!value}
                                        sx={{
                                            '& .MuiSvgIcon-root': {
                                                fontSize: 28,
                                            },
                                        }}
                                        onChange={(e, value) =>
                                            field.onChange(value)
                                        }
                                    />
                                )}
                            />
                        }
                        labelPlacement='start'
                        sx={{ marginTop: 3.5, marginLeft: 0 }}
                    />
                </Grid>
                <Grid item xs={16} sm={8}>
                    <InputLabel>Ključne riječi</InputLabel>
                    <OutlinedInput
                        id='keyWords'
                        type='text'
                        fullWidth
                        required
                        disabled={isEditEnabled ? false : true}
                        variant='outlined'
                        {...register('keyWords', { required: true })}
                        error={errors.keyWords ? true : false}
                    />
                    <Typography
                        variant='inherit'
                        color='red'
                        sx={{
                            font: '12px Roboto',
                        }}
                    >
                        {errors.keyWords?.message}
                    </Typography>
                </Grid>
            </Grid>
            <Grid container justifyContent='center' spacing={2} columns={12}>
                <Grid item xs={6} md={4}>
                    <Button
                        variant='contained'
                        startIcon={<Delete />}
                        style={{
                            textTransform: 'none',
                            fontWeight: 'bold',
                            marginTop: 15,
                            width: '100%',
                        }}
                        color='error'
                        disabled={isEditEnabled ? false : true}
                        onClick={handleOpenRemoveDocModal}
                    >
                        Izbriši
                    </Button>
                </Grid>
                <Grid item xs={6} md={4}>
                    <Button
                        variant='contained'
                        startIcon={<Edit />}
                        style={{
                            textTransform: 'none',
                            fontWeight: 'bold',
                            marginTop: 15,
                            width: '100%',
                        }}
                        disabled={isEditEnabled ? false : true}
                        onClick={handleSubmit(handleEditDocument)}
                    >
                        Izmjeni
                    </Button>
                </Grid>
            </Grid>
            {isRemoveDocModalVisible && (
                <DocumentRemoveModal
                    visible={isRemoveDocModalVisible}
                    onClose={handleCloseRemoveDocModal}
                    selected={id}
                />
            )}
        </div>
    );
}

export default DocumentInfoEdit;
