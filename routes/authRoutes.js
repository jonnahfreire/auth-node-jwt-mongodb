const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

router.post("/register", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name) {
    return res.status(422).json({ message: "O nome é obrigatório!" });
  }

  if (!email) {
    return res.status(422).json({ message: "O email é obrigatório!" });
  }

  if (!password) {
    return res.status(422).json({ message: "A senha é obrigatório!" });
  }

  if (password !== confirmPassword) {
    return res.status(422).json({ message: "As senhas não conferem!" });
  }

  const userExists = await User.findOne({ email: email });
  if (userExists) {
    return res.status(422).json({ message: "Este email já está em uso!" });
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    email,
    password: passwordHash,
  });

  try {
    await user.save();
    return res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (error) {
    res.status(500).json({
      message: "Desculpe! Aconteceu um erro no servidor. Tente mais tarde!",
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(422).json({ message: "O email é obrigatório!" });
  }

  if (!password) {
    return res.status(422).json({ message: "A senha é obrigatório!" });
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(422).json({ message: "Usuário não encontrado!" });
  }

  if (user) {
    // verificar senha
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(404).json({ message: "Senha inválida!" });
    }

    try {
      const secret = process.env.SECRET;

      const token = jwt.sign(
        {
          id: user._id,
        },
        secret
      );
      return res
        .status(200)
        .json({ message: "Usuário logado com sucesso!", token });
    } catch (error) {
      res.status(500).json({
        message: "Desculpe! Aconteceu um erro no servidor. Tente mais tarde!",
      });
    }
  }
});

const authRouter = router;
module.exports = authRouter;
