const CardBook = ({ title, description, cover, authors, id, setStatus }) => {
  return (
    <div className="card h-100  shadow-sm card-book">
      <img
        src={cover}
        className="card-img-top"
        alt="Portada"
        loading="lazy"
        style={{ height: 180, objectFit: 'cover' }}
      />
      <div className="card-body d-flex flex-column align-items-center text-center">
        <h6 className="card-title mb-1">{title}</h6>
        <div className="text-muted small">Autor: {authors}</div>
        <div className="mt-auto d-flex gap-2 justify-content-center">
          <a
            href={`/book/${id}`}
            className="btn btn-outline-primary btn-sm w-100"
          >
            Leer más
          </a>
          <div className="btn-group">
            <button
              className="btn btn-outline-warning btn-sm"
              onClick="setStatus('{{ id }}','favorite')"
              title="Favorito"
            >
              ⭐
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick="setStatus('{{ id }}','to_read')"
              title="Para leer"
            >
              📚
            </button>
            <button
              className="btn btn-outline-success btn-sm"
              onClick="setStatus('{{ id }}','read')"
              title="Leído"
            >
              {' '}
              ✔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardBook;
