let slices = [];

function setup() {
    let canvas= createCanvas(600, 600);
    canvas.parent('canvasContainer');
  background(100);
  for (let i = 0; i < 10; i++) {
    slices[i] = new scope();
  }
  for (let i = 0; i < 10; i++) {
    let s = slices[i];
    s.display(200);
    s.calc(width, height, 10);
    s.masking();
    s.mirror();
  }
  push();
  noFill();
  strokeWeight(100);
  stroke(0, 50);
  circle(width / 2, height / 2, 200);
  pop();
  push();
  noFill();
  strokeWeight(100);
  stroke(0, 100);
  circle(width / 2, height / 2, 400);
  pop();
  push();
  noFill();
  strokeWeight(100);
  stroke(0, 150);
  circle(width / 2, height / 2, 600);
  pop();
  push();
  noFill();
  strokeWeight(100);
  stroke(0, 200);
  circle(width / 2, height / 2, 800);
  pop();
}

function draw() {}

function keyPressed() {
  background(100);
  for (let i = 0; i < 10; i++) {
    let s = slices[i];
    if (keyCode == LEFT_ARROW) {
      s.display(-200);
    }
    if (keyCode == RIGHT_ARROW) {
      s.display(200);
    }
    s.calc(width, height, 10);
    s.masking();
    s.mirror();
  }
  push();
  noFill();
  strokeWeight(100);
  stroke(0, 50);
  circle(width / 2, height / 2, 200);
  pop();
  push();
  noFill();
  strokeWeight(100);
  stroke(0, 100);
  circle(width / 2, height / 2, 400);
  pop();
  push();
  noFill();
  strokeWeight(100);
  stroke(0, 150);
  circle(width / 2, height / 2, 600);
  pop();
  push();
  noFill();
  strokeWeight(100);
  stroke(0, 200);
  circle(width / 2, height / 2, 800);
  pop();
}

class scope {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.pos = 0;
    this.shape = 0;
    this.mask = 0;
  }

  display(dirc) {
    noStroke();
    this.pos += dirc / 10;
    for (var i = 0; i < 4000; i++) {
      fill(sin(i) * 255, sin((i + this.pos) / 50) * 255, 100, 90);
      ellipse(
        sin(this.pos / 4000 + i * 0.4) * width,
        cos(i * 0.23) * height,
        40 + cos(this.pos / 4000 + 400 - i) * 50,
        40 + cos(this.pos / 3000 + i) * 50
      );

      fill(200, sin(i) * 255, sin((i + this.pos) / 50) * 255,90);
      rect(
        cos(this.pos / 30000 + i * 0.4) * width,
        sin(i * 0.23) * height,
        40 + cos(this.pos / 4000 + 400 - i) * 50,
        40 + tan(this.pos / 43000 + i) * 50
      );
    }
  }

  mirror() {
    let img = get(0, 0, this.shape.a, this.shape.o);
    img.mask(this.mask);
    push();
    translate(width / 2, height / 2);
    rotate(radians(this.pos));
    for (var i = 0; i < 10; i++) {
      if (i % 2 == 0) {
        push();
        scale(1, -1);
        image(img, 0, 0);
        pop();
      } else {
        rotate(radians(360 / 10) * 2);
        image(img, 0, 0);
      }
    }
    pop();
  }
  masking() {
    let mask = createImage(this.shape.a, this.shape.o);
    mask.loadPixels();
    for (let i = 0; i < mask.width; i++) {
      for (let j = 0; j < mask.height; j++) {
        if (i >= map(j, 0, this.shape.o, 0, this.shape.a) - 1) {
          mask.set(i, j, color(255));
        }
      }
    }
    mask.updatePixels();
    this.mask = mask;
  }
  calc(width, height, slices) {
    let a = sqrt(sq(width / 2) + sq(height / 2));
    let theta = radians(360 / slices);
    let o = tan(theta) * a;
    let h = a / cos(theta);
    this.shape = { a: round(a), o: round(o), h: round(h) };
  }
}
