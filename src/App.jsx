
import { SideBar } from './components/SideBar';
import { useOrdenes, OrdenesProvider} from './context';
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './components/Home';
import { Header } from './components/Header';

function App() {
  return (

  <div className="grid-container">
    <OrdenesProvider>
      <BrowserRouter>
        <SideBar />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route />
          <Route />
        </Routes>
      </BrowserRouter>
    </OrdenesProvider>
  </div>   

  );
}

export default App;
