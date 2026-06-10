import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './hooks/useToast';
import { ToastContainer } from './components/Toasts';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import InputPaket from './pages/InputPaket';
import ManajemenStatus from './pages/ManajemenStatus';
import Laporan from './pages/Laporan';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ToastContainer />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/input" element={<InputPaket />} />
            <Route path="/manajemen" element={<ManajemenStatus />} />
            <Route path="/laporan" element={<Laporan />} />
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}
