//Serial communicator variables
let serial; //variable for serial object
// let latestData = ""; //variable holds data
let latestData = "";
let audioPlayed = false;

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
let aquarium = {name:'aquarium', x: 400, y: 500};
let cokeMuseum = {name: 'coke museum', x: 700, y: 100};

//postcard animation variables
let video;

let sound1, sound2, sound3, sound4, sound5, sound6;

function preload() {
  soundFormats('mp3', 'ogg');
  sound1 = loadSound('assets/Sounds/Chord1');
  sound2 = loadSound('assets/Sounds/Chord2.mp3');
  sound3 = loadSound('assets/Sounds/Chord3.mp3');
  sound4 = loadSound('assets/Sounds/Chord4.mp3');
  sound5 = loadSound('assets/Sounds/Chord5.mp3');
  sound6 = loadSound('assets/Sounds/Chord6.mp3');

  video = createVideo('assets/postcard.mp4');
  console.log('video loaded');
}

function setup() { 
  createCanvas(windowWidth, windowHeight);
  bg = loadImage('assets/background.png');
  //initialize video hide
  video.hide();
  video.play();  
  video.volume(0);
  video.autoplay();
  // serial constructor
  serial = new p5.SerialPort();
  serial.list();
  
  let options = {baudrate: 9600};
  
  //change this to your port name - adjust
  serial.open('COM5', options);
  serial.on('data', serialEvent);

  //silent buffer for audio
  audioContext = getAudioContext();
  silentBuffer = audioContext.createBuffer(1, 1, 22050);
  let source = audioContext.createBufferSource();
  source.buffer = silentBuffer;
  source.connect(audioContext.destination);
  source.start();
} 

function draw() { 
  background(bg);
  
  //if data exists
  if (latestData) {
    console.log('data exists');
    switch(latestData) {
      case '1': //aquarium
        console.log('aquarium');
        translate(aquarium.x, aquarium.y);
        wavyCircle(r, g, b);
        rotate(HALF_PI/2);
        image(video, aquarium.x - 500, aquarium.y - 350, 200, 100); // Adjust position based on rotation
        console.log(audioPlayed);
        sound1.play();
        break;
      case '0': //coke museum
        console.log('coke museum');
        translate(cokeMuseum.x, cokeMuseum.y);
        wavyCircle(r, g, b);
        rotate(HALF_PI * 1.68);
        console.log(cokeMuseum.x, cokeMuseum.y);
        image(video, cokeMuseum.x - 900, cokeMuseum.y - 260, 200, 100);
        sound2.play();
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
        video.hide();
        sound1.pause();
        sound2.pause();
    }
  } else {
    audioPlayed = false;
    video.hide();
    sound1.pause();
    sound2.pause();
  }
}

function wavyCircle(r, g, b) {
  console.log('drawing the ripple');
  
  for (var i = 0; i < 5; i++){
    let diam = outerDiam - 30 * i;    
    if (diam > 0){
      tempr = r;
      tempg = g;
      tempb = b;
      noFill();
      let alpha = map(diam, 0, 300, 255, 0);
      stroke(r, g, b, alpha);
      strokeWeight(5);
      // alpha(alpha);
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
  outerDiam += 5;
  console.log('ripple drawn');
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