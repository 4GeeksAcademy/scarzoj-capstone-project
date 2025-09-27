import { useContext, useState } from 'react';
import { Box, Paper, TextField, Typography, Button } from '@mui/material';
import { UserContext } from '../context/User';
import SignUpForm from './SignUpForm';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirectSignUp, setRedirectSignUp] = useState(false);

  const { login } = useContext(UserContext);

  const handleSubmit = () => {
    login(email, password);
  };

  if (redirectSignUp) {
    return <SignUpForm onBack={() => setRedirectSignUp(false)} />;
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
      <Paper sx={{ p: 3, width: 300 }}>
        <Typography variant="h6" gutterBottom align="center">
          Inicia sesión
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleSubmit}
        >
          Enviar
        </Button>
        <Button
          fullWidth
          variant="outlined"
          sx={{ mt: 1 }}
          onClick={() => setRedirectSignUp(true)}
        >
          ¿No estás registrado? Regístrate
        </Button>
      </Paper>
    </Box>
  );
};
