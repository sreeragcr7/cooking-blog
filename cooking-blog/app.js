require('dotenv').config();
const expressLayout = require('express-ejs-layouts');  
const fileUpload = require('express-fileupload');
const session = require('express-session'); 
const cookieParser = require('cookie-parser');   
const flash = require('connect-flash');
const express = require('express');
const app = express(); 

const port = process.env.PORT || 3000;             
 
app.use(expressLayout); 
app.use(express.urlencoded({ extended:true }));       
app.use(express.json());
app.use(express.static('public'));

app.use(cookieParser('cookingBlogSecure'))
app.use(session({
    secret:'cookingBlogSecure',
    saveUninitialized: true,
    resave: true
}))
app.use(flash()); 
app.use(fileUpload());

app.set('layout', './layouts/main');
app.set('view engine', 'ejs'); 

const recipeRoute = require('./server/routes/recipeRoutes');   

app.use(recipeRoute); 




app.listen(port, () => console.log(`Server started at http://localhost:${port}`));   