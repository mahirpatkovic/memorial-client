import React, { useState } from 'react';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
    Backdrop,
    Alert,
    AlertTitle,
} from '@mui/material';
import { HighlightOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Service from '../../api/service';
import Loader from '../Loader';

function ForgotPasswordModal(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required('Email je obavezan')
            .email('Email nije validan'),
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const handleResetPassword = async (value) => {
        setIsLoading(true);
        await Service.forgotPassword({ email: value.email })
            .then((res) => {
                setIsLoading(false);
                props.onClose();
                props.onOpenAlert(res.data.status, res.data.message);
            })
            .catch((err) => {
                // console.error(err);
                setIsAlertVisible(true);
                setErrorMessage(
                    err.response
                        ? err.response.data.message
                        : 'Konekcija sa serverom nije uspostavljena'
                );
                setIsLoading(false);
            });
    };
    return (
        <div>
            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: 1500,
                }}
                open={isLoading}
            >
                <Loader />
            </Backdrop>
            <Dialog open={props.visible} onClose={props.onClose}>
                <DialogTitle>Zaboravljena šifra</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Molimo vas da unese vaš mail, kako bismo vam poslali
                        reset link da oporavite vaš račun.
                    </DialogContentText>
                    {isAlertVisible && (
                        <Alert
                            severity='error'
                            action={
                                <HighlightOff
                                    onClick={() => setIsAlertVisible(false)}
                                    style={{ cursor: 'pointer' }}
                                />
                            }
                            style={{ marginBottom: 15 }}
                        >
                            <AlertTitle>Greška</AlertTitle>
                            {errorMessage}
                        </Alert>
                    )}
                    <TextField
                        autoFocus
                        margin='dense'
                        id='name'
                        label='Email'
                        type='email'
                        fullWidth
                        required
                        variant='standard'
                        {...register('email')}
                        error={errors.email ? true : false}
                    />

                    <Typography
                        variant='inherit'
                        color='red'
                        sx={{
                            textAlign: 'left',
                            font: '12px Roboto',
                        }}
                    >
                        {errors.email?.message}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant='outlined'
                        color='primary'
                        onClick={props.onClose}
                        sx={{
                            textTransform: 'none',
                            fontFamily: 'Roboto',
                            fontWeight: 'bold',
                        }}
                    >
                        Poništi
                    </Button>

                    <Button
                        variant='contained'
                        sx={{
                            textTransform: 'none',
                            fontFamily: 'Roboto',
                            color: '#fff',
                            fontWeight: 'bold',
                        }}
                        onClick={handleSubmit(handleResetPassword)}
                    >
                        Prijavi
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ForgotPasswordModal;
