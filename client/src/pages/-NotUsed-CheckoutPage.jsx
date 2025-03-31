import { useContext, useState, useEffect } from 'react';
import { Context } from '../Context';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CheckOutPage = () => {
  let navigate = useNavigate(); // Requirement for the navigation
  const { cartTotalAmount, setCartSummary } = useContext(Context); // Get cartTotalAmount from Context, format is on CartSummary component
  const [paymentInfo, setPaymentInfo] = useState({
    cardName: '',
    cardNumber: '',
    cardExpDate: '',
    cardCVV: '',
  }); // initial state for payment info
  const [isFormValid, setIsFormValid] = useState(false); // Used to validate the form

  //////////////////////////////////////////////////////////////
  // Related to the Form Validation
  //////////////////////////////////////////////////////////////
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo({ ...paymentInfo, [name]: value }); // change only the field that is being updated
  };

  useEffect(() => {
    const { cardName, cardNumber, cardExpDate, cardCVV } = paymentInfo;

    // Checks to know if can submit
    const isValid =
      cardName.trim() !== '' && // check if not empty
      cardNumber.length === 16 && // check if card number is 16chars
      cardExpDate !== '' && // check if not empty
      cardCVV.length === 3; // check if cvv is 3 chars
    setIsFormValid(isValid);
  }, [paymentInfo]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isFormValid) {
      alert('Payment Successful! 🎉\nReturning to Home page..');
      navigate('/'); // Redirect to home page
      setCartSummary([]); // Clear cart
    } else {
      alert('Please fill in all required fields correctly.');
    }
  };

  // Function to format price to 2 decimal places
  const formatPrice = (price) => {
    if (isNaN(price)) return '0.00';
    return price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  //////////////////////////////////////////////////////////////
  // RENDER
  //////////////////////////////////////////////////////////////
  return (
    <>
      <Header />
      <div className="bg-white mt-18 flex justify-center items-center py-6 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-3xl w-full bg-white shadow-xl rounded-lg p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Section: Shipping & Payment Info */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Shipping Details */}
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-700">
                  Shipping Details
                </h2>

                <label className="block text-sm font-medium text-gray-600">
                  Name
                  <input
                    type="text"
                    name="name"
                    className="mt-1 w-full p-2 border rounded-lg focus:outline-blue-500"
                    placeholder="John Doe"
                    required
                  />
                </label>

                <label className="block text-sm font-medium text-gray-600">
                  Email
                  <input
                    type="email"
                    name="email"
                    className="mt-1 w-full p-2 border rounded-lg focus:outline-blue-500"
                    placeholder="john@example.com"
                    required
                  />
                </label>

                <label className="block text-sm font-medium text-gray-600">
                  Address
                  <input
                    type="text"
                    name="address"
                    className="mt-1 w-full p-2 border rounded-lg focus:outline-blue-500"
                    placeholder="123 Main Street"
                    required
                  />
                </label>

                <label className="block text-sm font-medium text-gray-600">
                  Phone Number
                  <input
                    type="tel"
                    name="number"
                    className="mt-1 w-full p-2 border rounded-lg focus:outline-blue-500"
                    placeholder="(123) 456-7890"
                    required
                  />
                </label>
              </div>

              {/* Payment Information */}
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-700">
                  Payment Information
                </h2>

                <label className="block text-sm font-medium text-gray-600">
                  Full Name (as displayed on card)
                  <input
                    type="text"
                    name="cardName"
                    value={paymentInfo.cardName}
                    onChange={handleChange}
                    className="mt-1 w-full p-2 border rounded-lg focus:outline-blue-500"
                    placeholder="Full name"
                    required
                  />
                </label>

                <label className="block text-sm font-medium text-gray-600">
                  Card Number
                  <input
                    type="number"
                    name="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={handleChange}
                    className="mt-1 w-full p-2 border rounded-lg focus:outline-blue-500"
                    placeholder="xxxx-xxxx-xxxx-xxxx"
                    required
                  />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="block text-sm font-medium text-gray-600">
                    Expiration Date
                    <input
                      type="month"
                      name="cardExpDate"
                      value={paymentInfo.cardExpDate}
                      onChange={handleChange}
                      className="mt-1 w-full p-2 border rounded-lg focus:outline-blue-500"
                      required
                    />
                  </label>

                  <label className="block text-sm font-medium text-gray-600">
                    CVV
                    <input
                      type="password"
                      name="cardCVV"
                      value={paymentInfo.cardCVV}
                      onChange={handleChange}
                      className="mt-1 w-full p-2 border rounded-lg focus:outline-blue-500"
                      placeholder="***"
                      maxLength="3"
                      required
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className={`cursor-pointer w-full py-2 rounded-lg shadow-md transition duration-200 ${
                    isFormValid
                      ? 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95 transition-transform duration-150'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!isFormValid}
                >
                  {isFormValid ? 'Pay Now' : 'Fill Payment Details'}
                </button>
              </div>
            </form>
          </div>

          {/* Right Section: Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4 shadow-sm space-y-5">
            <h2 className="text-lg font-semibold text-gray-700">
              Order Summary
            </h2>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex justify-between">
                <p>Total Items</p>
                <p className="font-medium">
                  {cartTotalAmount?.totalQuantity || 0}
                </p>
              </div>
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p className="font-medium">
                  ${formatPrice(cartTotalAmount?.subTotalPrice || 0)}
                </p>
              </div>
              <div className="flex justify-between">
                <p>Tax</p>
                <p className="font-medium">
                  ${formatPrice(cartTotalAmount?.tax || 0)}
                </p>
              </div>
              <div className="flex justify-between">
                <p>Shipping Fee</p>
                <p className="font-medium">
                  ${formatPrice(cartTotalAmount?.shippingFee || 0)}
                </p>
              </div>
              <div className="border-t mt-2 pt-2 flex justify-between text-lg font-semibold">
                <p>Total Price</p>
                <p>
                  $
                  {formatPrice(
                    (cartTotalAmount?.subTotalPrice || 0) +
                      (cartTotalAmount?.tax || 0) +
                      (cartTotalAmount?.shippingFee || 0)
                  )}
                </p>
              </div>
            </div>

            <Link to={'/products'}>
              <button
                className="w-full text-blue-500 underline hover:text-blue-600 cursor-pointer"
                onClick={() => alert('Payment Cancelled!')}
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckOutPage;
