var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const helmet = require("helmet");
const authorize = require('./access_token_check');
const rgisterRoute = require("./routes/register");
var estateRegRoute = require("./routes/est_reg_route");
var counterRegRoute = require("./routes/counter_reg_route");
var addProviderRoute = require("./routes/add_provider_route");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var MySqlLayer = require('./db');
let nonceGen = require("./nonce_gen.js");
let readingsRoute = require("./routes/add_readings_route");
const { createInflateRaw } = require('zlib');

//create a database layer
var dbLayer = new MySqlLayer.MysqlLayer({basename:"my_bot", password:"65535258", user:"root", host:"localhost"});
//injecting into the routers
estateRegRoute.dbLayer = dbLayer;
counterRegRoute.dbLayer = dbLayer;
addProviderRoute.dbLayer = dbLayer;
readingsRoute.dbLayer = dbLayer;

var app = express();

app.use( async (req, res, next)=>{
  //nonce calculation for inline scripts
  res.locals.nonce = await nonceGen.insertNonceInResp ();
  console.log(req.url);
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//



// Use the helmet middleware with CSP directives

app.use((req, res, next) => {
      helmet({
        contentSecurityPolicy: {
          directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", `nonce-${res.locals.nonce}`],
                fontSrc: ["'self'", 
                            "https://cdn.jsdelivr.net/npm/bootstrap@5.3.1", 
                            "https://maxcdn.bootstrapcdn.com", 
                            "https://cdn.jsdelivr.net",
                            "https://cdnjs.cloudflare.com",
                            "https://fonts.gstatic.com",
                            "https://fonts.googleapis.com"
                          ],

                styleSrc: [ "'self'", 
                            "'unsafe-inline'",
                            "https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css",
                            "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css",
                            "https://cdn.jsdelivr.net",
                            "https://cdnjs.cloudflare.com",
                            "https://maxcdn.bootstrapcdn.com",
                            "https://fonts.googleapis.com"
                          ],

                scriptSrc: ["'self'",
                            "https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js",
                            "https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/"
                          ],

                imgSrc: ["'self'", "https://mdbcdn.b-cdn.net","https://mdbootstrap.com"],

                        
                
                // Add other directives as needed
          },
        },
      })
      next();
  }
);

app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));

// Middleware to set CSP headers
//saving last URL in cookies
 function saveLastUrl (req, res, next) {
    let path = req.originalUrl;
    if (req.method == "POST") {
      res.clearCookie("last_url");
    } else {
      res.cookie("last_url", path.toString());
    }
    
    next();
};

app.use('/test/',saveLastUrl, authorize.checkAccessTokenMiddleware, indexRouter);
app.use('/users',saveLastUrl, authorize.checkAccessTokenMiddleware, usersRouter);
app.use('/reg', rgisterRoute);
app.use("/login", loginRouter);
app.use("/estate",saveLastUrl, authorize.checkAccessTokenMiddleware, estateRegRoute);
app.use("/counter", saveLastUrl, authorize.checkAccessTokenMiddleware, counterRegRoute);
app.use("/providers",saveLastUrl, authorize.checkAccessTokenMiddleware, addProviderRoute);
app.use("/readings",saveLastUrl, authorize.checkAccessTokenMiddleware, readingsRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));5
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(80,()=>console.log("Listen on port 80"));
