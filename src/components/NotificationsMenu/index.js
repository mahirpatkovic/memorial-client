import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DoneAll, AccessTime, Notifications } from '@mui/icons-material';
import {
    Divider,
    Box,
    Typography,
    Tooltip,
    IconButton,
    List,
    ListSubheader,
    ListItemAvatar,
    useMediaQuery,
    ListItemButton,
    ListItemText,
    Button,
    Popover,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { formatDateTime } from '../../utilities/formatDate';
import { requestsActions } from '../../store/requests';

function renderContent(notification) {
    const documentName = (
        <Typography variant='subtitle2'>
            {notification.documentName}
            <Typography
                // component='span'
                variant='body2'
                sx={{
                    color: 'text.secondary',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    maxWidth: 300,
                    width: 250,
                }}
            >
                {notification.heading}
            </Typography>
        </Typography>
    );

    return {
        icon: <DoneAll color='success' />,
        documentName,
    };
}
function NotificationItem(props) {
    const { icon, documentName } = renderContent(props);
    const dispatch = useDispatch();

    const openNotificationModal = (data) => {
        dispatch(requestsActions.setRequestModalVisible());
        dispatch(requestsActions.setSelectedRequest(data));
    };

    return (
        <>
            <ListItemButton
                // to='#'
                disableGutters
                // component={RouterLink}
                sx={{
                    py: 1.5,
                    px: 2.5,
                    mt: '1px',
                    backgroundColor: alpha('#919EAB', 0.16),
                }}
            >
                <ListItemAvatar>
                    <Tooltip title='Pogledati'>
                        <IconButton
                            onClick={() => {
                                openNotificationModal(props);
                                // props.onClose();
                            }}
                        >
                            {icon}
                        </IconButton>
                    </Tooltip>
                </ListItemAvatar>
                <ListItemText
                    primary={documentName}
                    secondary={
                        <>
                            <Typography
                                variant='caption'
                                sx={{
                                    mt: 0.5,
                                    // ml: -0.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: 'text.disabled',
                                }}
                            >
                                {props.requestedBy}
                            </Typography>
                            <Typography
                                variant='caption'
                                sx={{
                                    ml: -0.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: 'text.disabled',
                                }}
                            >
                                <AccessTime sx={{ mr: 0.5 }} />
                                {formatDateTime(props.createdAt)}
                            </Typography>
                        </>
                    }
                />
            </ListItemButton>
        </>
    );
}
export default function NotificationsMenu(props) {
    const allRequests = useSelector((state) => state.requests.allRequests);
    const navigate = useNavigate();
    const isMobileSmall = useMediaQuery('(max-width:414px)');

    return (
        <Popover
            anchorEl={props.isOpen}
            open={Boolean(props.isOpen)}
            onClose={props.onClose}
            // onClick={props.onClose}
            PaperProps={{
                elevation: 0,
                sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                    },
                    '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: isMobileSmall ? 40 : 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                    },
                },
            }}
            transformOrigin={{
                horizontal: 'right',
                vertical: 'top',
            }}
            anchorOrigin={{
                horizontal: 'right',
                vertical: 'bottom',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant='subtitle1'>Notifikacije</Typography>
                    <Typography
                        variant='body2'
                        sx={{ color: 'text.secondary' }}
                    >
                        Ukupno {allRequests.length}{' '}
                        {allRequests.length > 1 || allRequests.length === 0
                            ? `zahtjeva`
                            : `zahtjev`}
                    </Typography>
                </Box>

                <Notifications color='success' />
            </Box>

            <Divider />

            <div>
                <List
                    disablePadding
                    subheader={
                        <ListSubheader
                            disableSticky
                            sx={{ py: 1, px: 2.5, typography: 'overline' }}
                        >
                            Zahtjevi
                        </ListSubheader>
                    }
                >
                    {allRequests.length > 0 ? (
                        allRequests
                            .slice(0, 3)
                            .map((notification, index) => (
                                <NotificationItem
                                    key={index}
                                    id={notification._id}
                                    description={notification.reason}
                                    heading={
                                        notification.type === 'access'
                                            ? 'Zahtjev za pregled dokumenta'
                                            : 'Zahtjev za preuzimanje dokumenta'
                                    }
                                    documentName={
                                        notification.document?.documentName
                                    }
                                    type={notification.type}
                                    requestedBy={`${notification.user?.firstName} ${notification.user?.lastName}`}
                                    userId={notification.user?._id}
                                    docId={notification.document?._id}
                                    createdAt={notification.createdAt}
                                />
                            ))
                    ) : (
                        <ListItemButton
                            // to='#'
                            disableGutters
                            // component={RouterLink}
                            sx={{
                                py: 1.5,
                                px: 2.5,
                                mt: '1px',
                                backgroundColor: alpha('#919EAB', 0.16),
                            }}
                        >
                            <Typography
                                variant='body2'
                                sx={{
                                    color: 'text.secondary',
                                }}
                            >
                                Trenutno nema zahtjeva
                            </Typography>
                        </ListItemButton>
                    )}
                </List>
            </div>
            <Divider />

            <Box sx={{ p: 1 }}>
                <Button
                    fullWidth
                    disableRipple
                    onClick={() => {
                        navigate('/zahtjevi');
                        props.onClose();
                    }}
                    sx={{ textTransform: 'none', fontWeight: 'bold' }}
                >
                    Pogledati sve
                </Button>
            </Box>
        </Popover>
    );
}
