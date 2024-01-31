const express = require('express');
const axios = require('axios');
const bodyparser = require('body-parser');
const fs = require('fs');


const toursFilePath = './data/tours_data.json';
const historyFilePath = './data/history.json';

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

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


let tours = [];
if (fs.existsSync(toursFilePath)) {
    tours = JSON.parse(fs.readFileSync(toursFilePath, 'utf8'));
}


let history = [];
if (fs.existsSync(historyFilePath)) {
    history = JSON.parse(fs.readFileSync(historyFilePath, 'utf8'));
}

app.post('/deleteHistoryEntry', (req, res) => {
    const { index } = req.body;

    if (index !== undefined && index >= 0 && index < history.length) {

        history.splice(index, 1);
        saveHistoryToFile();

        res.json({ message: 'History entry deleted successfully' });
    } else {
        res.status(400).json({ error: 'Invalid index provided' });
    }
});

function saveToursToFile() {
    fs.writeFileSync(toursFilePath, JSON.stringify(tours, null, 2), 'utf8');
}


function saveHistoryToFile() {
    fs.writeFileSync(historyFilePath, JSON.stringify(history, null, 2), 'utf8');
}


app.post('/saveBookingToHistory', (req, res) => {
    const { city, adults, children } = req.body;
    const timestamp = new Date();


    if (!Array.isArray(history)) {
        history = [];
    }

    history.push({ city, adults, children, timestamp });
    saveHistoryToFile();

    res.json({ message: 'Booking information saved to history successfully' });
});

app.get('/tours/:city', (req, res) => {
  const city = req.params.city;
  const tour = tours.find((tour) => tour.city === city);

  if (tour) {
      res.json({ tour });
  } else {
      res.status(404).json({ error: 'Tour not found' });
  }
});


app.post('/tours', (req, res) => {
  const newTour = req.body;
  tours.push(newTour);
  saveToursToFile();
  res.json({ message: 'Tour added successfully', tour: newTour });
});


app.put('/tours/:city', (req, res) => {
  const cityToUpdate = req.params.city;
  const updatedTour = req.body;

  const index = tours.findIndex((tour) => tour.city === cityToUpdate);
  if (index !== -1) {
      tours[index] = { ...tours[index], ...updatedTour };
      saveToursToFile();
      res.json({ message: 'Tour updated successfully', tour: tours[index] });
  } else {
      res.status(404).json({ error: 'Tour not found' });
  }
});


app.delete('/tours/:city', (req, res) => {
  const cityToDelete = req.params.city;

  const index = tours.findIndex((tour) => tour.city === cityToDelete);
  if (index !== -1) {
      const deletedTour = tours.splice(index, 1)[0];
      history.push({ ...deletedTour, timestamp: new Date() });
      saveToursToFile();
      saveHistoryToFile();
      res.json({ message: 'Tour deleted successfully', tour: deletedTour });
  } else {
      res.status(404).json({ error: 'Tour not found' });
  }
});

app.post('/travelagency', async (req, res) => {
  try {

      const tourCost = calculateTourCost(req.body);


      const weatherApiKey = process.env.OPENWEATHERMAP_API_KEY;
      const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${req.body.city}&appid=${weatherApiKey}&units=metric`
      );
      const weatherConditions = weatherResponse.data.weather[0].description;

      const timestamp = moment().format('MMMM Do YYYY, h:mm:ss a');
      const tourResult = {
          tour: req.body,
          cost: tourCost,
          weather: {
              temperature: weatherResponse.data.main.temp,
              conditions: weatherConditions,
          },
          timestamp: timestamp,
      };


      console.log('Tour Result:', tourResult);


      tourHistory.push(tourResult);


      res.json({ success: true, message: 'Tour booked successfully', tourResult });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error processing the tour request' });
  }
});
