// Neopixel Library
#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
 #include <avr/power.h> // Required for 16 MHz Adafruit Trinket
#endif

// NeoPixels Setup
#define PIN 12
#define NUMPIXELS 60
Adafruit_NeoPixel strip(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);
#define DELAYVAL 5
#define BRIGHTNESS 255

// MPR121 Library
#include <Wire.h>
#include "Adafruit_MPR121.h"
#ifndef _BV
#define _BV(bit) (1 << (bit)) 
#endif

// MPR121 Setup
Adafruit_MPR121 cap = Adafruit_MPR121();
uint16_t lasttouched = 0;
uint16_t currtouched = 0;

void setup() {
  Serial.begin(9600);

  strip.begin();
  strip.show();
  strip.setBrightness(BRIGHTNESS);
  strip.clear();

  while (!Serial) {
    delay(10);}

  if (!cap.begin(0x5A)) {
    //Serial.println("MPR121 not found, check wiring?");
    while (1);
  }
  //Serial.println("MPR121 found!");
  
}

void loop() {
  //strip.clear();

  //Serial.println(cap.touched());
  currtouched = cap.touched();
  // Serial.println(currtouched);

  for (int i=0; i<12; i++) {
    // it if *is* touched and *wasnt* touched before, alert!
    if ((currtouched & _BV(i)) && !(lasttouched & _BV(i)) ) {
      stripWipe(i);
      // Serial.println(i);
      Serial.println(i);
    }
    //if it *was* touched and now *isnt*, alert!
    if (!(currtouched & _BV(i)) && (lasttouched & _BV(i)) ) {
      // Serial.println(cap.touched());
    }
  }

  lasttouched = currtouched;
  delay(100);
}

int stripWipe(int j) {
  // Serial.println("Wipe!");
  for(int j=3; j<(strip.numPixels()-3); j++) {
    strip.clear();
    strip.setPixelColor(j-3, 100,100,100);
    strip.setPixelColor(j-2, 150,150,150);
    strip.setPixelColor(j-1, 200,200,200);
    strip.setPixelColor(j, 250,250,250);
    strip.setPixelColor(j+1, 200,200,200);
    strip.setPixelColor(j+2, 150,150,150);
    strip.setPixelColor(j+3, 100,100,100);
    strip.show();                          
    delay(DELAYVAL);                       
  }
  for(int j = (strip.numPixels()-3); j > 3; j--) {
    strip.clear();
    strip.setPixelColor(j-3, 100,100,100);
    strip.setPixelColor(j-2, 150,150,150);
    strip.setPixelColor(j-1, 200,200,200);
    strip.setPixelColor(j, 250,250,250);
    strip.setPixelColor(j+1, 200,200,200);
    strip.setPixelColor(j+2, 150,150,150);
    strip.setPixelColor(j+3, 100,100,100);
    strip.show();                          
    delay(DELAYVAL);                       
  }
  strip.clear();
  // Serial.println("Done!");
}

// void stripClear(){
//   strip.clear();
//   strip.show();
// }