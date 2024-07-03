import 'dotenv/config';
import express from 'express';
const  app = express();

const port = process.env.LOCALHOST_PORT

app.get('/' , (req,res) => {
    res.send('<h1> Home Route </h1>')
})
app.listen(port , () => {
    console.log(`Example app listening on port ${port}`)
} );
