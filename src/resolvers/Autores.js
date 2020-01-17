import { MongoClient, ObjectID } from "mongodb";
import { GraphQLServer } from "graphql-yoga";
import *as uuid from 'uuid';
import { PubSub } from "graphql-yoga";
import "babel-polyfill";



const Autores = {
    entradas:async (parent, args, ctx, info)=>{
      const nombre= parent.nombre;
      const { persona } = ctx;
      const a = persona.a("pag");
      const monton = a.monton("autores");
      const existe = await monton.findOne({nombre:nombre});
      if(existe){
        const monton = a.monton("entradas");
        const resultado = await monton.find({"idAutor": existe._id}).toArray(); 
        if(resultado) return resultado;
      }
    },
}



export {Autores as default}
