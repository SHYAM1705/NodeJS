async function getMeals(db,colName,query){
    return await db.collection(colName).find(query).toArray();
}

async function getMealswithsort(db,colName,query,sort){
    return await db.collection(colName).find(query).sort(sort).toArray();
}

async function getMealswithsortlimit(db,colName,query,sort,skip,limit){
    return await db.collection(colName).find(query).sort(sort).skip(skip).limit(limit).toArray();
}

async function postData(db,colName,data){
    return await db.collection(colName).insert(data)
}

async function updateData(db,colName,condition,data){
    return await db.collection(colName).update(condition,data)
}

async function deleteData(db,colName,condition){
    return await db.collection(colName).remove(condition)
}

module.exports = {getMeals,getMealswithsort,getMealswithsortlimit,postData,updateData,deleteData}