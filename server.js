const express = require('express');
const app = express();
const path = require('path');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 5000;

//loggerEvent module
app.use(logger);

//domains allowed to access backend
app.use(cors(corsOptions));


//middlewares
app.use(express.urlencoded({ extended:  false }));
//in-built middleware
app.use(express.json());

//cookie middleware
app.use(cookieParser());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));


//routers
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/subdir', require('./routes/subdir'));
app.use('/refresh', require('./routes/refresh'));

app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));


/* app.all('*', (req, res) => {

res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
})
 */

/* app.get('/*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
}); */
 




app.use(errorHandler)


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));




