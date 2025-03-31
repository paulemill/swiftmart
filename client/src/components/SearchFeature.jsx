import React, { useState } from 'react';

const SearchFeature = ({
  setFilteredProducts,
  sortedProducts,
  productList,
}) => {
  // Use props to be used on the ProductPage
  const [input, setInput] = useState(''); // used to store the value on the search feature

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (value.length === 0) {
      setFilteredProducts(productList);
      return; // if no search, display all the products
    }
    const filtered = sortedProducts.filter((product) =>
      product.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="mt-10 flex items-center justify-center w-full">
  <div className="relative flex items-center border border-gray-300 overflow-hidden w-70 justify-self-center rounded mx-auto">
    <input
      type="text"
      placeholder="Search Product..."
      className="w-full outline-none text-black text-base px-2 py-2"
      value={input}
      onChange={handleInputChange}
    />
  </div>
</div>
  );
};

export default SearchFeature;
