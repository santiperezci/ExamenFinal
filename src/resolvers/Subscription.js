import { MongoClient, ObjectID } from "mongodb";
import { GraphQLServer } from "graphql-yoga";
import *as uuid from 'uuid';
import { PubSub } from "graphql-yoga";
import "babel-polyfill";



const Subscription = {
    tellAutor:{
      subscribe: async (parent, args, ctx, info) => {
          const {id} = args;
          const {pubsub} = ctx;   
          return pubsub.asyncIterator(id);
      }
  },


  tellEntradaAsunto:{
    subscribe: async (parent, args, ctx, info) => {
      const {asunto} = args;
      const {pubsub} = ctx;  
      return pubsub.asyncIterator(asunto);
  }
  },
}






export {Subscription as default}
