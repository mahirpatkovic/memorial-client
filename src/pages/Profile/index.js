import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    Grid,
    Breadcrumbs,
    Typography,
    Stack,
    Card,
    Divider,
    OutlinedInput,
    InputLabel,
    Switch,
    FormGroup,
    FormControlLabel,
    Button,
    TextField,
    Autocomplete,
    Box,
    Alert,
    Snackbar,
    Backdrop,
} from '@mui/material';
import { Home, Person, LocationOn, SaveOutlined } from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import MuiPhoneNumber from 'material-ui-phone-number';
import countries from '../../utilities/countries';
import femaleLogo from '../../assets/femaleLogo.png';
import maleLogo from '../../assets/maleLogo.png';
import Service from '../../api/service';
import Loader from '../../components/Loader';
import { authActions } from '../../store/auth';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import PasswordChangeAccordion from '../../components/PasswordChangeAccordion';
import './style.css';

function Profile() {
    const currentUser = useSelector((state) => state.auth.currentUser);

    const [isLoading, setIsLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [switchChecked, setSwitchChecked] = useState(false);

    const dispatch = useDispatch();

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('Ime je obavezno'),
        lastName: Yup.string().required('Prezime je obavezno'),
        phoneNumber: Yup.string()
            .required('Broj telefona je obavezan')
            .min(10, 'Nedovoljan broj karaktera'),
        dob: Yup.date().required('Datum rođenja je obavezan'),
        country: Yup.string().required('Država je obavezna'),
        organization: Yup.string(),
        address: Yup.string(),
        city: Yup.string(),
        about: Yup.string(),
    });

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            firstName: currentUser?.firstName,
            lastName: currentUser?.lastName,
            dob: currentUser?.dob,
            address: currentUser?.address,
            country: currentUser?.country,
            city: currentUser?.city,
            phoneNumber: currentUser?.phoneNumber,
            organization: currentUser?.organization,
            about: currentUser?.about,
        },
    });

    const handleSwitchChange = (event) => {
        setSwitchChecked(event.target.checked);
    };

    const handleUpdateProfile = async (values) => {
        setIsLoading(true);
        await Service.updateUserProfile({
            values,
            id: currentUser._id,
        })
            .then((res) => {
                dispatch(authActions.setCurrentUser(res.data.user));
                setIsLoading(false);
                setAlertType('success');
                setIsAlertVisible(true);
                setAlertMessage(res.data.message);
                setSwitchChecked(false);
            })
            .catch((err) => {
                setAlertMessage(
                    err.response
                        ? err.response.data.message
                        : 'Konekcija sa serverom nije uspostavljena.'
                );
                setAlertType('error');
                setIsAlertVisible(true);
                setIsLoading(false);
            });
    };

    return (
        <div className='profilePage'>
            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={isLoading}
            >
                <Loader />
            </Backdrop>
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
                        <Person
                            sx={{ mr: -1.2, marginTop: 0.3 }}
                            fontSize='inherit'
                        />
                        <Typography>Profil</Typography>
                    </Stack>
                </Breadcrumbs>
            </Grid>
            <div className='userCard'>
                <Card sx={{ borderRadius: 3, backgroundColor: '#f4f6f8' }}>
                    <div className='userNameAvatarDiv'>
                        <Grid container justifyContent='flex-end'>
                            <FormGroup sx={{ mr: 1 }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            onChange={handleSwitchChange}
                                            checked={switchChecked}
                                        />
                                    }
                                    label='Urediti profil'
                                    labelPlacement='start'
                                />
                            </FormGroup>
                        </Grid>
                        <img
                            src={
                                currentUser?.gender === 'female'
                                    ? femaleLogo
                                    : maleLogo
                            }
                            alt='user avatar'
                            className='userAvatarProfilePage'
                        />
                        <Typography
                            variant='h5'
                            align='center'
                            sx={{ margin: 1.5 }}
                        >
                            {`${currentUser?.firstName} ${currentUser?.lastName}`}
                        </Typography>
                        <Typography align='center' sx={{ color: '#637381' }}>
                            {currentUser?.email}
                        </Typography>
                        <Stack
                            direction='row'
                            spacing={2}
                            justifyContent='center'
                            sx={{ margin: 1.5 }}
                        >
                            <LocationOn style={{ color: '#637381' }} />
                            <Typography
                                align='center'
                                sx={{ color: '#637381' }}
                            >
                                {currentUser?.country}
                            </Typography>
                        </Stack>
                    </div>
                    <Divider
                        variant='middle'
                        sx={{ mb: 1.5, color: '#637381' }}
                    />

                    <div className='userMainInfo'>
                        <Typography
                            variant='subtitle1'
                            sx={{
                                fontWeight: 'bold',
                                color: '#637381',
                            }}
                        >
                            INFO
                        </Typography>
                        <Grid
                            container
                            spacing={2}
                            columns={12}
                            sx={{ padding: 1 }}
                        >
                            <Grid item xs={12} sm={6}>
                                <InputLabel>Ime</InputLabel>
                                <OutlinedInput
                                    id='firstName'
                                    fullWidth
                                    sx={{ backgroundColor: '#fff' }}
                                    disabled={!switchChecked}
                                    {...register('firstName')}
                                    error={errors.firstName ? true : false}
                                />
                                <Typography
                                    variant='inherit'
                                    color='red'
                                    sx={{
                                        font: '12px Roboto',
                                    }}
                                >
                                    {errors.firstName?.message}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <InputLabel>Prezime</InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    id='lastName'
                                    sx={{ backgroundColor: '#fff' }}
                                    disabled={!switchChecked}
                                    {...register('lastName')}
                                    error={errors.lastName ? true : false}
                                />
                                <Typography
                                    variant='inherit'
                                    color='red'
                                    sx={{
                                        font: '12px Roboto',
                                    }}
                                >
                                    {errors.lastName?.message}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <InputLabel>Email</InputLabel>
                                <TextField
                                    fullWidth
                                    id='email'
                                    defaultValue={currentUser?.email}
                                    sx={{ backgroundColor: '#fff' }}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    disabled={!switchChecked}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <InputLabel>Datum rođenja</InputLabel>
                                <LocalizationProvider
                                    dateAdapter={AdapterDateFns}
                                >
                                    <Controller
                                        control={control}
                                        name='dob'
                                        defaultValue={currentUser?.dob}
                                        render={({ field }) => (
                                            <DatePicker
                                                {...field}
                                                inputFormat='dd/MM/yyyy'
                                                disableFuture
                                                onChange={(e) => {
                                                    field.onChange(
                                                        e && e.toJSON()
                                                    );
                                                }}
                                                clearable
                                                disabled={!switchChecked}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        required
                                                        fullWidth
                                                        sx={{
                                                            backgroundColor:
                                                                '#fff',
                                                        }}
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
                                    <Typography
                                        variant='inherit'
                                        color='red'
                                        sx={{
                                            font: '12px Roboto',
                                        }}
                                    >
                                        {errors.dob &&
                                            'Datum rođenja je obavezan'}
                                    </Typography>
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                    </div>
                    <Divider
                        variant='middle'
                        sx={{
                            mt: 2,
                            mb: 1.5,
                            color: '#637381',
                        }}
                    />
                    <div className='userContactInfo'>
                        <Typography
                            variant='subtitle1'
                            sx={{ fontWeight: 'bold', color: '#637381', mr: 2 }}
                        >
                            KONTAKT INFO
                        </Typography>
                        <Grid
                            container
                            spacing={2}
                            columns={12}
                            sx={{ padding: 1 }}
                        >
                            <Grid item xs={12}>
                                <InputLabel>Adresa</InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    id='address'
                                    sx={{ backgroundColor: '#fff' }}
                                    disabled={!switchChecked}
                                    {...register('address')}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <InputLabel>Država</InputLabel>

                                <Controller
                                    name='country'
                                    control={control}
                                    render={({ field }) => (
                                        <Autocomplete
                                            id='country'
                                            options={countries}
                                            defaultValue={currentUser?.country}
                                            isOptionEqualToValue={(
                                                option,
                                                value
                                            ) =>
                                                option.label === value.label ||
                                                option.label === value
                                            }
                                            disabled={!switchChecked}
                                            renderOption={(props, option) => (
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
                                                    required
                                                    sx={{
                                                        backgroundColor: '#fff',
                                                    }}
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
                                <Typography
                                    variant='inherit'
                                    color='red'
                                    sx={{
                                        font: '12px Roboto',
                                    }}
                                >
                                    {errors.country && 'Država je obavezna'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <InputLabel>Grad</InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    id='city'
                                    sx={{ backgroundColor: '#fff' }}
                                    disabled={!switchChecked}
                                    {...register('city')}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <InputLabel>Broj telefona</InputLabel>
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
                                            value={currentUser?.phoneNumber}
                                            onChange={(value) =>
                                                field.onChange(value && value)
                                            }
                                            variant='outlined'
                                            disableAreaCodes={true}
                                            sx={{ backgroundColor: '#fff' }}
                                            disabled={!switchChecked}
                                            error={
                                                errors.phoneNumber
                                                    ? true
                                                    : false
                                            }
                                        />
                                    )}
                                />
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
                        </Grid>
                    </div>
                    <Divider
                        variant='middle'
                        sx={{
                            mt: 2,
                            mb: 1.5,
                            color: '#637381',
                        }}
                    />

                    <div className='additionalInfo'>
                        <Typography
                            variant='subtitle1'
                            sx={{ fontWeight: 'bold', color: '#637381', mr: 2 }}
                        >
                            DODATNI INFO
                        </Typography>
                        <Grid
                            container
                            spacing={2}
                            columns={12}
                            sx={{ padding: 1 }}
                        >
                            <Grid item xs={12} sm={6}>
                                <InputLabel>Organizacija</InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    id='organization'
                                    sx={{ backgroundColor: '#fff' }}
                                    disabled={!switchChecked}
                                    {...register('organization')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel>O meni</InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    id='about'
                                    multiline
                                    rows={2}
                                    sx={{ backgroundColor: '#fff' }}
                                    disabled={!switchChecked}
                                    {...register('about')}
                                />
                            </Grid>
                        </Grid>
                        <Grid container justifyContent='center' columns={12}>
                            <Grid item xs={8} sm={6} md={4}>
                                <Button
                                    variant='contained'
                                    startIcon={<SaveOutlined />}
                                    sx={{
                                        m: 1,
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        width: '100%',
                                    }}
                                    onClick={handleSubmit(handleUpdateProfile)}
                                    disabled={!switchChecked}
                                >
                                    Spasi
                                </Button>
                            </Grid>
                        </Grid>
                        <PasswordChangeAccordion />
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default Profile;
