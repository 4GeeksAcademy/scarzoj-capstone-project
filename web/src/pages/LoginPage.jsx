import { useContext, useState } from 'react';
import { Box, Paper, TextField, Typography, Button } from '@mui/material';
import { UserContext } from '../context/User';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useContext(UserContext);

  const handleSubmit = () => {
    login(email, password);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
      <Paper sx={{ p: 3, width: 300 }}>
        <Typography variant="h6" gutterBottom>
          Login
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Paper>
    </Box>
  );
};
