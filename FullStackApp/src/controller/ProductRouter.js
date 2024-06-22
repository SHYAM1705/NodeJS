let express = require("express");

let productRouter = express.Router();
let mongodb= require("mongodb").MongoClient;
let url = process.env.MONGO_URL;



    function router(menu){
      productRouter.route("/")
      .get((req,res)=>{
        mongodb.connect(url,function(err,dc){
          if(err){
            res.status(500).send("error while connecting");
          }else{
            let DbObj = dc.db("aprnode");
            DbObj.collection("products").find().toArray(function(err,products){
             if(err){
              res.status(203).send("error while fetching");
             }else{
              res.render('products',{title:'products page',products:products,menu});
             }
            })
  
          }
        })
      })
    
     
      productRouter.route('/category/:id')
      .get(function(req,res){

        //let id = req.params.id;
        let {id}= req.params;
        mongodb.connect(url,function(err,dc){
            let DbObj = dc.db("aprnode");
            DbObj.collection("products").find({category_id:Number(id)}).toArray(function(err,products){
              res.render('products',{title:'products page',products:products,menu});
            })
          
        })
      })


    productRouter.route("/details")
    .get((req,res)=>{
      res.send("product details");
    })
    return productRouter;
    }
  
    module.exports= router;