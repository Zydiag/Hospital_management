import { app } from './app';

const port = process.env.PORT;

app.listen(port, () => {
  return console.log(`Server started on Port: ${port}`);
});
