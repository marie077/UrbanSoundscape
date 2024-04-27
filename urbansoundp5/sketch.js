//Serial communicator variables
let serial; //variable for serial object

// let latestData = ""; //variable holds data
let latestData = 0;
let audioPlayed = false;
let flipDelay = 15000;

//ripple variables
var outerDiam = 0;
let r = 212;
let g = 175;
let b = 55;
// let r = 210;
// let g = 180;
// let b = 140;
let xoff = 0.0;
let yoff = 0.0;
let zoff = 0.0;
let phase = 0.0;
let maxNoise = 0.3;


let postcard_width = 334/1.5;
let postcard_height = 193/1.5;

let bg;

//instances of ripples / postcards
// five instances each representing a building
//TODO: include postcard data later

let scale = 1.5;

let aquarium = {
	name: "Aquarium",
	x: 156/scale,
	y: 814/scale,
	outerDiam: 0,
	inputPin: 0,
	front: "",
	back: "",
	currImage: "",
	currState: "front",
};
let coke = {
	name: "Coke Museum",
	x: 1000/scale,
	y: 118/scale,
	outerDiam: 0,
	inputPin: 1,
	front: "",
	back: "",
	currImage: "",
	currState: "front",
};
let civil = {
	name: "Civil Rights Museum",
	x: 36/scale,
	y: 458/scale,
	outerDiam: 0,
	inputPin: 1,
	currState: "front",
};
let football = {
	name: "Football Hall of Fame",
	x: 1288/scale,
	y: 858/scale,
	outerDiam: 0,
	inputPin: 1,
	currState: "front",
};
let park = {
	name: "Centennial Park",
	x: 864/scale,
	y: 560/scale,
	outerDiam: 0,
	inputPin: 1,
	currState: "front",
};
let wheel = {
	name: "Ferris Wheel",
	x: 1534/scale,
	y: 514/scale,
	outerDiam: 0,
	inputPin: 1,
	currState: "front",
};

//postcard animation variables

let sound1, sound2, sound3, sound4, sound5, sound6, soundTest;

// setInterval(simulateData, 1000);

// function simulateData() {
// 	if (latestData < 6) {
// 		latestData += 1;
// 		audioPlayed = false;
// 		outerDiam = 0;
// 	} else {
// 		latestData = 0;
// 	}
	
// 	// console.log(latestData);
// }

function preload() {
	// soundFormats('mp3', 'ogg');
	sound1 = loadSound("assets/Sounds/Chord1.mp3");
	sound2 = loadSound("assets/Sounds/Chord2.mp3");
	sound3 = loadSound("assets/Sounds/Chord3.mp3");
	sound4 = loadSound("assets/Sounds/Chord4.mp3");
	sound5 = loadSound("assets/Sounds/Chord5.mp3");
	sound6 = loadSound("assets/Sounds/Chord6.mp3");

	soundTest = loadSound("assets/Sounds/progression.wav");

	// preload postcard images
	coke.front = loadImage("assets/coke-front.png");
	coke.back = loadImage("assets/coke-back.png");

	aquarium.front = loadImage("assets/aquarium-front.png");
	aquarium.back = loadImage("assets/aquarium-back.png");

	civil.front = loadImage("assets/civil-front.png");
	civil.back = loadImage("assets/civil-back.png");

	park.front = loadImage("assets/park-front.png");
	park.back = loadImage("assets/park-back.png");

	football.front = loadImage("assets/football-front.png");
	football.back = loadImage("assets/football-back.png");

	wheel.front = loadImage("assets/wheel-front.png");
	wheel.back = loadImage("assets/wheel-back.png");

	bg = loadImage("assets/background.png");
}

function setup() {
  
	createCanvas(windowWidth, windowHeight);

	coke.currImage = coke.front;
	aquarium.currImage = aquarium.front;
	civil.currImage = civil.front;
	park.currImage = park.front;
	wheel.currImage = wheel.front;
	football.currImage = football.front;
	// serial constructor
	serial = new p5.SerialPort();
	serial.list();

	let options = { baudrate: 9600 };

	//change this to your port name - adjust
	serial.open("COM9", options);
	serial.on("data", serialEvent);
}

