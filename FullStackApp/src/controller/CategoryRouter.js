let express = require("express");

let categoryRouter = express.Router();
let mongodb= require("mongodb").MongoClient;
let url = process.env.MONGO_URL;


  function router(menu){
    categoryRouter.route("/")
    .get((req,res)=>{
      mongodb.connect(url,function(err,dc){
        if(err){
          res.status(500).send("error while connecting");
        }else{
          let DbObj = dc.db("aprnode");
          DbObj.collection("category").find().toArray(function(err,category){
           if(err){
            res.status(203).send("error while fetching");
           }else{
            res.render('category',{title:'category page',category:category,menu});
           }
          })

        }
      })
        
    })
  

  categoryRouter.route("/details")
  .get((req,res)=>{
    res.send("category details");
  })
  return categoryRouter;
  }

  module.exports= router;