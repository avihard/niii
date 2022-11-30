const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./model');
const app = express();
require('dotenv').config();


app.use (cors());
db.sequelize.sync();
// parse requests of content-type - application/json

app.use (bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded

app.use (bodyParser.urlencoded({extended:true}));

//simple route
app.get ('/', (req, res) => {
res.json({message: 'Welcome to niiii'});
});

app.use(express.json())
require("../backend/routes/routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
console.log ('Server is running on port %s .', PORT);
});