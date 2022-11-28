import React, { useEffect, useState } from 'react';
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
    Slider,
    Typography,
    TextField,
    Stack,
} from '@mui/material';
import DateRangePicker from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    filterBtns: {
        textTransform: 'none',
        fontWeight: 'bold',
    },
    filterBtnsField: {
        '@media (max-width: 900px)': {
            marginTop: 10,
        },
    },
}));

function DocumentsTableFilters(props) {
    const [fileTypeValues, setFileTypeValues] = useState([]);
    const [rangeValue, setRangeValue] = useState([]);
    const [docValue, setDocValue] = useState('');
    const [docLastChangeValue, setDocLastChangeValue] = useState([null, null]);

    const fileTypes = ['image', 'video', 'audio', 'document'];
    const classes = useStyles();
    useEffect(() => {
        setRangeValue([0, props?.biggestDoc]);
    }, [props?.biggestDoc]);

    const handleChangeFileTypeValues = (event) => {
        const {
            target: { value },
        } = event;
        setFileTypeValues(value);
    };

    const getFileType = (role) => {
        switch (role) {
            case 'image':
                return 'Slika';
            case 'video':
                return 'Video';
            case 'audio':
                return 'Audio';
            case 'document':
                return 'Dokument';
            default:
                break;
        }
    };

    const handleChangeSizeRangeFilter = (e, value) => {
        setRangeValue(value);
    };

    const handleChangeDocValue = (e) => {
        setDocValue(e.target.value);
    };

    const resetFiltersHandler = () => {
        setFileTypeValues([]);
        setDocLastChangeValue([null, null]);
        setRangeValue([0, props?.biggestDoc]);
        setDocValue('');
        props.onResetFilters();
    };

    const filterDocsHandler = () => {
        props.onApplyFilters({
            docValue,
            rangeValue,
            fileTypeValues,
            docLastChangeValue,
        });
    };

    const isResetFilterBtnsVisible =
        docLastChangeValue.every((val) => val !== null && val !== undefined) ||
        fileTypeValues.length > 0 ||
        rangeValue.some((val) => val !== 0 && val !== props?.biggestDoc) ||
        docValue;

    return (
        <div>
            <Grid
                container
                spacing={2}
                columns={16}
                sx={{ marginTop: 1, marginBottom: 1 }}
            >
                <Grid item xs={16} sm={8} md={4}>
                    <FormControl fullWidth>
                        <InputLabel id='demo-multiple-name-label'>
                            Tip dokumenta
                        </InputLabel>
                        <Select
                            labelId='demo-multiple-name-label'
                            id='demo-multiple-name'
                            multiple
                            value={fileTypeValues}
                            onChange={handleChangeFileTypeValues}
                            input={<OutlinedInput label='Tip dokumenta' />}
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
                                            label={getFileType(value)}
                                        />
                                    ))}
                                </Box>
                            )}
                        >
                            {fileTypes.map((role, index) => (
                                <MenuItem key={index} value={role}>
                                    {getFileType(role)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={16} sm={8} md={4}>
                    <Box sx={{ width: '100%' }}>
                        <Typography>Veličina dokumenta</Typography>
                        <Slider
                            value={rangeValue}
                            onChange={handleChangeSizeRangeFilter}
                            valueLabelDisplay='auto'
                            valueLabelFormat={(val) =>
                                `${(val / 1000000).toFixed(2)} MB`
                            }
                            max={props?.biggestDoc}
                            step={1000}
                        />
                    </Box>
                </Grid>
                <Grid item xs={16} sm={8} md={4}>
                    <FormControl fullWidth>
                        <InputLabel id='demo-simple-select-label'>
                            Vrsta vrijednosti
                        </InputLabel>
                        <Select
                            labelId='demo-simple-select-label'
                            id='demo-simple-select'
                            value={docValue}
                            onChange={handleChangeDocValue}
                            input={<OutlinedInput label='Vrsta vrijednosti' />}
                        >
                            <MenuItem value='public'>Javno dostupan</MenuItem>
                            <MenuItem value='private'>
                                Ograničen pristup
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={16} sm={8} md={4}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        {/* <Typography>Zadnja izmjena </Typography> */}
                        <DateRangePicker
                            startText='Od'
                            endText='Do'
                            inputFormat='dd/MM/yyyy'
                            value={docLastChangeValue}
                            onChange={(newValue) => {
                                setDocLastChangeValue(newValue);
                            }}
                            renderInput={(startProps, endProps) => (
                                <React.Fragment>
                                    <TextField {...startProps} />
                                    <Box sx={{ mx: 2 }}> - </Box>
                                    <TextField {...endProps} />
                                </React.Fragment>
                            )}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid container justifyContent='flex-end'>
                    {isResetFilterBtnsVisible && (
                        <Stack
                            spacing={2}
                            direction='row'
                            className={classes.filterBtnsField}
                        >
                            <Button
                                variant='outlined'
                                className={classes.filterBtns}
                                onClick={resetFiltersHandler}
                            >
                                Reset
                            </Button>
                            <Button
                                variant='contained'
                                className={classes.filterBtns}
                                onClick={filterDocsHandler}
                            >
                                Filter
                            </Button>
                        </Stack>
                    )}
                </Grid>

                {/* {fileTypeValues.length > 0 && (
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
                )} */}
            </Grid>
        </div>
    );
}

export default DocumentsTableFilters;
