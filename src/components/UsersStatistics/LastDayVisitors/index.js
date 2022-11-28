import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
import { Login } from '@mui/icons-material';
// import { fShortenNumber } from '../../../utils/formatNumber';
import CountUp from 'react-countup';

const RootStyle = styled(Card)(({ theme }) => ({
    boxShadow: 'none',
    textAlign: 'center',
    padding: theme.spacing(5, 0),
    color: '#04297A',
    backgroundColor: '#D0F2FF',
    borderRadius: 20,
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
    margin: 'auto',
    display: 'flex',
    borderRadius: '50%',
    alignItems: 'center',
    width: theme.spacing(8),
    height: theme.spacing(8),
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
    color: '#04297A',
    backgroundImage: `linear-gradient(135deg, ${alpha(
        '#04297A',
        0
    )} 0%, ${alpha('#04297A', 0.24)} 100%)`,
}));

export default function LastDayVisitors(props) {
    return (
        <RootStyle>
            <IconWrapperStyle>
                <Login style={{ color: '#04297A' }} />
            </IconWrapperStyle>
            <Typography variant='h3'>
                <CountUp end={props?.todayVisit} duration={2} />
            </Typography>
            <Typography
                variant='subtitle2'
                sx={{ opacity: 0.72, fontWeight: 'bold' }}
            >
                Broj posjeta u posljednja 24h
            </Typography>
        </RootStyle>
    );
}
