import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { CardBook } from '../components/BooksCard';
import { searchBooks, setBookStatus } from '../services/api/booksApi';

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = (params.get('q') || '').trim();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!q) return;
    (async () => {
      try {
        setErr(null);
        setLoading(true);
        const data = await searchBooks(q, 20); // pega a /gbooks/volumes del backend
        setItems(data['items']);
      } catch (e) {
        setErr(e?.message || 'Error buscando libros');
      } finally {
        setLoading(false);
      }
    })();
  }, [q]);

  const handleSetStatus = async (id, status) => {
    try {
      await setBookStatus(id, status); // el backend hace lazy-import si hace falta
      // aquí podrías mostrar un snackbar “Actualizado”
    } catch (e) {
      setErr(e?.message || 'No se pudo actualizar el estado');
    }
  };

  if (!q)
    return (
      <Alert sx={{ m: 2 }} severity="info">
        Escribe algo en la búsqueda.
      </Alert>
    );

  return (
    <Box sx={{ p: 2 }}>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {err && (
        <Alert sx={{ mb: 2 }} severity="error">
          {String(err)}
        </Alert>
      )}

      <Grid container spacing={2}>
        {items.map((b) => (
          <Grid key={b.id} xs={12} sm={6} md={4} lg={3}>
            <CardBook
              id={b.id}
              title={b.volumeInfo.title}
              cover={b.volumeInfo.imageLinks.thumbnail}
              authors={b.volumeInfo.authors}
              setStatus={handleSetStatus}
            />
          </Grid>
        ))}
      </Grid>

      {!loading && items.length === 0 && !err && (
        <Alert sx={{ mt: 2 }} severity="info">
          Sin resultados para “{q}”.
        </Alert>
      )}
    </Box>
  );
}
