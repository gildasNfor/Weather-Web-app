// jshint esversion:6

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const weatherInfo = [];

const app = express();

app.use(bodyParser.urlencoded({extended:true}));


app.set("view engine", "ejs");

app.use(express.static("public"));


app.get("/",function(req, res){

  res.render("home", {weatherInfo: weatherInfo});
});

app.post("/", function(req, res){

  const city = req.body.cityName;
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+ city +"&appid=b208a89751a9e7c6269d1f4600f89591&units=metric";

  https.get(url,function(response){
    response.on("data",function(data){

      const weatherData = JSON.parse(data);

      const icon = weatherData.weather[0].icon;
      const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

      const cityData = {

        name: weatherData.name,
        symbol: weatherData.sys.country,
        temp: weatherData.main.temp,
        image: imageURL,
        description: weatherData.weather[0].description
      };

      weatherInfo.push(cityData);
      res.redirect("/");
    });
  });
});


app.listen(3000,function(){
  console.log("Server running on port 3000");
});
