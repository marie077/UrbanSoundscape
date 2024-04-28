import processing.serial.*;
import processing.sound.SoundFile;

Serial feather;

// PImage object for the map and postcards
PImage bgL, bgD;

int fadeAlpha = 0;  // Alpha value for fading in and out the postcard and bgL
float circleAlpha = 255;

int cD = 80;
int variance = 10;
int centerX = 960;
int centerY = 540;

int flipBackTime = 10000;
int lastFlipTime = 0;

color defaultRGB = color(255, 255, 255);
color currentRGB;

boolean rippling = false;
int rippleMult = 0;
int maxRippleMult = 200;

boolean fadeOutBgL = false;  // Flag to control the fade-out of bgL
boolean keepThemeColor = false;  // Flag to keep the theme color active
boolean visualLocked = false;

Venue aquarium, civil, coke, football, park, wheel;


Venue selectedVenue = null;



void setup() {
  size(1920, 1080);
  frameRate(60);
  
  preload();
  
  smooth();
  
  //String portName = "/dev/cu.usbserial-575E0525881";
  //feather = new Serial(this, portName, 9600);
}


void draw() {
  // Handle the ripple effect and initiate fading
  if (rippling && selectedVenue != null) {
    ripple(selectedVenue, selectedVenue.RGB, rippleMult);
    if (!selectedVenue.audioPlayed()) {
        selectedVenue.sound.play();
        selectedVenue.setAudioBool(true);
    }

    rippleMult += 10; // Adjust size decrease rate
    fadeAlpha = int(map(rippleMult, 0, maxRippleMult, 0, 255));  // Control fade in for bgL
    circleAlpha = map(rippleMult, 0, maxRippleMult, 255, 0); // Fade out the circle's visibility

    if (rippleMult >= maxRippleMult) {
      rippling = false;  // Stop the animation
      rippleMult = 0;    // Reset size for the next activation
      circleAlpha = 0;   // Set circle fully transparent, ready to fade in
      currentRGB = selectedVenue.RGB;  // Set color for fading in
    }
  }

  // Draw background with alpha control for fading
  tint(255, fadeAlpha);
  image(bgL, 0, 0);  // Draw fading bgL during ripple effect
  tint(255, 255 - fadeAlpha);
  image(bgD, 0, 0);  // Draw bgD, fades in as bgL fades out
  noTint();

  // Update and draw postcards and manage breathing circles
  Venue[] venues = {aquarium, civil, coke, football, park, wheel};
  for (Venue v : venues) {
    v.update();
    if (! visualLocked) {
      image(v.current, v.pcX, v.pcY);
    }

    // Manage the breathing circle for the selected venue
    if (visualLocked && v == selectedVenue) {
      image(v.current, v.pcX, v.pcY);
      if (!rippling && fadeAlpha == 255) {  // Only fade in if background is fully visible
        circleAlpha += 5; // Gradually increase alpha to fade in
        circleAlpha = constrain(circleAlpha, 0, 255); // Ensure alpha stays within bounds
      }
      color circleColor = lerpColor(defaultRGB, v.RGB, circleAlpha / 255);
      fill(circleColor, circleAlpha);
      breathingCircle(v, circleColor);
    } else {
      fill(defaultRGB, 255);
      breathingCircle(v, defaultRGB);
    }
  }

  // Manage background and circle color fade back to default
  if (!visualLocked && millis() - lastFlipTime >= flipBackTime) {
    fadeAlpha -= 5;  // Gradually decrease alpha to fade bgL out
    if (keepThemeColor && selectedVenue != null) {
      // Fade back to defaultRGB as bg fades out
      circleAlpha -= 5; // Gradually decrease alpha for the circle to fade out
      circleAlpha = constrain(circleAlpha, 0, 255);
      currentRGB = lerpColor(selectedVenue.RGB, defaultRGB, map(255 - circleAlpha, 255, 0, 0, 1));
    }

    if (fadeAlpha <= 0) {
      keepThemeColor = false;  // Stop keeping the theme color
    }
  }

  // Handle visual unlocking and cleanup after flip back time
  if (visualLocked && millis() - lastFlipTime >= flipBackTime) {
    if (selectedVenue != null && selectedVenue.isFlipped) {
      selectedVenue.flip();  // Flip back to the front
    }
    visualLocked = false;    // Unlock the visuals
    selectedVenue = null;    // Clear the selected venue
  }
}



 //<>//


void keyPressed() {
  if (visualLocked && millis() - lastFlipTime < flipBackTime) {
    // If visual is locked and the duration has not passed, ignore the key press
    return;
  }

  visualLocked = false; // Unlock the visuals if the duration has passed

  Venue newSelectedVenue = null;

  switch(key) {
    case '1':
      newSelectedVenue = aquarium;
      break;
    case '2':
      newSelectedVenue = civil;
      break;
    case '3':
      newSelectedVenue = coke;
      break;
    case '4':
      newSelectedVenue = football;
      break;
    case '5':
      newSelectedVenue = park;
      break;
    case '6':
      newSelectedVenue = wheel;
      break;
    default:
      return; // If an unrecognized key is pressed, do nothing
  }

  if (newSelectedVenue != null && !newSelectedVenue.isFlipped && selectedVenue == null) {
    selectedVenue = newSelectedVenue;
    selectedVenue.flip();  // Flip to the back
    selectedVenue.setAudioBool(false); // reset audio bool to false because there's a new piece of data
    visualLocked = true;   // Lock the visuals
    lastFlipTime = millis(); // Record the time of flip
    rippling = true;       // Start rippling
    rippleMult = 0;        // Reset ripple multiplier
    fadeAlpha = 0;         // Start with everything transparent
  }
}





