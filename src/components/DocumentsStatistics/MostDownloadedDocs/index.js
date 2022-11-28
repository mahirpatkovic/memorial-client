import React from 'react';
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import { Box, Card, CardHeader } from '@mui/material';
import ChartOptions from '../../ChartsOptions';

export default function MostDownloadedDocs(props) {
    const docs = props?.mostDownloadedDocs;

    const CHART_DATA = [
        {
            data: docs.map((doc) => doc.downloadNumber),
        },
    ];
    const chartOptions = merge(ChartOptions(), {
        tooltip: {
            marker: { show: false },
            y: {
                title: {
                    formatter: () => `Broj preuzimanja`,
                },
            },
        },
        colors: ['#FFC107'],
        plotOptions: { bar: { columnWidth: '8%', borderRadius: 4 } },
        labels: docs.map((doc) => doc.documentName),
    });

    return (
        <Card>
            <CardHeader subheader='Dokumenti sa najviše preuzimanja' />
            <Box sx={{ mx: 3 }} dir='ltr'>
                <ReactApexChart
                    type='bar'
                    series={CHART_DATA}
                    options={chartOptions}
                    height={396}
                />
            </Box>
        </Card>
    );
}
