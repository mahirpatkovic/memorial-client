import React, { useEffect, useRef, useState } from 'react';
import {
    useMediaQuery,
    Snackbar,
    Alert,
    Chip,
    IconButton,
    Grid,
} from '@mui/material';
import MaterialTable from '@material-table/core';
import { formatDate } from '../../utilities/formatDate';
import Service from '../../api/service';
import {
    DeleteOutlined,
    CheckBox,
    CheckBoxOutlineBlank,
    ToggleOn,
    ToggleOff,
} from '@mui/icons-material';
import Loader from '../Loader';
import UserDeactivateModal from '../UserDeactivateModal';
import UserActivateModal from '../UserActivateModal';
import UserRemoveModal from '../UserRemoveModal';
import UserAddEditorModal from '../UserAddEditorModal';
import UserRemoveEditorModal from '../UserRemoveEditorModal';
import UserRoleFilter from '../UserRoleFilter';
import { capitalizeWord } from '../../utilities/capitalizeWord';
import { useDispatch, useSelector } from 'react-redux';

import { requestsActions } from '../../store/requests';

function UsersTable() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isUserDeactivateModalVisible, setIsUserDeactivateModalVisible] =
        useState(false);
    const [isUserActivateModalVisible, setIsUserActivateModalVisible] =
        useState(false);
    const [isUserRemoveModalVisible, setIsUserRemoveModalVisible] =
        useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isUserAddEditorModalVisible, setIsUserAddEditorModalVisible] =
        useState(false);
    const [isUserRemoveEditorModalVisible, setIsUserRemoveEditorModalVisible] =
        useState(false);
    const [allUsers, setAllUsers] = useState([]);

    const isMobile = useMediaQuery('(max-width:540px)');

    const allRequests = useSelector((state) => state.requests.allRequests);

    const dispatch = useDispatch();
    let isMounted = useRef(true);

    useEffect(() => {
        const fetchAllUsersHandler = async () => {
            await Service.getAllUsers()
                .then((res) => {
                    if (isMounted.current) {
                        setUsers(res.data.allUsers);
                        setAllUsers(res.data.allUsers);
                        setIsLoading(false);
                    }
                })
                .catch((err) => {
                    setIsAlertVisible(true);
                    setErrorMessage(
                        err.response?.status === 500
                            ? 'Konekcija sa serverom nije uspostavljena'
                            : err.response.data.message
                    );
                    setIsLoading(false);
                });
        };

        fetchAllUsersHandler();

        return () => {
            isMounted.current = false;
        };
    }, []);

    const userRoleHandler = (role) => {
        switch (role) {
            case 'admin':
                return 'Admin';
            case 'editor':
                return 'Urednik';
            case 'reader':
                return 'Čitalac';
            default:
                break;
        }
    };
    const handleOpenUserAddEditorModal = (data) => {
        setIsUserAddEditorModalVisible(true);
        setSelectedRow(data);
    };
    const handleCloseUserAddEditorModal = (data, isOk) => {
        if (isOk) {
            let tmpUsersData = [...users];
            tmpUsersData.forEach((user) => {
                if (user._id === data._id) {
                    return (user.role = 'editor');
                }
            });
            setUsers(tmpUsersData);
        }
        setIsUserAddEditorModalVisible(false);
        setSelectedRow(null);
    };

    const handleOpenUserRemoveEditorModal = (data) => {
        setIsUserRemoveEditorModalVisible(true);
        setSelectedRow(data);
    };

    const handleCloseUserRemoveEditorModal = (data, isOk) => {
        if (isOk) {
            let tmpUsersData = [...users];
            tmpUsersData.forEach((user) => {
                if (user._id === data._id) {
                    return (user.role = 'reader');
                }
            });
            setUsers(tmpUsersData);
        }
        setIsUserRemoveEditorModalVisible(false);
        setSelectedRow(null);
    };

    const editorColumnHandler = (user) => {
        const isDisabled = user.removed;
        if (user.role === 'admin') {
            return (
                <IconButton disabled>
                    <CheckBox />
                </IconButton>
            );
        } else if (user.role === 'editor') {
            return (
                <IconButton
                    disabled={isDisabled}
                    onClick={() => handleOpenUserRemoveEditorModal(user)}
                >
                    <CheckBox
                        style={{
                            color: !isDisabled && '#00ab55',
                            cursor: 'pointer',
                        }}
                    />
                </IconButton>
            );
        } else {
            return (
                <IconButton
                    disabled={isDisabled}
                    onClick={() => handleOpenUserAddEditorModal(user)}
                >
                    <CheckBoxOutlineBlank />
                </IconButton>
            );
        }
    };

    const handleOpenUserDeactivateModal = (data) => {
        setIsUserDeactivateModalVisible(true);
        setSelectedRow(data);
    };

    const handleCloseUserDeactivateModal = (data, isOk) => {
        if (isOk) {
            let tmpUsersData = [...users];
            tmpUsersData.forEach((user) => {
                if (user._id === data._id) {
                    return (user.removed = true);
                }
            });
            setUsers(tmpUsersData);
        }
        setIsUserDeactivateModalVisible(false);
        setSelectedRow(null);
    };

    const handleOpenUserActivateModal = (data) => {
        setIsUserActivateModalVisible(true);
        setSelectedRow(data);
    };

    const handleCloseUserActivateModal = (data, isOk) => {
        if (isOk) {
            let tmpUsersData = [...users];
            tmpUsersData.forEach((user) => {
                if (user._id === data._id) {
                    return (user.removed = false);
                }
            });
            setUsers(tmpUsersData);
        }
        setIsUserActivateModalVisible(false);
        setSelectedRow(null);
    };

    const handleOpenUserRemoveModal = (data) => {
        setIsUserRemoveModalVisible(true);
        setSelectedRow(data);
    };

    const handleCloseUserRemoveModal = (data, isOk) => {
        if (isOk) {
            let tmpUsersData = [...users];
            setUsers(tmpUsersData.filter((user) => user._id !== data.id));
            let tmpRequestsData = [...allRequests];
            dispatch(
                requestsActions.setAllRequests(
                    tmpRequestsData.filter((req) => req.user?._id !== data.id)
                )
            );
        }
        setIsUserRemoveModalVisible(false);
        setSelectedRow(null);
    };

    const usersTableData =
        users &&
        users.map((user) => {
            return {
                id: user._id,
                firstLastName:
                    capitalizeWord(user.firstName) +
                    ' ' +
                    capitalizeWord(user.lastName),
                email: user.email,
                role: userRoleHandler(user.role),
                phoneNumber: user.phoneNumber,
                dob: formatDate(user.dob),
                gender: user.gender === 'male' ? 'M' : 'Ž',
                country: user.country,
                organization: capitalizeWord(user.organization),
                registrationPurpose: user.registrationPurpose,
                editor: editorColumnHandler(user),
                removed: user.removed,
                status: user.removed ? (
                    <Chip
                        label='Neaktivan'
                        style={{
                            color: '#B72136',
                            backgroundColor: '#FFE7D9',
                            fontWeight: 'bold',
                        }}
                        size='small'
                    />
                ) : (
                    <Chip
                        label='Aktivan'
                        style={{
                            color: '#007b55',
                            backgroundColor: '#C8FACD',
                            fontWeight: 'bold',
                        }}
                        size='small'
                    />
                ),
            };
        });

    const usersColumns = [
        {
            title: 'Ime i prezime',
            field: 'firstLastName',
            sorting: true,
            width: '10%',
        },
        { title: 'Email', field: 'email' },
        { title: 'Broj telefona', field: 'phoneNumber', width: '10%' },
        {
            title: 'Datum rođenja',
            field: 'dob',
            searchable: false,
            width: '10%',
        },
        { title: 'Spol', field: 'gender', searchable: false, width: '3%' },
        { title: 'Država', field: 'country' },
        {
            title: 'Organizacija',
            field: 'organization',
            sorting: false,
        },
        {
            title: 'Svrha istraživanja',
            field: 'registrationPurpose',
            sorting: false,
            searchable: false,
            cellStyle: {
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                maxWidth: 150,
            },
        },
        { title: 'Rola', field: 'role', searchable: false, width: '3%' },
        {
            title: 'Status',
            field: 'status',
            searchable: false,
            sorting: false,
        },
        {
            title: 'Urednik',
            field: 'editor',
            searchable: false,
            sorting: false,
        },
    ];

    const tableOptions = {
        actionsColumnIndex: -1,
        columnsButton: true,
        grouping: false,
        sorting: true,
        paging: true,
        pageSizeOptions: [5, 10, 20, 25, 50, 100],
        pageSize: 10,
        emptyRowsWhenPaging: false,
        rowStyle: (rowData) => ({
            color: rowData.removed && 'grey',
            font: '15px Roboto',
        }),
        headerStyle: {
            background: '#ddd',
            color: '#000',
            fontWeight: 'bold',
            paddingRight: 10,
        },
    };

    const tableLocalization = {
        pagination: {
            labelDisplayedRows: '',
            previousTooltip: 'Prethodna',
            nextTooltip: 'Sljedeća',
            lastTooltip: 'Posljednja',
            firstTooltip: 'Prva',
            labelRowsPerPage: !isMobile && 'Redova po stranici',
            labelRowsSelect: '',
        },
        toolbar: {
            nRowsSelected: '{0} row(s) selected',
            searchPlaceholder: 'Pretraga...',
            showColumnsTitle: 'Prikaži kolone',
            addRemoveColumns: 'Dadaj ili ukloni kolonu',
        },
        header: {
            actions: 'Opcije',
        },
        body: {
            emptyDataSourceMessage: 'Lista korisnika je prazna',
            filterRow: {
                filterTooltip: 'Filter',
            },
        },
    };

    const handleFilterUsersByRoles = (values) => {
        if (values.length > 0) {
            let tmpUserArr = [];
            for (const user of allUsers) {
                if (values.includes(user.role)) {
                    tmpUserArr.push(user);
                }
            }
            setUsers(tmpUserArr);
        } else {
            setUsers(allUsers);
        }
    };

    return (
        <div>
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
                        <UserRoleFilter
                            onFilterUsers={handleFilterUsersByRoles}
                            onResetFilter={() => setUsers(allUsers)}
                        />
                    </Grid>
                    <MaterialTable
                        columns={usersColumns}
                        data={usersTableData}
                        actions={[
                            (rowData) => ({
                                icon: () =>
                                    rowData.removed ? (
                                        <ToggleOff
                                            sx={{
                                                fontSize: 30,
                                            }}
                                            // color='disabled'
                                        />
                                    ) : (
                                        <ToggleOn
                                            sx={{
                                                fontSize: 30,
                                                color:
                                                    rowData.role !== 'Admin' &&
                                                    'green',
                                            }}
                                        />
                                    ),
                                tooltip:
                                    rowData.role === 'Admin' || rowData.removed
                                        ? ''
                                        : 'Deaktivirati',
                                onClick: (e, data) =>
                                    rowData.removed
                                        ? handleOpenUserActivateModal(data)
                                        : handleOpenUserDeactivateModal(data),
                                disabled:
                                    rowData.role === 'Admin' ? true : false,
                            }),
                            (rowData) => ({
                                icon: () => <DeleteOutlined />,
                                tooltip:
                                    rowData.role === 'Admin' || rowData.removed
                                        ? ''
                                        : 'Izbrisati',
                                onClick: (e, data) =>
                                    handleOpenUserRemoveModal(data),
                                disabled:
                                    rowData.role === 'Admin' ? true : false,
                            }),
                        ]}
                        title='Lista korisnika'
                        options={tableOptions}
                        localization={tableLocalization}
                    />
                    {isUserDeactivateModalVisible && (
                        <UserDeactivateModal
                            visible={isUserDeactivateModalVisible}
                            onClose={handleCloseUserDeactivateModal}
                            selected={selectedRow}
                        />
                    )}
                    {isUserActivateModalVisible && (
                        <UserActivateModal
                            visible={isUserActivateModalVisible}
                            onClose={handleCloseUserActivateModal}
                            selected={selectedRow}
                        />
                    )}
                    {isUserRemoveModalVisible && (
                        <UserRemoveModal
                            visible={isUserRemoveModalVisible}
                            onClose={handleCloseUserRemoveModal}
                            selected={selectedRow}
                        />
                    )}
                    {isUserAddEditorModalVisible && (
                        <UserAddEditorModal
                            visible={isUserAddEditorModalVisible}
                            onClose={handleCloseUserAddEditorModal}
                            selected={selectedRow}
                        />
                    )}
                    {isUserRemoveEditorModalVisible && (
                        <UserRemoveEditorModal
                            visible={isUserRemoveEditorModalVisible}
                            onClose={handleCloseUserRemoveEditorModal}
                            selected={selectedRow}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default UsersTable;
