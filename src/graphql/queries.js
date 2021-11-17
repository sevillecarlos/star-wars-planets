import {gql} from '@apollo/client';

export const PLANETS_FILMS = gql`
  query GetPlanetFilms {
    allPlanets(first: 15) {
      edges {
        node {
          id
          name
          filmConnection {
            edges {
              node {
                id
                title
              }
            }
          }
        }
      }
    }
  }
`;
