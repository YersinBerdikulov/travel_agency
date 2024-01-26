const express = require('express');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get('/', (req, res) => {
    res.send('Hello from travelRoutes.js');
});

router.post('/travelagency', (req, res) => {
    console.log(req.body);
    res.send('POST request to the homepage');
});

module.exports = router;
