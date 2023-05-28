import { OrdenesProvider } from './context';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './components/Home';
import { Header } from './components/Header';
import { SideBar } from './components/SideBar';
import { Login } from './components/login';
import { Registration } from './components/registration/Registration';
import { OrderTable } from './components/tables/OrderTable';


function App() {

  const sidebarAndHeader = <>
        <SideBar />
        <Header />
  </>
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
                  {sidebarAndHeader}
                  <Home />
                </>
              }
            />
            <Route
              path="/orders"
              element={
                <>
                  {sidebarAndHeader}
                  <OrderTable />
                </>
              }
            />
            <Route
              path="/paids"
              element={
                <>
                  {sidebarAndHeader}
                  <OrderTable status ='paids' />                
                </>              
              }
            />
            <Route
              path="/reports"
              element={
                <>
                  {sidebarAndHeader}
                  <OrderTable status ='reports' />                
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
