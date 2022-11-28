import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import {
    Grid,
    Breadcrumbs,
    Typography,
    Stack,
    Select,
    InputLabel,
    MenuItem,
    FormControl,
    Alert,
    AlertTitle,
    TextField,
    List,
    ListItem,
    ListItemText,
    Button,
    IconButton,
    Snackbar,
    Backdrop,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import {
    Home,
    DocumentScanner,
    HighlightOff,
    AddCircleOutlineOutlined,
    DeleteOutline,
    CloudUploadOutlined,
} from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Service from '../../api/service';
import Loader from '../../components/Loader';
import './style.css';

function NewDocument() {
    const [fileType, setFileType] = useState('');
    const [selectedFileType, setSelectedFileType] = useState('');
    const [files, setFiles] = useState([]);
    const [isFileAlertVisible, setIsFileAlertVisible] = useState(false);
    const [isUploadAlertVisible, setIsUploadAlertVisible] = useState(false);
    const [uploadMessage, setUploadMessage] = useState('');
    const [uploadAlertType, setUploadAlertType] = useState('success');
    const [isLoading, setIsLoading] = useState(false);

    const currentUser = useSelector((state) => state.auth.currentUser);
    const maxDocFileSize = 25000000;
    const maxOtherFilesSize = 1000000000;

    const validationSchema = Yup.object().shape({
        documentName: Yup.string().required('Ime dokumenta je obavezno'),
        description: Yup.string().required('Opis dokumenta je obavezan'),
        ownership: Yup.string().required('Vlasništvo dokumenta je obavezno'),
        publicAccess: Yup.bool(),
        location: Yup.string().required('Lokacija je obavezna'),
        active: Yup.bool(),
        keyWords: Yup.string().required('Ključne riječi su obavezne'),
    });

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            documentName: '',
            description: '',
            ownership: '',
            publicAccess: false,
            location: '',
            active: false,
            keyWords: '',
        },
        resolver: yupResolver(validationSchema),
    });

    const changeFileTypeHandler = (e) => {
        setFileType(e.target.value);
        switch (e.target.value) {
            case 'image':
                setSelectedFileType('.jpeg, .png, .jpg, .gif');
                break;
            case 'video':
                setSelectedFileType('.mp4, .MPEG-4, .mkv, .avi, .flv, .mov');
                break;
            case 'audio':
                setSelectedFileType('.mp3, .aac, .wav, .wma');
                break;
            case 'document':
                setSelectedFileType('.pdf, .doc, .docx, .txt');
                break;
            default:
                break;
        }
        setFiles([]);
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: selectedFileType,
        onDrop: (acceptedFiles) => {
            acceptedFiles.map((file, i) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                    fileId: i,
                })
            );
            setFiles(acceptedFiles);
        },
        maxFiles: fileType === 'image' ? 5 : 1,
        maxSize: fileType === 'document' ? maxDocFileSize : maxOtherFilesSize,
        disabled: !selectedFileType ? true : false,
    });

    const removeImageFromFiles = (fileId) => {
        const tmpFiles = [...files.filter((file) => file.fileId !== fileId)];
        setFiles(tmpFiles);
    };

    const handleSaveDocument = async (docValues) => {
        setIsLoading(true);
        if (files.length > 0) {
            let formData = new FormData();
            let fileSize = 0;

            for (let file of files) {
                formData.append('files', file);
                fileSize = fileSize + file.size;
            }
            Object.keys(docValues).forEach((key) =>
                formData.append(key, docValues[key])
            );

            formData.append('fileType', fileType);
            formData.append('fileSize', fileSize);
            formData.append('userId', currentUser._id);
            formData.append(
                'uploadedBy',
                `${currentUser.firstName} ${currentUser.lastName}`
            );

            await Service.createDocument(formData)
                .then((res) => {
                    setIsUploadAlertVisible(true);
                    setUploadMessage(res.data.message);
                    setUploadAlertType('success');
                })
                .catch((err) => {
                    setIsUploadAlertVisible(true);
                    setUploadMessage(
                        err.response
                            ? err.response.data.message
                            : 'Konekcija sa serverom nije uspostavljena'
                    );
                    setUploadAlertType('error');
                });
            reset();
            setFiles([]);
            setFileType('');
            setSelectedFileType('');
        } else {
            setIsFileAlertVisible(true);
        }
        setIsLoading(false);
    };

    return (
        <div className='newDocumentPage'>
            {isUploadAlertVisible && (
                <Snackbar
                    open={isUploadAlertVisible}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    autoHideDuration={6000}
                    onClose={() => setIsUploadAlertVisible(false)}
                >
                    <Alert
                        onClose={() => setIsUploadAlertVisible(false)}
                        severity={uploadAlertType}
                        sx={{ width: '100%' }}
                    >
                        {uploadMessage}
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
            <Grid container justifyContent='flex-start'>
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
                        <DocumentScanner
                            sx={{ mr: -1.2, marginTop: 0.3 }}
                            fontSize='inherit'
                        />
                        <Typography>Novi dokument</Typography>
                    </Stack>
                </Breadcrumbs>
            </Grid>
            <Grid container justifyContent='center'>
                <FormControl
                    variant='outlined'
                    sx={{ m: 1, maxWidth: 400, width: '100%' }}
                >
                    <InputLabel id='demo-simple-select-filled-label'>
                        Novi dokument
                    </InputLabel>
                    <Select
                        labelId='demo-simple-select-filled-label'
                        id='demo-simple-select-filled'
                        label='Novi dokument'
                        value={fileType}
                        onChange={changeFileTypeHandler}
                    >
                        <MenuItem value='document'>Dokument</MenuItem>
                        <MenuItem value='video'>Video</MenuItem>
                        <MenuItem value='image'>Slika</MenuItem>
                        <MenuItem value='audio'>Audio</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid container justifyContent='center'>
                <div className='uploadBox'>
                    <div
                        className={
                            !selectedFileType ? 'dragArea disabled' : 'dragArea'
                        }
                        {...getRootProps()}
                    >
                        <AddCircleOutlineOutlined className='icon' />
                        <h3>Dodaj dokument</h3>
                        <p>Povuci/izbaci</p>
                        <p>Podržani fajlovi {selectedFileType}</p>
                        <p>
                            maksimalno {fileType === 'image' ? 5 : 1}{' '}
                            fajl/fajlova po uploadu
                        </p>
                        {fileType === 'document' && (
                            <p>Maksimalna veličina fajla 25MB</p>
                        )}
                        <input
                            type='file'
                            hidden
                            {...getInputProps()}
                            // onChange={(e) =>
                            // 	setFiles(e.target.files)
                            // }
                        />
                    </div>
                    <div>
                        {files.map((file, index) => {
                            return (
                                <List key={index}>
                                    <ListItem
                                        secondaryAction={
                                            <IconButton
                                                edge='end'
                                                aria-label='delete'
                                                onClick={() =>
                                                    removeImageFromFiles(
                                                        file.fileId
                                                    )
                                                }
                                            >
                                                <DeleteOutline />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemText primary={file.path} />
                                    </ListItem>
                                </List>
                            );
                        })}
                    </div>
                </div>
            </Grid>
            {isFileAlertVisible && (
                <Grid container justifyContent='center' sx={{ marginTop: 2 }}>
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
            <Grid container justifyContent='center'>
                <div className='uploadDocumentInfo'>
                    <Grid
                        container
                        spacing={2}
                        columns={16}
                        sx={{ padding: 1 }}
                    >
                        <Grid item xs={16}>
                            <TextField
                                id='documentName'
                                label='Naziv dokumenta'
                                type='text'
                                fullWidth
                                required
                                disabled={fileType ? false : true}
                                variant='outlined'
                                {...register('documentName', {
                                    required: true,
                                })}
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
                            <TextField
                                id='description'
                                label='Opis'
                                type='text'
                                fullWidth
                                required
                                disabled={fileType ? false : true}
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
                            <TextField
                                id='ownership'
                                label='Vlasništvo'
                                type='text'
                                fullWidth
                                required
                                disabled={fileType ? false : true}
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
                                disabled={fileType ? false : true}
                                control={
                                    <Controller
                                        name='publicAccess'
                                        control={control}
                                        defaultValue={false}
                                        render={({
                                            field: { value, ...field },
                                        }) => (
                                            <Checkbox
                                                {...field}
                                                disabled={
                                                    fileType ? false : true
                                                }
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
                            <TextField
                                id='location'
                                label='Lokacija'
                                type='text'
                                fullWidth
                                required
                                disabled={fileType ? false : true}
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
                                disabled={fileType ? false : true}
                                label='Status'
                                control={
                                    <Controller
                                        name='active'
                                        control={control}
                                        defaultValue={false}
                                        render={({
                                            field: { value, ...field },
                                        }) => (
                                            <Checkbox
                                                {...field}
                                                disabled={
                                                    fileType ? false : true
                                                }
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
                                sx={{ marginTop: 0.8, marginLeft: 0 }}
                            />
                        </Grid>
                        <Grid item xs={16} sm={8}>
                            <TextField
                                id='keyWords'
                                label='Ključne riječi'
                                type='text'
                                fullWidth
                                required
                                disabled={fileType ? false : true}
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
                    <Grid container justifyContent='center' columns={12}>
                        <Grid item xs={8} sm={6} md={4}>
                            <Button
                                variant='contained'
                                startIcon={<CloudUploadOutlined />}
                                style={{
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    marginTop: 15,
                                    width: '100%',
                                }}
                                disabled={fileType ? false : true}
                                onClick={handleSubmit(handleSaveDocument)}
                            >
                                Spasi
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </Grid>
        </div>
    );
}

export default NewDocument;
