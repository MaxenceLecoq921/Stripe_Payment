// import express from 'express';
const express = require('express');

// import bodyParser from "body-parser";
const bodyParser = require('body-parser');

// import path from 'path';
const path = require('path');

require('dotenv').config();

const PUBLIC_KEY = process.env.PUBLIC_KEY;

const PRIVATE_KEY = process.env.PRIVATE_KEY;

const stripe = require('stripe')(PRIVATE_KEY);

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.render('Home',{key:PUBLIC_KEY});
});

app.post('/payment', (req, res) => {
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Maxence Test',
        address: {
            line1: '53 Rue des chemisiers',
            postal_code: '75000',
            city: 'Paris',
            state: 'Ile de France',
            country: 'France',
        }
    }).then((customer) => {
        return stripe.charges.create({
            amount: 1000,
            description: 'Achat d\'un article',
            currency: 'eur',
            customer: customer.id
        });
    }).then(
        (charge) => {
            console.log(charge);
            res.send('Success')
        }
    ).catch((err) => {
        console.log(err);
        res.send(err)
    })
    });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});