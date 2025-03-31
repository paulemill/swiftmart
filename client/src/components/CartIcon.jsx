import { useContext, useState, useEffect } from 'react';
import { Context } from '../Context';
import CartSummary from '../pages/CartSummary';

const CartIcon = () => {
  const { cartSummary } = useContext(Context); // Access cartSummary Context
  const [isModalOpen, setIsModalOpen] = useState(false); // Used for the modal feature

  //////////////////////////////////////////////////////////////
  // HANDLE THE MODAL FEATURE
  //////////////////////////////////////////////////////////////

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'; // Disable scrolling
    } else {
      document.body.style.overflow = ''; // Enable scrolling
    }

    // Cleanup to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  // Dynamically calculate the cart item count
  const totalItems = cartSummary.length;

  //////////////////////////////////////////////////////////////
  // RENDER
  //////////////////////////////////////////////////////////////
  return (
    <>
      <div className="m-8">
        {/* Cart Button */}
        <button
          onClick={handleModalToggle}
          className="relative text-gray-700 text-xl font-semibold hover:text-blue-600 transition duration-300 group cursor-pointer"
        >
          <span>Cart</span>

          {/* Total Items Badge */}
          {totalItems > 0 && (
            <span className="absolute -top-3 -right-6 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
          {/* Underline Animation */}
          <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
        </button>

        {/* Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 backdrop-blur-xs flex justify-center items-center z-50 p-4"
            onClick={handleModalToggle}
          >
            <div
              className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-4xl max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              <div className="p-4">
                <CartSummary handleModalToggle={handleModalToggle} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartIcon;
