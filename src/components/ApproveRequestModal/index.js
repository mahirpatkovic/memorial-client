import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Backdrop,
    Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Service from '../../api/service';
import Loader from '../Loader';
import { AccessTime } from '@mui/icons-material';
import { requestsActions } from '../../store/requests';
import { formatDateTime } from '../../utilities/formatDate';
import { modalResponseActions } from '../../store/modalResponse';

function ApproveRequestModal(props) {
    const [isLoading, setIsLoading] = useState(false);

    const allRequests = useSelector((state) => state.requests.allRequests);
    const selectedRequest = props?.selected;
    const dispatch = useDispatch();

    const successResponse = (res) => {
        props.onClose(selectedRequest.id, true);
        dispatch(modalResponseActions.setIsModalResAlertVisible());
        dispatch(modalResponseActions.setModalAlertType('success'));
        dispatch(modalResponseActions.setModalResMessage(res.data.message));
        setIsLoading(false);
        const filteredRequests = allRequests.filter(
            (request) => request._id !== selectedRequest.id
        );
        dispatch(requestsActions.setAllRequests(filteredRequests));
    };

    const errResponse = (err) => {
        dispatch(modalResponseActions.setIsModalResAlertVisible());
        dispatch(modalResponseActions.setModalAlertType('error'));
        dispatch(
            modalResponseActions.setModalResMessage(
                err.response
                    ? err.response.data.message
                    : 'Konekcija sa serverom nije uspostavljena'
            )
        );
        setIsLoading(false);
        props.onClose();
    };

    const approveRequestHandler = async () => {
        setIsLoading(true);

        await Service.approveRequest({
            id: selectedRequest.id,
            userId: selectedRequest.userId,
            docId: selectedRequest.docId,
            type: selectedRequest.type,
        })
            .then((res) => {
                successResponse(res);
            })
            .catch((err) => {
                errResponse(err);
            });
    };

    const declineRequestHandler = async () => {
        setIsLoading(true);

        await Service.declineRequest({
            id: selectedRequest.id,
            userId: selectedRequest.userId,
            docId: selectedRequest.docId,
            type: selectedRequest.type,
        })
            .then((res) => {
                successResponse(res);
            })
            .catch((err) => {
                errResponse(err);
            });
    };

    return (
        <div>
            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: 1500,
                }}
                open={isLoading}
            >
                <Loader />
            </Backdrop>
            <Dialog
                open={props.visible}
                onClose={props.onClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogContent>
                    <DialogContentText>
                        Da li sigurno želite dozvoliti{' '}
                        {`${
                            selectedRequest?.type === 'access'
                                ? 'pristup dokumentu'
                                : 'preuzimanje dokumenta'
                        }`}
                        : {selectedRequest?.documentName}, korisniku:{' '}
                        {selectedRequest?.requestedBy}?
                    </DialogContentText>
                    <DialogContentText component='span'>
                        Razlog: {selectedRequest?.description}
                    </DialogContentText>
                    <Typography
                        variant='caption'
                        component='span'
                        sx={{
                            ml: -0.5,
                            mt: 2,
                            display: 'flex',
                            alignItems: 'center',
                            color: 'text.disabled',
                        }}
                    >
                        <AccessTime />
                        {formatDateTime(selectedRequest?.createdAt)}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={props.onClose}
                        variant='outlined'
                        style={{ textTransform: 'none', fontWeight: 'bold' }}
                    >
                        Zatvori
                    </Button>
                    <Button
                        onClick={declineRequestHandler}
                        variant='outlined'
                        style={{ textTransform: 'none', fontWeight: 'bold' }}
                    >
                        Odbaci
                    </Button>
                    <Button
                        onClick={approveRequestHandler}
                        variant='contained'
                        style={{ textTransform: 'none', fontWeight: 'bold' }}
                    >
                        Prihvati
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ApproveRequestModal;
