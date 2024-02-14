import React from 'react'
import {
   BrowserRouter as Router, Link
} from 'react-router-dom'

import { Props } from '../misc/type'

const ProductDetails:React.FC<Props> = ({ data }) => {

   if(!data) {
      return <div>Item not found...</div>
   }

   return (
      <div>
         {data.price}
         <Link to="/products">
            <button>Back</button>
         </Link>
      </div>
   )
}

export default ProductDetails

