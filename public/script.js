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
        
    }
    else{
        if(display_btn.disabled == false){ display_btn.disabled = true }
        username = input.value
        user_message.innerHTML = `username didn't match length criteria! Please register with username length >= 6`
        
    }
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

let isDrawing = false;
let x=0;
let y=0;


function drawLine(x1, y1, x2, y2,pencil_col=document.getElementById('pencilCol').value,pencil_size=document.getElementById('pencil_size').value) {
  // using a line between actual point and the last one solves the problem
  // if you make very fast circles, you will see polygons.
  // we could make arcs instead of lines to smooth the angles and solve the problem
  ctx.beginPath();
  ctx.strokeStyle = pencil_col;
  ctx.lineWidth = pencil_size;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
}

function drawCircleAtCursor(x,y,canvas, event) {
  // Problem with draw circle is the refresh rate of the mousevent.
  // if you move too fast, circles are not connected.
  // this is browser dependant, and can't be modified.
    ctx.beginPath()
    ctx.arc(x, y, 10/2, 0, Math.PI * 2)
    ctx.closePath()

    ctx.lineWidth = 2
    ctx.strokeStyle = "#000"
    ctx.stroke()
    
    ctx.fillStyle = "#000"
    ctx.fill()
}

canvas.addEventListener('mousedown', function(e) {
  if(username != ''){
    const rect = canvas.getBoundingClientRect()
    x = e.clientX - rect.left
    y = e.clientY - rect.top
    console.log("x: " + x + " y: " + y)
    let Last_User = document.getElementById('Last_User')
    Last_User.innerHTML = `Last user: <b>YOU</b>`
    isDrawing=true
  }
  else{
    let user_message = document.getElementById('user_message')
    user_message.innerHTML = `Not registered! Please register to use canvas`
  } 
})

canvas.addEventListener('mousemove', e => {
  if (isDrawing === true) {
    //drawCircleAtCursor(x,y,canvas, e)
    drawLine(x, y, e.offsetX, e.offsetY);
    let pencil_col=document.getElementById('pencilCol').value;
    let pencil_size=document.getElementById('pencil_size').value;
    sendLine({user: username, x: x, y: y, x2: e.offsetX, y2: e.offsetY, pencil_color: pencil_col, pencil_size: pencil_size})
    x = e.offsetX;
    y = e.offsetY;
  }
});

window.addEventListener('mouseup', e => {
  if (isDrawing === true) {
    //drawCircleAtCursor(x,y,canvas, e)
    drawLine(x, y, e.offsetX, e.offsetY);
    x = 0;
    y = 0;
    isDrawing = false;
  }
});


function sendData(data){
  socket.emit('send figure', data);
}

function sendLine(data){
  socket.emit('send Line', data);
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

socket.on('share Line', (line) => {
  let Last_User = document.getElementById('Last_User')
  Last_User.innerHTML = `Last user: <b>${line.user}</b>`
  drawLine(line.x, line.y, line.x2, line.y2, line.pencil_color, line.pencil_size)
})
