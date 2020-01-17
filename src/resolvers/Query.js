import { MongoClient, ObjectID } from "mongodb";
import { GraphQLServer } from "graphql-yoga";
import *as uuid from 'uuid';
import { PubSub } from "graphql-yoga";
import "babel-polyfill";



const Query = {
    getAutor:async (parent, args, ctx, info) => {  
      const { nombre } = args;
      const { persona } = ctx;
      const a = persona.a("pag");
      const monton = a.monton("autores");
      const usuario = await monton.findOne({nombre:nombre});
      if(usuario){ 
	return usuario
      }else{
       throw new Error( nombre + ' no existe o no se encuentra');
      }
    },

    getEntradas:async (parent, args, ctx, info) => { 
      const { nombre } = args;
      const { persona } = ctx;
      const a = persona.a("pag");
      const monton = a.monton("autores");
      const usuario = await monton.findOne({nombre:nombre});
      if(usuario){ 
        const monton = a.monton("entradas");
        const resultado = await monton.find({"idAutor": usuario._id}).toArray(); 
        return resultado;
      }else{
        throw new Error( nombre + ' no existe o no se encuentra');
      }
    },      
}




export {Query as default}
