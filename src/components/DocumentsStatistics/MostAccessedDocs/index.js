import React from 'react';
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import { Box, Card, CardHeader } from '@mui/material';
import ChartOptions from '../../ChartsOptions';

export default function MostAccessedDocs(props) {
    const docs = props?.mostAccessedDocs;

    const CHART_DATA = [
        {
            data: docs.map((doc) => doc.visits),
        },
    ];
    const chartOptions = merge(ChartOptions(), {
        tooltip: {
            marker: { show: false },
            y: {
                title: {
                    formatter: () => `Broj posjeta`,
                },
            },
        },
        colors: ['#1890FF'],
        plotOptions: { bar: { columnWidth: '12%', borderRadius: 4 } },
        labels: docs.map((doc) => doc.documentName),
    });

    return (
        <Card>
            <CardHeader subheader='Najposjećeniji dokumenti' />
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
