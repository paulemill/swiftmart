import { createContext, useState, useEffect } from 'react';

// Create the Context
export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const initialCart = JSON.parse(localStorage.getItem('cartSummary')) || [];

  // Cart state
  const [cartSummary, setCartSummary] = useState(initialCart);
  // Update localStorage when cart changes
  useEffect(() => {
    localStorage.setItem('cartSummary', JSON.stringify(cartSummary));
  }, [cartSummary]);

  const [cartTotalAmount, setCartTotalAmount] = useState(0);
  const [stripeSummary, setStripeSummary] = useState([]);

  return (
    <Context.Provider
      value={{
        cartSummary,
        setCartSummary,
        cartTotalAmount,
        setCartTotalAmount,
        stripeSummary,
        setStripeSummary,
      }}
    >
      {children}
    </Context.Provider>
  );
};
