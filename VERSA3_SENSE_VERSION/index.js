/*
----------------------------------------------
 *  Project:   Virtual Pet APP
 *  Mail:       darahbass@gmail.com
 *  Github:     SarahBass
 ---------------------------------------------
 NOTES: 
 This Clock will be larger than normal
 because it has so many animations. 
 
 Images are ALL original artwork 
 ---------------------------------------------
*/

/*--- Import Information from user Account ---*/
import { settingsStorage } from "settings";
import { me as appbit } from "appbit";
import { HeartRateSensor } from "heart-rate";
import clock from "clock";
import * as document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { battery } from 'power';
import { display } from "display";
import { today as userActivity } from "user-activity";
import {goals, today} from "user-activity";
import { units } from "user-settings";
import * as document from "document";
import { Accelerometer } from "accelerometer";


/*--- Create Local Variables for Information Storage ---*/
let daytext = "day";
let monthtext = "month";
let goalreached = "NONE";


/*--- Import Information from index.gui ---*/

let background = document.getElementById("background");
let ampm = document.getElementById("ampm");  
let evolution = document.getElementById("evolution"); 
let date = document.getElementById("date");
let pet = document.getElementById("pet");
let object = document.getElementById("object");
let poop = document.getElementById("poop");
let buttonnumber = 0;
let poops = 0;
let petnaughty = 0;
let basic = 0;
let dirty =0;
let full=0;
let version = 0;
let age = 0;
let pets ="egg";
let buttonmiddle = 0;
//Update the clock every second 
clock.granularity = "seconds";

// Get a handle on the <text> elements 
const myLabel = document.getElementById("myLabel");
const batteryLabel = document.getElementById("batteryLabel");
const stepsLabel = document.getElementById("stepsLabel");
const firelabel = document.getElementById("firelabel");
const boltlabel = document.getElementById("boltlabel");
const heartlabel = document.getElementById("heartlabel");
const stairslabel = document.getElementById("stairslabel");
const distancelabel = document.getElementById("distancelabel");
const button2 = document.getElementById("button-1");
const button1 = document.getElementById("button-2");
const buttonmid = document.getElementById("button-3");
const buttonleft = document.getElementById("button-4");
var demoinstance = document.getElementById("demoinstance");
var demogroup = demoinstance.getElementById("demogroup");

const sleepmeter = document.getElementById("sleepmeter");
const hungermeter = document.getElementById("hungermeter");


  
  if (HeartRateSensor && appbit.permissions.granted("access_heart_rate")) {
   const hrm = new HeartRateSensor();
  hrm.addEventListener("reading", () => {
    heartlabel.text = (`${hrm.heartRate}`);

  });
  display.addEventListener("change", () => {
    // Automatically stop the sensor when the screen is off to conserve battery
    display.on ? hrm.start() : hrm.stop();
  });
  hrm.start();
  }else {heartlabel.text = "off";}



