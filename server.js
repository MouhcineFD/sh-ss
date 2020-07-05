const express = require("express");

const app = express();

app.get("/images/:file", (req, res) => {
  const { file } = req.params;
  res.sendFile(`${__dirname}/build/images/${file}`);
});

app.get("/static/:folder/:file", (req, res) => {
  const { file, folder } = req.params;
  res.sendFile(`${__dirname}/build/static/${folder}/${file}`);
});

app.get("/", (req, res) => res.sendFile(`${__dirname}/build/index.html`));

app.use("/", (req, res) => res.sendStatus(200));

app.listen(3000, () => console.log(" app listening on port 3000!"));
