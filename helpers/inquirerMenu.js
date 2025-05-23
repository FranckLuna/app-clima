// helpers/inquirerMenu.js
const inquirer = require('inquirer');
require('colors');

const leerInput = async (message) => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value) {
                if (value.trim().length === 0) {
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];

    const { desc } = await inquirer.prompt(question);
    return desc;
};

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            { value: '1', name: `${'1.'.green} Buscar Ciudad` },
            { value: '2', name: `${'2.'.green} Lista Historial` },
            { value: '0', name: `${'0.'.green} Salir` }
        ]
    }
];

const inquirerMenu = async () => {
    console.clear();
    console.log('   =============================='.green);
    console.log('       Seleccione una opción '.white);
    console.log('   ==============================\n'.green);

    const { opcion } = await inquirer.prompt(preguntas);
    return opcion;
};

const pausa = async()=>{
    
    const question = [
        {
            type: 'input',
            name: 'enter',
            message:`\nPresione ${ 'ENTER'.green } para continuar`
        }
    ]
    console.log('\n');
    await inquirer.prompt(question);

};

const listarLugares = async( lugares = [] )=>{
    const choices = lugares.map( (lugar, i) =>{
        const idx = `${i + 1}`.green;

        return {
            value: lugar.id,
            name: `${idx} ${lugar.properties.full_address}` 
        }
    });

    choices.push({
        value: null,
        name: '0.'.green + ' Cancelar'
    });

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione ciudad',
            choices
        }
    ];

    const { id } = await inquirer.prompt(preguntas);
    return id;
};

module.exports = {
    leerInput,
    inquirerMenu,
    pausa,
    listarLugares
};
