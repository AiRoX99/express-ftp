const express = require('express');
const path = require('path')
const fs= require('fs');
const { EDESTADDRREQ } = require('constants');
const app = express();


app.get('/', (req, res)=>{
    res.redirect('explorer?path=C:/')
})
app.use(express.static('public'))


app.get('/file/*', async (req, res)=>{
    var filePath  = decodeURI(req.originalUrl).substring(6, 9999)
    if(fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory()){
        res.sendFile(filePath);
    }else{
        res.status(500).send("File not found")
    }
})
app.get('/list/*', (req, res)=>{
    var filePath  = decodeURI(req.originalUrl).substring(6, 9999)
    if(filePath.endsWith(":")) filePath+="\\"
    if(fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()){
        console.log(fs.readdirSync(filePath));
        res.send(fs.readdirSync(filePath).map((x)=>{let isDir; try{isDir = fs.lstatSync(path.join(filePath, x)).isDirectory()}catch{isDir=false}return {path:path.join(filePath, x), dir: isDir}}))

    }else{
        res.status(500).send("File not found")
    }
})

app.get('/', (req, res)=>{
    res.redirect('explorer?path=C:/')
})
app.get('/explorer', (req, res)=>{
    if(!req.query.path) res.redirect('explorer?path=C:/')
    res.sendFile(path.join(__dirname, 'public/index.html'))
    // res.redirect('explorer?path=C:/')
})
app.listen(3000)