const express = require("express");

const PORT = 8080;

const app = express();

const indexController = require("./controllers/index");

app.use("/", indexController);

app.listen(PORT, () => {
  console.log(PORT, "번에서 대기 중");
});
