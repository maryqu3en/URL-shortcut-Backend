const express = require("express");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const app = express();
const shortid = require("shortid");
const PORT = process.env.PORT || 5001;

app.use(cors({
    origin:"*"
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let URLSlist = fs.readFileSync(path.resolve(__dirname, "data.json"), "utf-8");
URLSlist = JSON.parse(URLSlist);

app.get("/api", (req, res) => {
  return res.status(200).json({ data: "hello world" });
});

//add URL to json file + its shortened version
app.post("/shortURL", (req, res) => {
  const longURL = req.body;
  const shortURL = shortid.generate();

  const newURL = {
    longURL,
    shortURL,
  };

  try {
    URLSlist.push(newURL);
    fs.writeFileSync(
      path.resolve(__dirname, "data.json"),
      JSON.stringify(URLSlist)
    );
    return res.status(200).json({
      // shortenedURL: `http://localhost:5001/shortURL/${shortURL}`,
      shortenedURL: `https://url-shortcut-generator.onrender.com/shortURL/${shortURL}`,
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});

//redirecting
app.get("/shortURL/:url", (req, res) => {
  const url = req.params.url;
  const originalURLObject = URLSlist.find(
    (originalURL) => originalURL.shortURL === url
  );

  if (originalURLObject) {
    const originalURL = originalURLObject.longURL;
    return res.redirect(302, originalURL.longURL);
  } else {
    return res.status(404).json({ error: "Short URL not found" });
  }
});

app.listen(PORT, () =>
  console.log(`server running in http://localhost:${PORT}`)
);
