var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const helmet = require("helmet");

const rgisterRoute = require("./routes/register");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Use the helmet middleware with CSP directives
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        fontSrc: ["'self'", "https://cdn.jsdelivr.net/npm/bootstrap@5.3.1", 
                    "https://maxcdn.bootstrapcdn.com", 
                    "https://cdn.jsdelivr.net",
                    "https://cdnjs.cloudflare.com",
                    "https://fonts.gstatic.com",
                    "https://fonts.googleapis.com"
                  ],

        styleSrc: [ "'self'", "'unsafe-inline'","https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css",
                    "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css",
                    "https://cdn.jsdelivr.net",
                    "https://cdnjs.cloudflare.com",
                    "https://maxcdn.bootstrapcdn.com",
                    "https://fonts.googleapis.com"
                   ],

        scriptSrc: ["'self'", "https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js",
                        "https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/"
                   ],

        imgSrc: ["'self'", "https://mdbcdn.b-cdn.net"],

                 
        
        // Add other directives as needed
      },
    },
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to set CSP headers


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/reg', rgisterRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(80,()=>console.log("Listen on port 80"));
