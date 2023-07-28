import db from '../models';

const User = db.users;

const checkDuplicateEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
      return res.status(400).send('El correo electrónico ya está registrado.');
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export default checkDuplicateEmail;
