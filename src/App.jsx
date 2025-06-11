import './App.css'
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import ReviewPage from './ReviewPage';
import { Home } from './Home';
import { GoogleReview } from './GoogleReview';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/googlereview" element={<GoogleReview />} />
      </Routes>
    </Router>
  );
}

export default App
