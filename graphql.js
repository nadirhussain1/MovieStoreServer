import { buildSchema } from 'graphql';
import expressGraphql from 'express-graphql';
import { getAll, save ,remove} from './movie/model.js';

const schema = buildSchema(`
  type Movie {
    id: Int! 
    title: String! 
    year: Int 
    public: Int 
    user: Int
  }

  input MovieInput { 
    id: Int
    title: String! 
    year: Int 
    public: Int 
    user: Int
  }

  type Query {
    greet: String
    movie(id:Int): [Movie]
  }

  type Mutation {
    createMovie(movie: MovieInput): Movie
    updateMovie(movie: MovieInput): Movie
    deleteMovie(id: Int!): Boolean
  }


`);

const rootValue = {

  greet() {
    return 'Hello GraphQL';
  },

  async movie({ id }) {
    const movies = await getAll({ userId: 1 });
    if (id) {
      return movies.filter((movie) => movie.id === id);
    }
    return movies;
  },

  createMovie({ movie }) { 
    return save(movie, 1); 
  },

  async updateMovie({ movie }) {
    await save(movie, 1);
    return movie;
  },

  async deleteMovie({ id }) {
    await remove(id, 1);
    return true;
  },
};

export default expressGraphql.graphqlHTTP({
  schema,
  rootValue,
  graphiql: true,
});