/*--- CLOCK START ---*/
clock.ontick = (evt) => {

  let today = evt.date;
  let hours = today.getHours();
  let months = today.getMonth();
  let days = today.getDay();
  let dates = today.getDate();
  let years = today.getFullYear();
  let mins = util.zeroPad(today.getMinutes());
  let seconds = today.getSeconds();
  
  demoinstance.animate("enable"); 

 /*--- Update Stats for Screen ---*/
  updateScene();
  if (units.distance == "us"){
  distancelabel.text = (0.000621371 * userActivity.adjusted.distance).toFixed(1) + " mi";}
  else {distancelabel.text = (0.001 * userActivity.adjusted.distance).toFixed(1) + " km";}

  stairslabel.text = userActivity.adjusted.elevationGain;
  stepsLabel.text = userActivity.adjusted.steps;
  firelabel.text = userActivity.adjusted.calories;
  boltlabel.text = userActivity.adjusted.activeZoneMinutes.total;
  heartlabel.text = "off";  
  checkAndUpdateBatteryLevel();
       sleepmeter.text = basic+ "                     "+ (age - full);
       hungermeter.text = dirty+ "                     "+petnaughty;

  
  //AM PM -Change the image based on 24 hours
  if (util.zeroPad(hours) >= 12){ampm.text = "PM";}
  else{ampm.text = "AM";}
  
  
  //Change Pet Animations and Backgrounds

if (userActivity.adjusted.steps > goals.steps){background.image = "Gameover.jpeg";}
  else{background.image = days + ".jpeg";}
  
 //Pet creates waste based on steps 
  if ((userActivity.adjusted.steps%25) == 0){poops++;}
  if (poops < 0 ) {poops = 0;}
  if (poops > 3){poops = 3}
  
  //Not Cleaning makes Pet Naughty
  if ( petnaughty > 100){petnaughty = 100;}
  if (petnaughty < 0){petnaughty = 0;}
  
  //Sleeping increases cuteness level of form
  if (basic > 50){basic = 0;}
  if (basic < 0){basic = 0;} 
  
  
    //Not Cleaning makes Pet Dirty
  if ( dirty > 100){dirty = 100;}
  if (dirty < 0){dirty = 0;}
  
     //Eating makes pet full
  if ( full > 100){full = 100;}
  if (full < 0){full = 0;} 
  

  
   //Button to show heart
   button2.onclick = function(evt) { 
     poops--;
   console.log("Basic Level: " + basic);
   console.log("Naughty Level: " + petnaughty);
   poop.image = "poop/heart.png"; }
  
  //--------------CHANGE PET FORM IN FOREGROUND ------------------
  
  showPet();
  showPoop();
  showHearts();
  showButton();
  
   /*--- OPTION 2: TIME IMAGES FOR 12 HOUR CLOCK---*/
  //set class of each # IMAGE individually if needed for formatting
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  }else {hours = util.zeroPad(hours);}
  myLabel.text = `${hours}:${mins}`; 
  /*----------------------------SHOW CLOCK END----------------------------------*/                      

/*
  /*--- Battery Functions ---*/
  display.addEventListener('change', function () { if (this.on) {checkAndUpdateBatteryLevel();}
                                             
});
/*----------------------------END OF ON TICK-----------------------------------*/
  
/*----------------------------START OF FUNCTIONS--------------------------------*/

 /*--- Change Battery RED , GREEN & CHARGE ---*/  

