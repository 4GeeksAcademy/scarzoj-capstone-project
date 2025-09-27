export const Footer = () => {
  return (
    <footer
      className="bg-dark text-white py-5 mt-auto"
      style={{ backgroundColor: '#1a1a1a' }}
    >
      <div className="container">
        <div className="row align-items-center mb-4">
          <div className="col-md-6">
            <div className="d-flex align-items-center mb-3 mb-md-0">
              <img
                src="/astro.jpg"
                alt="Círculo Lectores Logo"
                className="me-3"
                style={{ width: '50px', height: '50px', objectFit: 'contain' }}
              />
              <h3 className="mb-0 text-white fw-bold">Círculo Lectores</h3>
            </div>
          </div>

          <div className="col-md-6">
            <div className="d-flex justify-content-md-end gap-3">
              <a
                href="#"
                className="text-light hover-text-warning text-decoration-none"
              >
                <i className="fa-brands fa-instagram fa-xl"></i>
              </a>
              <a
                href="#"
                className="text-light hover-text-warning text-decoration-none"
              >
                <i className="fa-brands fa-facebook fa-xl"></i>
              </a>
              <a
                href="#"
                className="text-light hover-text-warning text-decoration-none"
              >
                <i className="fa-brands fa-x-twitter fa-xl"></i>
              </a>
              <a
                href="#"
                className="text-light hover-text-warning text-decoration-none"
              >
                <i className="fa-brands fa-linkedin fa-xl"></i>
              </a>
            </div>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="row">
          <div className="col-12">
            <div className="d-flex flex-wrap justify-content-center gap-4 mb-4">
              <a
                href="#"
                className="text-light text-decoration-none hover-text-warning"
              >
                Explorar libros
              </a>
              <a
                href="#"
                className="text-light text-decoration-none hover-text-warning"
              >
                Unirse a la comunidad
              </a>
              <a
                href="#"
                className="text-light text-decoration-none hover-text-warning"
              >
                Preguntas frecuentes
              </a>
              <a
                href="#"
                className="text-light text-decoration-none hover-text-warning"
              >
                Términos y condiciones
              </a>
              <a
                href="#"
                className="text-light text-decoration-none hover-text-warning"
              >
                Política de privacidad
              </a>
              <a
                href="#"
                className="text-light text-decoration-none hover-text-warning"
              >
                Contacto
              </a>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12 text-center">
            <p className="text-light mb-0">
              Copyright © 2025 Círculo Lectores · Todos los derechos reservados
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-text-warning:hover {
          color: #ffc107 !important;
          transition: color 0.3s ease;
        }
      `}</style>
    </footer>
  );
};
