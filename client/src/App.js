import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css';
import Reserva from './components/Reserva';
import Inicio from './components/Inicio';
import ListaReservas from './components/ListaReservas';
import Exito from './components/Exito';
import Consumo from './components/Consumo';
import PDFViewerPage from './components/PDFViewerPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Inicio/>}/>
        <Route path='/reserva' element={<Reserva/>}/>
        <Route path='/reserva/ver' element={<ListaReservas/>}/>
        <Route path='/exito' element={<Exito/>}/>
        <Route path='/consumo' element={<Consumo/>}/>
        <Route path='/factura' element={<PDFViewerPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
