import { getAll, remove, get, save, rate } from './model.js';
import jsonXml from 'jsontoxml';


function getLinks(current, base) {

  const links = [
    { rel: 'base', href: base + '/' },
    { rel: 'sort-ascending', href: base + '/?sort=asc' },
    { rel: 'sort-descending', href: base + '/?sort=desc' },
  ];

  return links.map((link) => {
    if (current.length > 0 && link.rel.includes(current)) {
      link.rel = 'self';
    } else if (current.length === 0 && link.rel === 'base') {
      link.rel = 'self';
    }
    return link;
  });
}


export async function listAction(request, response) {
  try {
    const options = {
      userId: 1,
      sort: request.query.sort ? request.query.sort : '',
    };

    const movies = await getAll(options);
    const moviesResponse = {
      movies,
      links: getLinks(options.sort, request.baseUrl),
    };

    response.format({
      xml() {
        moviesResponse.movies = moviesResponse.movies.map((movie) => ({
          movie,
        }));
        response.send(jsonXml(moviesResponse));
      },
      json() { response.json(moviesResponse); },
      default() { response.json(moviesResponse); },
    });

  } catch (e) {
    console.error(e);
    response.status(500).send('Server side error');
  }
}


export async function detailAction(request, response) {
  try {
    const movie = await get(request.params.id, 1);
    if (!movie) {
      response.status(404).send("Not Found");
      return;
    }
    const moviesResponse = {
      movie,
      links: [{ rel: 'self', href: `${request.baseUrl}/${movie.id}` }],
    };

    response.json(moviesResponse);
  } catch (e) {
    response.status(500).send("Server side error");
  }
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

