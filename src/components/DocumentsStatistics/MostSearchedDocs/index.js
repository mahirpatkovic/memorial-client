import React from 'react';
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import { Box, Card, CardHeader } from '@mui/material';
import ChartOptions from '../../ChartsOptions';

export default function MostSearchedDocs(props) {
    const docs = props?.mostSearchedDocs;

    const CHART_DATA = [
        {
            data: docs.map((doc) => doc.searchNumber),
        },
    ];
    const chartOptions = merge(ChartOptions(), {
        tooltip: {
            marker: { show: false },
            y: {
                title: {
                    formatter: () => `Broj traženja`,
                },
            },
        },
        colors: ['#00AB55'],
        plotOptions: { bar: { columnWidth: '12%', borderRadius: 4 } },
        labels: docs.map((doc) => doc.documentName),
    });

    return (
        <Card>
            <CardHeader subheader='Najtraženiji dokumenti po ključnim riječima' />
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
