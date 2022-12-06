// import db
const db = require('./db')

// import jsonwebtoken
const jwt = require('jsonwebtoken')

// login defenition
const login = (acno, password) => {

    // 1. search acno,passowrd in mongodb
    return db.User.findOne({
        acno,
        password
    }).then((result) => {
        console.log(result);
        if (result) {
            // code for generate token
            const token = jwt.sign({
                currentAcno: acno
            }, "secretkey123456")


            // send to client
            return {
                message: 'Login successfull',
                status: true,
                statusCode: 200,
                username: result.username,
                token,
                currentAcno: acno
            }
        }

        else {
            return {
                message: 'Invalid Account Number / password!!',
                status: false,
                statusCode: 404
            }
        }
    })
}

// register page
const register = (acno, pswd, uname) => {
    // 1.search acno in db if yes
    return db.User.findOne({
        acno
    }).then((result) => {
        // 2. if yes respons already exist
        if (result) {
            return {
                message: 'Already existing user!!',
                status: false,
                statusCode: 404
            }
        }
        //3. new user:store all data into db
        else {
            let newUser = new db.User({
                acno,
                username: uname,
                password: pswd,
                balance: 0,
                transaction: []

            })

            newUser.save()
            return {
                message: 'Registered successfully',
                status: true,
                statusCode: 200
            }
        }
    })
}

// deposit
const deposit = (req, acno, password, amount) => {
    var amt = Number(amount)
    // 1. search acno,passowrd in mongodb
    return db.User.findOne({
        acno,
        password

    }).then((result) => {
        if (acno != req.currentAcno) {
            return {
                message: 'permission denied!!',
                status: false,
                statusCode: 404
            }
        }
        if (result) {
            result.balance += amt
            result.transaction.push({
                amount,
                type: 'CREDIT'
            })
            result.save()
            return {
                message: `${amt} Credited successfully and new balance is ${result.balance}`,
                status: true,
                statusCode: 200
            }
        }

        else {
            return {
                message: 'Invalid Account Number / password!!',
                status: false,
                statusCode: 404
            }
        }
    })
}

// withdraw
const withdraw = (req, acno, password, amount) => {
    var amt = Number(amount)
    // 1. search acno,passowrd in mongodb
    return db.User.findOne({
        acno,
        password

    }).then((result) => {
        console.log(result);
        // if (result) {
            if (acno != req.currentAcno) {
                return {
                    message: 'permission denied!!',
                    status: false,
                    statusCode: 404
                }
            }

            // check sufficient balance
            if (result.balance >= amt) {
                result.balance -= amt
                result.transaction.push({
                    amount,
                    type: 'DEBIT'
                })


                result.save()
                return {
                    message: `${amt} debited successfully and new balance is ${result.balance}`,
                    status: true,
                    statusCode: 200
                }

            }
        // }
        else {
            return {
                message: 'Insufficient balance',
                status: false,
                statusCode: 404
            }
        }
    })
}

// transaction
const transaction = (acno) => {
    return db.User.findOne({
        acno
    }).then(result => {
        console.log(result);
        if (result) {
            return {

                status: true,
                statusCode: 200,
                transaction: result.transaction
            }
        }
        else {
            return {
                message: 'Invalid account number',
                status: false,
                statusCode: 404
            }
        }
    })
}

// to delete acconut

const deleteAcno = (acno)=>{
    return db.User.deleteOne({
        acno
    }).then(result=>{
        if (result) {
            return{
                status:true,
                statusCode:200,
                message:`${acno} deleted Successfully...`
            }
        }
        else{
            return{
                status:false,
                statusCode:402,
                message:"invaid account number"
            }
        }
    })
}



//To use login in other files - we have to export it
module.exports = {
    login,
    register,
    deposit,
    withdraw,
    transaction,
    deleteAcno
}