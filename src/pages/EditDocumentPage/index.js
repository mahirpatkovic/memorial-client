import React, { useState, useEffect } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import {
    Grid,
    Breadcrumbs,
    Typography,
    Stack,
    Snackbar,
    Alert,
    FormGroup,
    FormControlLabel,
    Switch,
    Button,
} from '@mui/material';
import { Edit, Home } from '@mui/icons-material';
import UploadDocumentBox from '../../components/UploadDocumentBox';
import Service from '../../api/service';
import Loader from '../../components/Loader';
import './style.css';
import DocumentInfoEdit from '../../components/DocumentInfoEdit';

function EditDocumentPage() {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [document, setDocument] = useState(null);
    const [updatedFiles, setUpdatedFiles] = useState([]);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('error');
    const [isEditEnabled, setIsEditEnabled] = useState(false);
    const [isPreviewBtnVisible, setIsPreviewBtnVisible] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchSelectedDocument = async () => {
            await Service.getDocument({ id })
                .then((res) => {
                    setDocument(res.data.document);
                    setUpdatedFiles(res.data.document.files);
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
    }, [id, navigate]);

    const handleSwitchChange = (event) => {
        setIsEditEnabled(event.target.checked);
    };

    const handleEditFiles = (tmpFiles) => {
        setUpdatedFiles(tmpFiles);
    };

    return (
        <div>
            {isLoading ? (
                <Loader loaderColor={`black`} />
            ) : (
                <div className='editDocumentPage'>
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
                    <Grid container justifyContent='flex-start' sx={{ mb: 1 }}>
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
                                <Edit
                                    sx={{ mr: -1.2, marginTop: 0.3 }}
                                    fontSize='inherit'
                                />
                                <Typography>Izmjena dokumenta</Typography>
                            </Stack>
                        </Breadcrumbs>
                    </Grid>
                    <div className='editSwitch'>
                        <Grid container justifyContent='flex-end'>
                            {isPreviewBtnVisible && (
                                <Button
                                    variant='outlined'
                                    style={{
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                    }}
                                    onClick={() => navigate(`/pregled/${id}`)}
                                >
                                    Pregled
                                </Button>
                            )}

                            <FormGroup sx={{ mr: 1 }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            onChange={handleSwitchChange}
                                            checked={isEditEnabled}
                                        />
                                    }
                                    label='Izmjena dokumenta'
                                    labelPlacement='start'
                                />
                            </FormGroup>
                        </Grid>
                    </div>

                    <Grid container justifyContent='center'>
                        <UploadDocumentBox
                            document={document}
                            isEditEnabled={isEditEnabled}
                            onEdit={handleEditFiles}
                        />
                    </Grid>
                    <Grid
                        justifyContent='center'
                        container
                        spacing={2}
                        columns={16}
                        sx={{ padding: 1 }}
                    >
                        <DocumentInfoEdit
                            document={document}
                            isEditEnabled={isEditEnabled}
                            files={updatedFiles}
                            onShowPreview={() => setIsPreviewBtnVisible(true)}
                            onSwitchDisable={() => setIsEditEnabled(false)}
                        />
                    </Grid>
                    {/* <div className='actionButtons'>
                       
                    </div> */}
                </div>
            )}
        </div>
    );
}

export default EditDocumentPage;
