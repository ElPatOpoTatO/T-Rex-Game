/* 
Game state 0 es loose
Game state 1 es play
Game state 2 es inicio
*/

var trex, trex_running, edges, floor, rFloor, trex_jump, trexDeath, trexDeathImage;
var groundImage;
var mayJump;
var cactus, cactus1, cactus2, cactus3, cactus4, cactus5, cactus6;
var levelSpeed = -7;
var levelDificulty;
var cloudImg, cloud;
var score = 0;
var gameState = 2;
var cactiGr, cloudGr;
var gameOver, gameOverImage;
var reset, resetImage;
var W=600;
var H=200;
var sound_die, sound_jump, sound_score;



function preload(){
  trex_running = loadAnimation("./Assets/TrexRunning1.png","./Assets/TrexRunning2.png","./Assets/TrexRunning1.png","./Assets/TrexRunning2.png","./Assets/TrexRunning1.png","./Assets/TrexRunning2.png","./Assets/TrexRunning1.png","./Assets/TrexRunning2.png","./Assets/TrexRunning1.png","./Assets/TrexRunning2.png","./Assets/TrexRunning2closed.png");
  trex_jump = loadAnimation("./Assets/DinoStatic.png","./Assets/DinoStatic.png","./Assets/DinoStatic.png","./Assets/EyesClosed.png");
  resetImage = loadAnimation("./Assets/Charge1.png","./Assets/Charge2.png","./Assets/Charge3.png","./Assets/Charge4.png","./Assets/Charge5.png","./Assets/Charge6.png");
  groundImage = loadImage("./Assets/Floor.png");
  cactus1 = loadImage("./Assets/Cactus1.png");
  cactus2 = loadImage("./Assets/Cactus2.png");
  cactus3 = loadImage("./Assets/Cactus3.png");
  cactus4 = loadImage("./Assets/Cactus4.png");
  cactus5 = loadImage("./Assets/Cactus5.png");
  cactus6 = loadImage("./Assets/Cactus6.png");
  cloudImg = loadImage("./Assets/Cloud.png");
  gameOverImage = loadImage("./Assets/Game Over.png");
  sound_die = loadSound("./Assets/Sound Effects/die.wav");
  sound_jump = loadSound("./Assets/Sound Effects/jump.wav");
  sound_score = loadSound("./Assets/Sound Effects/point.wav");
}


function cactusCreation() {
  if (frameCount % (60-levelSpeed)===0){
    cactus = createSprite(600,170,20,50);
    
    if (gameState==1) {
      cactus.velocityX = levelSpeed;
    }
    else
    {
      cactus.velocityX = 0;
    }
    
    cactus.lifetime = 90;
    //switch case
    var randCactus = Math.floor(random(1,6));
    switch(randCactus){
      case 1: cactus.addImage(cactus1);
      break;
      case 2: cactus.addImage(cactus2);
      break;
      case 3: cactus.addImage(cactus3);
      break;
      case 4: cactus.addImage(cactus4);
      break;
      case 5: cactus.addImage(cactus5);
      break;
      case 6: cactus.addImage(cactus6);
      break;
      default:break;
    }
    cactiGr.add(cactus);
  }
  
}

function cloudSprite(){
  var cloudHeight = Math.floor(random(20,60));
  
  if (frameCount % 60===0){
    cloud = createSprite(600,20,184,52);
    cloud.y = cloudHeight;
    cloud.velocityX = ((Math.floor(random(2,10))));
    cloud.addImage(cloudImg);
    cloud.lifetime = 90;
    
    //crea una capa al t-rex y a la nube
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
   // console.log("cloud depth: "+cloud.depth);
    //console.log("T-Rex depth: "+trex.depth);
  }
}

function setup(){
  
  createCanvas(W,H);
  
  //crear sprite de Trex
  trex = createSprite(50,160,20,50);
  trex.addAnimation("jumping", trex_jump);
  trex.addAnimation("running", trex_running);

  edges = createEdgeSprites();
  floor = createSprite(300,190,600,10);
  floor.addAnimation("floor", groundImage);
  
  gameOver = createSprite(300,100);
  gameOver.addImage("gameOver", gameOverImage);
  gameOver.visible = false;

  reset = createSprite(W/2,(H/3)*2);
  reset.addAnimation("reset", resetImage);
  reset.visible = false;
 
  rFloor = createSprite(300,201,600,10);
  rFloor.visible = false;
  floor.x=floor.width / 2;
  
  //agregar tamaño y posición al Trex
  trex.scale = 1;
  trex.x = 50

  cactiGr = createGroup();
}

function draw(){
  //establecer color de fondo.
  background("white");

  text("Cursor Y: "+ mouseY, 500, 10);
  
  text(score, 300, 10);
  console.log(mayJump);

  if(gameState==2){
    if (keyDown("q")||keyDown("r")||keyDown("space")) {
      gameState=1;
    }
    //trex.changeAnimation("jumping");
  }
  else if(gameState==1){
    //limitar la velocidad del score
    console.error();
    score=score+Math.round(getFrameRate()/60);
    
    //-7=-7*141=14
    
  if (cactiGr.collide(trex)) {
    gameState=0;
    sound_die.play();
  }

  if (score % 100 === 0 && score !== 0) {
    sound_score.play();
  }

  reset.visible = false;
  gameOver.visible = false;

  cactusCreation();
  cloudSprite();

  //mueve el fondo
  floor.velocityX = levelSpeed;

  if (floor.x<=0){
    floor.x = floor.width / 2;
  }
  
  
  //cargar la posición Y del Trex
  //console.log(trex.y)
  //console.log("May Jump "+mayJump);

  if (trex.collide(rFloor))
  {
    mayJump = 1;
  }
  else
  {
    mayJump = 0;
    
  }
  
  //hacer que el Trex salte al presionar la barra espaciadora si está tocando el piso

  

  if (mayJump==1){
   if (keyDown("space")){
    trex.velocityY = -14;
    sound_jump.play();
  } 
    trex.changeAnimation("running");

  } else if(mayJump==0){
    trex.changeAnimation("jumping");
  }


}
else if (gameState==0) {
  //si es estado de perder, entonces es cuando el juego acaba
  floor.velocityX = 0;

  reset.visible = true;
  gameOver.visible = true;

  if (keyDown("q")||keyDown("r")||keyDown("space")) {
    gameState=1;
    score = 0;
  }
  
  if (mousePressedOver(reset)){
    gameState=1;
    score = 0;
  }

  //trex.changeAnimation("jumping");
}  

//evitar que el Trex caiga
  trex.collide(rFloor);
  trex.velocityY = trex.velocityY + 0.9;
  
  drawSprites();
}
/*
const deslizador = document.getElementById('');

deslizador.addEventListener('input', function() {
  levelSpeed = deslizador.value;
});*/

function link() {
  const slidebar = document.getElementById("difficulty_slidebar").value;
  
  let rango = document.querySelector("#difficulty_slidebar");
  let texto = document.querySelector("#texto_1");
  
  rango.value = 14;
  
  rango.oninput = () => {
    texto.innerHTML = rango.value
    levelSpeed = (rango.value*-1)
  };
}



/*const input = document.querySelector("difficulty")
value.textContent = input.value   /*arreglar deslizador 
input.addEventListener("input", (event) => {
  value.textContent = event.target.value
  levelSpeed = event.target.value
})*/