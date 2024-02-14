import React from 'react'
import { useParams } from 'react-router-dom'
import { useFetchDetails } from '../hooks/useFetchDetails'

const ProductDetails = React.lazy(() => import('./ProductDetails'))

export default function ProductItem() {
   const { id } = useParams<{ id: string }>()
   const { data, error } = useFetchDetails(id || '')

   if(error) {
      return <div>Error: {error}</div>
   }

   return (
      <div>
         <React.Suspense fallback={<div>Loading...</div>}>
            <ProductDetails data={data}/>
         </React.Suspense>
      </div>
   )
}
