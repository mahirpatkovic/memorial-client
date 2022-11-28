import React from 'react';
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import { Box, Card, CardHeader } from '@mui/material';
import ChartOptions from '../../ChartsOptions';

export default function UsersCountries(props) {
    const countries = props?.usersCountries;
    let sortedCountries = [];

    for (let country of countries) {
        sortedCountries.unshift(country);
    }

    const CHART_DATA = [
        {
            data: [sortedCountries.map((country) => country[1])][0],
        },
    ];
    const chartOptions = merge(ChartOptions(), {
        tooltip: {
            marker: { show: false },
            y: {
                // formatter: (seriesName) => fNumber(seriesName),
                title: {
                    formatter: () => `Broj korisnika`,
                },
            },
        },
        colors: ['#00AB55'],
        plotOptions: {
            bar: { horizontal: true, barHeight: '7%', borderRadius: 2 },
        },
        xaxis: {
            categories: [sortedCountries.map((country) => country[0])][0],
        },
    });

    return (
        <Card>
            <CardHeader subheader='Pregled korisnika po državama' />

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
