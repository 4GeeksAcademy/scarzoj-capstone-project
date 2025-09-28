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
} from 'react-bootstrap';
import { FaSearch, FaStar, FaRegStar, FaUser } from 'react-icons/fa';

const Adondeir = () => {
  const places = [
    { id: 1, name: 'Lugar 1', favorite: true },
    { id: 2, name: 'Lugar 2', favorite: false },
    { id: 3, name: 'Lugar 3', favorite: false },
  ];

  return (
    <>
      {/* Header */}
      <Navbar bg="info" expand="lg" className="px-3">
        <Container fluid>
          <Navbar.Brand>PerriFans</Navbar.Brand>
          <Nav className="ms-auto align-items-center">
            <Button variant="outline-dark" className="me-2">
              Explore
            </Button>
            <Button variant="outline-dark">
              <FaUser />
            </Button>
          </Nav>
        </Container>
      </Navbar>

      {/* Search bar */}
      <Container fluid className="bg-light py-3">
        <InputGroup>
          <Form.Control
            placeholder="¿A dónde quieres ir?"
            aria-label="Buscar lugar"
          />
          <Button variant="primary">
            <FaSearch />
          </Button>
        </InputGroup>
      </Container>

      {/* Main content */}
      <Container fluid className="my-4">
        <Row>
          {/* Lista de lugares */}
          <Col md={4}>
            {places.map((place) => (
              <Card key={place.id} className="mb-3 shadow-sm">
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title>{place.name}</Card.Title>
                    <div
                      style={{
                        backgroundColor: '#c5e1a5',
                        height: '80px',
                        width: '150px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px',
                      }}
                    >
                      IMAGEN
                    </div>
                  </div>
                  <div>
                    {place.favorite ? (
                      <FaStar className="text-warning fs-4" />
                    ) : (
                      <FaRegStar className="text-secondary fs-4" />
                    )}
                  </div>
                </Card.Body>
              </Card>
            ))}
          </Col>

          {/* Mapa */}
          <Col md={8}>
            <iframe
              title="map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3036.2538838929426!2d-3.7037901846049244!3d40.416775979364975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd422887b1c8efbf%3A0x2b3e96a1e99b040!2sMadrid!5e0!3m2!1ses!2ses!4v1632428732400!5m2!1ses!2ses"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
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
