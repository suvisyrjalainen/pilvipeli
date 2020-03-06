var taustakuva;
var kissakuva;
var lautta_y = 300;
var lautan_leveys = 80;
var painovoima = 0.05;
var kissalista = [];
var elamat = 9;
var pisteet = 0;
var kissatimer;

function preload() {
  taustakuva = loadImage('images/tausta.png');
  kissakuva = loadImage('images/pilvi.png');
}

function setup() {
  var canvas = createCanvas(windowWidth, windowWidth / 3 );
  canvas.parent('kissapeli');
  noCursor()
  angleMode(DEGREES);
  textSize(32);
  haePistetaulukko();
}

async function haePistetaulukko(){
  const response = await fetch('api/pisteet');
  const data = await response.json();
  console.log(data);
  tayta_pistetaulukko(data);
}

function tayta_pistetaulukko(data){
  var table = document.getElementById("pistetaulukko");
  for (var i = 0; i < data.length; i++) {
    var row = table.insertRow(i + 1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = data[i].pelaaja;
    cell2.innerHTML = data[i].pisteet;
  }
  console.log(table);
}

function tyhjenna_pistetaulukko(){
  var table = document.getElementById("pistetaulukko");
  var rivien_maara = table.rows.length - 1;

  for (var i = 0; i < rivien_maara; i++) {
      table.deleteRow(1);
  }
}

function alaPelaamaan(){
  elamat = 9;
  pisteet = 0;
  kissalista = [];
  clearTimeout(kissatimer);

  loop();
  luo_kissoja();
}

function windowResized(){
  resizeCanvas(windowWidth, windowWidth / 3);
  image(taustakuva, 0, -30, windowWidth, windowWidth / 3 + 30);
}

function draw() {
   var pelin_korkeus = windowWidth / 3;
   image(taustakuva, 0, -30, windowWidth, pelin_korkeus + 30);
   lautta(pelin_korkeus);

   kissalista.forEach(function(kissa_olio, monesko){
     kissa_olio.liikuta(pelin_korkeus);
     if(kissa_olio.kissa_y > pelin_korkeus){
       kissalista.splice(monesko, 1);
       elamat = elamat - 1;


     }
     if(kissa_olio.kissa_x > windowWidth){
       kissalista.splice(monesko, 1);
       pisteet = pisteet + 1;
     }


    text('Elämät: ' + elamat + "  Pisteet: " + pisteet, 10, 30);
    if(elamat == 0){
      gameover(pelin_korkeus);
    }
   });
}

function gameover(pelin_korkeus){
  push();
  textSize(50);
  textAlign(CENTER);
  text('GAME OVER', windowWidth / 2, pelin_korkeus / 2);
  pop();

  noLoop();
}

function lautta(pelin_korkeus){
    fill('#ffe6e6');
    rect(mouseX, pelin_korkeus - 50, lautan_leveys, 30, 20, 20, 0, 0);

}

function luo_kissoja(){
  var laukaise_kissa = random(1000, 5000);
  kissa_olio = new Kissa();
  kissalista.push(kissa_olio);
  kissatimer = setTimeout(luo_kissoja, laukaise_kissa);
}

class Kissa {
  constructor() {
    this.kissa_x = 0;
    this.kissa_y = 100;
    this.kissan_korkeus = 50;
    this.kissan_leveys = 50;
    this.kissan_nopeusY = random(-2, -4);
    this.kissan_nopeusX = random(1, 5);
    this.kulma=0;
  }
  liikuta(pelin_korkeus){

    this.kissa_x = this.kissa_x + this.kissan_nopeusX;
    this.kissan_nopeusY = this.kissan_nopeusY + painovoima;

    if(this.kissa_y + this.kissan_korkeus / 2> pelin_korkeus - 50 ){
      if(this.kissa_x > mouseX && this.kissa_x < mouseX + lautan_leveys){
          this.kissan_nopeusY = -abs(this.kissan_nopeusY)
      }
    }

    this.kissa_y = this.kissa_y + this.kissan_nopeusY;

    this.kulma = this.kulma + 10;

    push();       // tallentaa koordinaatiston origon ja kulman
    translate(this.kissa_x, this.kissa_y); //siirtää koordinaatiston origon kissan kohdalle
    rotate(this.kulma);
    imageMode(CENTER);         //asetaa kuvan origon kuvan keskelle
    image(kissakuva, 0 ,0 ,this.kissan_leveys, this.kissan_korkeus);
    pop();        // palauttaa koordinaatiston asetuksen alkuperäiseen

  }
}

function tallennaTulos(){
  var pelaaja = document.getElementById("pelaaja").value;

  const data = {pelaaja, pisteet};

  const options = {
    method: "POST",
    headers: {
      "Content-Type":"application/json"
    },
    body: JSON.stringify(data)
  };



  fetch('/api/tallenna', options).then(function(response) {
      if(response.status == 200){
          console.log("Sinne meni");
          tyhjenna_pistetaulukko();
          haePistetaulukko();
      }
    }, function(error){
      console.log(error.message);
    });


}
