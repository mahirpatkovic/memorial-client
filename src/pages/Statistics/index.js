import React, { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import {
    Grid,
    Breadcrumbs,
    Typography,
    Stack,
    Snackbar,
    Alert,
} from '@mui/material';
import { Home, Timeline } from '@mui/icons-material';
import UsersTotal from '../../components/UsersStatistics/UsersTotal';
import LastDayVisitors from '../../components/UsersStatistics/LastDayVisitors';
import DocumentsTotal from '../../components/DocumentsStatistics/DocumentsTotal';
import LastDayDocVisits from '../../components/DocumentsStatistics/LastDayDocVisits';
import LastSevenDayVisits from '../../components/UsersStatistics/LastSevenDayVisits';
import UsersAge from '../../components/UsersStatistics/UsersAge';
import UsersCountries from '../../components/UsersStatistics/UsersCountries';
import PublicPrivateDocs from '../../components/DocumentsStatistics/PublicPrivateDocs';
import './style.css';
import MostAccessedDocs from '../../components/DocumentsStatistics/MostAccessedDocs';
import Service from '../../api/service';
import Loader from '../../components/Loader';
import MostSearchedDocs from '../../components/DocumentsStatistics/MostSearchedDocs';
import MostDownloadedDocs from '../../components/DocumentsStatistics/MostDownloadedDocs';

function Statistics() {
    const [publicDocs, setPublicDocs] = useState(0);
    const [privateDocs, setPrivateDocs] = useState(0);
    const [mostAccessedDocs, setMostAccessedDocs] = useState([]);
    const [mostSearchedDocs, setMostSearchedDocs] = useState([]);
    const [mostDownloadedDocs, setMostDownloadedDocs] = useState([]);
    const [lastDaysDocVisits, setLastDaysDocVisits] = useState(0);
    const [totalDocs, setTotalDocs] = useState(0);

    const [lastDaysAppVisits, setLastDaysAppVisits] = useState([]);
    const [lastDaysAppVisitsUsers, setLastDaysAppVisitsUsers] = useState([]);
    const [usersAge, setUsersAge] = useState([]);
    const [usersCountries, setUsersCountries] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [todayVisit, setTodayVisit] = useState(0);

    const [isLoading, setIsLoading] = useState(true);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const isMounted = useRef(true);

    useEffect(() => {
        const fetchDocsStats = async () => {
            await Service.getDocsStats()
                .then((res) => {
                    if (isMounted.current) {
                        setPublicDocs(res.data.publicDocs);
                        setPrivateDocs(res.data.privateDocs);
                        setMostAccessedDocs(res.data.sortedDocs);
                        setMostSearchedDocs(res.data.mostSearchedDocs);
                        setMostDownloadedDocs(res.data.mostDownloadedDocs);
                        setTotalDocs(res.data.totalDocs);
                        setLastDaysDocVisits(res.data.lastDayDocsVisits);
                    }
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

        const fetchUsersStats = async () => {
            await Service.getUsersStats()
                .then((res) => {
                    if (isMounted.current) {
                        setLastDaysAppVisits(res.data.lastDaysAppVisits);
                        setLastDaysAppVisitsUsers(
                            res.data.lastDaysAppVisitsUsers
                        );
                        setTodayVisit(res.data.todayVisit);
                        setUsersAge(res.data.usersAge);
                        setUsersCountries(res.data.sortedCountries);
                        setTotalUsers(res.data.totalUsers);
                        setIsLoading(false);
                    }
                })
                .catch((err) => {
                    setIsAlertVisible(true);
                    setErrorMessage(
                        err.response
                            ? err.response.data.message
                            : 'Konekcija sa serverom nije uspostavljena'
                    );
                    setIsLoading(false);
                });
        };

        fetchDocsStats();
        fetchUsersStats();

        return () => {
            isMounted.current = false;
        };
    }, []);

    return (
        <div className='statisticsPage'>
            {isLoading ? (
                <Loader loaderColor={`black`} />
            ) : (
                <div>
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
                    <Grid container justifyContent='flex-start'>
                        <Breadcrumbs aria-label='breadcrumb'>
                            <NavLink
                                to='/'
                                style={{
                                    textDecoration: 'none',
                                    color: 'grey',
                                }}
                            >
                                <Home sx={{ mr: 0.5 }} fontSize='inherit' />
                                Početna
                            </NavLink>
                            <Stack
                                direction='row'
                                spacing={2}
                                style={{ color: '#393e46' }}
                            >
                                <Timeline
                                    sx={{ mr: -1.2, marginTop: 0.3 }}
                                    fontSize='inherit'
                                />
                                <Typography>Statistika</Typography>
                            </Stack>
                        </Breadcrumbs>
                    </Grid>
                    <div className='statNumbers'>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={3}>
                                <UsersTotal totalUsers={totalUsers} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <LastDayVisitors todayVisit={todayVisit} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <DocumentsTotal totalDocs={totalDocs} />
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <LastDayDocVisits
                                    lastDaysDocVisits={lastDaysDocVisits}
                                />
                            </Grid>

                            <Grid item xs={12} md={6} lg={8}>
                                <LastSevenDayVisits
                                    lastDaysAppVisits={lastDaysAppVisits}
                                    lastDaysAppVisitsUsers={
                                        lastDaysAppVisitsUsers
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} md={6} lg={4}>
                                <UsersAge usersAge={usersAge} />
                            </Grid>
                            <Grid item xs={12} md={6} lg={8}>
                                <UsersCountries
                                    usersCountries={usersCountries}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} lg={4}>
                                <PublicPrivateDocs
                                    publicDocs={publicDocs}
                                    privateDocs={privateDocs}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <MostAccessedDocs
                                    mostAccessedDocs={mostAccessedDocs}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <MostSearchedDocs
                                    mostSearchedDocs={mostSearchedDocs}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} lg={12}>
                                <MostDownloadedDocs
                                    mostDownloadedDocs={mostDownloadedDocs}
                                />
                            </Grid>
                        </Grid>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Statistics;
