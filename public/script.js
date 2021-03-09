var figs=[]
var username = ''
var figure_size = document.getElementById("figureSize");
const canvas = document.querySelector('#myCanvas')
canvas.width = document.getElementById("drawingbox").clientWidth;
canvas.height= document.getElementById("drawingbox").clientHeight;
var shape = document.getElementById("shapes");
var bg_color = document.getElementById("bgcolor");
var border_col = document.getElementById("bordercolor");
var border_thickness = document.getElementById("borderThickness");

var socket = io();

const ctx = canvas.getContext('2d')
addEventListener('load', () => {
  document.getElementById('display').disabled = true;
  let input = document.getElementById('username')
  input.value = ''
})
addEventListener('resize', () => {
    canvas.width = document.getElementById("drawingbox").clientWidth;
    canvas.height = document.getElementById("drawingbox").clientHeight;
    reLoadFigs()
})

function registerUser(){
    let input = document.getElementById('username')
    let display_btn = document.getElementById('display')
    let user_message = document.getElementById('user_message')
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(input.value.length >= 6){
        
        //Unlock display button
        if(display_btn.disabled == true){ display_btn.disabled = false}
        username = input.value
        user_message.innerHTML = `You are now logged in as : <b>${username}</b>`
        reLoadFigs()
    }
    else{
        if(display_btn.disabled == false){ display_btn.disabled = true }
        username = input.value
        user_message.innerHTML = `username didn't match length criteria! Please register with username length >= 6`
        reLoadFigs()
    }
}


function reLoadFigs(){
    getData().then((loadedFigure) => {
        if(loadedFigure){
          console.log(loadedFigure)
            for(let i = 0; i < loadedFigure.length; i++){
              
                if(loadedFigure[i].shape == 'Triangle'){
                    drawTriangle(loadedFigure[i].figSize, loadedFigure[i].borderSize, loadedFigure[i].start, loadedFigure[i].borderColor, loadedFigure[i].backgroundColor, false)
                }
                else if(loadedFigure[i].shape == 'Square'){
                    drawSquare(loadedFigure[i].figSize, loadedFigure[i].borderSize, loadedFigure[i].start, loadedFigure[i].borderColor, loadedFigure[i].backgroundColor, false)
                }
                else if(loadedFigure[i].shape == 'Circle'){
                    drawCircle(loadedFigure[i].figSize, loadedFigure[i].borderSize, loadedFigure[i].start, loadedFigure[i].borderColor, loadedFigure[i].backgroundColor, false)
                }
            }        
        }        
    })
}

function display(){
    let shape = document.getElementById('shapes').value
    if(shape == 'Triangle'){
        drawTriangle()
    }
    else if(shape == 'Square'){
        drawSquare()
    }
    else if(shape == 'Circle'){
        drawCircle()
    }
    
}

function drawTriangle(figSize = parseInt(document.getElementById('figureSize').value), borderSize = parseInt(document.getElementById('borderThickness').value), start = getStartingPoint(figSize, borderSize), border_color = document.getElementById('bordercolor').value, background_color = document.getElementById('bgcolor').value, new_fig = true){
    
      ctx.beginPath();
      ctx.fillStyle = background_color;
      ctx.moveTo(start[0]-figSize/2 ,start[1]-figSize/2);
      ctx.lineTo(start[0]-figSize/2 , start[1]+figSize/2);
      ctx.lineTo(start[0] + figSize/2, start[1] + figSize/2);
      ctx.closePath();
      ctx.lineWidth = borderSize;
      ctx.fill();
      ctx.strokeStyle=border_color;
      ctx.stroke();

    let triangle = {
        user: username,
        shape: 'Triangle',
        figSize: figSize,
        borderSize: borderSize,
        start: getStartingPoint(figSize, borderSize),
        borderColor: border_color,
        backgroundColor: background_color
    }
    if(new_fig){
        sendData(triangle)
    }
}

function drawSquare(figSize = parseInt(document.getElementById('figureSize').value), borderSize = parseInt(document.getElementById('borderThickness').value), start = getStartingPoint(figSize, borderSize), border_color = document.getElementById('bordercolor').value, background_color = document.getElementById('bgcolor').value, new_fig = true){
    
    var width = figSize;
    ctx.fillStyle = background_color;
    ctx.fillRect(start[0],start[1],width,width);
    ctx.strokeStyle=border_color;
    ctx.lineWidth = borderSize;
    ctx.strokeRect(start[0],start[1],width,width);
    let square = {
        user: username,
        shape: 'Square',
        figSize: figSize,
        borderSize: borderSize,
        start: getStartingPoint(figSize, borderSize),
        borderColor: border_color,
        backgroundColor: background_color
    }
    if(new_fig){
        sendData(square)        
    }
}

