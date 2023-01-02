require('colors');
const inquirer  =require('inquirer');

const pausar = {
    type:"input",
    name:"enter",
    message:`\n Presione ${"ENTER".green} para continuar `
}

const preguntas = [
    {
        type:'list',
        name:"opcion",
        message:"¿Qué desea hacer?",
        choices: [
            {
                value:1,
                name:`${"1".green}. Buscar Ciudad`
            },{
                value:2,
                name:`${"2".green}. Historial`
            },{
                value:0,
                name: `${"0".green}. Salir`
            }
          ]
    }
]

const inquirerMenu = async ()=>{
    console.clear();
    console.log("=======================".green);
    console.log(" Seleccione una opcion ".green);
    console.log("=======================\n".green);

    const {opcion} = await inquirer.prompt(preguntas);
    return opcion;
}

const pausa = async ()=>{
    const enter = await inquirer.prompt(pausar);
    return enter
}

const leerInput = async (mensaje)=>{
    const question = {
        type:'input',
        name:'desc',
        message:mensaje,
        validate(value){
            if(value.length===0){
                return("Por favor, ingrese un valor")
            }
            return true
        }
    }

    const {desc} = await inquirer.prompt(question);
    return desc;
}

const listarLugares = async (listado=[])=>{
    
    const choices = listado.map((lugar,index)=>{
        const i = `${index+1}.`.green
        return {
            value: lugar.id,
            name: `${i} ${lugar.nombre}`
        }
    });

    choices.unshift({
        value:0,
        name:'0'.green + " Cancelar"
    })

    const preguntas = [{
        type:'list',
        name:'id',
        message:"Seleccione un lugar: ",
        choices
    }]
    const {id}=await inquirer.prompt(preguntas);
    return id;
}

const mostrarCheck = async (listado=[])=>{
    
    const choices = listado.map((tarea,index)=>{
        const i = `${index+1}.`.green
        return {
            value: tarea.id,
            name: `${i} ${tarea.desc}`,
            checked:(tarea.creadoEn)?true:false
        }
    });

    const preguntas = [{
        type:'checkbox',
        name:'id',
        message:"Selecciones",
        choices
    }]
    const {id}=await inquirer.prompt(preguntas);
    return id;
}
 
const confirmar =async (message)=>{
    const question ={
        type:'confirm',
        name:'ok',
        message
    }

    const {ok} = await inquirer.prompt(question);
    return ok
}

module.exports= {inquirerMenu,pausa,leerInput,listarLugares,confirmar,mostrarCheck}