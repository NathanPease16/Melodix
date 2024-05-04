const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

const app = express();
const PORT = 8080;

dotenv.config({ path: '.env' });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/img', express.static(path.join(__dirname, 'public', 'img')));

app.use(bodyParser.json());

app.use(require('./server/routes/router.js'));

app.listen(PORT, (error) => {
    if (error) {
        console.log(err);
    } else {
        console.log(`Listening at http://localhost:${PORT}`);
    }
})