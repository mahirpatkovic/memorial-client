import React from 'react';
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import { styled } from '@mui/material/styles';
import { Card, CardHeader } from '@mui/material';
import ChartOptions from '../../ChartsOptions';

const CHART_HEIGHT = 372;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
    height: CHART_HEIGHT,
    marginTop: theme.spacing(5),
    '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
    '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
        overflow: 'visible',
    },
    '& .apexcharts-legend': {
        height: LEGEND_HEIGHT,
        alignContent: 'center',
        position: 'relative !important',
        borderTop: `solid 1px ${theme.palette.divider}`,
        top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
    },
}));

export default function UsersAge(props) {
    const usersAge = props?.usersAge;

    const CHART_DATA = usersAge;

    const chartOptions = merge(ChartOptions(), {
        colors: [
            '#00AB55',
            '#1890FF',
            '#FFC107',
            '#FF4842',
            '#826AF9',
            '#FF9933',
        ],
        labels: ['Ispod 20', '20-30', '30-40', '40-50', '50-60', 'Iznad 60'],
        // stroke: { colors: [theme.palette.background.paper] },
        legend: { floating: true, horizontalAlign: 'center' },
        dataLabels: { enabled: true, dropShadow: { enabled: false } },
        tooltip: {
            fillSeriesColor: false,
            y: {
                // formatter: (seriesName) => fNumber(seriesName),
                title: {
                    formatter: (seriesName) => `${seriesName}: korisnika`,
                },
            },
        },
        plotOptions: {
            pie: { donut: { labels: { show: false } } },
        },
    });

    return (
        <Card>
            <CardHeader subheader='Pregled korisnika po godinama' />

            <ChartWrapperStyle dir='ltr'>
                <ReactApexChart
                    type='pie'
                    series={CHART_DATA}
                    options={chartOptions}
                    height={280}
                />
            </ChartWrapperStyle>
        </Card>
    );
}
