import { app } from './app.js';
import doctorRoutes from './routes/doctor.route.js';
import adminRoutes from './routes/admin.route.js'
import patientroutes from './routes/patient.route.js';
const port = process.env.PORT || 3000;

app.use('/api/doctor', doctorRoutes);
app.use('/api/admin',adminRoutes)
app.use('/api/patient', patientroutes);

app.listen(port, () => {
  return console.log(`Server started on Port: ${port}`);
});
