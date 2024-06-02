import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import doctorRoutes from './routes/doctor.route.js';
import adminRoutes from './routes/admin.route.js';
import patientroutes from './routes/patient.route.js';
import commonRoutes from './routes/refresh.route.js'
import { corsOptions } from './config/index.js';
import errorHandler from './middlewares/error.middleware.js';
export const app = express();

app.use(express.json({ type: 'application/json' }));
app.use(express.json({ limit: '32kb' }));
app.use(express.urlencoded({ extended: true, limit: '32kb' }));
// app.use(express.static("public"));
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use('/api/doctor', doctorRoutes);
app.use('/api/patient', patientroutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', commonRoutes);
app.use(errorHandler);
// app.use(cors(corsOptions));
// app.use(cors({ origin: true, credentials: true }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});
