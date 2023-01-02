require('dotenv').config();


const { leerInput, inquirerMenu, pausa, listarLugares } =require("./helpers/inquirer") ;
const Busquedas = require("./models/busquedas");






const main =async () =>{
    const busquedas = new Busquedas()
    let opt = 0
    do{
        opt = await inquirerMenu();
        switch(opt){
            case 1: 
                const lugar = await leerInput('Ingrese el lugar que desea buscar ');
                const lugares=await busquedas.ciudad(lugar);
                const idSelected = await listarLugares(lugares);
                if(idSelected === '0') continue;
                
                const selected = lugares.find(l=>l.id===idSelected);
                busquedas.agregarHistorial(selected.nombre);

                const clima = await busquedas.clima(selected.lat,selected.lng);
                
                console.clear();
                console.log("\n Informacion de la ciudad \n".green);
                console.log("Ciudad :".cyan,selected.nombre);
                console.log("lat :".cyan,selected.lat);
                console.log("lng :".cyan,selected.lng);
                console.log("descripcion".cyan,clima.desc)
                console.log("temperatura :".cyan,clima.temp);
                console.log("max :".cyan,clima.max);
                console.log("min :".cyan,clima.min);
                break;
            case 2: 
                busquedas.historialCapitalizado.forEach((lugar,idx)=>{
                    const index = `${idx+1}.`.green;
                    console.log(`${index} ${lugar}`);
                })

                break;
        }

        if(opt !== 0 ) await pausa();
    }while(opt!==0);
}

main();