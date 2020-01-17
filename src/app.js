import { MongoClient } from "mongodb";
import { GraphQLServer ,PubSub} from "graphql-yoga";
import Mutation from './resolvers/Mutation'
import Subscription from './resolvers/Subscription'
import Autores from './resolvers/Autores'
import Entradas from './resolvers/Entradas'
import Query from './resolvers/Query'
import "babel-polyfill";



const usr = "sperezcirerap";
const pwd = "spc99";
const url = "cluster0-f5jg6.gcp.mongodb.net/test?retryWrites=true&w=majority";






const connectToDb = async function(usr, pwd, url) {
  const uri = `mongodb+srv://${usr}:${pwd}@${url}`;
  
  const persona = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  await persona.connect();
  return persona;
};





const runGraphQLServer = function(context) {
  const resolvers = {
    Query,
    Mutation,
    Autores,
    Entradas,
    Subscription
  };




  const server = new GraphQLServer({ 
    typeDefs : './src/schema.graphql',
    resolvers, 
    context
  });



  const options = {
    port: 3000
  };




  try {
    server.start(options, ({ port }) =>
      console.log(
        `Servidor iniciado, escuchando  ${port} .`
      )
    );
  } catch (e) {
    console.info(e);
    server.close();
  }
};



const runApp = async function() {
  const persona = await connectToDb(usr, pwd, url);
  try {
    const pubsub = new PubSub();
    runGraphQLServer({ persona,pubsub });
  } catch (e) {
    console.log(e);
    persona.close();
  }
};


runApp();
