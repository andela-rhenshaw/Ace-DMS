import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import routes from './routes/index';

dotenv.config();

const app = express();

const router = express.Router();
const port = process.env.port || 7600;

// Load middlewares

// log out request to console with morgan
app.use(logger('tiny'));

// parse incoming request bodies as json with body-parser
app.use(bodyParser.json());
// parse incoming request as querystrings also
app.use(bodyParser.urlencoded({ extended: false }));

routes(router);

// app.use('/', router);
app.listen(port, () => {
    console.log('Server started on port ' + port);
});
app.use(router);
// app.use(cors());

export default app;
