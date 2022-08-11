const canvasheight = document.getElements
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const width = canvas.width
const height = canvas.height

let Fuel = 660

let xrandom = 400
let xrandom2 = 200
let xrandom3 = 600
let Hostilespawn = 1
let Canisterspawn = 1
let Asteroidspawn = 1
let random = 0
let randomspeed = 1
let bulletdropped = 0
let score = 0
let gameover = 0

const background = new Image()
const P = new Image()
const fuelimg = new Image()
const rock = new Image()
const hostile = new Image()

background.src = 'Images/space.png'
P.src = 'Images/spaceship.png'
fuelimg.src = 'Images/fuel.png'
rock.src = 'Images/asteroid.png'
hostile.src = 'Images/hostile.png'

class Player {
  constructor(x, y, bulletController) {
    this.x = x
    this.y = y
    this.bulletController = bulletController
    this.width = 50
    this.height = 50
    this.speed = 6
    document.addEventListener("keydown", this.keydown)
    document.addEventListener("keyup", this.keyup)
  } 
  draw() {
    this.move()
    ctx.drawImage(P,this.x, this.y, this.width, this.height)
    this.shoot()
  }
  shoot() {
    if (this.shootPressed) {
      const speed = 5
      const delay = 10
      const damage = 1
      const bulletX = this.x + (this.width / 2)-2
      const bulletY = this.y
      this.bulletController.shoot(bulletX, bulletY, speed, damage, delay)
    }
  }
  move() {
    if (this.leftPressed && (player.x>155)) {
      this.x -= this.speed
    }

    if (this.rightPressed && (player.x<(canvas.width-player.width-155))) {
      this.x += this.speed
    }
  }
  keydown = (e) => {
    if (e.code === "ArrowLeft") {
      this.leftPressed = true
    }
    if (e.code === "ArrowRight") {
      this.rightPressed = true
    }
    if (e.code === "Space") {
      this.shootPressed = true
    }
  }
  keyup = (e) => {
    if (e.code === "ArrowLeft") {
      this.leftPressed = false
    }
    if (e.code === "ArrowRight") {
      this.rightPressed = false
    }
    if (e.code === "Space") {
      this.shootPressed = false
    }
  }
}

class HostileShip {
  constructor(x, y, health) {
    this.x = x;
    this.y = y;
    this.health = health;
    this.width = 80;
    this.height = 80;
  }
  draw() {
    ctx.drawImage(hostile, this.x, this.y, this.width, this.height)
    this.y += 3;
    if (this.health < 1) {
      this.y = 900
    }
    if (this.y>900){
      Hostilespawn = 0
    }
  }
  gen(){
    random = Rand(1,20)
    if(random==1){
    Hostilespawn = 1
    xrandom3 = Rand(200,canvas.width-250)
    while ( xrandom3 < xrandom+120  & xrandom3 > xrandom - 20 ){
      xrandom3 = Rand(200,canvas.width-250)
    }
    
    this.x = xrandom3
    this.y = -75
    }
  }
  takeDamage(damage) {
    this.health -= damage;
  }
}

class HostileBullet{
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 5;
    this.height = 10;
    this.color = "rgb(140, 250, 78)"
  }
  draw(){
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, this.width, this.height)
    this.y +=10
  }
}

class Asteroid {
    constructor(x, y, health) {
      this.x = x;
      this.y = y;
      this.health = health;
      this.width = 100;
      this.height = 100;
      
      console.log(this.speed)
    }
    draw() {
      ctx.drawImage(rock, this.x, this.y, this.width, this.height)
      this.y += randomspeed
      if (this.y>900){
        Asteroidspawn = 0
      }
    }
    gen(){
      let random = Rand(1,50)
      if(random==1){
      Asteroidspawn = 1

      xrandom = Rand(200,canvas.width-250)
      while ( xrandom3 < xrandom+120  & xrandom3 > xrandom - 20 ){
        xrandom = Rand(200,canvas.width-250)
      }
      this.x = xrandom
      this.y = -95
      randomspeed = Rand(2,8)
      this.speed = randomspeed
      }
    }
    takeDamage(damage) {
      this.health -= damage;
    }
  }

  class Bullet {
    constructor(x, y, speed, damage) {
      this.x = x
      this.y = y
      this.speed = speed
      this.damage = damage
      this.width = 4
      this.height = 8
      this.color = "yellow"
    }
    draw() {
      ctx.fillStyle = this.color
      this.y -= this.speed
      ctx.fillRect(this.x, this.y, this.width, this.height)
    }
    collideWith(sprite) {
      if (Math.abs((sprite.x+(sprite.width/2))-this.x)+Math.abs((sprite.y+(sprite.height/2))-this.y)<50) {
        sprite.takeDamage(this.damage);
        return true;
      }
      return false;
    }
  }

  class BulletController {
    bullets = []
    timerTillNextBullet = 0
    constructor(canvas) {
      this.canvas = canvas
    }
    shoot(x, y, speed, damage, delay) {
      if (this.timerTillNextBullet <= 0) {
        this.bullets.push(new Bullet(x, y, speed, damage))
        this.timerTillNextBullet = delay
      }
      this.timerTillNextBullet--
    }
    draw() {
      this.bullets.forEach((bullet) => {
        if (this.isBulletOffScreen(bullet)) {
          const index = this.bullets.indexOf(bullet)
          this.bullets.splice(index, 1)
        }
        bullet.draw()
      })
    }
    isBulletOffScreen(bullet) {
      return bullet.y <= -bullet.height
    }
    collideWith(sprite) {
        return this.bullets.some((bullet) => {
          if (bullet.collideWith(sprite)) {
            this.bullets.splice(this.bullets.indexOf(bullet), 1);
            return true;
          }
          return false;
        });
      }
  }

  class Canister {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.width = 40;
      this.height = 40;
    }
    draw() {
      ctx.drawImage(fuelimg, this.x, this.y, this.width, this.height)
      this.y += 4;
      if (this.y>900){
        Canisterspawn = 0
      }
    }
    gen(){
      let random = Rand(1,20)
      if(random==1){
      Canisterspawn = 1
      xrandom = Rand(200,canvas.width-250)
      this.x = xrandom
      this.y = -95
      }
    }
  }

