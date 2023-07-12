const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./Routes/userRoutes");
const noteRoutes = require("./Routes/noteRoutes");
const path = require("path");

dotenv.config();
const port = process.env.PORT;

const app = express();

app.use(express.json());

const connectDatabase = require("./db/conn");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
connectDatabase();

var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);

// ---------------- Deployment --------------------------
__dirname = path.resolve();
if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  app.get('*', (req,res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", 'index.html'))
  })
} else {
  app.get("/", (req, res) => {
    res.send("Done for the day");
  });
}
// ---------------- Deployment --------------------------

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Connection is live on port number ${port}`);
});
