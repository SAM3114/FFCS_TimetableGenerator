import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext';
import MainLayout from './layouts/MainLayout';
import SidebarLayout from './layouts/SidebarLayout';
import SetupPage from './pages/SetupPage';
import TimetablePage from './pages/TimetablePage';
import VisualizerPage from './pages/VisualizerPage';

export default function App() {
  return (
    <BrowserRouter>
      <AppContextProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route element={<SidebarLayout />}>
              <Route path="setup" element={<SetupPage />} />
              <Route path="timetable" element={<TimetablePage />} />
              <Route index element={<Navigate to="/setup" replace />} />
            </Route>
            <Route path="visualizer" element={<VisualizerPage />} />
          </Route>
        </Routes>
      </AppContextProvider>
    </BrowserRouter>
  );
}
