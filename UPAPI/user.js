//creating router to handle express api
const eapp=require('express')
//creating mini api
const userapp=eapp.Router()
//importing express-async handler
const expressAsyncHandler=require('express-async-handler')
//import bcryptjs to handel password hashing
let bcryptjs=require('bcryptjs')
//import jsonwebtoken to create token
const jsonwebtoken=require('jsonwebtoken')

//importing dotenv for secure the data
require("dotenv").config()

//to extract user body
userapp.use(eapp.json())
//creating routes to handle getuser
userapp.get('/getusers',expressAsyncHandler(async (req,res)=>{
    //only admin can access the entire databse
    //database collection object
    let duserscollection=req.app.get("duserscollection")
    let users=await duserscollection.find().toArray()
    res.send({message:"all users are",payload:users})
}))
//creating user route to aceess specfic object by id
userapp.get('/getusers/:id',expressAsyncHandler(async (req,res)=>{
    //database collection object
    let duserscollection=req.app.get("duserscollection")
    //
    let uidn=(+req.params.id)
    //finding user

    let user=await duserscollection.findOne({id:uidn})
    console.log(user)
    //if user does not exist
    if(user==null){
        res.send({message:'user does not existed'})
    }
    else{
        res.send({message:'user existed',payload:user})
    }
}))
//creating route to create users
userapp.post('/create-users',expressAsyncHandler(async (req,res)=>{
    //database collection onject
    let duserscollection=req.app.get("duserscollection")
    //get user object form request
    let obj=req.body
    console.log(obj)
    //inserting user objects into databse
    let result= await duserscollection.findOne({uname:obj.uname})
    //user existed
    if(result!=null){
        res.send({message:"username already existed"})
    }
    //user did not existed
    else{
        let hashpassword=await bcryptjs.hash(obj.password,6)
        //replace plain text  password with obj hash password
        obj.password=hashpassword
        //insert new object
       let newuser= await duserscollection.insertOne(obj)
        res.send({message:'created  users are',payload:newuser})
    }
    
}))
// create a router to user login
userapp.post("/login",expressAsyncHandler(async(req,res)=>{
     //database collection onject
     let duserscollection=req.app.get("duserscollection")
     //to get user creditinal from database
     let userscol=req.body
     //search user by username
     let userobj=await duserscollection.findOne({uname:userscol.uname})
     console.log(userobj)
     if(userobj==null){
         res.send({message:"invalid users"})
     }
     //user existed
     else{
         //compare passwords
         let status=await bcryptjs.compare(userscol.password,userobj.password)
         console.log(status)
         //if password not matched
         if(status==false){
             res.send({message:"invalid password"})
         }
         //passwords are matched
         else{
             //creating tokens
            let token=jsonwebtoken.sign({uname:userobj.uname},process.env.SECRET_KEY,{expiresIn:50})
             //send token
             res.send({message:"login success",payload:token,users:userobj})
            }
     }
})) 


//user route to modifying the user
userapp.put('/modify-user/:id',expressAsyncHandler(async (req,res)=>{
    //database collection object
    let duserscollection=req.app.get("duserscollection")
    let muser=req.body
    await duserscollection.updateOne({id:muser.id},{$set:{...muser}})
    res.send({message:'successfully modified'})

}))
userapp.delete('/remove-user/:id',expressAsyncHandler(async (req,res)=>{
    //database collection object
    let duserscollection=req.app.get("duserscollection")
    let duser=(+req.params.id)
   // console.log(duser)
    let deleteuser=await duserscollection.deleteOne({id:duser})
    console.log(deleteuser)
    if(deleteuser.deletedCount===1){
        res.send({message:"one user deleted",payload:duser})
    }
    else{
        res.send({message:'user is not deleted',payload:duser})
    }
    
}))

//exporting userapp
module.exports=userapp