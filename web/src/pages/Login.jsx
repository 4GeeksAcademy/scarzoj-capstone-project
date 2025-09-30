import { useContext, useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { UserContext } from '../context/User';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useContext(UserContext);

  return (
    <Container style={{ maxWidth: '400px', marginTop: '50px' }}>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button
          variant="primary"
          className="w-100"
          onClick={() => login(email, password)}
        >
          Submit
        </Button>
      </Form>
    </Container>
  );
};
