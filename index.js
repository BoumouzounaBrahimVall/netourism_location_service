const express = require('express');
const cors = require('cors');
const app = express();
const pool = require("./db");
const bodyParser = require('body-parser');
const fs = require('fs');

//middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
//routes
app.use("/locations", require("./routes/places"));
app.listen(9000, () => {
console.log("server started on port 9000");})


