// Bluetooth Serial Library
#include "BluetoothSerial.h"

// Bluetooth Serial Setup
String device_name = "urbanSoundscapeController";

#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth is not enabled! Please run `make menuconfig` to and enable it
#endif

#if !defined(CONFIG_BT_SPP_ENABLED)
#error Serial Bluetooth not available or not enabled. It is only available for the ESP32 chip.
#endif

BluetoothSerial SerialBT;

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
char trigger;

// Neopixel Library
#include <Adafruit_NeoPixel.h>

// Neopixel Setup
#define PIN 12
#define NUMPIXELS 160
Adafruit_NeoPixel strip(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);
#define DELAYVAL 50
#define BRIGHTNESS 255

void setup() {
  Serial.begin(9600);

  // Bluetooth Serial Begin
  SerialBT.begin(device_name); //Bluetooth device name
  Serial.printf("The device with name \"%s\" is started.\nNow you can pair it with Bluetooth!\n", device_name.c_str());

  // Neopixel Begin
  strip.begin();
  strip.setBrightness(BRIGHTNESS);
  strip.clear();
  strip.show();

  // MPR121 Begin
  while (!Serial) {
    delay(10);}

  if (!cap.begin(0x5A)) {
    //Serial.println("MPR121 not found, check wiring?");
    while (1);
  }
  Serial.println("MPR121 found!");

}

void loop() {
  // MPR121 Sense
  currtouched = cap.touched();
    for (uint8_t i=0; i<6; i++) {
    // it if is touched and wasnt touched before
    if ((currtouched & _BV(i)) && !(lasttouched & _BV(i)) ) {
      // Bluetooth Serial Write Touched Pin Number
      wipe();
      Serial.println(i);
      trigger = char(i+1);
      SerialBT.print(trigger);
    }
  }
  lasttouched = currtouched;
}


void wipe() {
  //Serial.println("Wipe!");
  for(int i=0; i<(strip.numPixels()); i++) {
    strip.clear();
    // strip.setPixelColor(i-3, 100,100,100);
    // strip.setPixelColor(i-2, 150,150,150);
    // strip.setPixelColor(i-1, 200,200,200);
    strip.setPixelColor(i, 250,250,250);
    strip.setPixelColor(i+1, 200,200,200);
    strip.setPixelColor(i+2, 150,150,150);
    strip.setPixelColor(i+3, 100,100,100);
    strip.show();                          
    delay(DELAYVAL);                       
  }
}