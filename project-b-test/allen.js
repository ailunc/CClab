let sounds = [];
let sounds1 = [];
let row1 = [];
let row2 = [];
let row3 = [];
let row4 = [];
let row5 = [];
let row6 = [];
let row7 = [];
let row8 = [];
let rows = [row1, row2, row3, row4, row5, row6, row7, row8];
let rectangle = [];
let player = 0;
let timer = 98;
let counter = [];
let fft;
let particles = [];
class rectangles {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 0;
    this.play = 0;
  }
  display(k) {
    if (k == 0) {
      push();
      fill(43, 213, 145, 90);
      rect(this.x, this.y, 84, 57);
      pop();
    }
    if (k == 1) {
      push();
      fill(9, 247, 151, 90);
      rect(this.x, this.y, 84, 57);
      pop();
    }
  }
}
class Particle {
  constructor() {
    this.pos = p5.Vector.random2D().mult(150);
    this.vel = createVector(0, 0);
    this.acc = this.pos.copy().mult(random(0.001, 0.0001));
    this.w = random(3, 5);
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
  }
  edges(){
    if(this.pos.x < -200 || this.pos.x > 200 || this.pos.y < -190 || this.pos.y > 190){
      return true
    }
    else{
      return false;
    }
  }
  show() {
    push();
    noStroke();
    fill(255, 90);
    ellipse(this.pos.x, this.pos.y, 4);
    pop();
  }
}
function preload() {
  soundFormats("mp3");
  bg = loadImage("images/background.jpg");
  do1 = loadSound("sounds/do.mp3");
  re1 = loadSound("sounds/re.mp3");
  mi1 = loadSound("sounds/mi.mp3");
  fa1 = loadSound("sounds/fa.mp3");
  so1 = loadSound("sounds/so.mp3");
  la1 = loadSound("sounds/la.mp3");
  si1 = loadSound("sounds/si.mp3");
  do2 = loadSound("sounds/do1.mp3");
  re2 = loadSound("sounds/re1.mp3");
  mi2 = loadSound("sounds/mi1.mp3");
  fa2 = loadSound("sounds/fa1.mp3");
  so2 = loadSound("sounds/so1.mp3");
  la2 = loadSound("sounds/la1.mp3");
  si2 = loadSound("sounds/si1.mp3");
  empty = loadSound("sounds/empty.mp3");
  sounds = [do1, re1, mi1, fa1, so1, la1, si1];
  sounds1 = [do2, re2, mi2, fa2, so2, la2, si2];
  counter = [0, 0, 0, 0, 0, 0, 0, 0];
  for (i = 0; i < 8; i++) {
    rows[i].push(empty);
  }
}

function setup() {
  getAudioContext().suspend();
  let canvas = createCanvas(780, 400);
  canvas.parent("p5-canvas-container")
  // image(
  //   bg,
  //   0,
  //   0,
  //   width + 5,
  //   height,
  //   0,
  //   0,
  //   bg.width + 5,
  //   bg.height,
  //   CONTAIN,
  //   LEFT,
  //   TOP
  // );
  push();
  fill(233, 238, 244);
  stroke(196, 201, 207);
  rect(0, 0, 98, 233);
  rect(0, 233, 98, 167);
  fill(56, 57, 59);
  stroke(56, 57, 59);
  rect(0, 31, 64, 31);
  rect(0, 98, 64, 31);
  rect(0, 166, 64, 31);
  rect(0, 268, 64, 31);
  rect(0, 336, 64, 31);
  pop();
  push();
  stroke(35, 52, 62);
  for (let i = 1; i < 8; i++) {
    if (i % 2 == 0) {
      fill(51, 68, 78);
      for (let j = 0; j < 8; j++) {
        rect(98 + 84 * j, 400 - i * 57, 84, 57);
      }
    }
    if (i % 2 == 1) {
      fill(45, 62, 72);
      for (let j = 0; j < 8; j++) {
        rect(98 + 84 * j, 400 - i * 57, 84, 57);
      }
    }
  }
  pop();
  for (let i = 0; i < 8; i++) {
    for (let j = 1; j < 8; j++) {
      rectangle.push(new rectangles(98 + 84 * i, 400 - 57 * j));
    }
  }
  fft = new p5.FFT();
  angleMode(DEGREES);
}

