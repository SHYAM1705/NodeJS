let express = require('express');
let app = express();
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let dotenv = require('dotenv');
dotenv.config();
let mongoUrl = process.env.MongoUrl;
let bodyParser = require('body-parser');
let cors = require('cors');
let port = process.env.PORT;
//let db;
let authKey= process.env.AuthKey
let {getMeals, getMealsSort, getMealswithsort, getMealswithsortlimit, postData, updateData,deleteData} = require('./controller/apiController');



app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors())

// function getMeals(colName,query){
//         let output;
//         db.collection(colName).find(query).toArray((err,data)=>{
//             if(err) throw err;
//             console.log('data-->>',data);
//             output= data; 
//         }) 
//         return output;
// }

// async function getMeals(colName,query){
//     return await db.collection(colName).find(query).toArray();
// }


app.get('/',(req,res)=>{
    res.status(200).send('health ok');
})

//city list
app.get('/location',(req,res)=>{
     let key = req.header('x-basic-token');
     if(key==authKey){
        db.collection('location').find().toArray((err,data)=>{
            if(err) throw err;
            res.status(200).send(data);
        })
     }else{
        res.status(203).send('not authenticated');
     }
    
})

//restaurants and mealtypes
app.get('/restaurants',(req,res)=>{
    let query = {};
    let stateId = Number(req.query.stateId);
    let mealId = Number(req.query.mealId);
    if(stateId && mealId){
        query = {state_id:stateId,
            "mealTypes.mealtype_id":mealId
        }
    }
    else if(mealId){
        query = {"mealTypes.mealtype_id":mealId}
    }
    else{
        query = {}
    }
    db.collection('restaurants').find(query).toArray((err,data)=>{
        res.status(200).send(data);
    })
})

//meals
app.get('/meals',async (req,res)=>{
    let query = {};
    let collection = 'mealType';
    // db.collection(collection).find(query).toArray((err,data)=>{
    //     res.status(200).send(data);
    // })
    let output = await getMeals(db,collection,query);
    console.log('output-->>',output);
    res.send(output);
})

//filters
app.get('/filter/:mealId',async (req,res)=>{
    let query = {};
    let sort = {cost:1};
    let skip = 0;
    let limit = 100;
    let collection = 'restaurants';
    let mealId = Number(req.params.mealId);
    let cuisineId = Number(req.query.cuisineId);
    let hcost = Number(req.query.hcost);
    let lcost = Number(req.query.lcost);

    if(req.query.skip && req.query.limit){
        skip= Number(req.query.skip);
        limit = Number(req.query.limit);
    }
    if(req.query.sort){
        query = {sort:req.query.sort}
    }
    if(cuisineId){
        query = {
            "mealTypes.mealtype_id":mealId,
            "cuisines.cuisine_id":cuisineId
        }
    }
    else if(hcost && lcost){
        query = {
            "mealTypes.mealtype_id":mealId,
            $and:[{$gt:lcost,$lt:hcost}]
        }
    }
    let output = await getMealswithsortlimit(db,collection,query,sort,skip,limit);
    res.send(output);

})

//getDeatils
app.get('/details/:id', async (req,res)=>{
   
   let _id = mongo.ObjectId(req.params.id);
   let query = {_id: _id};
   let collection = 'restaurants';
   let output = await getMeals(db,collection,query);
   res.send(output);
   console.log(output);
})

//menu
app.get('/menu/:id', async (req,res)=>{
   
    let id = Number(req.params.id);
    let query = {restaurant_id:id};
    let collection = 'menu';
    let output = await getMeals(db,collection,query);
    res.send(output);
 })

 //placeOrder
 app.post('/placeOrders',async (req,res)=>{
    let data = req.body;
    let collection = 'orders';
    let response = await postData(db,collection,data);
    res.send(response);
 })

 //menu details
 app.post('/menuDetails',async (req,res)=>{
    if(Array.isArray(req.body.id)){
        let query = {menu_id:{$in:req.body.id}}
        let collection = 'menu';
        let output = await getMeals(db,collection,query);
        res.send(output);
    }else{
          res.send('pls enter data as array [1,2,3]')
    }
 })

 //get orders
 app.get('/orders', async (req,res)=>{
   let query = {}
   if(req.query.email){
    query = {email:req.query.email}
   }
    let collection = 'orders';
    let output = await getMeals(db,collection,query);
    res.send(output);
 })

 //update order
 app.put('/updateOrders',async (req,res)=>{
    let collection = 'orders';
    let condition = {_id:req.body._id};
    let data = {
        $set:{
            "status":'delivered'
        }
    }
    let response = await updateData(db,collection,condition,data);
    res.send(response);
 })

 //delete order
 app.delete('/deleteOrders',async (req,res)=>{
    let collection = 'orders';
    let condition = {_id:req.body._id};
    let rowCount = await getMeals(db,collection,condition);
    if(rowCount.length>0){
        let response = await deleteData(db,collection,condition);
        res.send(response)
    }else{
        res.send('No order found');
    }
 })


MongoClient.connect(mongoUrl,{useNewUrlParser:true},(err,client)=>{
    if(err) console.log('error while connecting');
    db = client.db('aprnode');
    app.listen(port,()=>{
        console.log("running on port "+port);
    })
})