const asteroid = new Asteroid(400,-95,2)
const hostileship = new HostileShip(600,-95,5)
const hbullet = new HostileBullet(0,900)
const canister = new Canister(200,0)
const bulletController = new BulletController(canvas)
const player = new Player(690, 720, bulletController)

  function animate() {
    ctx.textAlign = 'center';
    ctx.drawImage(background,0,-5,canvas.width,canvas.height+5)
    if(gameover==0){
      bulletController.draw()
      player.draw()
      asteroid.draw()
      hostileship.draw()
      hbullet.draw()
      canister.draw()
      if((asteroid.y+asteroid.height)>720 && asteroid.y<750){
        if(player.x<asteroid.x+asteroid.width && player.x+player.width> asteroid.x){
          gameover=1
        }
      }
      if((hostileship.y+hostileship.height)>720 && hostileship.y<750){
        if(player.x<hostileship.x+hostileship.width && player.x+player.width> hostileship.x){
          gameover=1
        }
      }
      if((hbullet.y+hbullet.height)>720 && hbullet.y<750){
        if(player.x<hbullet.x+hbullet.width && player.x+player.width> hbullet.x){
          gameover=1
        }
      }
      if (Asteroidspawn==0){
        asteroid.gen()
      }
      if (Hostilespawn==0){
        hostileship.gen()
      }
      if (Canisterspawn==0){
        canister.gen()
      }
      if (canister.y>720  && canister.y <800){
        if (canister.x+canister.width >player.x && canister.x < (player.x+player.width)){
          Fuel = 660
          canister.y = 900
          score +=5
        }
      }
      if (bulletController.collideWith(asteroid)) {
        if (asteroid.health <= 0) {
          asteroid.y = 900
          asteroid.health = 2
          score +=10
        }
      }
      if (bulletController.collideWith(hostileship)) {
        if (hostileship.health <= 0) {
          hostileship.y = 900
          hostileship.health = 5
          score +=50
        }
      }
      if(hostileship.y<900 && bulletdropped == 0){
        hbullet.y = hostileship.y+70
        hbullet.x = hostileship.x + (hostileship.width/2-2)
        bulletdropped = 1
      }
      if (hbullet.y>900){
        bulletdropped=0
      }

    }
    
    //Interface
    //Left side
    ctx.fillStyle = 'white'
    ctx.font = '46px serif'

    //Right side
    ctx.fillText('Score:', 70,50)
    ctx.fillText(score, 70, 100)
    ctx.fillText('Fuel:', 1300,50)
    ctx.fillStyle = "grey"
    ctx.fillRect(1250 ,80,120,700)
    ctx.fillStyle = 'brown'
    ctx.fillRect(1260 ,100,100,660)
    ctx.fillStyle = 'yellow'
    ctx.fillRect(1260 ,760-Fuel,100,Fuel)
    ctx.rect(1260 ,100,100,660);
    ctx.stroke();
    ctx.fillStyle = 'black'
    for (i = 0; i<9; i++) {
      ctx.fillRect(1260,166+i*66, 100,3)
    }
    
    if(Fuel<=0){
      gameover=1
    }
    else{
      Fuel = Fuel -1
    }
    if(gameover==1){
      
      ctx.fillStyle="white"
      ctx.fillRect(205,155,970,540)
      let gradient = ctx.createLinearGradient(210,160,960,530);
      gradient.addColorStop(0, 'purple');
      gradient.addColorStop(.5, 'indigo');
      gradient.addColorStop(1, 'purple');
      ctx.fillStyle = gradient;
      ctx.fillRect(210,160,960,530)
      ctx.fillStyle="white"
      ctx.font = '128px serif'
      ctx.fillText(score, 690, 320)
      ctx.font = '64px serif'
      ctx.fillText("Score", 690, 450)
      ctx.fillText("Press [Space] to start again", 690, 550)
      document.addEventListener('keydown', logKey);
      function logKey(e) {
        if(e.code=="Space"){
          if(gameover==1){
            Fuel=660
            xrandom = 200
            xrandom2 = 400
            xrandom3 = 600
            Hostilespawn = 1
            Canisterspawn = 1
            Asteroidspawn = 1
            bulletdropped = 0
            score = 0 
            asteroid.y = 900
            canister.y = 900
            hostileship.y = 900
            hbullet.y = 900
          }
          gameover=0
        }
      }
    }
  }
  setInterval(animate, 1000 / 60)
function Rand(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}