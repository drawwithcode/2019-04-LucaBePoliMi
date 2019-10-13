var blood;
var resizer;

//empty array to be filled with a number of eyes objects later
var eyesBackground = [];
var eyesNumber = 70;


var soundtrack;

function preload() {
  soundtrack = loadSound("./assets/spooktober.mp3");
  pumpkin = loadImage("./assets/pumpkin.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight)
  angleMode(DEGREES);

  soundtrack.loop();

  //FFT measures audio and can be used later to create a waveform
  blood = new p5.FFT();
  blood.setInput(soundtrack);

  //variable resizer measures the "soundtrack" file volume, its value can be obtained later with getLevel()
  resizer = new p5.Amplitude();
  resizer.setInput(soundtrack);


  //creating instances of CreepyEyes and using them to fill the empy array
  for (var n = 0; n < eyesNumber; n++) {


    // for arc
    var eyes = new CreepyEyes(random() * width, random() * height, 10, 6, 16); //30, 18, 16);

    eyesBackground.push(eyes);

    //If not set in setup, imgOpacity will be this value every frame
    imgOpacity = 0;

  }

}

var imgOpacity;

function draw() {
  background(0, 0, 0);

  imageMode(CENTER);

  soundtrack.rate(1);


  var volume = resizer.getLevel();

  //Translates the volume of the soundtrack to a value used for eyes opacity
  var opacity = map(volume, 0, 0.35, 0, 255);

  for (var n = 0; n < eyesBackground.length; n++) {

    var eyes = eyesBackground[n];

    eyes.display();
    eyes.color.setAlpha(opacity);


  }

  //Creation of rectangles which change height and lenght according to music volume
  var recty = height;
  var rectBase = 10;
  for (i = 0; i < windowWidth; i += rectBase * 4) {

    //Lower this value to increase size change for rectangles according to volume
    var volumeCap = 0.23;


    push();

    var rectSize = map(volume, 0, volumeCap, 0, 175);

    noStroke();
    fill(96, 39, 73); //Multiplied for rectSize to add volume influence
    rect(0 + i, recty, rectBase * (0.02 * rectSize), -rectSize + sin(frameCount));
    pop();

    push();

    var rectSize = map(volume, 0, volumeCap, 0, 125);

    noStroke();
    fill(150, 46, 64);
    rect(rectBase + i, recty, rectBase * (0.02 * rectSize), -rectSize + sin(frameCount));
    pop();

    push();

    var rectSize = map(volume, 0, volumeCap, 0, 75);

    noStroke();
    fill(246, 146, 29);
    rect(2 * rectBase + i, recty, rectBase * (0.02 * rectSize), -rectSize + sin(frameCount));
    pop();

    push();

    var rectSize = map(volume, 0, volumeCap, 0, 50);
    noStroke();

    fill(177, 70, 35);
    rect(3 * rectBase + i, recty, rectBase * (0.02 * rectSize), -rectSize + sin(frameCount));
    pop();

  }

  //Creation of the "bloodstain"(waveform) which moves down depending on music volume
  var bloodStain = blood.analyze();
  push();
  noStroke();
  fill(139, 0, 0);
  for (var b = 0; b < bloodStain.length; b++) {

    var stainBase = map(b, 0, bloodStain.length, 0, width);
    var stainHeight = -height + map(bloodStain[b], 0, 255, height, 0);

    rect(stainBase, 0, width / bloodStain.length, -stainHeight);

  }
  pop();


  /*
  var eyeWidth = 30;
  var eyeHeight = 18;
  var eyesGap = 16;
  arc(width/2, height/2, eyeWidth, eyeHeight, 90, 180, OPEN);
  arc(width/2 + eyesGap, height/2, eyeWidth, eyeHeight, 0, 90, OPEN);*/

  //imgOpacity set to increase by 0.7 every frame, so that the image will slowly appear. mouseMoved is set to lower its opacity
  imgOpacity = imgOpacity + 0.7;
  if (imgOpacity > 255) {
    //This avoids opacity value being to high and so having to move the mouse a lot to make it disappear
    imgOpacity = 255
  }

  push();
  tint(255, imgOpacity);
  image(pumpkin, mouseX, mouseY, pumpkin.width, pumpkin.height);
  pop();


}
// Moving the mouse will lower pumpkin opacity
function mouseMoved() {
  imgOpacity = imgOpacity - 5;
  //This avoids opacity going below 0 and so having to wait extra time before it's visible again
  if (imgOpacity < 0) {
    imgOpacity = 0;
  }
}

//Creation of the object creepy eyes for the background
function CreepyEyes(_x, _y, _eyeWidth, _eyeHeight, _eyesGap) {

  this.x = _x;
  this.y = _y;
  this.width = _eyeWidth;
  this.height = _eyeHeight;
  this.gap = _eyesGap;
  this.color = color(231, 250, 92);

  this.display = function() {

    noStroke();
    fill(this.color);
    push();
    /*arc(this.x, this.y, this.width, this.height, 90, 200, OPEN);
    arc(this.x + this.gap, this.y, this.width, this.height, 340, 90, OPEN);*/
    ellipse(this.x, this.y, this.width, this.height);
    ellipse(this.x + this.gap, this.y, this.width, this.height);
    pop();
  }


}
