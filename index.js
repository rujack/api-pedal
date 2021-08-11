const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const request = require("request");
const cheerio = require("cheerio");
const htmlToText = require("html-to-text");
const http = require("http");

let port = process.env.PORT || 3000;

const laguDaerah = path.join(__dirname, "data", "lagu_daerah.json");
const ceritaRakyat = path.join(__dirname, "data", "isicerpen.json");

const app = express();
const route = express.Router();

app.use("/", route);

route.get("/", (_, res, next) => {
  try {
    res
      .status(200)
      .send(
        "<pre>API Route <br/> <br/>GET : /lagu => Lagu Daerah<br/>GET : /cerita_rakyat => Cerita Rakyat<br/>GET : /random_cerpen => Cerpen Acak dari cerpenmu.com</pre>",
      );
  } catch (err) {
    next(err);
  }
});

route.get("/lagu", async (_, res, next) => {
  try {
    const data = await fs.readFile(laguDaerah, "utf-8");
    const lagu = JSON.parse(data);
    res.status(200).send(lagu);
  } catch (err) {
    next(err);
  }
});

route.get("/cerita_rakyat", async (_, res, next) => {
  try {
    const data = await fs.readFile(ceritaRakyat, "utf-8");
    const cerita = JSON.parse(data);
    res.status(200).send(cerita);
  } catch (err) {
    next(err);
  }
});

app.get("/random_cerpen", (req, res, next) => {
  try {
    function foreach(arr, func) {
      for (var i in arr) {
        func(i, arr[i]);
      }
    }
    var items = [
      "cerpen-sedih",
      "cerpen-penyesalan",
      "cerpen-patah-hati",
      "cerpen-misteri",
      "cerpen-keluarga",
      "cerpen-kehidupan",
      "cerpen-horor-hantu",
      "cerpen-galau",
      "cerpen-fantasi-fiksi",
      "cerpen-cinta-sedih",
      "cerpen-cinta",
      "cerpen-cinta-romantis",
      "cerpen-cinta-dalam-hati-terpendam",
      "cerpen-cinta-islami",
      "cerpen-remaja",
      "cerpen-persahabatan",
    ];
    var kategori = items[Math.floor(Math.random() * items.length)];

    // var info = "";
    // switch (kategori) {
    //   case "cerpen-sedih":
    //     var info = "Cerpen Sedih";
    //   case "cerpen-penyesalan":
    //     var info = "Cerpen Penyesalan";
    //   case "cerpen-patah-hati":
    //     var info = "Cerpen Patah Hati";
    //   case "cerpen-misteri":
    //     var info = "Cerpen Misteri";
    //   case "cerpen-keluarga":
    //     var info = "Cerpen Keluarga";
    //   case "cerpen-kehidupan":
    //     var info = "Cerpen Kehidupan";
    //   case "cerpen-horor-hantu":
    //     var info = "Cerpen Horor Hantu";
    //   case "cerpen-galau":
    //     var info = "Cerpen Galau";
    //   case "cerpen-fantasi-fiksi":
    //     var info = "Cerpen Fantasi Fiksi";
    //   case "cerpen-cinta-sedih":
    //     var info = "Cerpen Cinta Sedih";
    //   case "cerpen-cinta":
    //     var info = "Cerpen Cinta";
    //   case "cerpen-cinta-romantis":
    //     var info = "Cerpen Romantis";
    //   case "cerpen-cinta-dalam-hati-terpendam":
    //     var info = "Cerpen Cinta Dalam Hati Perempuan";
    //   case "cerpen-cinta-islami":
    //     var info = "Cerpen Cinta Islami";
    //   case "cerpen-remaja":
    //     var info = "Cerpen Remaja";
    //   case "cerpen-persahabatan":
    //     var info = "Cerpen Persahanatan";
    // }

    var hal = Math.floor(Math.random() * 83);
    var url = "http://cerpenmu.com/category/" + kategori + "/page/" + hal;
    request.get(
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64; rv:74.0) Gecko/20100101 Firefox/74.0",
        },
        url: url,
      },
      function (error, response, body) {
        let $ = cheerio.load(body);
        //var bodi = body.replace("}1", "}");
        //var d = JSON.parse(bodi);
        let cerpen = [];

        $('article[class="post"] > h2 > a').each(function (i, e) {
          cerpen[i] = $(this).attr("href");
        });
        var nomorlink = Math.floor(Math.random() * 10);
        var url = cerpen[nomorlink];
        request.get(
          {
            headers: { "content-type": "application/x-www-form-urlencoded" },
            url: url,
          },
          function (error, response, body) {
            let $ = cheerio.load(body);
            //var h  = $.html().replace(/<[^>]*>?/gm, '');
            const text = htmlToText.fromString($.html(), {
              noLinkBrackets: true,
              ignoreHref: true,
              ignoreImage: true,
            });
            //console.log(text)
            const hasil = {
              cerpen: text.split("kamu dapat")[0].split("Kontak Kami")[1],
              url: url,
            };
            res.status(200).json(hasil);
            // res.status(200).json(text.split("kamu dapat")[0].split("Kontak Kami")[1]);
          },
        );
      },
    );
  } catch (err) {
    next(err);
  }
});

// route.get("/lagu/daerah=:daerah", async (req, res, next) => {
//   const input = req.params.daerah;
//   const daerah = input.charAt(0).toUpperCase() + input.slice(1);
//   const data = await fs.readFile(laguDaerah, "utf-8");
//   const lagu = JSON.parse(data);

//   console.log(daerah);
//   lagu.filter((hasil,i) => {
//     if (hasil.daerah === daerah) {
//       res.status(200).send(lagu[i]);
//     }
//   });
// for (var i = 0; i < lagu.length; i++) {
//   res.status(200)
//   try {
//     if (lagu[i].daerah === daerah) {
//       res.status(200).send(lagu[i]);
//     } else {
//       res.end("gk onk");
//     }
//   } catch (err) {
//     res.status(200).end("gk onk");
//     next(err);
//   }
// }
// });

app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET");
  res.append("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

app.listen(port, () =>
  console.log(`Connection berhasil http://localhost:${port}`),
);
