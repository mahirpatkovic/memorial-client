import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
import { DocumentScanner } from '@mui/icons-material';
import CountUp from 'react-countup';

const RootStyle = styled(Card)(({ theme }) => ({
    boxShadow: 'none',
    textAlign: 'center',
    padding: theme.spacing(5, 0),
    color: '#7A4F01',
    backgroundColor: '#FFF7CD',
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
    color: '#7A4F01',
    backgroundImage: `linear-gradient(135deg, ${alpha(
        '#7A4F01',
        0
    )} 0%, ${alpha('#7A4F01', 0.24)} 100%)`,
}));

export default function TotalDocsNumber(props) {
    return (
        <RootStyle>
            <IconWrapperStyle>
                <DocumentScanner style={{ color: '#7A4F01' }} />
            </IconWrapperStyle>
            <Typography variant='h3'>
                <CountUp end={props?.totalDocs} duration={2} />
            </Typography>
            <Typography
                variant='subtitle2'
                sx={{ opacity: 0.72, fontWeight: 'bold' }}
            >
                Broj dokumenata
            </Typography>
        </RootStyle>
    );
}
