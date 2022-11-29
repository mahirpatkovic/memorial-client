import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
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
  Person,
  Lock,
  Visibility,
  VisibilityOff,
  HighlightOff,
} from '@mui/icons-material';
import './style.css';
import logo from '../../assets/whiteLogo.svg';
import ForgotPasswordModal from '../../components/ForgotPasswordModal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Service from '../../api/service';
import { authActions } from '../../store/auth';
import { useDispatch } from 'react-redux';
import Loader from '../../components/Loader';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);
  const [alertType, setAlertType] = useState('');
  const [isResetPasswordAlertVisible, setIsResetPasswordAlertVisible] =
    useState(false);
  const [resetPasswordAlertMessage, setResetPasswordAlertMessage] =
    useState('');
  const [isValidationProfileAlertVisible, setIsValidationProfileAlertVisible] =
    useState(false);
  const [validationProfileMessage, setValidationProfileMessage] = useState('');
  const [validationAlertType, setValidationAlertType] = useState('success');

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email je obavezan')
      .email('Email nije validan'),
    password: Yup.string()
      .required('Šifra je obavezna')
      .min(8, 'Šifra mora da sadrži najmanje 8 karaktera')
      .max(24, 'Šifra može da sadrži najviše 24 karaktera'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(validationSchema),
  });
  const dispatch = useDispatch();

  let isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleLogin = async (userValues) => {
    setIsLoading(true);
    await Service.login(userValues)
      .then((res) => {
        if (isMounted.current) {
          if (!res.data.user.active) {
            setIsValidationProfileAlertVisible(true);
            setValidationProfileMessage(res.data.message);
            setValidationAlertType('warning');
            reset();
          } else {
            dispatch(authActions.login());
            dispatch(authActions.setCurrentUser(res.data.user));
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('token', res.data.token);
            setIsLoading(false);
            reset();
          }
        }
      })
      .catch((err) => {
        setErrorMessage(
          err.response
            ? err.response.data.message
            : 'Konekcija sa serverom nije uspostavljena'
        );
        setIsAlertVisible(true);
      });
    setIsLoading(false);
  };

  const showResetPasswordAlertHandler = (type, message) => {
    setAlertType(type);
    setResetPasswordAlertMessage(message);
    setIsResetPasswordAlertVisible(true);
  };

  return (
    <div>
      <div className='resetPasswordAlert'>
        {isResetPasswordAlertVisible && (
          <Alert
            severity={`${alertType}`}
            action={
              <HighlightOff
                onClick={() => setIsResetPasswordAlertVisible(false)}
                style={{ cursor: 'pointer' }}
              />
            }
            sx={{ font: '14px Roboto' }}
          >
            {resetPasswordAlertMessage}
          </Alert>
        )}
      </div>

      <div className='validationProfileAlert'>
        {isValidationProfileAlertVisible && (
          <Alert
            severity={validationAlertType}
            action={
              <HighlightOff
                onClick={() => setIsValidationProfileAlertVisible(false)}
                style={{ cursor: 'pointer' }}
              />
            }
            sx={{ font: '14px Roboto' }}
          >
            {validationProfileMessage}
          </Alert>
        )}
      </div>

      <Grid container justifyContent='center' alignItems='center'>
        <div className='loginContent'>
          <h2 className='headingLogin'>Digitalna biblioteka</h2>
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
            <div className='upperBox'>
              <h4>Prijava</h4>
              <img src={logo} alt='logo' />
            </div>

            <div className='formFieldsBox'>
              {isAlertVisible && (
                <Alert
                  severity='error'
                  action={
                    <HighlightOff
                      onClick={() => setIsAlertVisible(false)}
                      style={{ cursor: 'pointer' }}
                    />
                  }
                  style={{
                    marginBottom: 15,
                  }}
                >
                  <AlertTitle>Greška</AlertTitle>
                  {errorMessage}
                  {/* <strong> Pokušajte ponovo !</strong> */}
                </Alert>
              )}
              <Grid item xs={16}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-end',
                  }}
                >
                  <Person
                    sx={{
                      color: '#393E46',
                      mr: 1,
                      my: 0.5,
                    }}
                  />
                  <TextField
                    id='email'
                    label='Email'
                    type='email'
                    fullWidth
                    required
                    variant='standard'
                    {...register('email')}
                    error={errors.email ? true : false}
                    style={{ borderColor: '#00ab55' }}
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
                  {errors.email?.message}
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
                      color: '#393E46',
                      mr: 1,
                      my: 0.5,
                    }}
                  />
                  <TextField
                    id='password'
                    label='Šifra'
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    required
                    variant='standard'
                    {...register('password')}
                    error={errors.password ? true : false}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            aria-label='toggle password visibility'
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <Visibility
                                style={{
                                  color: '#393E46',
                                }}
                              />
                            ) : (
                              <VisibilityOff
                                style={{
                                  color: '#393E46',
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
            </div>
            <Button
              variant='contained'
              style={{
                textTransform: 'none',
                fontWeight: 'bold',
                // backgroundImage: `linear-gradient(to bottom right, #D0F2FF, #1890FF)`,
                backgroundColor: '#393E46',
                color: '#fff',
                width: '75%',
                height: '10%',
                marginTop: -50,
                marginBottom: 100,
              }}
              onClick={handleSubmit(handleLogin)}
              type='submit'
            >
              Prijava
            </Button>
          </form>
          <div>
            <p
              className='forgotPassBtn'
              onClick={() => setIsForgotPasswordModalOpen(true)}
            >
              Zaboravljena šifra?
            </p>
            <p className='registrationBtn'>
              Postanite korisnik,
              <NavLink
                to='/registracija'
                style={{
                  textDecoration: 'none',
                  color: 'black',
                }}
              >
                <strong> Registrujte se</strong>
              </NavLink>
            </p>
          </div>
        </div>
        {isForgotPasswordModalOpen && (
          <ForgotPasswordModal
            visible={isForgotPasswordModalOpen}
            onClose={() => setIsForgotPasswordModalOpen(false)}
            onOpenAlert={showResetPasswordAlertHandler}
          />
        )}
      </Grid>
    </div>
  );
}

export default Login;