function drawCircle(figSize = parseInt(document.getElementById('figureSize').value), borderSize = parseInt(document.getElementById('borderThickness').value), start = getStartingPoint(figSize, borderSize), border_color = document.getElementById('bordercolor').value, background_color = document.getElementById('bgcolor').value, new_fig = true){
  
    var r= figSize/2;
    ctx.beginPath();
    ctx.arc(start[0],start[1],r,0,2*Math.PI);
    ctx.fillStyle = background_color;
    ctx.fill();
    ctx.lineWidth = borderSize;
    ctx.strokeStyle = border_color;
    ctx.stroke();

    let circle = {
        user: username,
        shape: 'Circle',
        figSize: figSize,
        borderSize: borderSize,
        start: getStartingPoint(figSize, borderSize),
        borderColor: border_color,
        backgroundColor: background_color
    }
    if(new_fig){
        sendData(circle)        
    }
    
}

function getStartingPoint(figSize, borderSize){
    //let x = (Math.random()*(innerWidth - figSize - borderSize)) + borderSize
    //let y = (Math.random()*(innerHeight - figSize - borderSize)) + borderSize
    var x = Math.floor(Math.random()*(canvas.width));
    var y = Math.round(Math.random()*(canvas.height));
    return [x,y]
}

function sendData(data){
  socket.emit('send figure', data);
}

socket.on('share figure', (figure) => {
  if(figure.shape == 'Triangle'){
      drawTriangle(figure.figSize, figure.borderSize, figure.start, figure.borderColor, figure.backgroundColor, false)
  }
  else if(figure.shape == 'Square'){
      drawSquare(figure.figSize, figure.borderSize, figure.start, figure.borderColor, figure.backgroundColor, false)
  }
  else if(figure.shape == 'Circle'){
      drawCircle(figure.figSize, figure.borderSize, figure.start, figure.borderColor, figure.backgroundColor, false)
  }
})

/*
function sendData(data){
    fetch('/send', 
    {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    })
}

function getData(){
    return new Promise((resolve, reject) => {
        fetch('/get',
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({user: username})
        }).then(res => {
            return res.json()
        }).then(data => {
            resolve(data)
        }).catch(err => {
            reject(err)
        })     
    })
}*/
/*function randomGen(){
  var shp=["Square","Triangle","Circle"]
  var col=["white","#347fc4","#7d6b91","#989fce","#E6C9F7"] ;
  var col_bor=["#4b4a67","#5a2328","#264027","#821CC2","black"] ;
  var thickness = [2,4,6,8,10,20];
  var figSize = [20,40,60,80,100,200];
  for(let i=0;i<10;i++){
    var rnd_shp = shp[Math.floor(Math.random()*3)];
    var rnd_bg = col[Math.floor(Math.random()*5)];
    var rnd_bor = col_bor[Math.floor(Math.random()*5)];
    var rnd_thickness=thickness[Math.floor(Math.random()*6)]
    var rnd_figSize=figSize[Math.floor(Math.random()*6)]
    var x = Math.floor(Math.random()*(canvas.width));
    var y = Math.round(Math.random()*(canvas.height));
    var ctx = canvas.getContext("2d");
    if(rnd_shp=="Circle"){
      var r= rnd_figSize/2;
      ctx.beginPath();
      ctx.arc(x,y,r,0,2*Math.PI);
      ctx.fillStyle = rnd_bg;
      ctx.fill();
      ctx.lineWidth = rnd_thickness;
      ctx.strokeStyle = rnd_bor;
      ctx.stroke();
    }
    else if(rnd_shp=="Square"){
      var width = rnd_figSize;
      ctx.fillStyle = rnd_bg;
      ctx.fillRect(x,y,width,width);
      ctx.strokeStyle=rnd_bor;
      ctx.lineWidth = rnd_thickness;
      ctx.strokeRect(x,y,width,width);
    }
    else{
        ctx.beginPath();
        ctx.fillStyle = rnd_bg;
        ctx.moveTo(x-rnd_figSize/2 ,y-rnd_figSize/2);
        ctx.lineTo(x-rnd_figSize/2 , y+rnd_figSize/2);
        ctx.lineTo(x + rnd_figSize/2, y + rnd_figSize/2);
        ctx.closePath();
        ctx.lineWidth = rnd_thickness;
        ctx.fill();
        ctx.strokeStyle=rnd_bor;
        ctx.stroke();
      }
    //figs.push({"shape": rnd_shp, "bg_color": rnd_bg, "x": x, "y": y, "figure_size": rnd_figSize, "border_thickness": rnd_thickness, "border_col": rnd_bor});
  //localStorage.setItem("figures", JSON.stringify(figs));
   }
 }
 
function clearStorage(){
    localStorage.setItem("figures", JSON.stringify([]));
}
*/