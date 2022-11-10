const express = require('express');
//const morgan = require('morgan');

const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser')

const app = express();



//db connection
const dbUri = 'mongodb+srv://Jay-node:jay20011968bawa@jaybawa.dlgafqh.mongodb.net/Jay-Node?retryWrites=true&w=majority';

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    //listen for port 3000 after connected to database
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));




app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.use(authRoutes);
app.use((req, res) => {
    res.status(404).render('404');
})