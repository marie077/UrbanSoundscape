//Serial communicator variables
let serial; //variable for serial object

// let latestData = ""; //variable holds data
let latestData;
let audioPlayed = false;
let flipDelay = 10000;

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


let postcard_width = 334;
let postcard_height = 193;

let bg;

//instances of ripples / postcards
// five instances each representing a building
//TODO: include postcard data later

let aquarium = {
	name: "Aquarium",
	x: 177,
	y: 809,
	outerDiam: 0,
	inputPin: 0,
	front: "",
	back: "",
	currImage: "",
	currState: "front",
};
let coke = {
	name: "Coke Museum",
	x: 928,
	y: 148,
	outerDiam: 0,
	inputPin: 1,
	front: "",
	back: "",
	currImage: "",
	currState: "front",
};
let civil = {
	name: "Civil Rights Museum",
	x: 10,
	y: 438,
	outerDiam: 0,
	inputPin: 1,
	currState: "front",
};
let football = {
	name: "Football Hall of Fame",
	x: 1254,
	y: 838,
	outerDiam: 0,
	inputPin: 1,
	currState: "front",
};
let park = {
	name: "Centennial Park",
	x: 847,
	y: 589,
	outerDiam: 0,
	inputPin: 1,
	currState: "front",
};
let wheel = {
	name: "Ferris Wheel",
	x: 1576,
	y: 430,
	outerDiam: 0,
	inputPin: 1,
	currState: "front",
};

//postcard animation variables

let sound1, sound2, sound3, sound4, sound5, sound6, soundTest;

// setInterval(simulateData, 2000);

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
  
	createCanvas(1920, 1080);

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
	serial.open("COM6", options);
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
				wavyCircle(r, g, b, coke.x, coke.y);
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
				wavyCircle(r, g, b, civil.x + 300, civil.y - 50);
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
				wavyCircle(r, g, b, aquarium.x + 400, aquarium.y);
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
				wavyCircle(r, g, b, football.x + 25, football.y - 25);
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
				wavyCircle(r, g, b, wheel.x + 50, wheel.y - 50);
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
				wavyCircle(r, g, b, park.x + 80, park.y - 100);
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
		let diam = outerDiam - 30 * i;
		if (diam > 0) {
			tempr = r;
			tempg = g;
			tempb = b;
			noFill();
			let alpha = map(diam, 0, 300, 255, 0);
			stroke(r, g, b, alpha);
			strokeWeight(5);
			// alpha(alpha);
			let radius = diam / 2;
			beginShape();
			for (let i = 0; i <= 360; i++) {
				let angle = radians(i);
				let noiseScale = map(noise(i * 0.006, yoff), 0, 1, -10, 10);
				let xPoint = radius * cos(angle);
				let yPoint = radius * sin(angle) + noiseScale;
				vertex(xPoint, yPoint);
			}
			endShape(CLOSE);
			yoff += 0.03;
		}
	}
	outerDiam += 3;
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
	}
	console.log(value);
	//reset audioPlayed whenever there is new data
	audioPlayed = false;
	outerDiam = 0;
	latestData = value;
}

function mousePressed() {
	// console.log(mouseX, mouseY);
}
