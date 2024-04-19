import { app } from './app.js';

const port = process.env.PORT;

app.listen(port, () => {
  return console.log(`Server started on Port: ${port}`);
});
