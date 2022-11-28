import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
} from '@mui/material';
import { formatDate } from '../../../utilities/formatDate';
import moment from 'moment';
import { EventNote, ExpandLess, ExpandMore } from '@mui/icons-material';

function UsersVisitModal(props) {
    const [open, setOpen] = useState({});
    const users = props?.users;

    const handleOpenListItem = (id) => {
        setOpen((prevState) => ({ ...prevState, [id]: !prevState[id] }));
    };
    return (
        <div>
            <Dialog
                open={props.visible}
                onClose={props.onClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle>
                    Pregled posjete korisnika u posljednjih 7 dana
                </DialogTitle>
                <DialogContent dividers>
                    <List
                        sx={{
                            width: '100%',
                            maxWidth: '100%',
                        }}
                        component='nav'
                        aria-labelledby='nested-list-subheader'
                    >
                        {users?.map((user, index) => {
                            return (
                                <div key={index}>
                                    <ListItemButton
                                        onClick={() =>
                                            handleOpenListItem(index)
                                        }
                                    >
                                        <ListItemIcon>
                                            <EventNote />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={formatDate(
                                                moment().subtract(index, 'days')
                                            )}
                                        />
                                        {open[index] ? (
                                            <ExpandLess />
                                        ) : (
                                            <ExpandMore />
                                        )}
                                    </ListItemButton>
                                    <Collapse
                                        in={open[index]}
                                        timeout='auto'
                                        unmountOnExit
                                    >
                                        <List disablePadding>
                                            {user.length > 0 ? (
                                                <div>
                                                    <ListItem>
                                                        <ListItemIcon />
                                                        <ListItemText
                                                            primary={`Ukupno ${
                                                                user.length
                                                            } ${
                                                                user.length > 1
                                                                    ? 'korisnika:'
                                                                    : 'korisnik:'
                                                            }`}
                                                            sx={{
                                                                color: '#393e46',
                                                            }}
                                                        />
                                                    </ListItem>
                                                    {user.map((usr, i) => {
                                                        return (
                                                            <ListItem
                                                                key={i}
                                                                sx={{ ml: 1 }}
                                                            >
                                                                <ListItemIcon />
                                                                <ListItemText
                                                                    secondary={`- ${usr}`}
                                                                />
                                                            </ListItem>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <ListItem>
                                                    <ListItemIcon />
                                                    <ListItemText secondary='Nema prijavljenih korisnika' />
                                                </ListItem>
                                            )}
                                        </List>
                                    </Collapse>
                                </div>
                            );
                        })}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={props.onClose}
                        variant='outlined'
                        style={{ textTransform: 'none', fontWeight: 'bold' }}
                    >
                        Zatvori
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default UsersVisitModal;
