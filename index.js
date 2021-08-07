const express = require("express");
const fs = require("fs").promises;
const path = require("path");
let port = process.env.PORT || 3000;

const laguDaerah = path.join(__dirname, "data", "lagu_daerah.json");

const app = express();
const route = express.Router();

app.use("/", route);

route.get("/", (_, res, next) => {
  res
    .status(200)
    .send(
      "<pre>API Route <br/> <br/>GET : /lagu => Lagu Daerah<br/>GET : /cerita_rakyat => Cerita Rakyat</pre>",
    );
  next();
});

route.get("/lagu", async (_, res, next) => {
  const data = await fs.readFile(laguDaerah, "utf-8");
  const lagu = JSON.parse(data);
  res.status(200).send(lagu);
  next();
});

app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET");
  res.append("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

app.listen(port, () => console.log(`Connection berhasil http://localhost:${port}`));
