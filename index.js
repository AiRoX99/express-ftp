

/* YOUR PORT GOES HERE */
const PORT = 5050;
/* YOUR PORT GOES HERE */


const express = require('express');
const path = require('path')
const fs = require('fs');
const { EDESTADDRREQ } = require('constants');
const app = express();


function getIP() {
    'use strict';
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    const results = Object.create(null); // Or just '{}', an empty object
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }
    return results[Object.keys(results)[0]];
}


app.get('/', (req, res) => {
    res.redirect('explorer?path=C:/')
})
app.use(express.static('public'))


app.get('/file/*', async (req, res) => {
    var filePath = decodeURI(req.originalUrl).substring(6, 9999)
    if (fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory()) {
        res.sendFile(filePath);
    } else {
        res.status(500).send("File not found")
    }
})
app.get('/list/*', (req, res) => {
    var filePath = decodeURI(req.originalUrl).substring(6, 9999)
    if (filePath.endsWith(":")) filePath += "\\"
    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()) {
        // console.log(fs.readdirSync(filePath));
        // res.send(fs.readdirSync(filePath).map((x)=>{let isDir; try{isDir = fs.lstatSync(path.join(filePath, x)).isDirectory()}catch{isDir=false}return {name: x, path:path.join(filePath, x), dir: isDir}}))
        res.send(fs.readdirSync(filePath).map((x) => { let stats; try { stats = fs.lstatSync(path.join(filePath, x)) } catch { } return { name: x, path: path.join(filePath, x), dir: stats ? stats.isDirectory() : false, stats: stats } }))

    } else {
        res.status(500).send("File not found")
    }
})
app.get('/powershell/*', (req, res) => {
    var filePath2 = decodeURI(req.originalUrl).substring(12, 9999)
    if (filePath2.endsWith(":")) filePath2 += "\\"
    if (fs.existsSync(filePath2) && fs.lstatSync(filePath2).isDirectory()) {
        let powershellScript = fs.readFileSync('./powershell_template.txt', 'utf8', () => { })
        filePath2 = filePath2.replace(/\//g, "\\")
        if (!filePath2.endsWith("\\")) filePath2 += "\\"
        powershellScript = powershellScript.replace("MAINPATH", filePath2)
        powershellScript = powershellScript.replace("localhost", req.hostname)
        powershellScript = powershellScript.replace("PORT", PORT)
        res.send(powershellScript)
    } else {
        res.status(500).send("File not found")
    }
})
app.get('/', (req, res) => {
    res.redirect('explorer?path=C:/')
})
app.get('/explorer', (req, res) => {
    if (!req.query.path) res.redirect('explorer?path=C:/')
    res.sendFile(path.join(__dirname, 'public/index.html'))
    // res.redirect('explorer?path=C:/')
})
app.get('/test', (req, res)=>{
    res.send('pong!')
    console.log(req.hostname);
})
app.listen(PORT, ()=>{
    const ips = getIP();
    if(ips?.forEach){
        ips.forEach(x=>{
            console.log(`Host started on http:/${x}:${PORT}`);
        })
    }else{
        console.log(`Host started on http:/${getIP()}:${PORT}`);
    }
})