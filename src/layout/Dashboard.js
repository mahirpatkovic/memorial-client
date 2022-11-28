import React, { Fragment, useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Login from '../pages/Login';
import Content from './Content';
import Signup from '../pages/Signup';
import PasswordReset from '../pages/PasswordReset';
import ValidateProfile from '../pages/ValidateProfile';
import ViewHistory from '../pages/ViewHistory';
import Home from '../pages/Home';
import Statistics from '../pages/Statistics';
import Profile from '../pages/Profile';
import NewDocument from '../pages/NewDocument';
import ViewDocumentPage from '../pages/ViewDocumentPage';
import DocumentsPage from '../pages/DocumentsPage';
import SearchPage from '../pages/SearchPage';
import RequestsPage from '../pages/RequestsPage';
import Service from '../api/service';
import { requestsActions } from '../store/requests';
import { Snackbar, Alert } from '@mui/material';
import ApproveRequestModal from '../components/ApproveRequestModal';
import EditDocumentPage from '../pages/EditDocumentPage';
import { modalResponseActions } from '../store/modalResponse';

function Dashboard() {
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const isUserLoggedIn = useSelector((state) => state.auth.isAuthenticated);
    const currentUser = useSelector((state) => state.auth.currentUser);
    const isSearchStarted = useSelector((state) => state.docs.isSearchStarted);
    const isRequestModalVisible = useSelector(
        (state) => state.requests.isRequestModalVisible
    );
    const selectedRequest = useSelector(
        (state) => state.requests.selectedRequest
    );

    const isModalResAlertVisible = useSelector(
        (state) => state.modalResponse.isModalResAlertVisible
    );
    const modalResMessage = useSelector(
        (state) => state.modalResponse.modalResMessage
    );
    const modalAlertType = useSelector(
        (state) => state.modalResponse.modalAlertType
    );

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllRequests = async () => {
            await Service.getAllRequests()
                .then((res) => {
                    dispatch(
                        requestsActions.setAllRequests(res.data.allRequests)
                    );
                })
                .catch((err) => {
                    setIsAlertVisible(true);
                    setErrorMessage(
                        err.response
                            ? err.response.data.message
                            : 'Konekcija sa serverom nije uspostavljena'
                    );
                });
        };
        if (
            isUserLoggedIn &&
            (currentUser.role === 'editor' || currentUser.role === 'admin')
        ) {
            fetchAllRequests();
        }
    }, [dispatch, isUserLoggedIn, currentUser]);

    const closeNotificationModal = () => {
        dispatch(requestsActions.resetInitialState());
    };
    return (
        <Fragment>
            {isAlertVisible && (
                <Snackbar
                    open={isAlertVisible}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    autoHideDuration={8000}
                    onClose={() => setIsAlertVisible(false)}
                >
                    <Alert
                        onClose={() => setIsAlertVisible(false)}
                        severity='error'
                        sx={{ width: '100%' }}
                    >
                        {errorMessage}
                    </Alert>
                </Snackbar>
            )}
            {isModalResAlertVisible && (
                <Snackbar
                    open={isModalResAlertVisible}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    autoHideDuration={3000}
                    onClose={() =>
                        dispatch(
                            modalResponseActions.setIsModalResAlertHidden()
                        )
                    }
                >
                    <Alert
                        onClose={() =>
                            dispatch(
                                modalResponseActions.setIsModalResAlertHidden()
                            )
                        }
                        severity={modalAlertType}
                        sx={{ width: '100%' }}
                    >
                        {modalResMessage}
                    </Alert>
                </Snackbar>
            )}

            <Router>
                <Routes>
                    <Route
                        path='/'
                        element={isUserLoggedIn ? <Content /> : <Login />}
                    >
                        <Route index element={<Home />} />
                        <Route
                            path='/historijapregleda'
                            element={
                                currentUser?.role === 'reader' ||
                                currentUser?.role === 'editor' ? (
                                    <ViewHistory />
                                ) : (
                                    <Navigate to='/' />
                                )
                            }
                        />
                        <Route
                            path='/statistika'
                            element={
                                currentUser.role === 'admin' ||
                                currentUser.role === 'editor' ? (
                                    <Statistics />
                                ) : (
                                    <Navigate to='/' />
                                )
                            }
                        />
                        <Route
                            path='/dokumenti'
                            element={
                                currentUser.role === 'admin' ? (
                                    <DocumentsPage />
                                ) : (
                                    <Navigate to='/' />
                                )
                            }
                        />
                        <Route path='/profil' element={<Profile />} />
                        <Route
                            path='/novidokument'
                            element={
                                currentUser.role === 'admin' ||
                                currentUser.role === 'editor' ? (
                                    <NewDocument />
                                ) : (
                                    <Navigate to='/' />
                                )
                            }
                        />
                        <Route
                            path='/izmjena/:id'
                            element={
                                currentUser.role === 'admin' ||
                                currentUser.role === 'editor' ? (
                                    <EditDocumentPage />
                                ) : (
                                    <Navigate to='/' />
                                )
                            }
                        />
                        <Route
                            path='/pregled/:id'
                            element={<ViewDocumentPage />}
                        />
                        <Route
                            path='/pretraga'
                            element={
                                isSearchStarted ? (
                                    <SearchPage />
                                ) : (
                                    <Navigate to='/' />
                                )
                            }
                        />
                        <Route
                            path='/zahtjevi'
                            element={
                                currentUser.role === 'editor' ||
                                currentUser.role === 'admin' ? (
                                    <RequestsPage />
                                ) : (
                                    <Navigate to='/' />
                                )
                            }
                        />
                    </Route>
                    {/* <Route
                        path='/'
                        element={
                            !isUserLoggedIn ? <Login /> : <Navigate to='/' />
                        }
                    /> */}
                    <Route
                        path='/registracija'
                        element={
                            !isUserLoggedIn ? <Signup /> : <Navigate to='/' />
                        }
                    />
                    <Route
                        path='/resetPassword/:resetToken'
                        element={
                            !isUserLoggedIn ? (
                                <PasswordReset />
                            ) : (
                                <Navigate to='/' />
                            )
                        }
                    />
                    <Route
                        path='/validateProfile/:validationToken'
                        element={
                            !isUserLoggedIn ? (
                                <ValidateProfile />
                            ) : (
                                <Navigate to='/' />
                            )
                        }
                    />
                    <Route path='*' element={<Navigate to='/' />} />
                </Routes>
            </Router>
            {isRequestModalVisible && (
                <ApproveRequestModal
                    visible={isRequestModalVisible}
                    onClose={closeNotificationModal}
                    selected={selectedRequest}
                />
            )}
        </Fragment>
    );
}

export default Dashboard;
