const express = require('express')
const app = express();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("kuuntelen porttia " + port));


app.use(express.static("public"));

app.use(express.json({limit: '1mb'}));


const pisteet = [
    {
        "pelaaja": "Suvi",
        "pisteet": "86"
    },
    {
      "pelaaja": "Mary",
      "pisteet": "25"
    }
]

app.get('/api/pisteet', function (request, response) {
  response.send(pisteet);
})

app.post('/api/tallenna', function (request, response) {
  console.log(request.body);
  pisteet.push(request.body);
  console.log(pisteet);
  response.send(200);
})
