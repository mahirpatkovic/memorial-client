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

function UserAddEditorModal(props) {
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    let selectedUser = props?.selected;

    const addUserAsEditorHandler = async () => {
        setIsLoading(true);
        const userId = selectedUser._id;

        await Service.userEditorAdd({ userId })
            .then((res) => {
                setIsLoading(false);
                dispatch(modalResponseActions.setIsModalResAlertVisible());
                dispatch(modalResponseActions.setModalAlertType('success'));
                dispatch(
                    modalResponseActions.setModalResMessage(res.data.message)
                );
                props.onClose(res.data.user, true);
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
                        Da li sigurno želite dodati ovog korisnika kao urednika?
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
                        onClick={addUserAsEditorHandler}
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

export default UserAddEditorModal;
