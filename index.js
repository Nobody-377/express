const express= require('express');
// require('dotenv').config();
const mysql=require('mysql2');
const cors=require('cors')

let app=express();
app.use(cors())
app.use(express.json());


let db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'todo_app'
})

db.connect((error)=>{
    if(error){
        console.log(error);   
    }
    console.log('connected to db');
    
})


app.post('/',(req,res)=>{
    let {title}= req.body;
    let sql='insert into todo(title) values(?)';
    db.query(sql,[title],(err,result)=>{
        if(err){
            console.log('something went worng');
            return res.status(500).json({error:'database error'})
        }

        res.status(201).json({
            message:'inserted successful',
            insertedId:result.insertId 
        })
    })
})



app.get('/', (req, res) => {
    
    let sql = 'SELECT * FROM todo';
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Something went wrong',
            });
        }

        res.status(200).json(result);
    });
});



app.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title,completed } = req.body;

    const sql = `
        UPDATE todo
        SET title = ?, completed = ?
        WHERE id = ?
    `;

    db.query(sql, [title,completed,id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Record not found' });
        }

        res.status(200).json({
            message: 'Record updated successfully'
        });
    });
});


app.delete('/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM todo WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error',err });
        }

        // If no row deleted
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Record not found' });
        }

        res.status(200).json({
            message: 'Record deleted successfully'
        });
    });
});


app.listen(3000,()=>{
    console.log(`server started on 3000`);
    
})