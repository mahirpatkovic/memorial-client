import React, { useState } from 'react';
import MaterialTable from '@material-table/core';
import {
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    useMediaQuery,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { formatDateTime } from '../../utilities/formatDate';
import './style.css';

export default function DownloadUsersTable({ users }) {
    const [isExpandedAccordion, setIsExpandedAccordion] = useState(false);

    const isMobile = useMediaQuery('(max-width:540px)');

    const usersTableData =
        users &&
        users.map((user) => {
            return {
                id: user._id,
                username: user.user,
                time: formatDateTime(user.time),
            };
        });

    const usersColumns = [
        {
            title: 'Ime i prezime',
            field: 'username',
            sorting: true,
        },
        { title: 'Vrijeme preuzimanja', field: 'time' },
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
            emptyDataSourceMessage:
                'Lista korisnika koji su preuzeli dokument je prazna',
            filterRow: {
                filterTooltip: 'Filter',
            },
        },
    };

    const handleChangeAccordion = (panel) => (event, isExpanded) => {
        setIsExpandedAccordion(isExpanded ? panel : false);
    };

    return (
        <div className='downloadedBy'>
            <Accordion
                expanded={isExpandedAccordion === 'panel1'}
                onChange={handleChangeAccordion('panel1')}
                sx={{ m: 1, borderRadius: 1 }}
            >
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography>
                        Lista korisnika koji su preuzeli dokument
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: 1 }}>
                    <MaterialTable
                        columns={usersColumns}
                        data={usersTableData}
                        title=''
                        options={tableOptions}
                        localization={tableLocalization}
                    />
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
