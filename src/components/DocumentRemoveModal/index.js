import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Backdrop,
    Stack,
    Typography,
} from '@mui/material';
import Service from '../../api/service';
import Loader from '../Loader';
import { WarningAmber } from '@mui/icons-material';

function DocumentRemoveModal(props) {
    const [isLoading, setIsLoading] = useState(false);

    let docId = props?.selected;

    const deleteDocumentHandler = async () => {
        setIsLoading(true);

        await Service.removeDocument(docId)
            .then((res) => {
                setIsLoading(false);
                props.onClose(res.data, true);
            })
            .catch((err) => {
                setIsLoading(false);
                props.onClose(
                    err.response
                        ? err.response.data.message
                        : 'Konekcija sa serverom nije uspostavljena',
                    true
                );
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
                    <Stack direction='row' spacing={1} sx={{ mb: 2 }}>
                        <WarningAmber color='warning' />
                        <Typography color='#e65100'>Upozorenje!</Typography>
                    </Stack>
                    <DialogContentText>
                        Da li sigurno želite izbrisati ovaj dokument i sve
                        njegove fajlove?
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
                        onClick={deleteDocumentHandler}
                        variant='contained'
                        style={{ textTransform: 'none', fontWeight: 'bold' }}
                    >
                        Izbrisati
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default DocumentRemoveModal;
