const express = require('express');
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser")
const cors = require('cors')

app.use(cors())


let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    database:"nodejs",
    password:"fawaz123"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });


  app.use(bodyParser.urlencoded({ extended: false }));

  // parse application/json
  app.use(bodyParser.json());

app.get('/',(req,res)=>{
    let sql = "select * from student_register;"
    
    con.query(sql, (error, results, fields) => {
        if (error) throw error;
        console.log(results)
        res.json(results);
      });

})

app.post('/',(req,res)=>{

    let name = req.body.name
    let username = req.body.username
    let password = req.body.password

    let repeatUser = `select * from student_register where username='${username}';`
    let sql = `insert into student_register(name,username,password) values('${name}','${username}','${password}')`

    con.query(repeatUser, (error, results, fields) => {
        console.log(results.length)
        if (error) throw error;
        if(results.length!==0){
            res.json("Username aleready exist!")
        }
        else {
            con.query(sql, (error, results, fields) => {
                if (error) throw error;
                console.log(results)
                res.json(results.message);
                res.json(fields)
              });
        }
      });
})


app.put('/:id',(req,res)=>{
    let userid = req.params.id
    let name = req.body.name
    let username = req.body.username
    let password = req.body.password

    let sql = `update student_register set name='${name}',username='${username}',password='${password}' where student_id=${userid};`;
    con.query(sql, (error, results, fields) => {
        if (error) throw error;
        res.send("working")
      });
})


app.delete('/:id',(req,res)=>{
    let userid = req.params.id
    
    let sql = `delete from student_register where student_id=${userid};`;
    con.query(sql, (error, results, fields) => {
        if (error) throw error;
        res.send("working")
      });
})



app.post('/login',(req,res)=>{
    let username = req.body.username
    let password = req.body.password

    let sql = `select * from student_register where username='${username}';`

    con.query(sql,(error,results,fields)=>{
        if(error) throw error;
        if(results.length){
            if(password === results[0].password)   
                res.json("Login Successfull")
            else res.json("Wrong Password")
        }else res.json("No user found")
    })
})


const axios = require('axios');

app.get('/weather/:city', async (req, res) => {
  const apiKey = '';
  const city = req.params.city;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  try {
    const response = await axios.get(url);
    const data = response.data;
    console.log(data)
    res.send(data);
  } catch (error) {
    console.error(error);
  }
});




app.listen("4000",(req,res)=>{
    console.log("Connected to local host 4000");
})

