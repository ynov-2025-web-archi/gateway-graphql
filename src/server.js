import { ApolloServer } from '@apollo/server';
import fetch from 'node-fetch';
import { startStandaloneServer } from '@apollo/server/standalone';

// The GraphQL schema
const typeDefs = `#graphql
  type Product {
    id: ID!
    name: String!
    description: String
    price: Float!
    imageUrl: String
    category: String
  }
    type Query {
        getProducts: [Product!]!
    }
`;

// A map of functions which return data for the schema.
const resolvers = {
    Query: {
        getProducts: async () => {
            // communcation avec l'API de produits
            try {
                const response = await fetch(`${process.env.PRODUCTS_SERVICE_URL}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                console.log('Fetching products from API...');
                const products = await response.json();
                console.log(products);
                return products
            }
            catch (error) {
                console.error('Error fetching products:', error);
                throw new Error('Failed to fetch products');
            }
        },
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const { url } = await startStandaloneServer(server);
console.log(`🚀 Server ready at ${url}`);