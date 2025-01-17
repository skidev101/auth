const usersDB = {
  users: require("../data/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcryptjs");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and Password are required" });

  const duplicate = usersDB.users.find((person) => person.username === user);
  if (duplicate) return res.status(409) .json({ message: "User already exists. Login!" });

  try {
    const hashedpwd = await bcrypt.hash(pwd, 10);
    const newUser = { username: user, password: hashedpwd };
    usersDB.setUsers([...usersDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "data", "users.json"),
      JSON.stringify(usersDB.users)
    );
    await fsPromises.writeFile(
      path.join(__dirname, "..", "data", "employees.json"),
      JSON.stringify(usersDB.users)
    );

    console.log(usersDB.users);

    res.status(201).json({ success: `New user ${user} created successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
