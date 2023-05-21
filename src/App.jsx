import { useOrdenes, OrdenesProvider } from './context';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './components/Home';
import { Header } from './components/Header';
import { SideBar } from './components/SideBar';
import { Login } from './components/login';
import { Registration } from './components/registration/Registration';
import { OrderTable } from './components/tables/OrderTable';


function App() {
  return (
    <div className="grid-container">
      <OrdenesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route
              path="/dashboard"
              element={
                <>
                  <SideBar />
                  <Header />
                  <Home />
                </>
              }
            />
            <Route
              path="/orders"
              element={
                <>
                  <SideBar />
                  <Header />
                  <OrderTable />
                </>
              }
            />
          </Routes>
        </BrowserRouter>
      </OrdenesProvider>
    </div>
  );
}

export default App;
