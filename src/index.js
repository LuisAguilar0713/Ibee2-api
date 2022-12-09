const express = require('express')
const app = express();
require('dotenv').config();
const cors = require('cors');
const { con, query } = require('./config/connection');
const mysql = require('mysql');
const router = require('./routes/pacientes');
const path = require('path');


// middelwares
app.use(cors());
app.use(express.json());


// rutas
app.use(require('./routes/user'));
app.use(require('./routes/pacientes'));
app.use(require('./routes/citas'));
app.use(require('./routes/historiaClinica'));
app.use(require('./routes/pagos'));
app.use(require('./routes/agenda'));


// conecta la base de datos
con.connect((err)=>{
    if(err){
        console.log('error mysql')
        console.log(err)
    }
    console.log('base de datos conectada');
})
// keeps the conection with db server
setInterval(async()=>{
    await query('SELECT 1');
}, 5000);

const credentials = {
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'Ibee_actualizada_nueva_2'
};

app.get('/',(req,res)=>{
    res.send('hola');
})

app.get('/tratamientos', (req, res)=>{
    var connection=mysql.createConnection(credentials)
    connection.query('SELECT * FROM tratamiento', (error, result)=>{
        if(error){
            res.status(500).send(error)
        }else{
            res.status(200).send(result)
        }
    })
    connection.end
})

app.get('/estudios', (req, res)=>{
    var connection=mysql.createConnection(credentials)
    connection.query('SELECT * FROM estudios', (error, result)=>{
        if(error){
            res.status(500).send(error)
        }else{
            res.status(200).send(result)
        }
    })
    connection.end
})

const port = process.env.PORT || 8081;

// escucha por peticiones
app.listen(port,()=>{
    console.log('server corriendo en '+ port);
})



app.listen(4000, () => console.log('hola soy el servidor'))