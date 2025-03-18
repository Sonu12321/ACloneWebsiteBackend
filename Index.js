import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import ConnectDB from './DataBase.js';
import userRouter from './Router/UserRoutes.js'
import cookieParser from 'cookie-parser';

dotenv.config({
    path: './.env'
})



const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(cookieParser())


app.use('/api',userRouter)

app.get('/', (req, res) => {
  res.send('Hello World');
})

ConnectDB()
.then(() => {

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
}
)
.catch((error) => {
    console.log(`Error: ${error.message}`);
    process.exit(1);
}
)


