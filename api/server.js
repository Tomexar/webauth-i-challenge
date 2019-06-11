const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)

const server = express();

const usersRouter = require('../users/users-router.js');
const authRouter = require('../auth/auth-router.js');


const sessionConfig = {
  name: 'moneky',
  secret: 'keep it secret, keep it safe',
  resave: false,
  saveUninitialized: true,
  cookie:{
    maxAge: 1000 *60 *10,///mili > seconds > minutes
    secure: false, /// https true for production
    httpOnly: true,///always set to true. js cant access the cookie 

  },
  store: new KnexSessionStore({
    knex: require('../data/dbConfig.js'),
    tablename: 'sessions',
    sidefield:'sid',
    createtable:true,
    clearInterval: 1000*60*60,
  })
};


server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig))

server.get('/', (req, res) => {
  res.json({shit :"works"});
});

server.use('/api/users', usersRouter);
server.use('/api/auth', authRouter);

module.exports = server;
