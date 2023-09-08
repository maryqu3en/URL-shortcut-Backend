const express = require("express");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let users = fs.readFileSync(path.resolve(__dirname, "data.json"), "utf-8");
users = JSON.parse(users);

app.get("/api", (req, res) => {
  return res.status(200).json({ data: "hello world" });
});

app.get("/login-and-register", (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});
