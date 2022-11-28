import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Service from '../../api/service';
import {
    Grid,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    Box,
    Typography,
    Backdrop,
    Alert,
    AlertTitle,
} from '@mui/material';
import {
    Lock,
    Visibility,
    VisibilityOff,
    HighlightOff,
} from '@mui/icons-material';
import logo from '../../assets/whiteLogo.svg';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router-dom';
import './style.css';

function PasswordReset() {
    const { resetToken } = useParams();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [isPasswordResetSuccessful, setIsPasswordResetSuccessful] =
        useState(false);
    const [accessApproved, setAccessApproved] = useState(false);
    const navigate = useNavigate();
    let isMounted = useRef(true);
    useEffect(() => {
        const findResetTokenHandler = async () => {
            await Service.findResetToken({ resetToken })
                .then((res) => {
                    if (isMounted.current && res.status === 200) {
                        setAccessApproved(true);
                    }
                })
                .catch(() => {
                    navigate('/');
                });
        };

        findResetTokenHandler();

        return () => {
            isMounted.current = false;
        };
    }, [resetToken, navigate]);

    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .required('Šifra je obavezna')
            .max(24, 'Šifra može da sadrži maximalno 24 karaktera')
            .matches(
                /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
                'Šifra mora da sadrži minimalno 8 karaktera, jedno veliko, jedno malo slovo, jedan broj i jedan simbol'
            ),
        passwordConfirm: Yup.string()
            .required('Morate ponoviti šifru')
            .oneOf([Yup.ref('password'), null], 'Šifre moraju biti iste'),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const resetPasswordHandler = async (values) => {
        setIsLoading(true);
        await Service.resetPassword({
            values,
            resetToken,
        })
            .then((res) => {
                setResponseMessage(res.data.message);
                setIsLoading(false);
                setIsPasswordResetSuccessful(true);
            })
            .catch((err) => {
                setResponseMessage(
                    err.response
                        ? err.response.data.message
                        : 'Konekcija sa serverom nije uspostavljena'
                );
                setIsAlertVisible(true);
                setIsLoading(false);
            });
    };

    const switchToLoginHandler = () => {
        navigate('/login');
    };

    return (
        <div className='resetPasswordPage'>
            {accessApproved && (
                <Grid container justifyContent='center' alignItems='center'>
                    {isPasswordResetSuccessful ? (
                        <div className='resetPasswordSuccess'>
                            <h2>{responseMessage}</h2>
                            <Button
                                variant='contained'
                                style={{
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    backgroundColor: '#fff',
                                    color: '#393e46',
                                    height: '10%',
                                    marginBottom: 20,
                                    display: 'block',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                }}
                                onClick={switchToLoginHandler}
                            >
                                Prijavite se
                            </Button>
                        </div>
                    ) : (
                        <div className='resetPasswordContent'>
                            <Backdrop
                                sx={{
                                    color: '#fff',
                                    zIndex: (theme) => theme.zIndex.drawer + 1,
                                }}
                                open={isLoading}
                            >
                                <Loader />
                            </Backdrop>
                            <form>
                                <div className='upperBoxReset'>
                                    <h4>Reset šifre</h4>
                                    <img src={logo} alt='logo' />
                                </div>

                                <div className='formFieldsResetBox'>
                                    {isAlertVisible && (
                                        <Alert
                                            severity='error'
                                            action={
                                                <HighlightOff
                                                    onClick={() =>
                                                        setIsAlertVisible(false)
                                                    }
                                                    style={{
                                                        cursor: 'pointer',
                                                    }}
                                                />
                                            }
                                            style={{ marginBottom: 15 }}
                                        >
                                            <AlertTitle>Greška</AlertTitle>
                                            {responseMessage}
                                        </Alert>
                                    )}
                                    <Grid item xs={16}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'flex-end',
                                            }}
                                        >
                                            <Lock
                                                sx={{
                                                    color: '#393e46',
                                                    mr: 1,
                                                    my: 0.5,
                                                }}
                                            />
                                            <TextField
                                                id='password'
                                                label='Nova šifra'
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                fullWidth
                                                required
                                                variant='standard'
                                                {...register('password')}
                                                error={
                                                    errors.password
                                                        ? true
                                                        : false
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
                                        </Box>
                                        <Typography
                                            variant='inherit'
                                            color='red'
                                            sx={{
                                                textAlign: 'left',
                                                marginLeft: 4,
                                                font: '12px Roboto',
                                            }}
                                        >
                                            {errors.password?.message}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={16}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'flex-end',
                                            }}
                                        >
                                            <Lock
                                                sx={{
                                                    color: '#393e46',
                                                    mr: 1,
                                                    my: 0.5,
                                                }}
                                            />
                                            <TextField
                                                id='passwordConfirm'
                                                label='Potvrdite novu šifru'
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                fullWidth
                                                required
                                                variant='standard'
                                                {...register('passwordConfirm')}
                                                error={
                                                    errors.passwordConfirm
                                                        ? true
                                                        : false
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
                                        </Box>
                                        <Typography
                                            variant='inherit'
                                            color='red'
                                            sx={{
                                                textAlign: 'left',
                                                marginLeft: 4,
                                                font: '12px Roboto',
                                            }}
                                        >
                                            {errors.passwordConfirm?.message}
                                        </Typography>
                                    </Grid>
                                </div>

                                <Button
                                    variant='contained'
                                    style={{
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        // backgroundImage: `linear-gradient(to bottom right, #D0F2FF, #1890FF)`,
                                        // backgroundColor: '#393e46',
                                        color: '#fff',
                                        width: '75%',
                                        height: '10%',
                                        marginTop: -80,
                                    }}
                                    onClick={handleSubmit(resetPasswordHandler)}
                                >
                                    Resetuj šifru
                                </Button>
                            </form>
                        </div>
                    )}
                </Grid>
            )}
        </div>
    );
}

export default PasswordReset;
