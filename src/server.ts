require('dotenv').config();
import express, { Response, Request } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as morgan from 'morgan';
import cookieParser from 'cookie-parser';
import figlet from 'figlet';
import router from './service';

import logger, { stream } from './config/logger';
const app = express();

const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan.default('combined', { stream }));
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Mago api');
});

app.use('/api', router);

app.listen(port, () => {
  figlet('Mago API', (err, data) => {
    if (err) {
      logger.error('...');
      return;
    }
    console.log(data);
  });
  logger.info(`[server]: Server is running at http://localhost:${port}`);
});