function checkAndUpdateBatteryLevel() {
  batteryLabel.text = `${battery.chargeLevel}%`;
  if (battery.chargeLevel > 30){ batteryLabel.class = "labelgreen";}
  else {batteryLabel.class = "labelred";
        battery.onchange = (charger, evt) => {batteryLabel.class = "labelgreen";}}
}
 
    function showPet(){
      //egg has 1 version
      if (pets == "egg") {version = 0;}
      else if (pets == "ghost"){
        if (basic > age){ version=1;}
        else {version=0;}
      }
      else{
         if (petnaughty > age){ version=0;}
         else if(basic > age){version = 1;}
         else{version = 2;}}
          
  //0 is worst 
  //1 is best and good
  //2 is sad but good
  //3 is weird and worst
  
    //----------Pet Evolution Baby Pet -------------------
  
  //--------------CHANGE PET FORM IN FOREGROUND ------------------
  //pet/pet3v0a1.png
  if (pets == "egg" || pets == "baby"|| pets == "ghost") {
    pet.image = "pet/"+ pets + "v" + version + "a" + seconds%2 + ".png";
  }
      else{
        if (pets == "child"){
          if ((days == 4) || (days == 0)||(days == 5))
      {pet.image = "pet/"+ days+ pets + "v" + version + "a" + seconds%2 + ".png";}
        else{pet.image = "pet/" +pets + "v" + version + "a" + seconds%2 + ".png";}
         }else  {pet.image = "pet/"+ days+ pets + "v" + version + "a" + seconds%2 + ".png";}}
      
    //----------Pet Evolution Egg -------------------
  if (userActivity.adjusted.steps < goals.steps/5){
  pets = "egg";
  age = 10;}
  else if ((userActivity.adjusted.steps < ((goals.steps)*2)/5) && (userActivity.adjusted.steps > ((goals.steps*1)/5))) {
         pets = "baby";
         age = 10;
  }
  //----------Pet Evolution Mini Pet -------------------
  
  else if ((userActivity.adjusted.steps < ((goals.steps)*3)/5)&& (userActivity.adjusted.steps > ((goals.steps*2)/5))){
         pets = "child";
         age = 20;
  }
  
    //----------Pet Evolution Cup Pet -------------------
  
  else if ((userActivity.adjusted.steps < ((goals.steps)*4)/5)&& (userActivity.adjusted.steps > ((goals.steps*3)/5)))
           {
             pets = "adult";
             age = 30;
           }
  
    //----------Pet Evolution Adult Pet -------------------
  
  else if ((userActivity.adjusted.steps < goals.steps)&& (userActivity.adjusted.steps > ((goals.steps*4)/5)))
           {
             pets = "adult";
             age = 40;
           }
  //---------Game Over Pet ------------------
  
  else if (userActivity.adjusted.steps > goals.steps){
    
    pets = "ghost";
    age = 10;
    
  } else {
    pets = "egg";
    age = 20;
  }}
  
  function showPoop(){
    
     if (poops > 0){petnaughty++; dirty++;}
    
    //clear poops by moving wrist
    if (poops > 0){
    if (Accelerometer) {
   //console.log("Poop Level: " + poops);
  // console.log("Naughty Level: " + petnaughty);
   //console.log("Basic Level: " + basic);
   const accelerometer = new Accelerometer({ frequency: 30, batch: 60 });
   accelerometer.addEventListener("reading", () => { 
    if (accelerometer.y > 5 && accelerometer.x > 5 && accelerometer.z > 5){   
      poops--;
      petnaughty--;
    }
  });  
    display.addEventListener("change", () => {
    // Automatically stop the sensor when the screen is off to conserve battery
    display.on ? accel.start() : accel.stop();
  });
       accelerometer.start();
  }
  else {console.log("This device does NOT have an Accelerometer!");}
  } 
    
    
  //Change animation in background to show game over or pet waste
    //egg No Waste
  if (userActivity.adjusted.steps < goals.steps/5 && buttonnumber == 0){
    poop.image = "poop/snakev" + poops+ "a"+seconds%2 + ".png";
  }
    //Pet makes Waste
  else if (((userActivity.adjusted.steps > goals.steps/5) &&  (userActivity.adjusted.steps < goals.steps)) && buttonnumber == 0){
 //poop/poopv0a0.png
    poop.image = "poop/poopv" + poops+ "a"+seconds%2 + ".png";
  //Ghost shows "game over"
  }else if (userActivity.adjusted.steps >= goals.steps && buttonnumber == 0 ){ poop.image = "poop/gameoverv" + poops+ "a"+seconds%2 + ".png";}
else {poop.image = "blank.png";}



  }
  function showHearts(){
    if (userActivity.adjusted.steps < goals.steps/5){evolution.text = "♥";}
  else if ((userActivity.adjusted.steps < ((goals.steps)*2)/5) && (userActivity.adjusted.steps > ((goals.steps*1)/5))) {evolution.text = "♥♥";}
  else if ((userActivity.adjusted.steps < ((goals.steps)*3)/5)&& (userActivity.adjusted.steps > ((goals.steps*2)/5)))
  {evolution.text = "♥♥♥";}
  else if ((userActivity.adjusted.steps < ((goals.steps)*4)/5)&& (userActivity.adjusted.steps > ((goals.steps*3)/5)))
           {evolution.text = "♥♥♥♥";}
  else if ((userActivity.adjusted.steps < goals.steps)&& (userActivity.adjusted.steps > ((goals.steps*4)/5)))
           {evolution.text = "♥♥♥♥♥";}
  else if (userActivity.adjusted.steps > goals.steps){evolution.text = "♥♥♥♥♥";}
  else {evolution.text = "";}
  }
  
  function showButton(){
     //Show large text Clock if clicked
button1.onclick = function(evt) { buttonnumber++; }
    buttonleft.onclick = function(evt) { buttonnumber--; }
    buttonmid.onclick = function(evt) { buttonmiddle++; }
//Toggle through 7 button options
    if ( buttonnumber >7){buttonnumber = 0;}
    if (buttonnumber <= 0){buttonnumber = 0;}
    
    if (buttonnumber == 6 && (buttonmiddle ==0)){sleepmeter.class= "meters"; hungermeter.class="meters";}
    else{sleepmeter.class= "none"; hungermeter.class="none";}
    
    if (buttonnumber == 1){
        full++; basic++;}
    else if (buttonnumber == 2){basic++;}
    else if (buttonnumber == 3){petnaughty--;full--;}
    else if (buttonnumber == 4){petnaughty--;basic++;}
    else if (buttonnumber == 5){dirty--;petnaughty--;}
    else if (buttonnumber == 7){petnaughty--;basic--;}
    else{}
    

  
  if (buttonmiddle == 1 ){
                    distancelabel.class = "labelseeblue";
                    firelabel.class  = "labelseeblue";
                    boltlabel.class  = "labelseeblue";
                    heartlabel.class  = "labelseeblue";
                    stairslabel.class  = "labelseeblue";
                    evolution.class = "none";
                    basic++;
                    myLabel.class="showbigLabel";
                    date.class = "labelbigyellow";
                     stepsLabel.class = "labelpurple";
                    ampm.class = "showbigampm";
    
                      if (seconds % 2 == 0){object.image = "read.jpeg";}
                      else{object.image = "read1.jpeg";}
  }else{
                    buttonmiddle=0;
                    distancelabel.class = "none";
                    firelabel.class  = "none";
                    boltlabel.class  = "none";
                    heartlabel.class  = "none";
                    stairslabel.class  = "none";
                    
                    evolution.class = "meter";
                    myLabel.class="none";
                    date.class = "none";
                    stepsLabel.class = "none";
                    ampm.class="none";
                    object.image = "button/" + buttonnumber + seconds%2 + ".png";
    
    
    
    
  }
  }
  
