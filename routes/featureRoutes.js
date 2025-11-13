const path = require('path');
const express = require('express');
const router = express.Router();
const rootDir = require('../utils/pathUtils');
const cropModel = require('../Models/cropModel')
const { ensureAuthenticated } = require('../Config/Auth');

// routes for the world market page
router.get('/world-market', ensureAuthenticated, (req, res) => {
    res.render('market');
});


// routes for the experts page
router.get('/experts', ensureAuthenticated, (req, res) => {
    res.render('experts');
});

router.get('/recommedation', ensureAuthenticated, (req, res) => {
    res.render('cover2');
});

router.get('/visualization', ensureAuthenticated,(req, res) => {
    // res.status(200).sendFile(path.join(rootDir, 'views', 'visual.html'));
    res.status(200).render('visual');
});

router.get('/weatherupdate', (req, res) => {
    res.status(200).sendFile(path.join(rootDir, 'views', 'weather.html'));
});
// just for demo purposes
router.get('/result', (req, res) => {
    res.status(200).send('Hello world');
});
//  recommend a crop from getting data from database
// router.post('/visulization', async (req, res) => {
//     const { temperature, humidity, rainfall, soil } = req.body;
//     if (!temperature || !humidity || !rainfall || !soil) {
//         return res.status(400).send('All fields are required');
//     }

//     try {
//         // Simulate a crop recommendation based on the input data
//         const recommendation = await cropModel.findOne({ soil: soil, temperature: temperature, humidity: humidity, rainfall: rainfall });
//         if (!recommendation) {
//             return res.status(404).send('No crop found for the given conditions');
//         }

//         const recommendationCrop = recommendation.crop;

//         //  rerender the current page with the recommedation crop
//         res.status(200).render('visual', { recommendationCrop: recommendationCrop });

//     } catch (error) {
//         console.error('Error fetching crop data:', error);
//         return res.status(500).send('Internal Server Error');

//     }
// });


router.post('/visualization', ensureAuthenticated, async (req, res) => {
    const { temperature, humidity, rainfall, soil } = req.body;

    // Debugging: Log the incoming data
    console.log('Form Data:', { temperature, humidity, rainfall, soil });

    if (!temperature || !humidity || !rainfall || !soil) {
        return res.status(400).send('All fields are required');
    }

    try {
        // Simulate a crop recommendation based on the input data
        const recommendation = await cropModel.findOne({
            soil: soil,
            temperature: temperature,
            humidity: humidity,
            rainfall: rainfall,
        });

        if (!recommendation) {
            return res.status(404).send('No crop found for the given conditions');
        }

        const recommendationCrop = recommendation.crop;

        // Rerender the current page with the recommendation crop
        res.status(200).render('visual', { recommendationCrop: recommendationCrop });
    } catch (error) {
        console.error('Error fetching crop data:', error);
        return res.status(500).send('Internal Server Error');
    }
});
module.exports = router;