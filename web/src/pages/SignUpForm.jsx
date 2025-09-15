import { useContext } from 'react';
import { UserContext } from '../context/User';
import { Box, Paper, TextField, Typography, Button } from '@mui/material';

const SignUpForm = () => {
  const { register } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const { name, email, password } = data;

    register(name, email, password);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
      <Paper sx={{ p: 3, width: 300 }}>
        <Typography variant="h6" gutterBottom>
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth margin="normal" label="Name" name="name" />
          <TextField fullWidth margin="normal" label="Email" name="email" />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            name="password"
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 2, backgroundColor: '#646262ff' }}
          >
            Register
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default SignUpForm;
