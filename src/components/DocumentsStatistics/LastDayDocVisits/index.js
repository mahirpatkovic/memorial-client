import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
import { Login } from '@mui/icons-material';
import CountUp from 'react-countup';

const RootStyle = styled(Card)(({ theme }) => ({
    boxShadow: 'none',
    textAlign: 'center',
    padding: theme.spacing(5, 0),
    color: '#7A0C2E',
    backgroundColor: '#FFE7D9',
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
    color: '#7A0C2E',
    backgroundImage: `linear-gradient(135deg, ${alpha(
        '#7A0C2E',
        0
    )} 0%, ${alpha('#7A0C2E', 0.24)} 100%)`,
}));

export default function LastDayVisits(props) {
    return (
        <RootStyle>
            <IconWrapperStyle>
                <Login style={{ color: '#7A0C2E' }} />
            </IconWrapperStyle>
            <Typography variant='h3'>
                <CountUp end={props?.lastDaysDocVisits} duration={2} />
            </Typography>
            <Typography
                variant='subtitle2'
                sx={{ opacity: 0.72, fontWeight: 'bold' }}
            >
                Broj pregledanih dokumenata u posljednja 24h
            </Typography>
        </RootStyle>
    );
}
