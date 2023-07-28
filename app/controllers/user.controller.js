import users from '../models/user.model.js';
import db from '../models/index.js';

const User = db.users;
const Bootcamp = db.bootcamps;

exports.createUser = (user) => {
  return User.create({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password,
  })
    .then((user) => {
      console.log(
        `>> Se ha creado el usuario: ${JSON.stringify(user, null, 4)}`
      );
      return user;
    })
    .catch((err) => {
      console.log(`>> Error al crear el usuario ${err}`);
    });
};

exports.findUserById = (userId) => {
  return User.findByPk(userId)
    .then((users) => {
      return users;
    })
    .catch((err) => {
      console.log(`>> Error mientras se encontraba los usuarios: ${err}`);
    });
};

exports.findUserByEmail = (email) => {
  return User.findOne({ where: { email } })
    .then((users) => {
      return users;
    })
    .catch((err) => {
      console.log(`>> Error mientras se encontraba los usuarios: ${err}`);
    });
};

exports.findAll = () => {
  return User.findAll({
    include: [
      {
        model: Bootcamp,
        as: 'bootcamps',
        attributes: ['id', 'title'],
        through: {
          attributes: [],
        },
      },
    ],
  }).then((users) => {
    return users;
  });
};

exports.updateUserById = (userId, fName, lName) => {
  return User.update(
    {
      firstName: fName,
      lastName: lName,
    },
    {
      where: {
        id: userId,
      },
    }
  )
    .then((user) => {
      console.log(
        `>> Se ha actualizado el usuario: ${JSON.stringify(
          { id: userId, firstName: fName, lastName: lName },
          null,
          4
        )}`
      );
      return { id: userId, firstName: fName, lastName: lName };
    })
    .catch((err) => {
      console.log(`>> Error mientras se actualizaba el usuario: ${err}`);
    });
};

exports.deleteUserById = (userId) => {
  return User.destroy({
    where: {
      id: userId,
    },
  })
    .then((user) => {
      console.log(
        `>> Se ha eliminado el usuario: ${JSON.stringify(user, null, 4)}`
      );
      return user;
    })
    .catch((err) => {
      console.log(`>> Error mientras se eliminaba el usuario: ${err}`);
    });
};
