import { Items } from "../api/items.js";
import { Meteor } from 'meteor/meteor';

export function createBasicData() {
  const test_n_changers = [
    {
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
    {
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
    {
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
  ]

  const test_n_things = [
    {
      _id: "4xXiX6GLjK5vK4QYf",
      tags: ["bicicleta", "electrica", "enova", "usada"],
      shortDescription: "Bicicleta en perfecto estado",
      longDescription: "Frenos a disco y 36 cambios shimano",
      owner: "suta8bz7azTiZ3Xor", //jero
      pics: [ "https://bucket1.glanacion.com/anexos/fotos/90/2920990w740.jpg" ],
      private: false
    },
    {
      _id: "4xXiXAGLjK5vK4QYf",
      tags: ["bicicleta", "aurora", "plegable"],
      shortDescription: "Bicicleta plegable impecable",
      longDescription: "Casi nueva",
      owner: "suta8bz7azTiZ3Xor", //jero
      pics: [ "https://http2.mlstatic.com/bicicleta-plegable-aurora-folding-20-f20-local-palermo-alum-D_NQ_NP_815601-MLA28911412788_122018-F.jpg" ],
      private: false
    },
    {
      _id: "NjwFDvHbcthTxu9sR",
      tags: ["jarron", "chino", "usado"],
      shortDescription: "Jarrón colorido",
      longDescription: "Mas de 100 años, tiene un arreglo",
      owner: "suta8bz7azTiZ3Xor", // jero
      pics: [ "https://upload.wikimedia.org/wikipedia/commons/b/b8/Chinese_vase.jpg" ],
      private: false
    },
    {
      _id: "BfCfWvxRwMXn2ADqB",
      tags: ["mesa", "madera", "nueva"],
      shortDescription: "Mesa de madera de paraiso",
      longDescription: "Acabado en laca poliuretánica, fabricacion nacional ",
      owner: "ZnBYaurWkfXrTx6Mm", // jose
      pics: [ "https://d26lpennugtm8s.cloudfront.net/stores/099/040/products/mesa-nucha1-0dcf07456778b2981c15132748677920-640-0.jpg" ],
      private: false
    },
    {
      _id: "ACEvGGwand6EcmxcH",
      tags: ["tomate", "organico"],
      shortDescription: "Tomates frescos de la huerta",
      longDescription: "Cultivados en húrlingham con abono natural, sin pesticidas",
      owner: "ZnBYaurWkfXrTx6Mm", // jose
      pics: [ "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSlsQhOrZuBImzRqIl-Hk-a4l_aBuvcy03gFLlHuhGqkJjdYGak&usqp=CAU" ],
      private: false
    },
    {
      _id: "pNnYqPFeunQArcc4C",
      tags: ["herramienta", "pinza", "bosch", "nueva"],
      shortDescription: "Pinza marca bosch",
      longDescription: "Pinza de acero de primera calidad",
      owner: "oJMQe3eHZmqvrPS2B", // charlo
      pics: [ "https://www.martinezescalada.com.ar/566/pinza-universal-6.jpg" ],
      private: false
    },
    {
      _id: "TGM9Quij6GNtbynaz",
      tags: ["herramienta", "martillo", "nuevo"],
      shortDescription: "Martillo de primera calidad",
      longDescription: "Martillo de primera calidad",
      owner: "oJMQe3eHZmqvrPS2B", // charlo
      pics: [ "https://www.ferreteriajs.com/wp-content/uploads/2018/09/STAN0475.jpg" ],
      private: false
    }
  ];
  test_n_changers.map((n_changer)=>{
    Meteor.users.upsert(n_changer._id, {$set: n_changer});
  });
  console.warn("test users created ");
  test_n_things.map((item)=>{
    Items.upsert(item._id, item);
  });
  console.warn("test items created ");
}
