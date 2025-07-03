require('dotenv').config();                     
const connectToMongo = require('./db');
const express        = require('express');
const cors           = require('cors');
const session        = require('express-session'); 
const passport       = require('./config/passport');


/* ---------------- Start the server after Mongo connects ---------------- */
connectToMongo()
  .then(() => {
    const app  = express();
    const port = process.env.PORT || 8000;        

    app.use(cors({ credentials: true, origin: process.env.CLIENT_ORIGIN })); // allow cookies
    // console.log(`CORS enabled for origin: ${process.env.CLIENT_ORIGIN}`);
    app.use(express.json());

    app.use(session({
      secret            : process.env.SESSION_SECRET,
      resave            : false,
      saveUninitialized : false,
      cookie            : { secure: false }       
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    app.use('/api/auth',  require('./routes/auth'));      

    app.use((req, res) => res.status(404).json({ error: 'Not found' }));

    app.listen(port, () =>
      console.log(`API ready at http://localhost:${port}`)
    );
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
