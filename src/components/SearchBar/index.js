import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { docsActions } from '../../store/docs';
import { styled } from '@mui/material/styles';
import {
    Input,
    Slide,
    Button,
    InputAdornment,
    ClickAwayListener,
    IconButton,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Search } from '@mui/icons-material';

const SearchbarStyle = styled('div')(() => ({
    top: 0,
    left: 0,
    zIndex: 99,
    width: '100%',
    display: 'flex',
    position: 'absolute',
    alignItems: 'center',
    height: 64,
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
}));

const useStyles = makeStyles(() => ({
    textFieldSearchIcon: {
        marginLeft: 30,
        '@media (max-width: 1280px)': {
            marginLeft: 80,
        },
    },
    searchBtn: {
        marginRight: 10,
        textTransform: 'none',
        fontWeight: 'bold',
    },
}));

export default function Searchbar() {
    const [isOpen, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const classes = useStyles();

    const handleOpen = () => {
        setOpen((prev) => !prev);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangeSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const searchHandler = async (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            dispatch(docsActions.startSearch(searchQuery));
            navigate('/pretraga');
            handleClose();
        }
    };

    return (
        <ClickAwayListener onClickAway={handleClose}>
            <div>
                {!isOpen && (
                    <IconButton onClick={handleOpen}>
                        <Search />
                    </IconButton>
                )}

                <Slide direction='down' in={isOpen} mountOnEnter unmountOnExit>
                    <SearchbarStyle>
                        <Input
                            autoFocus
                            fullWidth
                            disableUnderline
                            placeholder='Pretraga…'
                            startAdornment={
                                <InputAdornment position='start'>
                                    <Search />
                                </InputAdornment>
                            }
                            className={classes.textFieldSearchIcon}
                            onChange={handleChangeSearch}
                            onKeyDown={searchHandler}
                        />
                        <Button
                            variant='contained'
                            className={classes.searchBtn}
                            onClick={searchHandler}
                        >
                            Pretraži
                        </Button>
                    </SearchbarStyle>
                </Slide>
            </div>
        </ClickAwayListener>
    );
}
