import { app } from './app.js';
import doctorRoutes from './routes/doctorroute.js';



const port = process.env.PORT || 3000;

app.use('/api/doctor', doctorRoutes);


app.listen(port, () => {
  return console.log(`Server started on Port: ${port}`);
});
