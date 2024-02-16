import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
// import { useFetchDetails } from '../hooks/useFetchDetails'
import { Product } from '../../misc/type'
import { AppState, useAppDispatch, useAppSelector } from '../../redux/store'
// import { fetchSingleProduct } from '../../redux/slices/productSlice'
import { useSelector } from 'react-redux'
import { Props } from '../../misc/type'

const ProductDetails = React.lazy(() => import('./ProductDetails'))

const ProductItem:React.FC<Props> = ()  =>  {
   const { id } = useParams<{ id: string }>()
   // const dispatch = useAppDispatch();
   // const selectedProduct = useAppSelector(state => state.products.selectedProduct);
   // useEffect(() => {
   //    if(id) {
   //       dispatch(fetchSingleProduct(id));
   //    }
   // }, [dispatch, id]);

   return (
      <div>
         <React.Suspense fallback={<div>Loading...</div>}>
            {/* <ProductDetails id={id!} /> */}
         </React.Suspense>
      </div>
   )
}

export default ProductItem