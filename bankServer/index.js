// import express inside index.js file
const { response } = require('express');
const express = require('express');
const { model } = require('mongoose');

// import dataservice
const dataService = require('./services/data.service')

// import cors - for connecting frontend and backend
const cors = require('cors')

// import jsonwebtoken
const jwt = require('jsonwebtoken')

// create server app using express
const app = express()

// to define origin using cors
app.use(cors({
  origin: 'http://localhost:4200'
}))

// set up port for server app
app.listen(3000, () => {
  console.log('server started at 3000');
})

// Application specific  Middleware  
const appMiddleware = (req, res, next) => {
  console.log("Application specific  Middleware  ");
  next()
}

// to use in entire application
app.use(appMiddleware)



// to parse json
app.use(express.json())

// bank sever api - request resolving

// jwt token verification middleware
const jwtMiddleware = (req, res, next) => {
  console.log('router specific middlewrae');
  // 1. get token from request header in access token
  const token = req.headers['access-token']
  // 2. verify token using 'verify()' method in jsonwebtoken
  try {
    const data = jwt.verify(token, "secretkey123456")
    // assinging login user acno to currentacno
    req.currentAcno = data.currentAcno
    console.log(data);
    next()
  }
  catch {
    res.status(422).json({
      status: false,
      massage: 'Please login'
    })
  }
}

// login API - resolve
app.post('/login', (req, res) => {
  console.log(req.body);

  // asynchrinous
  dataService.login(req.body.acno, req.body.pswd)
    .then((result) => {
      res.status(result.statusCode).json(result)
    })
})
// register 
app.post('/register', (req, res) => {
  console.log(req.body);

  // asynchrinous
  dataService.register(req.body.acno, req.body.pswd, req.body.uname)
    .then((result) => {
      res.status(result.statusCode).json(result)
    })
})


// deposit
app.post('/deposit', jwtMiddleware, (req, res) => {
  console.log(req.body);

  // asynchrinous
  dataService.deposit(req, req.body.acno, req.body.pswd, req.body.amount)
    .then((result) => {
      res.status(result.statusCode).json(result)
    })
})

// withdraw
app.post('/withdraw', jwtMiddleware, (req, res) => {
  console.log(req.body);

  // asynchrinous
  dataService.withdraw(req, req.body.acno, req.body.pswd, req.body.amount)
    .then((result) => {
      res.status(result.statusCode).json(result)
    })
})

// transaction
app.get('/transaction/:acno', jwtMiddleware, (req, res) => {
  console.log(req.body);

  // asynchrinous
  dataService.transaction(req.params.acno)
    .then((result) => {
      res.status(result.statusCode).json(result)
    })
})

// deleteAcno API

app.delete('/deleteAcno/:acno',jwtMiddleware,(req,res)=>{
  dataService.deleteAcno(req.params.acno)
  .then((result)=>{
    res.status(result.statusCode).json(result)

  })
})