function draw() {
	background(bg);
	image(coke.currImage, coke.x, coke.y, postcard_width, postcard_height);
	image(
		aquarium.currImage,
		aquarium.x,
		aquarium.y,
		postcard_width,
		postcard_height
	);
	image(civil.currImage, civil.x, civil.y, postcard_width, postcard_height);
	image(park.currImage, park.x, park.y, postcard_width, postcard_height);
	image(wheel.currImage, wheel.x, wheel.y, postcard_width, postcard_height);
	image(
		football.currImage,
		football.x,
		football.y,
		postcard_width,
		postcard_height
	);
    
//if data exists
	if (latestData !== 0) {
		console.log("data in");
		console.log("before reset:?" + latestData);
		switch (latestData) {
			case 1: //coke museum
			console.log("in case 1");
				wavyCircle(r, g, b, coke.x - 50, coke.y + 30);
				if (coke.currState == "front") {
					flip(coke);
					setTimeout(()=> {
						flip(coke);
					}, flipDelay);
				}
				if (!audioPlayed) {
					sound2.play();
					audioPlayed = true;
				}
				console.log('reset:' + latestData);
				break;
			case 2:
			console.log("in case 2");
				if (civil.currState == "front") {
					flip(civil);
					setTimeout(()=> {
						flip(civil);
					}, flipDelay);
				}
				wavyCircle(r, g, b, civil.x + 145, civil.y - 40);
				if (!audioPlayed) {
					sound1.play();
					audioPlayed = true;
				}
				break;
			case 3:
			console.log("in case 3");
				if (aquarium.currState == "front") {
					flip(aquarium);
					setTimeout(()=> {
						flip(aquarium);
					}, flipDelay);
				}
				wavyCircle(r, g, b, aquarium.x + 280, aquarium.y + 10);
				if (!audioPlayed) {
					sound3.play();
					audioPlayed = true;
				}
				break;
			case 4: // football
			console.log("in case 4");
				if (football.currState == "front") {
					flip(football);
					setTimeout(()=> {
						flip(football);
					}, flipDelay);
				}
				wavyCircle(r, g, b, football.x - 10, football.y - 20);
				if (!audioPlayed) {
					sound4.play();
					audioPlayed = true;
				}
				break;
			case 5: // wheel
			console.log('in case 5');
				if (wheel.currState == "front") {
					flip(wheel);
					setTimeout(()=> {
						flip(wheel);
					}, flipDelay);
				}
				wavyCircle(r, g, b, wheel.x + 40, wheel.y - 70);
				if (!audioPlayed) {
					sound5.play();
					audioPlayed = true;
				}
				break;
			case 6: // park
			console.log("in case 6");
				if (park.currState == "front") {
					flip(park);
					setTimeout(()=> {
						flip(park);
					}, flipDelay);
				}
				wavyCircle(r, g, b, park.x + 45, park.y - 50);
				if (!audioPlayed) {
					sound6.play();
					audioPlayed = true;
				}
				break;
			default:
				break;	
		}
	}
}

function flip(card) {
	if (card.currState == "front") {
		card.currImage = card.back;
		card.currState = "back";
	} else {
		card.currImage = card.front;
		card.currState = "front";
	}
}

function wavyCircle(r, g, b, x, y) {
	console.log("drawing the ripple");
	translate(x, y);
	for (var i = 0; i < 5; i++) {
		let diam = outerDiam - 20 * i;
		if (diam > 0) {
			tempr = r;
			tempg = g;
			tempb = b;
			noFill();
			let alpha = map(diam, 0, 200, 255, 0);
			stroke(r, g, b, alpha);
			strokeWeight(2.5);
			let radius = diam / 2;
			beginShape();
			for (let i = 0; i <= TWO_PI; i+=0.006) {
				let xoff = map(cos(i + phase), -1, 1, 0, maxNoise);
				let yoff =  map(sin(i), -1, 1, 0, maxNoise);
				let noiseScale = map(noise(xoff, yoff, zoff), 0, 1, 10, 20);
				let xPoint = radius * cos(i) + noiseScale;
				let yPoint = radius * sin(i) + noiseScale;
				vertex(xPoint, yPoint);
				phase += 0.006;

				// vertex(xPoint, yPoint);
			}
			endShape(CLOSE);
			// yoff += 0.03;
			zoff += 0.02;
		}
	}
	outerDiam += 3.5;
	// console.log("ripple drawn");
}

function serialEvent() {
	let currentString = serial.readBytes(); // store the data in a variable
	// trim(currentString); // get rid of whitespace
	let value;
	if (currentString.length > 0) {
		for (let i = 0; i < currentString.length; i++) {
			value = currentString[i];
		}
		audioPlayed = false;
		outerDiam = 0;
		latestData = value;
	}
	console.log(latestData);	
}

function mousePressed() {
	// console.log(mouseX, mouseY);
}
