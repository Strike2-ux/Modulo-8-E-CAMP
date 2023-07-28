import express from 'express';
import cors from 'cors';
import userController from '../controllers/user.controller';
import { verifySignUp, auth } from '../middleware/auth.middleware';

const router = express.Router();

const rutaUser = require('../routes/user.routes');
const rutaBootcamp = require('../routes/bootcamp.routes');
const auth = require('./auth');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', rutaUser);

app.use('/api/bootcamp', rutaBootcamp);

app.get('/', auth, (req, res) => {
  res
    .status(200)
    .send(
      'Bienvenido, se ha validado correctamente esta ruta /inicio con el Token JWT 🙌'
    );
});

app.all('*', (req, res) => {
  res.status(404).send('Ruta desconocida.');
});
module.exports = app;
