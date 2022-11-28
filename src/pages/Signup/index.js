import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    Grid,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    Box,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Autocomplete,
    Stack,
    Typography,
    Alert,
    AlertTitle,
    Backdrop,
} from '@mui/material';
import {
    Person,
    Lock,
    Visibility,
    VisibilityOff,
    Email,
    Phone,
    Public,
    Work,
    FindInPage,
    Event,
    Wc,
    HighlightOff,
} from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import './style.css';
import logo from '../../assets/whiteLogo.svg';
import countries from '../../utilities/countries';
import MuiPhoneNumber from 'material-ui-phone-number';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Service from '../../api/service';
import Loader from '../../components/Loader';

function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [
        isValidationProfileAlertVisible,
        setIsValidationProfileAlertVisible,
    ] = useState(false);
    const [validationProfileMessage, setValidationProfileMessage] =
        useState('');

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('Ime je obavezno'),
        lastName: Yup.string().required('Prezime je obavezno'),
        email: Yup.string()
            .required('Email je obavezan')
            .email('Email nije validan'),
        password: Yup.string()
            .required('Šifra je obavezna')
            .max(24, 'Šifra može da sadrži maximalno 24 karaktera')
            .matches(
                /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
                'Šifra mora da sadrži najmanje 8 karaktera, jedno veliko, jedno malo slovo, jedan broj i jedan simbol'
            ),
        phoneNumber: Yup.string()
            .required('Broj telefona je obavezan')
            .min(10, 'Nedovoljan broj karaktera'),
        dob: Yup.date().required('Datum rođenja je obavezan'),
        gender: Yup.string().required('Spol je obavezan'),
        country: Yup.string().required('Država je obavezna'),
        organization: Yup.string(),
        registrationPurpose: Yup.string().required(
            'Svrha istrživanja je obavezna'
        ),
    });

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            phoneNumber: '',
            dob: null,
            gender: '',
            country: '',
            organization: '',
            registrationPurpose: '',
        },
    });
    const handleSignup = async (userValues, e) => {
        setIsLoading(true);
        await Service.signup(userValues)
            .then((res) => {
                setIsValidationProfileAlertVisible(true);
                setValidationProfileMessage(res.data.message);
                reset();
            })
            .catch((err) => {
                setErrorMessage(
                    err.response
                        ? err.response.data.message
                        : 'Konekcija sa serverom nije uspostavljena, pokušajte da osjvežite aplikaciju ili nas kontaktirajte putem info maila.'
                );
                setIsAlertVisible(true);
            });
        setIsLoading(false);
    };

    return (
        <div>
            <div className='validationProfileAlert'>
                {isValidationProfileAlertVisible && (
                    <Alert
                        severity='success'
                        action={
                            <HighlightOff
                                onClick={() =>
                                    setIsValidationProfileAlertVisible(false)
                                }
                                style={{ cursor: 'pointer' }}
                            />
                        }
                        sx={{ font: '14px Roboto' }}
                    >
                        {validationProfileMessage}
                    </Alert>
                )}
            </div>
            <h2 className='headingSignup'>Digitalna biblioteka</h2>
            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={isLoading}
            >
                <Loader />
            </Backdrop>
            <Grid
                container
                justifyContent='center'
                alignItems='center'
                sx={{
                    maxWidth: 600,
                    margin: '50px auto',
                    WebkitBoxShadow: '-1px -1px 8px -1px rgba(0, 0, 0, 0.52)',
                    MozBoxShadow: '-1px -1px 8px -1px rgba(0, 0, 0, 0.52)',
                    boxShadow: '-1px -1px 8px -1px rgba(0, 0, 0, 0.52)',
                    borderRadius: 3,
                }}
            >
                <div className='signupContent' sx={{ paddingBottom: 150 }}>
                    <form>
                        <div className='upperBoxSignup'>
                            <h4>Registracija</h4>
                            <img
                                src={logo}
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                alt='logo'
                            />
                        </div>

                        <div className='formFieldsBoxSignup'>
                            {isAlertVisible && (
                                <Alert
                                    severity='error'
                                    action={
                                        <HighlightOff
                                            onClick={() =>
                                                setIsAlertVisible(false)
                                            }
                                            style={{ cursor: 'pointer' }}
                                        />
                                    }
                                    style={{ marginBottom: 15 }}
                                >
                                    <AlertTitle>Greška</AlertTitle>
                                    {errorMessage} —{' '}
                                    <strong> Pokušajte ponovo !</strong>
                                </Alert>
                            )}
                            <Grid
                                container
                                spacing={2}
                                columns={16}
                                sx={{ padding: 1 }}
                            >
                                <Grid item xs={16} sm={8}>
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
                                            id='firstName'
                                            label='Ime'
                                            type='text'
                                            fullWidth
                                            required
                                            variant='standard'
                                            {...register('firstName')}
                                            error={
                                                errors.firstName ? true : false
                                            }
                                        />
                                    </Box>
                                    <Typography
                                        variant='inherit'
                                        color='red'
                                        sx={{
                                            marginLeft: 4,
                                            font: '12px Roboto',
                                        }}
                                    >
                                        {errors.firstName?.message}
                                    </Typography>
                                </Grid>
                                <Grid item xs={16} sm={8}>
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
                                            id='lastName'
                                            label='Prezime'
                                            type='text'
                                            fullWidth
                                            required
                                            variant='standard'
                                            {...register('lastName')}
                                            error={
                                                errors.lastName ? true : false
                                            }
                                        />
                                    </Box>
                                    <Typography
                                        variant='inherit'
                                        color='red'
                                        sx={{
                                            marginLeft: 4,
                                            font: '12px Roboto',
                                        }}
                                    >
                                        {errors.lastName?.message}
                                    </Typography>
                                </Grid>
                                <Grid item xs={16} sm={8}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                        }}
                                    >
                                        <Email
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
                                        />
                                    </Box>
                                    <Typography
                                        variant='inherit'
                                        color='red'
                                        sx={{
                                            marginLeft: 4,
                                            font: '12px Roboto',
                                        }}
                                    >
                                        {errors.email?.message}
                                    </Typography>
                                </Grid>
                                <Grid item xs={16} sm={8}>
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
                                                errors.password ? true : false
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
                                            marginLeft: 4,
                                            font: '12px Roboto',
                                        }}
                                    >
                                        {errors.password?.message}
                                    </Typography>
                                </Grid>
                                <Grid item xs={16} sm={8}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                        }}
                                    >
                                        <Phone
                                            sx={{
                                                color: '#393E46',
                                                mr: 1,
                                                my: 0.5,
                                            }}
                                        />
                                        <Controller
                                            control={control}
                                            name='phoneNumber'
                                            // defaultValue=''
                                            render={({ field }) => (
                                                <MuiPhoneNumber
                                                    id='phoneNumber'
                                                    required
                                                    fullWidth
                                                    // defaultValue=''
                                                    label='Broj telefona'
                                                    defaultCountry={'ba'}
                                                    onChange={(value) =>
                                                        field.onChange(
                                                            value && value
                                                        )
                                                    }
                                                    disableAreaCodes={true}
                                                    error={
                                                        errors.phoneNumber
                                                            ? true
                                                            : false
                                                    }
                                                    // {...register('phoneNumber')}
                                                />
                                            )}
                                        />
                                    </Box>
                                    <Typography
                                        variant='inherit'
                                        color='red'
                                        sx={{
                                            marginLeft: 4,
                                            font: '12px Roboto',
                                        }}
                                    >
                                        {errors.phoneNumber &&
                                            'Broj telefona je obavezan'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={16} sm={8}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                        }}
                                    >
                                        <Event
                                            sx={{
                                                color: '#393E46',
                                                mr: 1,
                                                my: 0.5,
                                            }}
                                        />
                                        <LocalizationProvider
                                            dateAdapter={AdapterDateFns}
                                        >
                                            <Controller
                                                control={control}
                                                name='dob'
                                                defaultValue={null}
                                                render={({ field }) => (
                                                    <DatePicker
                                                        {...field}
                                                        label='Datum rođenja'
                                                        inputFormat='dd/MM/yyyy'
                                                        disableFuture
                                                        onChange={(e) => {
                                                            field.onChange(
                                                                e && e.toJSON()
                                                            );
                                                        }}
                                                        clearable
                                                        renderInput={(
                                                            params
                                                        ) => (
                                                            <TextField
                                                                {...params}
                                                                variant='standard'
                                                                required
                                                                fullWidth
                                                                error={
                                                                    errors.dob
                                                                        ? true
                                                                        : false
                                                                }
                                                            />
                                                        )}
                                                    />
                                                )}
                                                rules={{ required: true }}
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                    <Typography
                                        variant='inherit'
                                        color='red'
                                        sx={{
                                            marginLeft: 4,
                                            font: '12px Roboto',
                                        }}
                                    >
                                        {errors.dob &&
                                            'Datum rođenja je obavezan'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={16} sm={8}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                        }}
                                    >
                                        <Wc
                                            sx={{
                                                color: '#393E46',
                                                mr: 1,
                                                my: 2,
                                            }}
                                        />
                                        <FormControl component='fieldset'>
                                            <Stack spacing={4} direction='row'>
                                                <FormLabel
                                                    component='legend'
                                                    sx={{ my: 2 }}
                                                    error={
                                                        errors.gender
                                                            ? true
                                                            : false
                                                    }
                                                >
                                                    Spol*
                                                </FormLabel>
                                                <Controller
                                                    control={control}
                                                    name='gender'
                                                    rules={{ required: true }}
                                                    render={({ field }) => (
                                                        <RadioGroup
                                                            row
                                                            aria-label='gender'
                                                            name='row-radio-buttons-group'
                                                            {...field}
                                                        >
                                                            <FormControlLabel
                                                                value='female'
                                                                control={
                                                                    <Radio />
                                                                }
                                                                label='Ž'
                                                            />
                                                            <FormControlLabel
                                                                value='male'
                                                                control={
                                                                    <Radio />
                                                                }
                                                                label='M'
                                                            />
                                                        </RadioGroup>
                                                    )}
                                                />
                                            </Stack>
                                        </FormControl>
                                    </Box>
                                    <Typography
                                        variant='inherit'
                                        color='red'
                                        sx={{
                                            marginLeft: 4,
                                            font: '12px Roboto',
                                        }}
                                    >
                                        {errors.gender && 'Spol je obavezan'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={16} sm={8}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                        }}
                                    >
                                        <Public
                                            sx={{
                                                color: '#393E46',
                                                mr: 1,
                                                my: 0.5,
                                            }}
                                        />
                                        <Controller
                                            name='country'
                                            control={control}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    id='country'
                                                    options={countries}
                                                    getOptionLabel={(option) =>
                                                        option.label
                                                    }
                                                    renderOption={(
                                                        props,
                                                        option
                                                    ) => (
                                                        <Box
                                                            component='li'
                                                            sx={{
                                                                '& > img': {
                                                                    mr: 2,
                                                                    flexShrink: 0,
                                                                },
                                                            }}
                                                            {...props}
                                                        >
                                                            <img
                                                                loading='lazy'
                                                                width='20'
                                                                src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                                                srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                                                                alt=''
                                                            />
                                                            {option.label} (
                                                            {option.code})
                                                        </Box>
                                                    )}
                                                    required
                                                    fullWidth
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label='Država'
                                                            required
                                                            variant='standard'
                                                            error={
                                                                errors.country
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                    )}
                                                    onChange={(e, value) =>
                                                        field.onChange(
                                                            value && value.label
                                                        )
                                                    }
                                                />
                                            )}
                                            rules={{ required: true }}
                                        />
                                    </Box>
                                    <Typography
                                        variant='inherit'
                                        color='red'
                                        sx={{
                                            marginLeft: 4,
                                            font: '12px Roboto',
                                        }}
                                    >
                                        {errors.country && 'Država je obavezna'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={16} sm={8}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                        }}
                                    >
                                        <Work
                                            sx={{
                                                color: '#393E46',
                                                mr: 1,
                                                my: 0.5,
                                            }}
                                        />
                                        <TextField
                                            id='organization'
                                            label='Organizacija'
                                            type='organization'
                                            fullWidth
                                            variant='standard'
                                            {...register('organization')}
                                            error={
                                                errors.organization
                                                    ? true
                                                    : false
                                            }
                                        />
                                    </Box>
                                    <Typography
                                        variant='inherit'
                                        color='red'
                                        sx={{
                                            marginLeft: 4,
                                            font: '12px Roboto',
                                        }}
                                    >
                                        {errors.organization?.message}
                                    </Typography>
                                </Grid>
                                <Grid item xs={16}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                        }}
                                    >
                                        <FindInPage
                                            sx={{
                                                color: '#393E46',
                                                mr: 1,
                                                my: 0.5,
                                            }}
                                        />
                                        <TextField
                                            id='registrationPurpose'
                                            label='Svrha istraživanja'
                                            type='registrationPurpose'
                                            fullWidth
                                            required
                                            variant='outlined'
                                            {...register('registrationPurpose')}
                                            error={
                                                errors.registrationPurpose
                                                    ? true
                                                    : false
                                            }
                                            multiline
                                            rows={3}
                                        />
                                    </Box>
                                    <Typography
                                        variant='inherit'
                                        color='red'
                                        sx={{
                                            marginLeft: 4,
                                            font: '12px Roboto',
                                        }}
                                    >
                                        {errors.registrationPurpose?.message}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </div>

                        <Button
                            variant='contained'
                            style={{
                                textTransform: 'none',
                                fontWeight: 'bold',
                                // backgroundImage: `linear-gradient(to bottom right, #D0F2FF, #04297a)`,
                                backgroundColor: '#393E46',
                                width: '75%',
                                color: '#fff',
                                height: '10%',
                                marginTop: -50,
                                display: 'block',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                            }}
                            onClick={handleSubmit(handleSignup)}
                            type='submit'
                        >
                            Registruj se
                        </Button>
                    </form>
                </div>
                <p className='loginBtn'>
                    Ukoliko ste korisnik,
                    <NavLink
                        to='/'
                        style={{ textDecoration: 'none', color: 'black' }}
                    >
                        <strong> Prijavite se</strong>
                    </NavLink>
                </p>
            </Grid>
        </div>
    );
}

export default Signup;
