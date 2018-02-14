const router = require('express').Router();
const City = require ('./Model.js');

router.route('/destinations')
    .post((req,res) => {
        // res.send(req.body);
        res.redirect('/');
        let city = new City({name: req.body.name, photos: req.body.photos.split(',')});
        city.save()
            .then(city =>{
                res.status(200).send('this worked');
            })
            .catch(err => {
              res.status(400).send("unable to save to database");
            });
        });


module.exports = router;