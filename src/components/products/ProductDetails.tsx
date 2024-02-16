import React, { useEffect } from 'react'
import {
   BrowserRouter as Router, Link
} from 'react-router-dom'

import { Data, Product, Props } from '../../misc/type'
import { useDispatch, useSelector } from 'react-redux';
// import { fetchSingleProduct } from '../../redux/slices/productSlice';
import { AppState, useAppSelector } from '../../redux/store';

const ProductDetails:React.FC<Data> = ({ id })  =>  {
   const dispatch = useDispatch();
   const selectedProduct = useAppSelector((state: AppState) => state.products.selectedProduct);
   // const { selectedProduct, loading } = useSelector((state: AppState) => state.products);
   
   useEffect(() => {
      // Fetch the single product when component mounts
      // dispatch(fetchSingleProduct(id));
   }, [dispatch, id]);
   // if(!product) {
   //    return <div>Item not found...</div>
   // }
   // const selectedProduct: Product = Array.isArray(product) ? product[0] : product;
   console.log('Product:', selectedProduct);

   return (
      <div>
         {/* {selectedProduct.price} */}
         <Link to="/products">
            <button>Back</button>
         </Link>
      </div>
   )
}

export default ProductDetails