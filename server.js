const express = require('express');
const app = express();

const port = 3000;

const travelRoutes = require('./routes/travelRoutes');


app.use(express.static(__dirname + "/public"));

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/views/home.html");
});

app.get('/about', (req, res) => {
  res.sendFile(__dirname + "/views/about.html");
});

app.use('/travelagency', travelRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
