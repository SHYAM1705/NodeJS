let fs = require("fs");

// fs.writeFile("mycode.txt","we are using express",()=>{
//     console.log("file creared");
// });

// fs.appendFile("mycode.txt", " we are using inbuilt packages also", ()=>{
//     console.log("file updated");
// })

// fs.readFile("data.json","utf-8", (err,data)=>{
//    if(err){
//     console.log(err.message);
//    }
//    else{
//     console.log(data);
//    }  
// })
// fs.readFile("mytext.txt","utf-8", (err,data)=>{
//     if(err){
//      console.log(err.message);
//     }
//     else{
//      console.log(data);
//     }  
//  })

// fs.unlink("mycode.txt", ()=>{
//     console.log("file deleted");
// })

// fs.rename("mycode.txt","myText.txt",(err)=>{
//     if(err) throw err;
//     console.log("file renamed");
// })

let data = fs.readFileSync("mytext.txt",{encoding:"utf-8",flag:"r"});
console.log(data);

let data1 = fs.readFileSync("data.json",{encoding:"utf-8",flag:"r"});
console.log(data1);



