import { MongoClient, ObjectID } from "mongodb";
import { GraphQLServer } from "graphql-yoga";
import *as uuid from 'uuid';
import { PubSub } from "graphql-yoga";
import "babel-polyfill";



const Entradas = {
    autor:async (parent, args, ctx, info)=>{   
      const id= parent.idAutor;
      const { persona } = ctx;
      const a = persona.a("pag");
      const monton = a.monton("autores");
      const resultado = await monton.findOne({ _id: ObjectID(id) });
      return resultado;
    },
}




export {Entradas as default}
