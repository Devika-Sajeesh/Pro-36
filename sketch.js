var dog, happyDog;
var database;
var foodS, foodStock;
var dogImg, happyDogImg;
var feed,addFood;
var fedTime,lastfed;
var foodObj;

function preload()
{
  dogImg = loadImage("dogImg1.png");
  happyDogImg = loadImage("dogImg.png");
}

function setup() {
  createCanvas(1000, 400);
  database = firebase.database();

  foodObj = new Food();
  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  dog = createSprite(800,200,20,20);
  dog.addImage(dogImg);
  dog.scale=0.2;
 
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

 
  fill(255,255,254);
  textSize(15);
  if(lastfed>=12){
    text("Last Feed : "+ lastfed%12 + " PM", 350,30);
   }else if(lastfed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastfed + " AM", 350,30);
   }

   fill("white");
   stroke("red");
   strokeWeight(2);
   textSize(18);
   text("Food remaining : "+foodS,730,290);
 
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDogImg);
 

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}