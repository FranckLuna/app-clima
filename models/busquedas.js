//models/busquedas.js

const fs = require('fs');
const axios = require('axios');

class Busquedas {
    historial = [];
    dbPath = './db/database.json';
    
    constructor(){
        this.leerDB();
    };

    get historialCapitalizado(){
        return this.historial.map( lugar =>{
            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUperCase() + p.subString(1) );
            return palabras.join(' ')
        })
    };

    get paramsWeather(){
        return{
            //aca va el key de openWeather
            appid: '',
            units: 'metric',
            lang: 'es'
        }
    };

    async ciudad(lugar = ''){
        const access_token = '' //aca va el key de mapbox;
        try {
            const response = await axios.get('https://api.mapbox.com/search/geocode/v6/forward', {
                params: {
                    q: lugar,
                    language: 'es',
                    access_token,
                    limit: 5
                }
                });

            return response.data.features;

        } catch (error) {
            console.log(error);
        }
    };

    async climaDelLugar(lat, lon){
        try {
            const response = await axios.get('https://api.openweathermap.org/data/2.5/weather',{
                params: { ...this.paramsWeather, lat, lon }
            });
            const { weather, main } = response.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
        } catch (error) {
            console.log('Error al obtener el clima:', error.message);
        }
    };

    agregarHistorial( lugar = '') {
        if( this.historial.includes( lugar.toLocaleLowerCase()) ){
            return;
        }

        this.historial = this.historial.splice(0,5);
        this.historial.unshift( lugar );
        this.guardarBD();
    };

    guardarBD(){
        const paylod = {
            historial: this.historial
        };
        fs.writeFileSync( this.dbPath, JSON.stringify( paylod ) );
    };

    leerDB(){
        if( !fs.existsSync( this.dbPath )) {
                return null;
            };
        
        const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8' } );
        const data = JSON.parse( info );
        
        this.historial = data.historial;
    };
};

module.exports = Busquedas;