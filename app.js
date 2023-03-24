import express from 'express';
import cors from 'cors';
import { create } from 'express-handlebars';

import * as path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// -------------------------------------------------
// ------------------- MIDLEWARE -------------------
// -------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// -------------------------------------------------
// ------------------- SERVIDOR --------------------
// -------------------------------------------------

app.listen(3001, () => { console.log('Servidor en http://localhost:3001'); });

// -------------------------------------------------
// ------------------- HANDLEBARS-------------------
// -------------------------------------------------

const hbs = create({
  partialsDir: [
    "views/partials/"
  ]
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));

export default app;