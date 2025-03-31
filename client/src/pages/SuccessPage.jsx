import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../Context';

const SuccessPage = () => {
  const navigate = useNavigate();
  const { setCartSummary } = useContext(Context);

  // Clear cart from localStorage and reset cartSummary on successful payment
  useEffect(() => {
    localStorage.removeItem('cart');
    setCartSummary([]); // Clear the cart in context
  }, [setCartSummary]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold text-green-500 mb-4">
          Payment Successful! 🎉
        </h1>
        <p className="text-gray-700 mb-6">
          Thank you for your order. We have received your payment.
        </p>
        <button
          onClick={() => navigate('/products')}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
