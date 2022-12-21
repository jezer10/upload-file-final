const express = require("express");

const multer = require("multer");
const cors = require("cors");
const upload = multer({ storage: multer.memoryStorage() });
const app = express();
const { savePost, getPosts, uploadFile } = require("./firebase");
const { v4: uuid } = require("uuid");
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello wrld");
});
app.get("/posts", async (req, res) => {
  const response = await getPosts();
  console.log(response);
  res.json(response);
});
app.post("/posts", upload.any(), async (req, res) => {
  try {
    const files = req.files;
    const mappedFiles = files.map(
      ({ fieldname, originalname: fileName, buffer }) => {
        const fieldId = fieldname.split("-")[0];
        title = req.body[`${fieldId}-title`];
        description = req.body[`${fieldId}-description`];
        if (!title || !description || !buffer) {
          throw new Error("Bad Metadata Format");
        }
        return {
          title,
          description,
          fileName,
          buffer,
        };
      }
    );

    const publications = await Promise.all(
      mappedFiles.map((e) => uploadFile(e))
    );
    console.log(publications);

    const response = await savePost({
      title: req.body.title,
      description: req.body.description,
      creationDate: new Date(),
      publications,
    });
    console.log(response);
    res.send("Uploaded");
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

module.exports = app;
