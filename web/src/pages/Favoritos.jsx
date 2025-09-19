import { useEfect, useState } from 'react';

const Favoritos = () => {
  const [favorito, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEfect(() => {
    fetch('https://api.midominio.com/favoritos') //alli ira endpoint verdadero
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error al obtener favoritos');
        }
        return res.json;
      })
      .then((data) => {
        setFavoritos(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []); //se ejecuta una sola vez al montar el componente
  if (loading) return <p>Cargando favoritos ...</p>;

  return (
    <div>
      <h1>Mis Favoritos</h1>;
      <ul>
        {Favoritos.map((libro) => (
          <li key={libro.id}> {libro.titulo}</li>
        ))}
      </ul>
    </div>
  );
};

export default Favoritos;
