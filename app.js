var express = require('express');
var app = express();

var cors = require('cors');
app.use(cors())

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));
 
app.use('/api', require('./routes/api'))

const port = process.env.PORT || 3000;
app.listen(port);