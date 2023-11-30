import { dbUser } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = (req, res) => {
  const q = "SELECT * FROM admin_key WHERE admin_name = ?";

  dbUser.query(q, [req.body.adminName], (err, data) => {
    if (err) return res.json(err);
    if (data.length == 0) return res.status(404).json("Admin not found!");

    // check pw
    const isPasswordBcrypt = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );
    const isPasswordDB = req.body.password == data[0].password;

    if (!isPasswordBcrypt && !isPasswordDB)
      return res.status(400).json("wrong adminname or password");

    const token = jwt.sign({ id: data[0].admin_id }, "adminkey");
    const { password, ...other } = data[0];

    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "Lax",
      })
      .status(200)
      .json(other);
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("access_token", {
      sameSite: "Lax",
    })
    .status(200)
    .json("user have been logout");
  // section end time
};
