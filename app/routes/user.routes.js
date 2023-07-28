const router = require('express').Router();
const User = require('../controllers/user.controller');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifySignUp = require('../middleware/verifySignUp');
const auth = require('../middleware/auth');
const TOKEN = require('../config/auth.config');

router.post('/api/signup', verifySignUp, (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!(firstName && lastName && email && password)) {
    return res.status(400).send('Todos los campos son requeridos');
  }

  bcrypt.hash(password, 10).then((encryptedPassword) => {
    User.createUser({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: encryptedPassword,
    }).then((user) => {
      const token = jwt.sign(
        {
          user_id: user._id,
          email,
        },
        TOKEN.TOKEN_KEY,
        {
          expiresIn: '30m',
        }
      );

      console.log('\nToken Generado: ' + token);

      return res.status(201).json(user);
    });
  });
});

router.post('/api/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send('Todos los datos son requeridos, email y password');
    }

    const user = await User.findUserByEmail(email);
    console.log(user);
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        {
          user_id: user._id,
          email,
        },
        TOKEN.TOKEN_KEY,
        {
          expiresIn: '30m',
        }
      );

      console.log('Usuario: ' + email + '\nToken: ' + token);

      return res.status(200).json(user);
    }
    return res.status(400).send('Credenciales invalidas');
  } catch (err) {
    console.log(err);
  }
});

router.get('/api/user/:id', auth, (req, res) => {
  const { id } = req.params;
  User.findUserById(id)
    .then((user) => {
      if (user) {
        return res.status(200).json({ user: user });
      } else {
        return res.status(404).send(`No se pueden leer los datos de ${id}`);
      }
    })
    .catch((err) => {
      return res.status(500).json({
        code: 500,
        message: `Error al obtener al usuario ID ${id}`,
      });
    });
});

router.get('/api/user/', auth, (req, res) => {
  User.findAll()
    .then((user) => {
      if (user) {
        return res.status(200).json({ user: user });
      } else {
        return res.status(404).send(`No se pueden leer los datos`);
      }
    })
    .catch((err) => {
      return res.status(500).json({
        code: 500,
        message: `Error al obtener a los usuarios`,
      });
    });
});

router.put('/api/user/:id', auth, (req, res) => {
  const id = req.params.id;
  const { firstName, lastName } = req.body;
  User.updateUserById(id, firstName, lastName)
    .then((user) => {
      if (user != 0) {
        return res.status(200).json({ user: user });
      } else {
        return res.status(404).send(`No se pueden leer los datos de ${id}`);
      }
    })
    .catch((err) => {
      return res.status(500).json({
        code: 500,
        message: `Error al obtener al usuario ID ${id}`,
      });
    });
});

router.delete('/api/user/:id', auth, (req, res) => {
  const id = req.params.id;
  User.deleteUserById(id)
    .then((user) => {
      if (user != 0) {
        return res.status(200).send(`Usuario ID ${id} eliminado`);
      } else {
        return res.status(404).send(`No se pueden leer los datos de ${id}`);
      }
    })
    .catch((err) => {
      return res.status(500).json({
        code: 500,
        message: `Error al obtener al usuario ID ${id}`,
      });
    });
});

module.exports = router;
