import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Service from '../../api/service';
import { Grid, Button, Stack, Alert, Backdrop } from '@mui/material';
import { HighlightOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import './style.css';

function ValidateProfile() {
    const { validationToken } = useParams();
    const [responseMessage, setResponseMessage] = useState('');
    const [isAccessApproved, setIsAccessApproved] = useState(false);
    const [isResendEmailButtonVisible, setIsResendEmailButtonVisible] =
        useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertResponseMessage, setAlertResponseMessage] = useState('');
    const [alertType, setAlertType] = useState('success');

    const navigate = useNavigate();
    let isMounted = useRef(true);
    useEffect(() => {
        const validateProfileHanlder = async () => {
            await Service.validateProfile({ validationToken })
                .then((res) => {
                    setIsAccessApproved(true);
                    setResponseMessage(res.data.message);
                })
                .catch((err) => {
                    if (
                        isMounted.current &&
                        err.response?.data.status === 403
                    ) {
                        navigate('/');
                    }
                    setIsAccessApproved(true);
                    setResponseMessage(err.response?.data.message);
                    setIsResendEmailButtonVisible(true);
                });
        };

        validateProfileHanlder();

        return () => {
            isMounted.current = false;
        };
    }, [validationToken, navigate]);

    const switchToLoginHandler = () => {
        navigate('/login');
    };

    const resendValidationEmailHandler = async () => {
        setIsLoading(true);
        await Service.resendValidationEmail({ validationToken })
            .then((res) => {
                setIsAlertVisible(true);
                setAlertType('success');
                setAlertResponseMessage(res.data.message);
            })
            .catch((err) => {
                setIsAlertVisible(true);
                setAlertType('error');
                setAlertResponseMessage(err.response?.data.message);
            });
        setIsLoading(false);
    };

    return (
        <div className='validatePage'>
            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={isLoading}
            >
                <Loader />
            </Backdrop>
            {isAccessApproved && (
                <Grid container justifyContent='center' alignItems='center'>
                    <div className='validationMessage'>
                        <h2>{responseMessage}</h2>
                        <Stack
                            spacing={2}
                            direction='row'
                            justifyContent='center'
                            style={{ marginBottom: 20 }}
                        >
                            {isResendEmailButtonVisible && (
                                <Button
                                    variant='contained'
                                    style={{
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        backgroundColor: '#fff',
                                        color: '#393e46',
                                        height: '10%',
                                    }}
                                    onClick={resendValidationEmailHandler}
                                >
                                    Zatražite novi validacioni token
                                </Button>
                            )}
                            {!isResendEmailButtonVisible && (
                                <Button
                                    variant='contained'
                                    style={{
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        backgroundColor: '#fff',
                                        color: '#393e46',
                                        height: '10%',
                                    }}
                                    onClick={switchToLoginHandler}
                                >
                                    Prijavite se
                                </Button>
                            )}
                        </Stack>
                    </div>
                </Grid>
            )}
            {isAlertVisible && (
                <div className='alertMessage'>
                    <Alert
                        severity={alertType}
                        action={
                            <HighlightOff
                                onClick={() => setIsAlertVisible(false)}
                                style={{ cursor: 'pointer' }}
                            />
                        }
                        sx={{ font: '14px Roboto' }}
                    >
                        {alertResponseMessage}
                    </Alert>
                </div>
            )}
        </div>
    );
}

export default ValidateProfile;
