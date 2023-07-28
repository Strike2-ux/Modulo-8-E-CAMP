const router = require('express').Router();
const db = require('../models');
const Bootcamp = require('../controllers/bootcamp.controller');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifySignUp = require('../middleware/verifySignUp');
const auth = require('../middleware/auth');
const TOKEN = require('../config/auth.config');

router.post('/', auth, (req, res) => {
  const { title, cue, description } = req.body;
  if (!(title && cue && description)) {
    return res.status(400).send('Todos los campos son requeridos');
  }
  Bootcamp.createBootcamp({
    title,
    cue,
    description,
  }).then((bootcamp) => {
    return res.status(201).json(bootcamp);
  });
});

router.post('/addUser', auth, (req, res) => {
  const { bootcampId, userId } = req.body;
  if (!(bootcampId && userId)) {
    return res.status(400).send('Todos los campos son requeridos');
  }
  Bootcamp.addUser(bootcampId, userId).then((result) => {
    return res.status(result.code).json(result);
  });
});

router.get('/:id', auth, (req, res) => {
  const id = req.params.id;
  Bootcamp.findById(id).then((result) => {
    return res.status(result.code).json(result);
  });
});

router.get('/', (req, res) => {
  Bootcamp.findAll().then((result) => {
    return res.status(200).json(result);
  });
});

module.exports = router;
