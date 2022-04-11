//crearing express api
const eapp=require('express')
// to create mini express app
const app=eapp()
//importing mongodb module to coonect database
const mclient=require('mongodb').MongoClient

//to intract with frontend import the path module. This path module is an core module by BUILD folder of the nodejs
const pathmodule=require('path')
//connecting buid of reactapp with nodejs
app.use(eapp.static(pathmodule.join(__dirname,'./build')))
//importing dotenv for secure the data
require("dotenv").config()


//database connection url by database api and password 5041
const dburl=process.env.DATABASE_CONNECTION_URL
//connecting database url with mongodbserver
mclient.connect(dburl)
.then((client)=>{
    //creating database object 
    let dbobj=client.db('Database')
    //creating database collection objects
    let duserscollection=dbobj.collection("duserscollection")
    let dproductcollection=dbobj.collection("productscollection")
    //sharing collection object to API's key and value
    app.set("duserscollection",duserscollection)
    app.set("dproductcollection",dproductcollection)
    console.log("database connection success")
})
.catch(err=>console.log("database connection occur error",err))


//importing user and product api
const userapp=require('./UPAPI/user')
const productapp=require('./UPAPI/product')
const { Collection } = require('mongodb')
app.use('/user',userapp)
app.use('/product',productapp)
//invalid path
app.use((req,res,next)=>{
    res.send(`path ${req.url} is invalid`)
})
//to handle errors
app.use((error,req,res,next)=>{
    res.send({message:` reason: ${error.message} `})
})
//assign port number
const port=process.env.PORT
app.listen(port,()=>console.log('server listining on port 3000'))