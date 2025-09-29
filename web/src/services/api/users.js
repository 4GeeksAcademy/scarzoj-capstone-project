import { baseUrl, fetchWrapper } from './config';

const favoritesEndpoint = `${baseUrl}favourites`;

export const getCurrentUser = async () => {
  return await fetchWrapper(`${baseUrl}me`, {
    credentials: 'include',
  }).then((data) => {
    return data;
  });
};

export const getCurrentProfile = async () => {
  return await fetchWrapper(`${baseUrl}profile`, {
    credentials: 'include',
  }).then((data) => {
    return data;
  });
};

export const editProfile = async (displayname, description, avatar) => {
  return await fetchWrapper(`${baseUrl}/profilepost`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({
      display_name: displayname,
      description: description,
      avatar: avatar,
    }),
  }).then((data) => {
    return data;
  });
};

export const getUserFavourites = async () => {
  return await fetchWrapper(favoritesEndpoint, {
    credentials: 'include',
  }).then((data) => {
    return data;
  });
};

export const postUserFavourite = async (externalId, name, type) => {
  return await fetchWrapper(favoritesEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      external_id: externalId,
      name: name,
      type: type,
    }),
  }).then((data) => {
    return data;
  });
};

export const deleteUserFavourite = async (favouriteId) => {
  return await fetchWrapper(favoritesEndpoint, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      id: favouriteId,
    }),
  }).then((data) => {
    return data;
  });
};
