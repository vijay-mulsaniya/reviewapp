import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReviewPage from './ReviewPage';
import { Home } from './Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/ReviewPage" element={<ReviewPage />} />
      </Routes>
    </Router>
  );
}

export default App
