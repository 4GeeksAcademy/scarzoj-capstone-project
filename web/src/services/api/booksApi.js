import { baseUrl, fetchWrapper } from './config';

const BASE = import.meta.env?.VITE_API_BASE || 'http://127.0.0.1:5000';

function getUserId() {
  return localStorage.getItem('userId') || '1';
}

const fixCover = (u) => (u ? u.replace(/^http:/, 'https:') : undefined);

export function mapVolumeToCard(v) {
  const vi = v?.volumeInfo || {};
  const links = vi.imageLinks || {};
  return {
    id: v.id,
    title: vi.title || 'Título desconocido',
    cover: fixCover(links.thumbnail || links.smallThumbnail),
    authors: vi.authors || [],
  };
}
/*
export async function searchBooks(q, startIndex = 0, maxResults = 20) {
  const url = new URL("/gbooks/volumes", BASE);
  url.searchParams.set("q", q);
  url.searchParams.set("startIndex", String(startIndex)); // paginación
  url.searchParams.set("maxResults", String(maxResults)); // Google permite hasta 40
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`GoogleBooks proxy ${res.status}`);
  const json = await res.json();
  return (json.items || []).map(mapVolumeToCard);
}
*/

export async function searchBooks(q, maxResults = 20) {
  return await fetchWrapper(
    `${baseUrl}gbooks/search?q=${q}&maxResults=${maxResults}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  ).then((data) => {
    return data;
  });
}

export async function setBookStatus(volumeId, status) {
  const path =
    status === 'favorite'
      ? '/favorite/book/'
      : status === 'to_read'
        ? '/to_read/book/'
        : '/read/book/';
  const res = await fetch(`${BASE}${path}${volumeId}`, {
    method: 'POST',
    headers: { 'X-User-Id': getUserId(), 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`setBookStatus ${status} -> ${res.status}`);
  return res.json();
}

export async function unsetBookStatus(volumeId, status) {
  const path =
    status === 'favorite'
      ? '/favorite/book/'
      : status === 'to_read'
        ? '/to_read/book/'
        : '/read/book/';
  const res = await fetch(`${BASE}${path}${volumeId}`, {
    method: 'DELETE',
    headers: { 'X-User-Id': getUserId() },
  });
  if (!res.ok) throw new Error(`unsetBookStatus ${status} -> ${res.status}`);
  return res.json();
}
