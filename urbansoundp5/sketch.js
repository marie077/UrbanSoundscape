//Serial communicator variables
let serial; //variable for serial object
// let latestData = ""; //variable holds data
let latestData = "";

//ripple variables
var outerDiam = 0;
let r = 210;
let g = 180;
let b = 140;
let xoff = 0.0;
let yoff = 0.0;

//instances of ripples / postcards
// five instances each representing a building - for now 2 instances
//TODO: include postcard data later
let aquarium = {name:'aquarium', x: 159, y: 369, outerDiam: 0, inputPin: 0};
let cokeMuseum = {name: 'coke museum', x: 500, y: 200, outerDiam: 0, inputPin: 1};

//postcard animation variables
let postcard_x = 30;
let postcard_y = 30;
let postcard_front;
let postcard_back;
let animate = false; // change when plucked
let flipped = false; // change when plucked
let width = 780;
let height = 512;
let alpha = 0;
// let blendFactor = 0;
// let x = 200;


function setup() { 
  createCanvas(windowWidth, windowHeight);
  // serial constructor
  serial = new p5.SerialPort();
  serial.list();
  
  let options = {baudrate: 9600};
  
  //change this to your port name - adjust
  serial.open('COM5', options);
  serial.on('data', serialEvent);
  
  //postcard load
  postcard_front = loadImage("./postcard-front.jpg");
  postcard_back = loadImage("./postcard-back.jpg");
} 

function draw() { 
  background('0xFFFFFF');
  //if data exists
  if (latestData) {
    console.log('data exists');
    switch(latestData) {
      case '0': //aquarium
        console.log('aquarium');
        translate(aquarium.x, aquarium.y);
        wavyCircle(aquarium.outerDiam, r, g, b);
        triggerPostCard(aquarium.x - 250, aquarium.y - 200);
        break;
      case '1': //coke museum
        console.log('coke museum');
        translate(cokeMuseum.x, cokeMuseum.y);
        wavyCircle(cokeMuseum.outerDiam, r, g, b);
        triggerPostCard(cokeMuseum.x - 250, cokeMuseum.y - 200);
        break;
      case '2':
        break;
      case '3':
        break;
      case '4':
        break;
      case '5':
        break;
      default:
        console.log("no matches to input pin");
    }
  }
}

function wavyCircle(diam, r, g, b) {
  console.log('drawing the ripple');
  let tempr = r;
  let tempg = g;
  let tempb = b;
  
  for (var i = 0; i < 5; i++){
    diam = outerDiam - 30 * i;    
    if (diam > 0){
      tempr = map(tempr + diam, 0, width, 210, 250);
      tempg = map(tempg + diam, 0, width, 180, 250);
      tempb = map(tempb + diam, 0, width, 140, 250);
      stroke(tempr, tempg, tempb);
      strokeWeight(5);
      noFill();
      let radius = diam/2;
      beginShape();
      for (let i  = 0; i <= 360; i++) {
         let angle = radians(i);
         let noiseScale = map(noise(i * 0.006, yoff), 0, 1, -10, 10);
         let xPoint = radius * cos(angle);
         let yPoint = radius * sin(angle) + noiseScale;
         vertex(xPoint, yPoint);
      }
      endShape(CLOSE);
      yoff += 0.04;
    }
  }
  outerDiam += 6;
  console.log('ripple drawn');
}

function triggerPostCard(x, y) {
  noStroke();
  image(postcard_front, x, y, 300, 200);

  if (flipped) {
      image(postcard_back, x, y, 300, 200);
  }
  fill(80, 80, 80, alpha);
  rect(x, y, 300, 200);
  // if sensor passes threshold, set animate to true
  // currently simulated with button press
  if (keyIsPressed) {
      animate = true;
      alpha = 200;
  }

  if (animate) {
      alpha -= 1;
      flipped = true;
  }
}
// animate the flip over
function animateFlip() {
	// Draw the transition video
}

function serialEvent() {
  let currentString = serial.readLine(); // store the data in a variable
  trim(currentString); // get rid of whitespace
  if (!currentString) return; // if there's nothing in there, ignore it
  console.log(currentString); // print it out
  latestData = currentString; // save it to the global variable
}

function mousePressed() {
  console.log(mouseX, mouseY);
}