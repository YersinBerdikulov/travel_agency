const express = require('express');
const router = express.Router();
const path = require('path');


router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});



module.exports = router;