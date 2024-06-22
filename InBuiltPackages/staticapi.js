let http = require("http");
let fs = require("fs");

let server = http.createServer((req,res)=>{
    fs.readFile("mytext.txt","utf-8", (err,data)=>{
        if(err) throw err;
        res.write(data);
        res.end();
    })
   
})

server.listen(7601);