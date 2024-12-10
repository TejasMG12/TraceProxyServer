import express, { Express } from "express";
import config from "./config/config";
import { morgan } from './module/logger';
import helmet from "helmet";
import cors from "cors";
// import xss from 'xss-clean';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import passport from 'passport';
// import httpStatus from 'http-status';
import { authLimiter } from "./util";
import routes from "./routes";
// import swaggerUi from "swagger-ui-express";
// import swaggerOutput from "./swagger_output.json";

const app: Express = express();

if (config.env != "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

app.use(helmet())

const corsOptions = {
  origin: [
    'http://localhost',
    'http://localhost:5173',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

// enable cors
app.use(cors(corsOptions));
app.options('*', cors());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
// app.use(xss());
app.use(ExpressMongoSanitize());

// gzip compression
app.use(compression());

// jwt authentication
app.use(passport.initialize());

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}
app.use('/', routes);



export default app;