void breathingCircle(Venue v, color c) {
  float diameter = cD + sin(frameCount * 0.01) * variance;

  for (int i = 60; i > 0; i--) {
    float increment = (i * 0.025) * diameter;
    float alpha = map(i, 0, 60, 0, 10);
    fill(red(c), green(c), blue(c), alpha);
    circle(v.cX, v.cY, diameter + increment);
  }

  // Draw the main circle
  fill(c, 10);
  noStroke();
  circle(v.cX, v.cY, diameter);
}

void ripple(Venue v, color c, int s) {
  
  float maxD = dist(0, 0, width, height);
  
  for (int column = 0; column <= width; column += 20) {
    for (int row = 0; row <= height; row += 20) {
      float size = dist(v.cX, v.cY, column, row);
      size = size / maxD * s;
      fill(c, 255 * s);  // Fading effect
      noStroke();
      circle(column, row, size);
    }
  }
}




void preload() {
  // Load the map to PImage bg
  bgL = loadImage("background_light.png");
  bgD = loadImage("background_dark.png");
  
  // Load positions, pins, file path, and theme color to Venue objects 
  // Aquarium
  aquarium = new Venue("aquarium", 0);
  aquarium.setCPos(575.7, 828.3);
  aquarium.setPCPos(177, 809);
  aquarium.setPath("postcards/aquarium-front.png", "postcards/aquarium-back.png", "sounds/chord1.mp3", this);
  aquarium.setRGB(34, 45, 198);
  
  // Civil Right Museum
  civil = new Venue("civil", 1);
  civil.setCPos(255.7, 396.3);
  civil.setPCPos(10, 438);
  civil.setPath("postcards/civil-front.png", "postcards/civil-back.png", "sounds/chord2.mp3", this);
  civil.setRGB(241, 75, 35);
  
  // World of Coke
  coke = new Venue("coke", 2);
  coke.setCPos(927.7, 162.3);
  coke.setPCPos(928, 148);
  coke.setPath("postcards/coke-front.png", "postcards/coke-back.png", "sounds/chord3.mp3", this);
  coke.setRGB(244, 0, 0);
  
  // College Football Hall of Fame
  football = new Venue("football", 3);
  football.setCPos(1279.7, 828.3);
  football.setPCPos(1254, 838);
  football.setPath("postcards/football-front.png", "postcards/football-back.png", "sounds/chord4.mp3", this);
  football.setRGB(182, 153, 87);
  
  // Centennial Olympic Park
  park = new Venue("park", 4);
  park.setCPos(927.7, 486.3);
  park.setPCPos(847, 589);
  park.setPath("postcards/park-front.png", "postcards/park-back.png", "sounds/chord5.mp3", this);
  park.setRGB(0, 200, 200);
  
  
  // SkyView Atlanta
  wheel = new Venue("wheel", 5);
  wheel.setCPos(1599.7, 396.3);
  wheel.setPCPos(1576, 430);
  wheel.setPath("postcards/wheel-front.png", "postcards/wheel-back.png", "sounds/chord6.mp3", this);
  wheel.setRGB(248, 217, 72);
  
  println("Preload Complete");
}

class Venue {
  String name;
  int pcX, pcY, pin;
  float cX, cY;
  PImage front, back, current;
  SoundFile sound;
  color RGB;
  boolean isFlipped;
  boolean audioPlayed = false;
  
  public Venue(String n, int iP) {
    name = n;
    pin = iP;
    isFlipped = false;
  }

  boolean audioPlayed() {
    return audioPlayed;
  }
  
  void setAudioBool(boolean status) {
    audioPlayed = status;
  }
  void setCPos(float cxpos, float cypos) {
    cX = cxpos;
    cY = cypos;
  }

  void setPCPos(int pcxpos, int pcypos) {
    pcX = pcxpos;
    pcY = pcypos;
  }

  void setPath(String fP, String bP, String sP, PApplet p) {
    front = loadImage(fP);
    back = loadImage(bP);
    current = front;
    sound = new SoundFile(p, sP);
  }
  
  void setRGB(int r, int g, int b) {
    RGB = color(r, g, b);
  }


  void flip() {
    if (!isFlipped) {
      current = back;
      isFlipped = true;
      lastFlipTime = millis();
    }
  }

  void update() {
    // Automatically flip back to front after the specified time
    if (isFlipped && millis() - lastFlipTime > flipBackTime) {
      current = front;
      isFlipped = false;
    }
  }
}
