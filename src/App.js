import React, { Fragment, useEffect, useState } from 'react';
import Dashboard from './layout/Dashboard';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { authActions } from './store/auth';
import { Alert, Backdrop, Snackbar } from '@mui/material';
import Loader from './components/Loader';
import Service from './api/service';
// import axios from 'axios';
import './appStyle.css';

const theme = createTheme({
    palette: {
        primary: {
            main: '#393E46',
        },
    },
});

function App() {
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const dispatch = useDispatch();
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');

        const isUserAutheticated = async () => {
            // let csrfToken = '';
            // await Service.getCsrfToken().then((res) => {
            //     axios.defaults.headers.common['X-CSRF-Token'] =
            //         res.data.csrfToken;
            //     csrfToken = res.data.csrfToken;
            // });

            if (isLoggedIn === 'true') {
                await Service.userAuthenticated()
                    .then((res) => {
                        dispatch(authActions.login());
                        dispatch(authActions.setCurrentUser(res.data.user));
                        localStorage.setItem('token', res.data.token);
                    })
                    .catch((err) => {
                        setErrorMessage(
                            err.response
                                ? err.response.data.message
                                : 'Konekcija sa serverom nije uspostavljena'
                        );
                        setIsAlertVisible(true);
                    });
            }

            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        };

        isUserAutheticated();
    }, [dispatch]);

    return (
        <ThemeProvider theme={theme}>
            {isLoading ? (
                <Backdrop
                    sx={{
                        color: '#fff',
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        backgroundColor: '#fff',
                    }}
                    open={isLoading}
                >
                    <Loader loaderColor={`black`} />
                </Backdrop>
            ) : (
                <Fragment>
                    <div style={{ maxWidth: 400, margin: 'auto' }}>
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
                                    severity='error'
                                    sx={{ width: '100%', font: '14px Roboto' }}
                                >
                                    {errorMessage}
                                </Alert>
                            </Snackbar>
                        )}
                    </div>
                    <Dashboard />
                </Fragment>
            )}
        </ThemeProvider>
    );
}

export default App;
