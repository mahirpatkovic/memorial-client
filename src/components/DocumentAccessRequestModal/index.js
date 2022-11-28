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
import { useSelector, useDispatch } from 'react-redux';
import { HighlightOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { authActions } from '../../store/auth';
import * as Yup from 'yup';
import Service from '../../api/service';
import Loader from '../Loader';

function DocumentAccessRequestModal(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isAlertVisible, setIsAlertVisible] = useState(false);

    const currentUser = useSelector((state) => state.auth.currentUser);
    const dispatch = useDispatch();

    const validationSchema = Yup.object().shape({
        reason: Yup.string().required('Razlog je obavezan'),
    });
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            reason: '',
        },
        resolver: yupResolver(validationSchema),
    });

    const handleRequestAccess = async (value) => {
        setIsLoading(true);
        const values = {
            reason: value.reason,
            user: currentUser._id,
            document: props?.document._id,
            type: 'access',
        };

        await Service.createRequest(values)
            .then((res) => {
                setIsLoading(false);
                props.onClose(true, res.data.message);
                reset();
                dispatch(authActions.setCurrentUser(res.data.currentUser));

                // props.onOpenAlert(res.data.status, res.data.message);
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
            <Dialog
                open={props.visible}
                onClose={() => {
                    props.onClose();
                    reset();
                }}
            >
                <DialogTitle>Zatražite pregled dokumenta</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Molimo vas da unese razlog zbog kojeg želite imati
                        pristup ovom dokumentu.
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
                        id='reason'
                        label='Razlog'
                        type='text'
                        fullWidth
                        required
                        multiline
                        rows={2}
                        variant='standard'
                        {...register('reason')}
                        error={errors.reason ? true : false}
                    />

                    <Typography
                        variant='inherit'
                        color='red'
                        sx={{
                            textAlign: 'left',
                            font: '12px Roboto',
                        }}
                    >
                        {errors.reason?.message}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant='outlined'
                        color='primary'
                        onClick={() => {
                            props.onClose();
                            reset();
                        }}
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
                        onClick={handleSubmit(handleRequestAccess)}
                    >
                        Pošalji
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default DocumentAccessRequestModal;
