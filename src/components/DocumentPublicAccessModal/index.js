import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Backdrop,
} from '@mui/material';
import Service from '../../api/service';
import Loader from '../Loader';
import { modalResponseActions } from '../../store/modalResponse';
import { useDispatch } from 'react-redux';

function DocumentPublicAccessModal(props) {
    const [isLoading, setIsLoading] = useState(false);

    let selectedDoc = props?.selected;
    const dispatch = useDispatch();

    const approvePublicAccess = async () => {
        setIsLoading(true);
        const docId = selectedDoc._id;
        await Service.approvePublicAccess({ docId })
            .then((res) => {
                setIsLoading(false);
                dispatch(modalResponseActions.setIsModalResAlertVisible());
                dispatch(modalResponseActions.setModalAlertType('success'));
                dispatch(
                    modalResponseActions.setModalResMessage(res.data.message)
                );
                props.onClose(res.data.document, true);
            })
            .catch((err) => {
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
                        Da li sigurno želite odobriti javni pristup ovom
                        dokumentu?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={props.onClose}
                        variant='outlined'
                        style={{ textTransform: 'none', fontWeight: 'bold' }}
                    >
                        Ne
                    </Button>
                    <Button
                        onClick={approvePublicAccess}
                        variant='contained'
                        style={{ textTransform: 'none', fontWeight: 'bold' }}
                    >
                        Da
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default DocumentPublicAccessModal;
