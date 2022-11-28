import React, { useState } from 'react';
import {
    Grid,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    Typography,
    Backdrop,
    Alert,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Snackbar,
    AlertTitle,
} from '@mui/material';
import {
    Lock,
    Visibility,
    VisibilityOff,
    ExpandMore,
    HighlightOff,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Loader from '../../components/Loader';
import './style.css';
import Service from '../../api/service';

function PasswordChangeAccordion() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessAlertVisible, setIsSuccessAlertVisible] = useState(false);
    const [isErrorAlertVisible, setIsErrorAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [alertMessage, setAlertMessage] = useState('');
    const [isExpandedAccordion, setIsExpandedAccordion] = useState(false);

    const currentUser = useSelector((state) => state.auth.currentUser);

    const validationSchema = Yup.object().shape({
        currentPassword: Yup.string().required('Morate unijeti staru šifru'),
        password: Yup.string()
            .required('Šifra je obavezna')
            .max(24, 'Šifra može da sadrži maximalno 24 karaktera')
            .matches(
                /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
                'Šifra mora da sadrži minimalno 8 karaktera, jedno veliko, jedno malo slovo, jedan broj i jedan simbol'
            ),
        passwordConfirm: Yup.string()
            .required('Morate potvrditi novu šifru')
            .oneOf([Yup.ref('password'), null], 'Šifre moraju biti iste'),
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            currentPassword: '',
            password: '',
            passwordConfirm: '',
        },
    });

    const handleUpdatePassword = async (passwordValues) => {
        setIsLoading(true);
        await Service.updateUserPassword({
            currentPassword: passwordValues.currentPassword,
            newPassword: passwordValues.password,
            id: currentUser?._id,
        })
            .then((res) => {
                setIsSuccessAlertVisible(true);
                setAlertMessage(res.data.message);
                setAlertType(res.data.status);
                reset();
                setIsErrorAlertVisible(false);
                setIsExpandedAccordion(false);
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
            })
            .catch((err) => {
                setAlertMessage(
                    err.response
                        ? err.response.data.message
                        : 'Konekcija sa serverom nije uspostavljena, pokušajte da osjvežite aplikaciju ili nas kontaktirajte putem info maila.'
                );
                setIsErrorAlertVisible(true);
                setAlertType(err.response ? err.response.data.status : 'error');
            });
        setIsLoading(false);
    };

    const handleChangeAccordion = (panel) => (event, isExpanded) => {
        setIsExpandedAccordion(isExpanded ? panel : false);
    };

    return (
        <div>
            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={isLoading}
            >
                <Loader />
            </Backdrop>
            {isSuccessAlertVisible && (
                <Snackbar
                    open={isSuccessAlertVisible}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    autoHideDuration={6000}
                    onClose={() => setIsSuccessAlertVisible(false)}
                >
                    <Alert
                        onClose={() => setIsSuccessAlertVisible(false)}
                        severity={alertType}
                        sx={{ width: '100%', font: '14px Roboto' }}
                    >
                        {alertMessage}
                    </Alert>
                </Snackbar>
            )}
            <Accordion
                expanded={isExpandedAccordion === 'panel1'}
                onChange={handleChangeAccordion('panel1')}
                sx={{ m: 1, borderRadius: 1 }}
            >
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography>Promjena šifre</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: 0 }}>
                    <div className='accordionOptions'>
                        <Grid
                            container
                            justifyContent='center'
                            spacing={2}
                            columns={12}
                            sx={{ mb: 2, padding: 1 }}
                        >
                            <Grid item xs={12} sm={10} md={8}>
                                {isErrorAlertVisible && (
                                    <Alert
                                        severity={alertType}
                                        action={
                                            <HighlightOff
                                                onClick={() =>
                                                    setIsErrorAlertVisible(
                                                        false
                                                    )
                                                }
                                                style={{ cursor: 'pointer' }}
                                            />
                                        }
                                        style={{
                                            marginBottom: 15,
                                        }}
                                    >
                                        <AlertTitle>Greška</AlertTitle>
                                        {alertMessage}
                                        <strong> Pokušajte ponovo !</strong>
                                    </Alert>
                                )}
                            </Grid>
                            <Grid item xs={12} sm={10} md={8}>
                                <TextField
                                    id='currentPassword'
                                    label='Trenutna šifra'
                                    type={
                                        showCurrentPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    fullWidth
                                    required
                                    {...register('currentPassword')}
                                    error={errors.password ? true : false}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                <IconButton
                                                    aria-label='toggle password visibility'
                                                    onClick={() =>
                                                        setShowCurrentPassword(
                                                            !showCurrentPassword
                                                        )
                                                    }
                                                >
                                                    {showCurrentPassword ? (
                                                        <Visibility
                                                            style={{
                                                                color: '#393e46',
                                                            }}
                                                        />
                                                    ) : (
                                                        <VisibilityOff
                                                            style={{
                                                                color: '#393e46',
                                                            }}
                                                        />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Typography
                                    variant='inherit'
                                    color='red'
                                    sx={{
                                        textAlign: 'left',
                                        font: '12px Roboto',
                                    }}
                                >
                                    {errors.currentPassword?.message}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={10} md={8}>
                                <TextField
                                    id='password'
                                    label='Nova šifra'
                                    type={showPassword ? 'text' : 'password'}
                                    fullWidth
                                    required
                                    {...register('password')}
                                    error={errors.password ? true : false}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                <IconButton
                                                    aria-label='toggle password visibility'
                                                    onClick={() =>
                                                        setShowPassword(
                                                            !showPassword
                                                        )
                                                    }
                                                >
                                                    {showPassword ? (
                                                        <Visibility
                                                            style={{
                                                                color: '#393e46',
                                                            }}
                                                        />
                                                    ) : (
                                                        <VisibilityOff
                                                            style={{
                                                                color: '#393e46',
                                                            }}
                                                        />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Typography
                                    variant='inherit'
                                    color='red'
                                    sx={{
                                        textAlign: 'left',
                                        font: '12px Roboto',
                                    }}
                                >
                                    {errors.password?.message}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={10} md={8}>
                                <TextField
                                    id='passwordConfirm'
                                    label='Potvrdite novu šifru'
                                    type={showPassword ? 'text' : 'password'}
                                    fullWidth
                                    required
                                    {...register('passwordConfirm')}
                                    error={
                                        errors.passwordConfirm ? true : false
                                    }
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                <IconButton
                                                    aria-label='toggle password visibility'
                                                    onClick={() =>
                                                        setShowPassword(
                                                            !showPassword
                                                        )
                                                    }
                                                >
                                                    {showPassword ? (
                                                        <Visibility
                                                            style={{
                                                                color: '#393e46',
                                                            }}
                                                        />
                                                    ) : (
                                                        <VisibilityOff
                                                            style={{
                                                                color: '#393e46',
                                                            }}
                                                        />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Typography
                                    variant='inherit'
                                    color='red'
                                    sx={{
                                        textAlign: 'left',
                                        font: '12px Roboto',
                                    }}
                                >
                                    {errors.passwordConfirm?.message}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent='center' columns={12}>
                            <Grid item xs={8} sm={6} md={4}>
                                <Button
                                    variant='contained'
                                    startIcon={<Lock />}
                                    sx={{
                                        m: 1,
                                        mt: -1,
                                        mb: 2,
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        width: '100%',
                                    }}
                                    onClick={handleSubmit(handleUpdatePassword)}
                                    // disabled={!switchChecked}
                                >
                                    Izmjeni
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

export default PasswordChangeAccordion;
