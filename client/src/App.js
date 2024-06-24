import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css';
import Reserva from './components/Reserva';
import Inicio from './components/Inicio';
import ListaReservas from './components/ListaReservas';
import Exito from './components/Exito';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Inicio/>}/>
        <Route path='/reserva' element={<Reserva/>}/>
        <Route path='/reserva/ver' element={<ListaReservas/>}/>
        <Route path='/exito' element={<Exito/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