function draw() {
  // console.log(mouseX, mouseY);
  if (player == 1) {
    // image(
    //   bg,
    //   0,
    //   0,
    //   width + 3,
    //   height,
    //   0,
    //   0,
    //   bg.width + 3,
    //   bg.height,
    //   CONTAIN,
    //   LEFT,
    //   TOP
    // );
    push();
    stroke(35, 52, 62);
    for (let i = 1; i < 8; i++) {
      if (i % 2 == 0) {
        fill(51, 68, 78);
        for (let j = 0; j < 8; j++) {
          rect(98 + 84 * j, 400 - i * 57, 84, 57);
        }
      }
      if (i % 2 == 1) {
        fill(45, 62, 72);
        for (let j = 0; j < 8; j++) {
          rect(98 + 84 * j, 400 - i * 57, 84, 57);
        }
      }
    }
    pop();
    push();
    noFill();
    stroke(255, 90);
    strokeWeight(5);
    translate(width / 2, height / 2);
    let p = new Particle();
    particles.push(p);
    for (let i = particles.length -1; i >= 0; i--) {
      if(!particles[i].edges()){
        particles[i].update();
        particles[i].show();
      }
      else{
        particles.splice(i,1);
      }
    }
    let wave = fft.waveform();
    for (let t = -1; t <= 1; t += 2) {
      beginShape();
      for (let i = 0; i <= 180; i += 0.5) {
        let index = floor(map(i, 0, 180, 0, wave.length - 1));
        let r = map(wave[index], -1, 1, 50, 200);
        let x = r * sin(i) * t;
        let y = r * cos(i) * t;
        vertex(x, y);
      }
      endShape();
    }
    pop();
    timer += 0.74;
    if (timer >= 780) {
      timer = 98;
      counter = [0, 0, 0, 0, 0, 0, 0, 0];
    }
    for (let i = 0; i < 8; i++) {
      for (let k = 0; k < 7; k++) {
        if (rectangle[i * 7 + k].play == 1) {
          rectangle[i * 7 + k].display(0);
        }
        if (
          98 + 84 * i <= timer &&
          timer <= 182 + 84 * i &&
          rows[i][0].isPlaying() == false &&
          counter[i] < 1
        ) {
          for (let j = 0; j < rows[i].length; j++) {
            rows[i][j].play();
            counter[i] += 1;
            for (let m = 0; m < 7; m++) {
              if (rectangle[i * 7 + m].play == 1) {
                rectangle[i * 7 + m].display(1);
              }
            }
          }
        }
      }
    }
  }
}

function mouseClicked() {
  // image(
  //   bg,
  //   0,
  //   0,
  //   width + 3,
  //   height,
  //   0,
  //   0,
  //   bg.width + 3,
  //   bg.height,
  //   CONTAIN,
  //   LEFT,
  //   TOP
  // );
  push();
  stroke(35, 52, 62);
  for (let i = 1; i < 8; i++) {
    if (i % 2 == 0) {
      fill(51, 68, 78);
      for (let j = 0; j < 8; j++) {
        rect(98 + 84 * j, 400 - i * 57, 84, 57);
      }
    }
    if (i % 2 == 1) {
      fill(45, 62, 72);
      for (let j = 0; j < 8; j++) {
        rect(98 + 84 * j, 400 - i * 57, 84, 57);
      }
    }
  }
  pop();
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 7; j++) {
      if (
        98 + 84 * i <= mouseX &&
        mouseX <= 183 + 84 * i &&
        345 - 57 * j <= mouseY &&
        mouseY <= 400 - 57 * j
      ) {
        rectangle[j + i * 7].life += 1;
        sounds[j].play();
      }
      if (rectangle[j + i * 7].life % 2 == 1) {
        rectangle[j + i * 7].display(0);
        rows[i].push(sounds1[j]);
        rectangle[j + i * 7].play = 1;
      }
      if (rectangle[j + i * 7].life % 2 == 0 && rectangle[j + i * 7].life > 0) {
        rows[i].pop(sounds1[j]);
        rectangle[j + i * 7].play = 0;
      }
    }
  }
}
function keyPressed() {
  if (keyCode == 32) {
    if (player == 0) {
      player = 1;
    } else {
      player = 0;
    }
  }
}
function mousePressed() {
  userStartAudio();
}
