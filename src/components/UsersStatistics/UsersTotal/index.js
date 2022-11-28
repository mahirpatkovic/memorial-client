import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
import { Person } from '@mui/icons-material';
// import { fShortenNumber } from '../../../utils/formatNumber';
import CountUp from 'react-countup';

const RootStyle = styled(Card)(({ theme }) => ({
    boxShadow: 'none',
    textAlign: 'center',
    padding: theme.spacing(5, 0),
    color: '#005249',
    backgroundColor: '#C8FACD',
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
    color: '#005249',
    backgroundImage: `linear-gradient(135deg, ${alpha(
        '#005249',
        0
    )} 0%, ${alpha('#005249', 0.24)} 100%)`,
}));

// ----------------------------------------------------------------------

export default function TotalUsersNumber(props) {
    return (
        <RootStyle>
            <IconWrapperStyle>
                <Person style={{ color: '#005249' }} />
            </IconWrapperStyle>
            <Typography variant='h3'>
                <CountUp end={props?.totalUsers} duration={2} />
            </Typography>
            <Typography
                variant='subtitle2'
                sx={{ opacity: 0.72, fontWeight: 'bold' }}
            >
                Broj korisnika
            </Typography>
        </RootStyle>
    );
}
