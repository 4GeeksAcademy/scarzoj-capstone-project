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
} from 'react-bootstrap';
import { FaSearch, FaStar, FaRegStar, FaUser } from 'react-icons/fa';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const Adondeir = () => {
  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState([]); // lugares buscados
  const [favorites, setFavorites] = useState([]); // array de lugares favoritos
  const [loading, setLoading] = useState(false);

  const mapRef = useRef(null);

  const defaultCenter = { lat: 40.416775, lng: -3.70379 }; // Madrid

  // Buscar lugares con Google Places API
  const handleSearch = () => {
    if (!query) return;
    setLoading(true);

    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );

    const request = {
      query,
      fields: ['name', 'geometry', 'photos', 'place_id'],
      locationBias: defaultCenter,
      radius: 5000,
    };

    service.textSearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const mapped = results.map((place) => ({
          id: place.place_id,
          name: place.name,
          location: place.geometry?.location,
          photo:
            place.photos && place.photos.length > 0
              ? place.photos[0].getUrl({ maxWidth: 200 })
              : null,
        }));
        setPlaces(mapped);
      }
      setLoading(false);
    });
  };

  // Alternar favorito
  const toggleFavorite = (place) => {
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
          <Nav className="ms-auto align-items-center">
            <Button variant="outline-dark">
              <FaUser />
            </Button>
          </Nav>
        </Container>
      </Navbar>

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
          {/* Lista de lugares */}
          <Col md={4}>
            {places.map((place) => (
              <Card
                key={place.id}
                className="mb-3 shadow-sm"
                style={{ cursor: 'pointer' }}
                onClick={() => goToPlace(place.location)}
              >
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title style={{ marginBottom: 8 }}>
                      {place.name}
                    </Card.Title>
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

          {/* Mapa */}
          <Col md={8} style={{ position: 'relative' }}>
            {/* Panel flotante de favoritos */}
            {favorites.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  zIndex: 1000,
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  padding: '10px',
                  borderRadius: '8px',
                  boxShadow: '0 0 5px rgba(0,0,0,0.3)',
                  maxHeight: '250px',
                  overflowY: 'auto',
                  width: '220px',
                }}
              >
                <h6>Favoritos ⭐</h6>
                {favorites.map((fav) => (
                  <div
                    key={fav.id}
                    style={{
                      cursor: 'pointer',
                      marginBottom: '6px',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                    onClick={() => goToPlace(fav.location)}
                  >
                    {fav.photo && (
                      <img
                        src={fav.photo}
                        alt={fav.name}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '4px',
                          objectFit: 'cover',
                        }}
                      />
                    )}
                    <span>{fav.name}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ height: '450px', width: '100%' }}>
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

      {/* Footer */}
      <footer className="bg-info text-center py-3">
        <Container>PerriFans 🐾🐾</Container>
      </footer>
    </>
  );
};

export default Adondeir;
