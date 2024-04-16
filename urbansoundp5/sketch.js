//Serial communicator variables
let serial; //variable for serial object
// let latestData = ""; //variable holds data
let latestData;

//ripple variables
var outerDiam = 0;
let r = 210;
let g = 180;
let b = 140;
let xoff = 0.0;
let yoff = 0.0;

//instances of ripples
// five instances each representing a building - for now 2 instances
let instances = [{name: 'ga aquarium', x: 159, y: 369, outerDiam: 0, inputPin: 9}, {name: 'high museum', x: 368, y: 450, outerDiam: 0, inputPin: 11}];

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
let x = 200;


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
  // translate(width/2, height/2);
  if (latestData) {
    for (let i = 0; i < instances.length; i++) {
      // if building is selected
      if (instances[i].inputPin == latestData) {
        translate(instances[i].x, instances[i].y);
        wavyCircle(outerDiam, r, g, b);
        noStroke();
        image(postcard_front, postcard_x, postcard_y);

        if (flipped) {
            image(postcard_back, postcard_x, postcard_y);
        }
        fill(80, 80, 80, alpha);
        rect(30, 30, width, height);
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
      r = 210;
      g = 180;
      b = 140;
    }
  }
}

function wavyCircle(diam, r, g, b) {
  console.log('drawing the ripple');
  // r = 210;
  // g = 180;
  // b = 140;
  
  for (var i = 0; i < 5; i++){
    diam = outerDiam - 30 * i;    
    if (diam > 0){
      r = map(r + diam, 0, width, 210, 250);
      g = map(g + diam, 0, width, 180, 250);
      b = map(b + diam, 0, width, 140, 250);
      stroke(r, g, b);
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