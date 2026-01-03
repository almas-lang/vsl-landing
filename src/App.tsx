import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Watch } from './pages/Watch';
import { Congratulations } from './pages/Congratulations';
import { GetStarted } from './pages/GetStarted';
import { Apply } from './pages/Apply';
import { Disqualified } from './pages/Disqualified';
import { ApplyRejected } from './pages/ApplyRejected';
import { SuccessStories } from './pages/SuccessStories';
import { Privacy, Terms, Refund } from './pages/LegalPages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/watch" element={<Watch />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/disqualified" element={<Disqualified />} />
        <Route path="/apply-rejected" element={<ApplyRejected />} />
        <Route path="/success-stories" element={<SuccessStories />} />
        <Route path="/congratulations" element={<Congratulations />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund" element={<Refund />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;