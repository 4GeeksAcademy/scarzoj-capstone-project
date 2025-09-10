import { getCurrentUser } from '../services/api/users';

export const Home = () => {
  getCurrentUser().then((data) => {
    console.log(data);
  });

  return (
    <main>
      <h1>Hola, este es tu card</h1>
    </main>
  );
};
