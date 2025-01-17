const usersDB = {
  users: require("../data/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogin = async (req, res) => {
  try {
    const { user, pwd } = req.body;
    if (!user || !pwd)
      return res
        .status(400)
        .json({ message: "Username and Password are required" });

    const foundUser = usersDB.users.find((person) => person.username === user);
    if (!foundUser) {
      console.log('User not found');
      return res.status(401) .json({ 'message': 'user not found' });
    }
    

    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
      const accessToken = jwt.sign(
        { username: foundUser.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "5m" }
      );
      const refreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      const otherUsers = usersDB.users.filter(
        (person) => person.username !== foundUser.username
      );
      const currentUser = { ...foundUser, refreshToken };
      usersDB.setUsers([...otherUsers, currentUser]);

      await fsPromises.writeFile(
        path.join(__dirname, "..", "data", "users.json"),
        JSON.stringify(usersDB.users)
      );

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000
      });

      res.sendStatus(200).json({ accessToken });
      console.log(`${user} is now logged in`);
    } else {
      console.log('Wrong password');
      res.status(401).json({ message: "Wrong password" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { handleLogin };
