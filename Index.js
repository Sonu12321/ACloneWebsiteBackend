import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import ConnectDB from './DataBase.js';
import userRouter from './Router/UserRoutes.js'
import cookieParser from 'cookie-parser';
import CaptainRouter from './Router/CaptainRoute.js'
import MapsRouter from './Router/Maps.Routes.js';
import RideRouter from './Router/rideRoutes.js'


dotenv.config()



const app = express();

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173', // Allow your frontend's origin
    credentials: true, // Allow cookies and authentication headers
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(cookieParser())


app.use('/api',userRouter)
app.use('/Captain',CaptainRouter)
app.use('/Maps',MapsRouter)
app.use('/Rides',RideRouter)



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


