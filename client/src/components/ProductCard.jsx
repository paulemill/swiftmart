import NoProductFound from './NoProductFound';
import ProductRating from './ProductRating';
import { Link } from 'react-router-dom';

const ProductCard = ({ productList }) => {
  // Used this to render the noProductFound component when the searchFeature don't return anything
  if (productList.length === 0) {
    return <NoProductFound />;
  }

  return (
    <>
      {/* Grid Layout for Product Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 mt-20 ml-4 mr-4 sm:ml-6 sm:mr-6 md:ml-8 md:mr-8 lg:ml-14 lg:mr-14 xl:ml-30 xl:mr-30 mb-10 w-auto">
        {productList.map((product) => (
          // Router Link
          <Link key={product.id} to={`/products/${product.id}`}>
            <div className="relative flex flex-col bg-white border border-gray-200 rounded-xl shadow-lg p-3 sm:p-4 cursor-pointer h-64 sm:h-72 md:h-80 overflow-hidden hover:scale-102 hover:border-blue-500 transition-transform duration-300 ease-in-out">
              {/* Discount */}
              {product.discountPercentage > 0 && (
                <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
                  -{Math.floor(product.discountPercentage)}%
                </span>
              )}
              {/* Product Image */}
              <div className="relative w-full h-32 sm:h-36 md:h-40 flex justify-center items-center overflow-hidden rounded-lg bg-white">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="object-contain max-h-full max-w-full"
                />
              </div>
              {/* Product Details */}
              <div className="mt-2 sm:mt-4">
                <h2 className="text-gray-800 text-sm sm:text-base font-semibold truncate">
                  {product.title}
                </h2>
                <p className="text-xs text-gray-400 font-bold mt-1">
                  {product.brand ? product.brand.toUpperCase() : ''}
                </p>
                <ProductRating rating={product.rating} />
              </div>
              {/* Price & Discount */}
              <div className="flex items-end justify-between mt-1 sm:mt-2">
                <p className="text-blue-600 text-sm sm:text-xl font-semibold">
                  $
                  {(
                    product.price *
                    (1 - product.discountPercentage / 100)
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm line-through">
                  ${product.price.toLocaleString()}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default ProductCard;