/*--- Change Date and Background Functions ---*/

  function updateScene() {

   date.text = " " + daytext + " " + monthtext + " " + dates + " " + years + " ";  
  if (months == 0){monthtext = "January";}
  else if (months == 1){monthtext =  "February";}
  else if (months == 2){monthtext =  "March";}
  else if (months == 3){monthtext =  "April";}
  else if (months == 4){monthtext =  "May";}
  else if (months == 5){monthtext =  "June";}
  else if (months == 6){monthtext =  "July";}
  else if (months == 7){monthtext =  "August";}
  else if (months == 8){monthtext =  "Septemper";}
  else if (months == 9){monthtext =  "October";}
  else if (months == 10){monthtext = "November";}
  else if (months == 11){monthtext = "December";}
  else {monthtext = "MONTH";}
    
  if (days == 0){daytext =      "Sunday,";}
  else if (days == 1){daytext = "Monday,";}
  else if (days == 2){daytext = "Tuesday,";}
  else if (days == 3){daytext = "Wednesday,";}
  else if (days == 4){daytext = "Thursday,";}
  else if (days == 5){daytext = "Friday,";}
  else if (days == 6){daytext = "Saturday,";}
  else {daytext = "DAY";}
 }

}
/*----------------------------END OF FUNCTIONS--------------------------------*/
/*-------------------------------END OF CODE----------------------------------*/

