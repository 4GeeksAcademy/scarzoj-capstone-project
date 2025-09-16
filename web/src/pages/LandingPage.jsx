import { Box, Typography } from '@mui/material';
import InkFindersBackground from '../assets/InkFindersBackground.jpg';
import InkFindersLogo from '../assets/InkFindersLogo.png';

const LandingPage = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        component="img"
        src={InkFindersBackground}
        alt="Background"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
        }}
      />
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Box
          component="img"
          src={InkFindersLogo}
          alt="Logo"
          sx={{ width: 150, height: 150, mb: 2 }}
        />
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 'bold',
            color: 'white',
            textShadow: '2px 2px 8px rgba(0,0,0,0.6)',
          }}
        >
          InkFinders
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          sx={{ fontWeight: 'bold', color: 'white' }}
        >
          Look for your favorite books
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;
