require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const app = express();

//conexão mongoDB
async function connectDB() {
    try{
        await mongoose.connect(process.env.CONNECTIONSTRING);
        console.log('Conectado á base de dados')
        app.emit('pronto');
    }catch(err) {
        console.error('Error ao conectar ao MongoDB', err)
    }
}

connectDB();


//sessões e flash
const sessionOptions = session({
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});
const routes = require('./routes');
app.use(sessionOptions);
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use('/frontend', express.static(path.join(__dirname, 'frontend')));
app.use(routes)
app.listen(1414, () => {
    console.log('Servidor executando porta 3333')
});