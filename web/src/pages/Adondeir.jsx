import { useState, useRef } from 'react';
import {
  Navbar,
  Nav,
  Container,
  Button,
  Row,
  Col,
  Card,
  Form,
  InputGroup,
  Spinner,
  Offcanvas,
  Alert,
} from 'react-bootstrap';
import { FaSearch, FaStar, FaRegStar, FaUser, FaHeart } from 'react-icons/fa';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const Adondeir = () => {
  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [alert, setAlert] = useState(null);

  const mapRef = useRef(null);

  // Simulación de sesión (puedes reemplazar por tu lógica real)
  const isLoggedIn = true; // 👈 Cambia a false para probar

  const defaultCenter = { lat: 40.416775, lng: -3.70379 }; // Madrid

  // Buscar lugares
  const handleSearch = () => {
    if (!query) return;
    setLoading(true);

    if (!mapRef.current) {
      console.error('Mapa aún no está listo');
      setLoading(false);
      return;
    }

    const service = new window.google.maps.places.PlacesService(mapRef.current);

    const request = {
      query,
      location: defaultCenter,
      radius: 5000,
    };

    service.textSearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const mapped = results.map((place) => ({
          id: place.place_id,
          name: place.name,
          address: place.formatted_address,
          location: place.geometry?.location,
          photo:
            place.photos && place.photos.length > 0
              ? place.photos[0].getUrl({ maxWidth: 200 })
              : null,
        }));
        setPlaces(mapped);
      } else {
        setPlaces([]);
      }
      setLoading(false);
    });
  };

  // Alternar favoritos
  const toggleFavorite = (place) => {
    if (!isLoggedIn) {
      setAlert('Debes iniciar sesión para guardar favoritos.');
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    setFavorites((prev) => {
      if (prev.find((f) => f.id === place.id)) {
        return prev.filter((f) => f.id !== place.id);
      } else {
        return [...prev, place];
      }
    });
  };

  // Centrar mapa en lugar
  const goToPlace = (location) => {
    if (mapRef.current && location) {
      mapRef.current.panTo(location);
      mapRef.current.setZoom(15);
    }
  };

  return (
    <>
      {/* Header */}
      <Navbar bg="info" expand="lg" className="px-3">
        <Container fluid>
          <Navbar.Brand>PerriFans</Navbar.Brand>
          <Nav className="ms-auto align-items-center gap-2">
            {isLoggedIn && (
              <Button
                variant="outline-dark"
                onClick={() => setShowFavorites(true)}
              >
                <FaHeart /> Favoritos
              </Button>
            )}
            <Button variant="outline-dark">
              <FaUser />
            </Button>
          </Nav>
        </Container>
      </Navbar>

      {/* Alerta */}
      {alert && (
        <Alert variant="warning" className="m-3 text-center">
          {alert}
        </Alert>
      )}

      {/* Barra de búsqueda */}
      <Container fluid className="bg-light py-3">
        <InputGroup>
          <Form.Control
            placeholder="¿A dónde quieres ir?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button variant="primary" onClick={handleSearch} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : <FaSearch />}
          </Button>
        </InputGroup>
      </Container>

      {/* Contenido principal */}
      <Container fluid className="my-4">
        <Row>
          {/* Columna izquierda: resultados */}
          <Col md={4} style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <h5>Resultados</h5>
            {places.map((place) => (
              <Card
                key={place.id}
                className="mb-3 shadow-sm"
                style={{ cursor: 'pointer' }}
                onClick={() => goToPlace(place.location)}
              >
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title style={{ marginBottom: 4 }}>
                      {place.name}
                    </Card.Title>
                    <small className="text-muted">{place.address}</small>
                    <div
                      style={{
                        backgroundColor: '#c5e1a5',
                        height: '80px',
                        width: '150px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        marginTop: '6px',
                      }}
                    >
                      {place.photo ? (
                        <img
                          src={place.photo}
                          alt={place.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        'Sin imagen'
                      )}
                    </div>
                  </div>
                  <div>
                    <Button
                      variant="link"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(place);
                      }}
                    >
                      {favorites.find((f) => f.id === place.id) ? (
                        <FaStar className="text-warning fs-4" />
                      ) : (
                        <FaRegStar className="text-secondary fs-4" />
                      )}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
            {places.length === 0 && (
              <p className="text-muted mt-3">
                Busca un lugar para ver resultados
              </p>
            )}
          </Col>

          {/* Columna derecha: mapa */}
          <Col md={8}>
            <div style={{ height: '600px', width: '100%' }}>
              <LoadScript
                googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                libraries={['places']}
              >
                <GoogleMap
                  center={defaultCenter}
                  zoom={13}
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  onLoad={(map) => (mapRef.current = map)}
                >
                  {places.map((place) => (
                    <Marker
                      key={place.id}
                      position={{
                        lat: place.location?.lat(),
                        lng: place.location?.lng(),
                      }}
                    />
                  ))}
                </GoogleMap>
              </LoadScript>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Modal lateral de Favoritos */}
      <Offcanvas
        show={showFavorites}
        onHide={() => setShowFavorites(false)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Mis Favoritos</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {favorites.length > 0 ? (
            favorites.map((fav) => (
              <Card
                key={fav.id}
                className="mb-2"
                style={{ cursor: 'pointer' }}
                onClick={() => goToPlace(fav.location)}
              >
                <Card.Body className="d-flex align-items-center gap-2">
                  {fav.photo && (
                    <img
                      src={fav.photo}
                      alt={fav.name}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: '4px',
                        objectFit: 'cover',
                      }}
                    />
                  )}
                  <span>{fav.name}</span>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p className="text-muted">No tienes favoritos guardados.</p>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      {/* Footer */}
      <footer className="bg-info text-center py-3">
        <Container>PerriFans 🐾🐾</Container>
      </footer>
    </>
  );
};

export default Adondeir;
