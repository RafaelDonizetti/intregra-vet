const moment = require('moment');
function formatarMensagem(nome, text){
    return {
        nome,
        text,
        time: moment().format('h:mm:ss a')
    }
    
}

module.exports = formatarMensagem;
