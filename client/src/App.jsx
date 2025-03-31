import LandingPage from './pages/LandingPage';
import ProductPage from './pages/ProductPage';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import ProductDetailsPerItem from './pages/ProductDetailsPerItem';

import ContactUsPage from './pages/ContactUsPage';
import SuccessPage from './pages/SuccessPage';
import CancelPage from './pages/CancelPage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />{' '}
        <Route path="/products" element={<ProductPage />} />{' '}
        <Route path="/products/:id" element={<ProductDetailsPerItem />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="success" element={<SuccessPage />} />
        <Route path="cancel" element={<CancelPage />} />
      </Routes>
    </>
  );
}

export default App;
