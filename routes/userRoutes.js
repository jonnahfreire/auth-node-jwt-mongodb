const router = require("express").Router();
const User = require("../models/User");

const { checkToken } = require("./middlewares");

router.get("/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id, "-password");
    if (user) {
      return res.status(200).json({ user });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ message: "Usuário não encontrado!" });
  }
});

const userRouter = router;
module.exports = userRouter;
