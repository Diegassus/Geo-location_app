const fs = require("fs");
require("dotenv").config();
const axios = require("axios");

class Busquedas {
  historial = [];
  dbPath = "./db/database.json";

  constructor() {
    this.leerDB();
  }

  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: "es",
    };
  }

  get historialCapitalizado() {
    return this.historial.map(lugar=>{
      let palabras=lugar.split(' ');
      palabras = palabras.map(p=>p[0].toUpperCase()+p.substring(1));
      return palabras.join(' ');
    })

  }

  async ciudad(city = "") {
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json`,
        params: this.paramsMapbox,
      });

      const rta = await instance.get();
      return rta.data.features.map((lugar) => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1],
      })); //?lat=9.93333&lon=-84.08333&appid=fc19144854c0440d6948042c5a00fdf8&units=metric
    } catch (e) {
      return [];
    }
  }

  async clima(lat, lon) {
    try {
      const instance = axios.create({
        baseURL: "https://api.openweathermap.org/data/2.5/weather",
        params: {
          lat,
          lon,
          appid: process.env.OPEN_WEATHER,
          units: "metric",
          lang: "es",
        },
      });
      const rta = await instance.get();
      const { weather, main } = rta.data;
      console.log(weather, main);
      return {
        desc: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp,
      };
    } catch (e) {
      console.log(e);
    }
  }

  agregarHistorial(lugar) {
    if (this.historial.includes(lugar.toLowerCase())) {
      return;
    }
    this.historial=this.historial.splice(0,4);
    this.historial.unshift(lugar.toLowerCase());

    this.guardarDB();
  }

  guardarDB() {
    const payload = {
      historial: this.historial,
    };
    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  leerDB() {
    if (fs.existsSync(this.dbPath)) {
      const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
      this.historial = JSON.parse(info).historial;
    }
  }
}

module.exports = Busquedas;
