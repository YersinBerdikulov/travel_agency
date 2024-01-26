const express = require('express');
const app = express();

const port = 3000;

const travelRoutes = require('./routes/travelRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'));

// Handle GET request to root route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Use travel routes
app.use('/travelagency', travelRoutes);

// Listen on port 3000
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
