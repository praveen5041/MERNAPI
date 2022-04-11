//creating router to handle product api
const eapp=require('express')
//creating mini express api
const productapi=eapp.Router()
//to extract product body
productapi.use(eapp.json())
//import exprss-async-handler to handle errors
const expressAsyncHandler=require('express-async-handler')
//get allproducts
productapi.get("/getproducts", expressAsyncHandler(async (req,res)=>{
    //database collection object
    let dproductcollection=req.app.get("dproductcollection")
    let allproducts=await dproductcollection.find().toArray()
    res.send({message:"products are",payload:allproducts})
}))
//get product by pid
productapi.get("/getproducts/:id",expressAsyncHandler(async(req,res)=>{
    //database collection object
    let dproductcollection=req.app.get("dproductcollection")
    let pid=(+req.params.id)
    let product=await dproductcollection.findOne({id:pid})
    //if product not existed
    if(product==null){
        res.send({message:'product does not exist'})
    }
    //if product existed
    else{
        res.send({message:'product is found',payload:product})
    }
}))
//modifyinf the product
productapi.put('/update/products/:id',expressAsyncHandler(async (req,res)=>{
    //database collection object
    let dproductcollection=req.app.get("dproductcollection")
    let mid=req.body
    await dproductcollection.updateOne({id:mid.id},{$set:{...mid}})
    res.send({message:'product modified successfull'})
 }))
 //post the product
 productapi.post('/create/product',expressAsyncHandler(async(req,res)=>{
     //database collection object by collection key
     let dproductcollection=req.app.get("dproductcollection")
     //get databse body request
     let pobj=req.body
     //insert product obj
      let newproduct= await dproductcollection.insert(pobj)
      res.send({message:'new producst are',payload:newproduct})

 }))
 //deleting product
 productapi.delete('/remove-product/:id',expressAsyncHandler(async (req,res)=>{
    //database collection object
    let dproductcollection=req.app.get("dproductcollection")
    let duser=(+req.params.id)
   // console.log(duser)
    let deleteuser=await dproductcollection.deleteOne({id:duser})
    console.log(deleteuser)
    if(deleteuser.deletedCount===1){
        res.send({message:"one product deleted",payload:duser})
    }
    else{
        res.send({message:'product is not deleted',payload:duser})
    }
    
}))


//exporting product api
module.exports=productapi