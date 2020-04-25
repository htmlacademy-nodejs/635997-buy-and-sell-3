'use strict';

const express = require(`express`);
const mainRoutes = require(`./routes/main-routes`);

const PORT = 8080;

const app = express();

app.use(`/`, mainRoutes);
app.listen(PORT);
