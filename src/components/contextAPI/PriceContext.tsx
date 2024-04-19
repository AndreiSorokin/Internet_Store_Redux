import React, { useState, createContext } from "react";

interface ProductContextType {
   minPrice: number | undefined;
   setMinPrice: React.Dispatch<React.SetStateAction<number | undefined>>;
   maxPrice: number | undefined;
   setMaxPrice: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
   children: React.ReactNode;
}

export const useProductContext: React.FC<ProductProviderProps> = ({ children }) => {
   const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
   const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

   return (
      <ProductContext.Provider value={{ minPrice, setMinPrice, maxPrice, setMaxPrice }}>
         {children}
      </ProductContext.Provider>
   );
};

export default ProductContext;