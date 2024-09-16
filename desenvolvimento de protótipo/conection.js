const mysql = require('mysql2');

const connection = mysql.createConnection({
host:'localhost',
user:'root',
password:'admin',
database:'prototipo'
})

connection.connect(err=>{
    if(err){
        console.log("erro ao acessar banco:", err);
        return;
    }
    console.log('conectado  ao banco!')
}

);