import { Items } from "../shared/collections";
import { NChanges } from "../shared/collections";
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

export function createBasicData() {
  const usr = {
    jero: {
      _id : "suta8bz7azTiZ3Xor",
      firstName: "Jero",
      lastName: "Test",
      createdAt: Date("2020-04-17T22:06:48.391Z"),
      "services.password": { // password is "jero"
        bcrypt: "$2b$10$Z3Pzl4vrKkvbwHXZtLL90eLuvA3whqA6Kjyig56DhhPjYgtCoBqVG"
      },
      emails: [
        {
          address: "jero@test.com",
          verified: false
        }
      ]
    },
    jose: {
      _id: "ZnBYaurWkfXrTx6Mm",
      firstName: "Jose",
      lastName: "Test",
      createdAt: Date("2020-04-17T22:07:16.636Z"),
      "services.password": { // password is "jose"
        bcrypt: "$2b$10$yWDUKQlhABRumd6rs.MjJ.56mEwOgsm0WXAP7ZLnpTth8P1Ms3opq"
      },
      emails: [
        {
          address: "jose@test.com",
          verified: false
        }
      ]
    },
    charlo: {
      _id: "oJMQe3eHZmqvrPS2B",
      firstName: "Charlo",
      lastName: "Test",
      createdAt: Date("2020-04-17T22:07:36.443Z"),
      "services.password": { // password is "charlo"
        bcrypt: "$2b$10$YqOjUBWJ0lZ4waYGMoo8XezDMMgpWbzCCNy0CW9UVW8LEg64sn4Ky"
      },
      emails: [
        {
          address: "charlo@test.com",
          verified: false
        }
      ]
    }
  }

  const nthng = {
    bici_electrica: {
      _id: "4xXiX6GLjK5vK4QYf",
      tags: ["bicicleta", "electrica", "enova", "usada"],
      shortDescription: "Bicicleta en perfecto estado",
      longDescription: "Frenos a disco y 36 cambios shimano",
      owner: usr.jero._id,
      pics: [ "https://bucket1.glanacion.com/anexos/fotos/90/2920990w740.jpg" ],
      private: false,
      likedBy: []
    },
    bici_plegable: {
      _id: "4xXiXAGLjK5vK4QYf",
      tags: ["bicicleta", "aurora", "plegable"],
      shortDescription: "Bicicleta plegable impecable",
      longDescription: "Casi nueva",
      owner: usr.jero._id,
      pics: [ "https://http2.mlstatic.com/bicicleta-plegable-aurora-folding-20-f20-local-palermo-alum-D_NQ_NP_815601-MLA28911412788_122018-F.jpg" ],
      private: false,
      likedBy: []
    },
    jarron: {
      _id: "NjwFDvHbcthTxu9sR",
      tags: ["jarron", "usado"],
      shortDescription: "Jarrón con girasoles",
      longDescription: "Mas de 100 años, tiene un arreglo",
      owner: usr.jero._id,
      pics: [ "https://http2.mlstatic.com/jarron-ceramica-girasoles-tipo-talavera-D_NQ_NP_928645-MLM29559760561_032019-F.jpg" ],
      private: false,
      likedBy: []
    },
    mesa: {
      _id: "BfCfWvxRwMXn2ADqB",
      tags: ["mesa", "madera", "nueva"],
      shortDescription: "Mesa de madera de paraiso",
      longDescription: "Acabado en laca poliuretánica, fabricacion nacional ",
      owner: usr.jose._id,
      pics: [ "https://d26lpennugtm8s.cloudfront.net/stores/099/040/products/mesa-nucha1-0dcf07456778b2981c15132748677920-640-0.jpg" ],
      private: false,
      likedBy: []
    },
    tomate: {
      _id: "ACEvGGwand6EcmxcH",
      tags: ["tomate", "organico"],
      shortDescription: "Tomates frescos de la huerta",
      longDescription: "Cultivados en húrlingham con abono natural, sin pesticidas",
      owner: usr.jose._id,
      pics: [ "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSlsQhOrZuBImzRqIl-Hk-a4l_aBuvcy03gFLlHuhGqkJjdYGak&usqp=CAU" ],
      private: false,
      likedBy: []
    },
    pinza: {
      _id: "pNnYqPFeunQArcc4C",
      tags: ["pinza", "bahco", "nueva"],
      shortDescription: "Pinza marca bahco",
      longDescription: "Pinza de acero de primera calidad",
      owner: usr.charlo._id,
      pics: [ "https://www.demaquinasyherramientas.com/wp-content/uploads/2017/03/pinza-universal-bahco.jpg",
              "https://http2.mlstatic.com/pinza-bahco-aislada-1000v-2628s-200-piano-25mm-espana-D_NQ_NP_974239-MLA31085941704_062019-F.jpg",
              "https://mla-s1-p.mlstatic.com/629668-MLA40078358763_122019-E.jpg",
              "https://http2.mlstatic.com/pinza-bahco-tipo-ford-2-posiciones-2970g-200-regulable-D_NQ_NP_937559-MLA31063584936_062019-F.jpg"
            ],
      private: false,
      likedBy: []
    },
    martillo: {
      _id: "TGM9Quij6GNtbynaz",
      tags: ["martillo", "nuevo"],
      shortDescription: "Martillo de primera calidad",
      longDescription: "Martillo de primera calidad",
      owner: usr.charlo._id,
      pics: [ "https://www.ferreteriajs.com/wp-content/uploads/2018/09/STAN0475.jpg" ],
      private: false,
      likedBy: [{ userId: usr.jero._id }, { userId: usr.jose._id }]
    }
  };
  nchng = {
    jeroJoseBiciXTomateYMesa: {
      _id: "thr9Quij6GNtbynaz",
      actions: [
        { user: usr.jose._id, action: 'take',
          nThing: nthng.bici_electrica._id, from: usr.jero._id
        },
        { user: usr.jero._id, action: 'take',
          nThing: nthng.mesa._id, from: usr.jose._id
        },
        { user: usr.jero._id, action: 'take',
          nThing: nthng.tomate._id, from: usr.jose._id
        }
      ]
    },
    jeroCharlo2BicisXPinza: {
      _id: "thr9fwefej6GNtbynaz",
      actions: [
        { user: usr.charlo._id, action: 'take',
          nThing: nthng.bici_electrica._id, from: usr.jero._id
        },
        { user: usr.charlo._id, action: 'take',
          nThing: nthng.bici_plegable._id, from: usr.jero._id
        },
        { user: usr.jero._id, action: 'take',
          nThing: nthng.pinza._id, from: usr.charlo._id
        }
      ]
    }
  }
  _.forEach(usr, (nchanger)=>{
    Meteor.users.upsert(nchanger._id, {$set: nchanger});
  });
  console.warn("test users created ");
  _.forEach(nthng, (nthing)=>{
    Items.upsert(nthing._id, nthing);
  });
  console.warn("test nthings created ");
  _.forEach(nchng, (nchange)=>{
    NChanges.upsert(nchange._id, nchange);
  });
  console.warn("test nchanges created ");

}
