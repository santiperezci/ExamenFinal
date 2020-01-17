import { MongoClient, ObjectID } from "mongodb";
import { GraphQLServer } from "graphql-yoga";
import *as uuid from 'uuid';
import { PubSub } from "graphql-yoga";
import "babel-polyfill";



const Mutation = {
    addAutor:async (parent, args, ctx, info) => {  
      const { nombre,contrasena } = args;
      const { persona } = ctx;
      const a = persona.a("pag");
      const monton = a.monton("autores");
      const usuario = await monton.findOne({nombre:nombre});
      if(!usuario){
        const token = uuid.v4();
        const resultado = await monton.insertOne({nombre,contrasena,token});

        return {
          nombre,            
          contrasena,
          token,
          _id:result.ops[0]._id
        };
      }
    },



    addEntrada:async (parent, args, ctx, info) => {   
      const { nombre,token,date,asunto,message } = args;
      const { persona,pubsub } = ctx;
      const a = persona.a("pag");
      const monton = a.monton("autores");
      const usuario = await monton.findOne({nombre:nombre,token:token});

      if(usuario){
        const monton = a.monton("entradas");
        const idAutor = usuario._id;
        const resultado = await monton.insertOne({idAutor,date,asunto,message});
        pubsub.publish(
          idAutor,
          {
            tellAutor: {
              idAutor,            
              date,
              asunto,
              message,
              _id:resultado.ops[0]._id
            }
          }
        );

        pubsub.publish(
          asunto,
          {
            tellPublicationAsunto: {
              idAutor,            
              date,
              asunto,
              message,
              _id:resultado.ops[0]._id
            }
          }
        );

        return {
          idAutor,            
          date,
          asunto,
          message,
          _id:resultado.ops[0]._id
        };

      }else{
        throw new Error('No existe o no se encuentra el usuario');
      }
    },

    login:async (parent, args, ctx, info) => {  
      const { nombre,contrasena } = args;
      const { persona } = ctx;
      const a = persona.a("pag");
      const monton = a.monton("autores");
      let usuario = await monton.findOne({nombre:nombre,contrasena:contrasena});
      if(usuario){
        await monton.updateOne({"nombre": nombre }, { $set: { "token": uuid.v4() }});
        usuario = await monton.findOne({nombre:nombre,contrasena:contrasena});
        return usuario;
      }else{
        throw new Error('No existe o no se encuentra el usuario');
      }
    },

    logout:async (parent, args, ctx, info) => {  
      const { nombre,token} = args;
      const { persona } = ctx;
      const a = persona.a("pag");
      const monton = a.monton("autores");

          time = new moment();
          clearTimeout(timer);
          timer = setTimeout("Logout()", 1800000);

      let usuario = await monton.findOne({nombre:nombre,token:token});
      if(usuario){
        await monton.updateOne({"nombre": nombre }, { $set: { "token": null}});
        usuario = await monton.findOne({nombre:nombre});
        return usuario;

      }else{
        throw new Error('No existe o no se encuentra el usuario');
      }
    },

    removeAutor:async (parent, args, ctx, info) => {  
      const { nombre,token } = args;
      const { persona } = ctx;
      const a = persona.a("pag");
      let monton = a.monton("autores");
      const usuario = await monton.findOne({nombre:nombre,token:token});
      if(usuario){
        const id = usuario._id;
        await monton.deleteOne({nombre:{$eq:nombre}}); 
        monton = a.monton("entradas");
        await monton.remove({idAutor:{$eq:id}},false);
        return usuario.name + " eliminado";
      }else{
        throw new Error('No existe o no se encuentra el usuario');
      }
    },

    removeEntrada:async (parent, args, ctx, info) => {  
      const { nombre,token,id} = args;
      const { persona } = ctx;
      const a = client.a("pag");
      let monton = a.monton("autores");
      const usuario = await monton.findOne({nombre:nombre,token:token});
      if(usuario){
        let monton = a.monton("entradas");
        await monton.deleteOne({_id:{$eq:ObjectID(id)}});
        return "factura eliminada";
      }else{
        throw new Error('No existe o no se encuentra el usuario');
      }
    },
}




export {Mutation as default}
