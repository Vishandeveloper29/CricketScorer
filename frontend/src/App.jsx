import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';
import { MatchProvider } from './context/MatchContext';
import { SettingsProvider } from './context/SettingsContext';
import { SnackbarProvider } from './context/SnackbarContext';
import Home from './pages/Home';
import CreateMatch from './pages/CreateMatch';
import LiveScore from './pages/LiveScore';
import Scorecard from './pages/Scorecard';
import MatchHistory from './pages/MatchHistory';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <SettingsProvider>
      <SnackbarProvider>
        <MatchProvider>
          <BrowserRouter>
            <div className="min-h-full pb-24 sm:pb-0">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<CreateMatch />} />
                <Route path="/live" element={<LiveScore />} />
                <Route path="/scorecard/:matchId?" element={<Scorecard />} />
                <Route path="/history" element={<MatchHistory />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <BottomNav />
            </div>
          </BrowserRouter>
        </MatchProvider>
      </SnackbarProvider>
    </SettingsProvider>
  );
}
