import React, { useState } from 'react';
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import { Card, CardHeader, Box, IconButton, Tooltip } from '@mui/material';
import moment from 'moment';
import ChartOptions from '../../ChartsOptions';
import { formatDate } from '../../../utilities/formatDate';
import { ViewList } from '@mui/icons-material';
import UsersVisitModal from '../UsersVisitModal';

export default function LastSevenDayLogin(props) {
    const [isUsersVisitModalVisible, setIsUsersVisitModalVisible] =
        useState(false);

    const lastDaysAppVisits = props?.lastDaysAppVisits;
    const lastDaysAppVisitsUsers = props?.lastDaysAppVisitsUsers;

    const CHART_DATA = [
        {
            name: 'Posjeta',
            type: 'column',
            data: lastDaysAppVisits,
        },
        {
            type: 'area',
            data: lastDaysAppVisits,
        },
    ];

    const chartOptions = merge(ChartOptions(), {
        stroke: { width: [0, 2, 3] },
        plotOptions: { bar: { columnWidth: '5%', borderRadius: 4 } },
        fill: { type: ['solid', 'gradient', 'solid'] },
        colors: ['#1890FF', '#00AB55'],
        labels: [
            formatDate(moment().subtract(6, 'days')),
            formatDate(moment().subtract(5, 'days')),
            formatDate(moment().subtract(4, 'days')),
            formatDate(moment().subtract(3, 'days')),
            formatDate(moment().subtract(2, 'days')),
            formatDate(moment().subtract(1, 'days')),
            formatDate(moment().subtract(0, 'days')),
        ],
        legend: {
            show: false,
        },
        // xaxis: { type: 'datetime' },
        tooltip: {
            shared: false,
            intersect: false,
            y: {
                formatter: (y) => {
                    if (typeof y !== 'undefined') {
                        return `${y}`;
                    }
                    return y;
                },
            },
        },
    });

    const handleOpenUsersVisitModal = () => {
        setIsUsersVisitModalVisible(true);
    };

    const handleCloseUsersVisitModal = () => {
        setIsUsersVisitModalVisible(false);
    };

    return (
        <Card>
            <CardHeader
                subheader='Posjeta posljednjih 7 dana'
                action={
                    <Tooltip title='Pregled' placement='top'>
                        <IconButton onClick={handleOpenUsersVisitModal}>
                            <ViewList />
                        </IconButton>
                    </Tooltip>
                }
            />

            <Box sx={{ p: 3, pb: 1 }} dir='ltr'>
                <ReactApexChart
                    type='line'
                    series={CHART_DATA}
                    options={chartOptions}
                    height={364}
                />
            </Box>
            {isUsersVisitModalVisible && (
                <UsersVisitModal
                    visible={isUsersVisitModalVisible}
                    onClose={handleCloseUsersVisitModal}
                    users={lastDaysAppVisitsUsers}
                />
            )}
        </Card>
    );
}
