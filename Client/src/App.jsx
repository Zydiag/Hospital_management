import { RouterProvider } from 'react-router-dom';
import { router } from './routes/Allroutes';

import './styles/global.css';
import './styles/index.css';

function App() {
  return <RouterProvider router={router} />;
}

export default App;

