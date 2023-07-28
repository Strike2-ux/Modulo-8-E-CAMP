import db from '../models';
const { users, bootcamps } = db;
const Bootcamp = db.bootcamps;
const User = db.users;

// Crear y guardar un nuevo bootcamp
exports.createBootcamp = (bootcamp) => {
  return Bootcamp.create({
    title: bootcamp.title,
    cue: bootcamp.cue,
    description: bootcamp.description,
  })
    .then((bootcamp) => {
      console.log(
        `>> Creado el bootcamp: ${JSON.stringify(bootcamp, null, 4)}`
      );
      return bootcamp;
    })
    .catch((err) => {
      console.log(`>> Error al crear el bootcamp: ${err}`);
    });
};

// Agregar un Usuario al Bootcamp
exports.addUser = (bootcampId, userId) => {
  return Bootcamp.findByPk(bootcampId)
    .then((bootcamp) => {
      if (!bootcamp) {
        console.log('No se encontro el Bootcamp!');
        return { code: 404, message: 'No se encontró el Bootcamp' };
      }
      return User.findByPk(userId).then((user) => {
        if (!user) {
          console.log('Usuario no encontrado!');
          return { code: 404, message: 'No se encontró el usuario' };
        }
        bootcamp.addUser(user);
        console.log('***************************');
        console.log(
          ` Agregado el usuario id=${user.id} al bootcamp con id=${bootcamp.id}`
        );
        console.log('***************************');
        return { code: 201, result: bootcamp };
      });
    })
    .catch((err) => {
      console.log(
        '>> Error mientras se estaba agregando Usuario al Bootcamp',
        err
      );
    });
};

exports.findById = (Id) => {
  return Bootcamp.findByPk(Id, {
    include: [
      {
        model: User,
        as: 'users',
        attributes: ['id', 'firstName', 'lastName'],
        through: {
          attributes: [],
        },
      },
    ],
  })
    .then((bootcamp) => {
      if (!bootcamp) {
        console.log('No se encontro el Bootcamp!');
        return { code: 404, message: 'No se encontró el Bootcamp' };
      }
      return { code: 200, result: bootcamp };
    })
    .catch((err) => {
      console.log(`>> Error mientras se encontraba el bootcamp: ${err}`);
    });
};

exports.findAll = () => {
  return Bootcamp.findAll({})
    .then((bootcamps) => {
      return bootcamps;
    })
    .catch((err) => {
      console.log('>> Error Buscando los Bootcamps: ', err);
    });
};

export default {
  createUser,
  findUserById,
  findAll,
  updateUserById,
  deleteUserById,
};
