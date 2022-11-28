import React, { useState } from 'react';
import {
    Box,
    OutlinedInput,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    Chip,
    Grid,
    Button,
} from '@mui/material';
import { HighlightOffOutlined } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    resetBtn: {
        textTransform: 'none',
        fontWeight: 'bold',
        height: 40,
        marginTop: 20,
        '@media (max-width: 600px)': {
            marginLeft: 10,
            marginTop: 0,
            marginBottom: 10,
        },
    },
    selectField: {
        margin: 10,
        width: 300,
        '@media (max-width: 300px)': {
            width: 200,
        },
    },
}));

function UserRoleFilter(props) {
    const [roleValues, setRoleValues] = useState([]);
    const roles = ['admin', 'editor', 'reader'];
    const classes = useStyles();

    const handleChangeRoleValues = (event) => {
        const {
            target: { value },
        } = event;
        setRoleValues(value);
        props.onFilterUsers(value);
    };

    const getUserRole = (role) => {
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

    const handleResetFilter = () => {
        props.onResetFilter();
        setRoleValues([]);
    };

    return (
        <div>
            <Grid container spacing={2} columns={16} sx={{ padding: 1 }}>
                <Grid item xs={16} sm={12}>
                    <FormControl className={classes.selectField}>
                        <InputLabel id='demo-multiple-name-label'>
                            Filter rola korisnika
                        </InputLabel>
                        <Select
                            labelId='demo-multiple-name-label'
                            id='demo-multiple-name'
                            multiple
                            value={roleValues}
                            onChange={handleChangeRoleValues}
                            input={
                                <OutlinedInput label='Filter rola korisnika' />
                            }
                            renderValue={(selected) => (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 0.5,
                                    }}
                                >
                                    {selected.map((value) => (
                                        <Chip
                                            key={value}
                                            label={getUserRole(value)}
                                        />
                                    ))}
                                </Box>
                            )}
                        >
                            {roles.map((role, index) => (
                                <MenuItem key={index} value={role}>
                                    {getUserRole(role)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                {roleValues.length > 0 && (
                    <Grid item xs={16} sm={4}>
                        <Button
                            variant='contained'
                            startIcon={<HighlightOffOutlined />}
                            onClick={handleResetFilter}
                            className={classes.resetBtn}
                        >
                            Reset
                        </Button>
                    </Grid>
                )}
            </Grid>
        </div>
    );
}

export default UserRoleFilter;
