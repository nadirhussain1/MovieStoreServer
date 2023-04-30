import { getAll, remove, get, save, rate } from './model.js';

export async function listAction(request, response) {
  const movies = await getAll(1);
  const moviesResponse = {
    movies,
    links: [{ rel: 'self', href: request.baseUrl + '/' }],
  };

  response.json(moviesResponse);
}


export async function detailAction(request, response) {
  const movie = await get(request.params.id,1);
  const moviesResponse = {
    movie,
    links: [{ rel: 'self', href: `${request.baseUrl}/${movie.id}` }], };

  response.json(moviesResponse);
}

export async function removeAction(request, response) {
  const id = parseInt(request.params.id, 10);
  await remove(id, request.user.id);
}

export async function formAction(request, response) {
  let movie = { id: '', title: '', year: '', public: '' };
  if (request.params.id) {
    movie = await get(parseInt(request.params.id, 10), request.user.id);
  }

}

export async function saveAction(request, response) {
  const movie = {
    id: request.body.id,
    title: request.body.title,
    year: request.body.year,
    public: request.body.public === '1' ? 1 : 0,
  };

  await save(movie), request.user.id;
}

export async function rateAction(request, response) {
  const rating = {
    movie: parseInt(request.params.movie, 10),
    user: request.user.id,
    rating: parseInt(request.params.rating, 10),
  };
  await rate(rating);

}

