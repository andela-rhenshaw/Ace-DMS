import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import webpack from 'webpack';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackMiddleware from 'webpack-dev-middleware'; // eslint-disable-line
import webpackConfig from '../webpack.config';

import routes from './routes';

dotenv.config();

const app = express();

const router = express.Router();
const port = process.env.PORT || 5600;


// Load middlewares

// log out request to console with morgan
app.use(logger('tiny'));
if (process.env.NODE_ENV !== 'test') {
  const compiler = webpack(webpackConfig);
  app.use(webpackMiddleware(compiler, {
    hot: true,
    publicPath: webpackConfig.output.publicPath,
    noInfo: true
  }));
  app.use(webpackHotMiddleware(compiler));
}

// parse incoming request bodies as json with body-parser
app.use(bodyParser.json());
// parse incoming request as querystrings also
app.use(bodyParser.urlencoded({ extended: false }));


routes(router);
app.use('/api-docs', express.static(path.join(__dirname, './public/api-docs')));
app.listen(port, () => {
  console.log(`Server started on port ${port}`); // eslint-disable-line
});
app.use(router);
// app.use('*', (req, res) => {
//   // res.sendFile(`${__dirname}/../client/public/index.html`);
//   express.static('../client/public/index.html');
// });

// app.use(cors());

export default app;
