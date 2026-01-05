import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { GetStarted } from './pages/GetStarted';
import { Watch } from './pages/Watch';
import { Apply } from './pages/Apply';
import { Book } from './pages/Book';
import { Congratulations } from './pages/Congratulations';
import { ApplyRejected } from './pages/ApplyRejected';
import { Disqualified } from './pages/Disqualified';
import { SuccessStories } from './pages/SuccessStories';
import { Privacy, Terms, Refund } from './pages/LegalPages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/getstarted" element={<GetStarted />} />
        <Route path="/watch" element={<Watch />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/book" element={<Book />} />
        <Route path="/congratulations" element={<Congratulations />} />
        <Route path="/apply-rejected" element={<ApplyRejected />} />
        <Route path="/disqualified" element={<Disqualified />} />
        <Route path="/success-stories" element={<SuccessStories />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund" element={<Refund />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;