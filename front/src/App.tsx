import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router';
import { Routers } from './routers';

function App() {

  return (
        <BrowserRouter>
          <ToastContainer />
          <Routers />
        </BrowserRouter>
  )
}

export default App;
