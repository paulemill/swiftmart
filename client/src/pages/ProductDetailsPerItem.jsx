import { useEffect, useState, useContext } from 'react';
import ProductRating from '../components/ProductRating';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Context } from '../Context';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProductDetailsPerItem = () => {
  const { id } = useParams(); // Access the params ID on the Routes
  const [item, setItem] = useState(null); // Used to store API data
  const [quantity, setQuantity] = useState(0); // Used to store quantity of item before adding to cart
  const [currentID, setCurrentID] = useState(parseInt(id)); // Used to store current ID for the Navigation feature
  const navigate = useNavigate(); // prerequisite of useNavigate
  const { stripeSummary, setStripeSummary, cartSummary, setCartSummary } =
    useContext(Context); // Access the context

  //////////////////////////////////////////////////////////////
  // FETCH API
  //////////////////////////////////////////////////////////////

  // Fetch the product details based on the current ID
  // Params ID is connected to the useState current ID as default value
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `/.netlify/functions/fetchProduct?id=${currentID}`
        );
        const data = await response.json();
        setItem(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
  }, [currentID]); // Re-run the effect when the current id changes

  //////////////////////////////////////////////////////////////
  // NAVIGATION FEATURE
  //////////////////////////////////////////////////////////////

  // Handle Next Page
  const handleNextPage = () => {
    if (currentID < 100) {
      const nextId = currentID + 1;
      setCurrentID(nextId);
      navigate(`/products/${nextId}`);
    }
  };

  // Handle Previous Page
  const handlePreviousPage = () => {
    if (currentID > 1) {
      const prevId = currentID - 1;
      setCurrentID(prevId);
      navigate(`/products/${prevId}`);
    }
  };

  //////////////////////////////////////////////////////////////
  // ADD TO CART
  //////////////////////////////////////////////////////////////
  const handleAddToCart = () => {
    setCartSummary((prev) => {
      // Check if the item is already in the cart
      const existingItemIndex = prev.findIndex(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItemIndex !== -1) {
        // Update existing item quantity and total
        const updatedCart = [...prev];

        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity,
          total:
            updatedCart[existingItemIndex].price *
            (updatedCart[existingItemIndex].quantity + quantity),
        };
        alert('Item is already in the cart. Quantity updated!');
        setQuantity(0);
        updateStripeSummary(updatedCart);
        return updatedCart;
      } else {
        // Add new item to the cart
        alert('Item added to cart!');
        setQuantity(0);
        const newCart = [
          ...prev,
          {
            id: item.id,
            title: item.title,
            price: item.price * (1 - item.discountPercentage / 100),
            quantity: quantity,
            total: item.price * (1 - item.discountPercentage / 100) * quantity,
            image: item.images[0],
          },
        ];
        updateStripeSummary(newCart);
        return newCart;
      }
    });
  };

  // Helper function to update stripeSummary
  const updateStripeSummary = (updatedCart) => {
    const stripeData = updatedCart.map((cartItem) => ({
      id: String(cartItem.id),
      quantity: cartItem.quantity,
    }));
    setStripeSummary(stripeData);
  };

  // Loading state
  if (!item) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading product details...</p>
      </div>
    );
  }

  // Function to convert the date to a readable format
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };
  console.log('cart', cartSummary);
  console.log('stripe', stripeSummary);

  //////////////////////////////////////////////////////////////
  // RENDER
  //////////////////////////////////////////////////////////////
  return (
    <>
      <Header />

      {/* Navigation */}
      <div className="max-w-3xl mx-auto p-8 bg-white shadow-2xl rounded-lg mb-10 mt-30">
        <div className="flex flex-row gap-x-3 justify-center mb-5">
          <button
            className={`w-10 h-10 flex items-center justify-center rounded-md border ${
              currentID === 1
                ? 'text-gray-400 border-gray-300 cursor-not-allowed bg-white'
                : 'text-gray-700 border-gray-300 hover:border-gray-500 hover:bg-gray-100'
            } active:scale-95 transition-transform duration-150`}
            onClick={handlePreviousPage}
            disabled={currentID === 1}
          >
            ←
          </button>
          <button
            className={`w-10 h-10 flex items-center justify-center rounded-md border ${
              currentID === 100
                ? 'text-gray-400 border-gray-300 cursor-not-allowed bg-white'
                : 'text-gray-700 border-gray-300 hover:border-gray-500 hover:bg-gray-100'
            } active:scale-95 transition-transform duration-150`}
            onClick={handleNextPage}
            disabled={currentID === 100}
          >
            →
          </button>
        </div>

        {/* Product Detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Section - Product Image */}
          <div className="flex justify-center overflow-hidden max-h-96">
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-full h-auto max-w-md rounded-lg shadow-md object-contain"
            />
          </div>

          {/* Right Section - Product Info */}
          <div>
            {/* Title & Description */}
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              {item.title}
            </h1>
            <p className="text-gray-600 text-lg mb-4">{item.description}</p>

            {/* Price & Discount */}
            <div className="flex items-center space-x-4 mb-4">
              <p className="text-2xl font-bold text-blue-600">
                ${' '}
                {(
                  item.price *
                  (1 - item.discountPercentage / 100)
                ).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-lg text-gray-500 line-through">
                ${item.price.toLocaleString()}
              </p>
              <span className="bg-orange-500 text-white text-sm px-3 py-1 rounded-lg">
                -{Math.floor(item.discountPercentage)}% Off
              </span>
            </div>

            {/* Rating */}
            <div className="mb-4">
              <ProductRating rating={item.rating} />
            </div>

            {/* Stock & Quantity */}
            <p className="text-base text-gray-500 mb-2">Stock: {item.stock}</p>
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => setQuantity((prev) => prev - 1)}
                disabled={quantity === 0}
                className="bg-gray-200 text-gray-800 px-5 py-3 rounded-md hover:bg-gray-300 disabled:bg-gray-100 cursor-pointer active:scale-95 transition-transform duration-150"
              >
                -
              </button>
              <span className="text-lg font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                disabled={quantity === item.stock}
                className="bg-gray-200 text-gray-800 px-5 py-3 rounded-md hover:bg-gray-300 disabled:bg-gray-100 cursor-pointer active:scale-95 transition-transform duration-150"
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`px-6 py-3 rounded-md w-full transition duration-200 ${
                quantity === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-700 cursor-pointer active:scale-95 transition-transform duration-150'
              }`}
              disabled={quantity === 0}
            >
              Add to Cart
            </button>

            {/* Continue Shopping Button */}
            <div className="flex justify-center items-center mt-4">
              <Link to={'/products'}>
                <button className="underline decoration-dotted underline-offset-10 text-base cursor-pointer">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Additional Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 text-base">
            <p>
              <span className="font-semibold">Dimensions:</span>
              <br />
              Depth: {item.dimensions.depth}, Height: {item.dimensions.height},
              Width: {item.dimensions.width}
            </p>
            <p>
              <span className="font-semibold">Return Policy:</span>
              <br />
              {item.returnPolicy}
            </p>
            <p>
              <span className="font-semibold">Shipping Information:</span>
              <br />
              {item.shippingInformation}
            </p>
            <p>
              <span className="font-semibold">Warranty:</span>
              <br />
              {item.warrantyInformation}
            </p>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Reviews</h2>
          {item.reviews && item.reviews.length > 0 ? (
            <div className="space-y-5">
              {item.reviews.map((review, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-md p-5 shadow-sm bg-gray-50"
                >
                  <ProductRating rating={review.rating} />
                  <p className="text-gray-700 mt-2 text-base">
                    {review.comment}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {review.reviewerName} - {formatDate(review.date)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-base">No reviews available.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetailsPerItem;
