const express = require("express");
const PORT = 8080;
const app = express();

const indexController = require("./controllers/index");
const apiController = require("./controllers/api.controller");

app.use(express.json()); // body를 받기 위한
app.use("/", indexController);
app.use("/api", apiController);

app.listen(PORT, () => {
  console.log(PORT, "번에서 대기 중");
});
