console.log("hi");
let parent = document.getElementById("grid")

// parent.innerHTML += "<div class=\"title\"><h1>ugh</h1></div>"
var files = [];

parms = new URLSearchParams(window.location.search)
let path = parms.get('path');
fetch("list/" + path)
    .then(data => { return data.json() })
    .then(res => {
        files = []
        
        console.log(res);
        for (let i = -1; i < res.length; i++) {
            const x = res[i];
            let newUrl = x ? `${x?.dir ? "explorer?path=" : "file/"}${x?.path}` : `explorer?path=${path.substr(0, path.lastIndexOf('\\'))}`
            let name = x ? x?.path?.substr(x.path?.lastIndexOf('\\')+1) : "  ..../"
            let node = document.createElement('div')
            node.className = i%2==0 ? "title" : "title light";
            // if(i%2==0) {node.style.backgroundColor = "rgb(48, 48, 48)";}
            node.id = "test"
            if(i == res.length-1){
                node.style.borderBottomLeftRadius = "10px"
                node.style.borderBottomRightRadius = "10px"
            }
            let iconHtml;
            if(x?.dir || !x){
                iconHtml = `<img  src="folder.svg"  class="file">`
            }else if((/(.zip|.rar)$/g).test(x?.path)){
                iconHtml = `<img  src="zip.svg"  class="file">`
            }else{
                iconHtml = `<img  src="file.svg"  class="file">`
            }
            node.innerHTML += `<div class="name">${iconHtml}<a href="${newUrl}" style="color: inherit; text-decoration: none;">${name}</a></div>`
            node.innerHTML += `<div class="size"><a href="${newUrl}" style="color: inherit; text-decoration: none;">${name}</a></div>`
            files.push(node)
            parent.appendChild(node)
            
        }
    })



console.log(window.location.origin);