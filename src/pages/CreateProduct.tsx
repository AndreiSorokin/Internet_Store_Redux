import React, { useState } from 'react'
import { Product } from '../misc/type';
import { useAppDispatch } from '../redux/store';
import { createProduct } from '../redux/slices/productSlice';

export default function CreateProduct() {
   const dispatch = useAppDispatch()


   const [newProduct, setNewProduct] = useState<Product>({
      category: { id: "", name: "", image: "" },
      id: "",
      images: [],
      price: 0,
      title: "",
      description: ""
   });

   const addNew = (e: React.ChangeEvent<HTMLInputElement>) => {
      const content = e.target.value
      e.preventDefault();
      // dispatch(createProduct(content))
   }

   return (
      <div>
         <form action="">
            <input type="text" placeholder=''/>
            <input type="text" placeholder=''/>
            <input type="text" placeholder=''/>
            <button>Add</button>
         </form>
      </div>
   )
}
