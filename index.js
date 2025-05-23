// index.js

require('dotenv').config();
const { leerInput, inquirerMenu, pausa, listarLugares } = require('./helpers/inquirerMenu');
const Busquedas = require('./models/busquedas');

const main = async () => {
    let opcion = '';
    const busquedas = new Busquedas();

    do {
        opcion = await inquirerMenu();
        
        switch ( opcion ) {
            case '1':
                const lugar = await leerInput('Ingresa la ciudad a buscar: ');
                const lugares = await busquedas.ciudad( lugar );
                const idSelec = await listarLugares( lugares );

                if ( idSelec === '0' ) continue;
                const lugarSelec = lugares.find( l => l.id === idSelec );
                
                busquedas.agregarHistorial(lugarSelec.properties.full_address);

                console.log('\nInformacion de la ciudad:\n');
                console.log('Ciudad: ', lugarSelec.properties.full_address);
                console.log('Latitud:', lugarSelec.geometry.coordinates[1]); // [lon, lat]
                console.log('Longitud:', lugarSelec.geometry.coordinates[0]); // [lon, lat]

                const latitud = lugarSelec.geometry.coordinates[0];
                const longitud = lugarSelec.geometry.coordinates[1];
                
                const clima = await busquedas.climaDelLugar(latitud, longitud);
                            console.log('======    Clima del lugar   ======');
                            console.log('Cielo: ', clima.desc);
                            console.log('Temperatura: ', clima.temp);
                            console.log('Minima: ', clima.min);
                            console.log('Maxima: ', clima.max);
                
                break;
            case '2':
                busquedas.historial.forEach( (lugar, i)=>{
                    const idx = `${ i + 1 }`.green;
                    console.log(`${ idx } ${ lugar }`);
                } );

                break;
        }
        await pausa();
    } while (opcion !== '0');
};

main();
