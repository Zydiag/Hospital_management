import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import doctorRoutes from './routes/doctorroute.js';
import patientroutes from './routes/patientroute.js';
export const app = express();

app.use(express.json({ type: 'application/json' }));

app.use('/api/doctor', doctorRoutes);
app.use('/api/patient',patientroutes);
app.use(
  cors({
    origin: process.env.CORS_ORIGINS || 'http://localhost:3000',
    credentials: true,
  })
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});
