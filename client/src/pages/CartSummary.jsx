import { Context } from '../Context';
import { useContext, useReducer, useEffect } from 'react';

//////////////////////////////////////////////////////////////
// useReducer TO HANDLE DELETE, CLEAR, ADD AND SUBTRACT QUANTITY
//////////////////////////////////////////////////////////////
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'DELETE_ITEM':
      return state.filter((item) => item.id !== action.payload);
    case 'CLEAR_CART':
      return [];
    case 'ADD_QUANTITY':
      return state.map((item) =>
        item.id === action.payload
          ? {
              ...item,
              quantity: item.quantity + 1,
              total: (item.quantity + 1) * item.price,
            }
          : item
      );
    case 'SUBTRACT_QUANTITY':
      return state.map((item) =>
        item.id === action.payload
          ? {
              ...item,
              quantity: item.quantity > 1 ? item.quantity - 1 : item.quantity,
              total:
                item.quantity > 1
                  ? (item.quantity - 1) * item.price
                  : item.quantity * item.price,
            }
          : item
      );
    default:
      return state;
  }
};

const CartSummary = ({ handleModalToggle }) => {
  //add params for the handleModalToggle on the CartIcon component

  const {
    stripeSummary,
    setStripeSummary,
    cartSummary,
    setCartSummary,
    setCartTotalAmount,
  } = useContext(Context); // Access in on the context

  //////////////////////////////////////////////////////////////
  // Functions related to useReducer
  //////////////////////////////////////////////////////////////
  const [cart, dispatch] = useReducer(cartReducer, cartSummary); // Requirement for useReducer

  // Sync with cartSummary in Context whenever cart changes
  useEffect(() => {
    setCartSummary(cart);
  }, [cart, setCartSummary]);

  // Sync stripeSummary with cart whenever cart changes
  useEffect(() => {
    const updatedStripeSummary = cart.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title, // Pass product name here
        },
        unit_amount: Math.round(item.price * 100), // Convert price to cents
      },
      quantity: item.quantity,
    }));
    setStripeSummary(updatedStripeSummary);
  }, [cart, setStripeSummary]);

  // Handle item deletion
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to remove this item from your cart?'
    );
    if (confirmDelete) {
      dispatch({ type: 'DELETE_ITEM', payload: id });
      alert('Item removed from cart!');
    }
  };

  // Handle clear cart
  const handleClearCart = () => {
    const confirmClear = window.confirm(
      'Are you sure you want to clear the cart?'
    );
    if (confirmClear) {
      dispatch({ type: 'CLEAR_CART' });
      alert('Cart cleared!');
    }
  };

  // Handle add quantity
  const handleAddQuantity = (id) => {
    dispatch({ type: 'ADD_QUANTITY', payload: id });
  };

  // Handle subtract quantity
  const handleSubtractQuantity = (id) => {
    dispatch({ type: 'SUBTRACT_QUANTITY', payload: id });
  };

  //////////////////////////////////////////////////////////////
  // Functions to format numbers
  //////////////////////////////////////////////////////////////

  // Format the prices
  const formatPrice = (price) => {
    return price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Calculate subtotal, tax, and total price
  const rawSubTotalPrice = cart.reduce((acc, item) => acc + item.total, 0);
  const subTotalPrice = formatPrice(rawSubTotalPrice);
  const tax = rawSubTotalPrice * 0.12;
  const formattedTax = formatPrice(tax);
  const shippingFee = cart.length > 0 ? 20 : 0;
  const total = rawSubTotalPrice + tax + shippingFee;
  const formattedTotal = formatPrice(total);

  // Store the raw total in the context so can access it in CheckoutPage
  useEffect(() => {
    setCartTotalAmount({
      totalQuantity: cart.length,
      subTotalPrice: rawSubTotalPrice,
      tax: tax,
      shippingFee: shippingFee,
    }); // Store the raw total in the context
  }, [cart, rawSubTotalPrice, tax, shippingFee, setCartTotalAmount]);

  //////////////////////////////////////////////////////////////
  // FUNCTION FOR STRIPE during onclick
  //////////////////////////////////////////////////////////////
  const checkout = async () => {
    const updatedStripeSummary = [
      ...stripeSummary,
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Tax',
          },
          unit_amount: Math.round(tax * 100), // Tax converted to cents
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping Fee',
          },
          unit_amount: Math.round(shippingFee * 100), // Shipping fee in cents
        },
        quantity: 1,
      },
    ];

    await fetch('/.netlify/functions/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: updatedStripeSummary }), // Updated items
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        if (response.url) {
          window.location.assign(response.url);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  console.log('cartSummary', cartSummary);

  //////////////////////////////////////////////////////////////
  // RENDER
  //////////////////////////////////////////////////////////////
  return (
    <>
      <div className="bg-gray-200 min-h-[55vh] p-8 flex justify-center rounded-xl">
        <div className="w-full max-w-3xl">
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold">Shopping Cart</h1>
            <button
              onClick={handleModalToggle}
              className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer active:scale-95 transition-transform duration-150"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Cart Items Section */}
            <div className="col-span-1 bg-gray-50 shadow-lg rounded-xl p-6 sm:p-8 overflow-auto relative max-h-[55vh]">
              {/* Empty Cart Message */}
              {cartSummary.length === 0 && (
                <div className="text-center text-gray-600">
                  Your cart is empty.
                </div>
              )}

              {/* Cart Items */}
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white grid grid-cols-1 lg:grid-cols-2 py-4 px-4 text-left rounded-lg shadow-lg mb-4"
                >
                  {/* Product Image & Name */}
                  <div className="w-full flex justify-center items-center overflow-hidden rounded-lg bg-white">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 sm:w-18 object-contain rounded-lg"
                    />
                  </div>

                  {/* Right Portion - Product detail and quantity */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mt-2 truncate overflow-hidden">
                      {item.title}
                    </p>
                    <p className="text-sm font-semibold text-blue-500 mt-2">
                      ${formatPrice(item.total)}
                    </p>

                    {/* Quantity Control and Delete Button */}
                    <div className="flex items-center justify-between">
                      {/* Quantity Control - Left */}
                      <div className="flex items-center gap-3 mt-4">
                        <button
                          className={`w-6 h-6 border rounded-md flex items-center justify-center ${
                            item.quantity === 1
                              ? 'cursor-not-allowed'
                              : 'hover:bg-gray-200 cursor-pointer '
                          } active:scale-95 transition-transform duration-150`}
                          onClick={() => handleSubtractQuantity(item.id)}
                          disabled={item.quantity === 1}
                        >
                          -
                        </button>

                        <p className="text-sm">{item.quantity}</p>

                        <button
                          className="w-6 h-6 border rounded-md flex items-center justify-center hover:bg-gray-200 cursor-pointer active:scale-95 transition-transform duration-150"
                          onClick={() => handleAddQuantity(item.id)}
                        >
                          +
                        </button>
                      </div>

                      {/* Delete Button - Right */}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="cursor-pointer mr-2 mt-4 active:scale-95 transition-transform duration-150"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              {cart.length > 0 && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleClearCart}
                    className="bg-red-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-200 cursor-pointer"
                  >
                    Clear Cart
                  </button>
                </div>
              )}
            </div>

            {/* Summary Section */}
            <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 h-fit">
              <h2 className="text-lg font-semibold mb-6">Summary</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>${subTotalPrice}</p>
                </div>
                <div className="flex justify-between">
                  <p>Taxes</p>
                  <p>${formattedTax}</p>
                </div>
                <div className="flex justify-between">
                  <p>Shipping</p>
                  <p>${shippingFee.toFixed(2)}</p>
                </div>
              </div>

              <div className="border-t mt-6 pt-4">
                <div className="flex justify-between text-lg font-semibold text-blue-500">
                  <p>Total</p>
                  <p>${formattedTotal}</p>
                </div>
              </div>

              {/* Checkout Button */}

              <button
                className={`w-full font-medium py-3 mt-6 rounded-lg ${
                  cartSummary.length === 0
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer active:scale-95 transition-transform duration-150'
                }`}
                onClick={() => {
                  const confirmCheckout = window.confirm(
                    'Are you sure you want to proceed to checkout?'
                  );
                  if (confirmCheckout) {
                    alert('Proceeding to checkout...');
                    checkout(); // Proceed to checkout if the user confirms
                  }
                }}
                disabled={cartSummary.length === 0}
              >
                Checkout
              </button>

              {/* Continue Shopping */}
              <div className="text-center mt-8">
                <button
                  className="text-blue-500 underline decoration-dotted underline-offset-4 text-sm cursor-pointer"
                  onClick={handleModalToggle}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartSummary;
