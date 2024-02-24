import React, { useState } from 'react'
import { useAppDispatch } from '../../redux/store'
import { Product } from '../../misc/type'
import { Button, TextField } from '@mui/material'
import { createProduct, uploadImage  } from '../../redux/slices/productSlice'

export default function CreateProduct() {
   const dispatch = useAppDispatch()

   const [title, setTitle] = useState('')
   const [price, setPrice] = useState<number | null>(null)
   const [description, setDescription] = useState('')
   const [categoryId, setCategoryId] = useState<number | null>(null)
   const [images, setImages] = useState<File[]>([])

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
   
      if (!title || !price || !description || !categoryId || images.length === 0) {
         return alert('Please make sure that you have added title, price, description, category ID, and images');
      }
   
      try {
         const uploadedImageUrls: string[] = [];
         for (const image of images) {
            const uploadedImageUrl = await uploadImage(image);
            uploadedImageUrls.push(uploadedImageUrl);
         }
   
         const newProduct: Product = {
            title,
            price,
            description,
            categoryId,
            images: uploadedImageUrls,
         };
         dispatch(createProduct(newProduct));
         console.log('New Product:', JSON.stringify(newProduct));
      } catch (error) {
         console.error('Error creating product:', error);
      }
   };
   
   const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
         const selectedFiles = Array.from(e.target.files);
         setImages(selectedFiles);
      }
   };
   
   
   return (
      <form onSubmit={handleSubmit}>
         <TextField
            label="Title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            fullWidth
            margin="normal"
            variant="outlined"
         />
         <TextField
            label="Price"
            type="number"
            value={price ?? ''}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            fullWidth
            margin="normal"
            variant="outlined"
         />
         <TextField
            label="Description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            fullWidth
            multiline
            rows={4}
            margin="normal"
            variant="outlined"
         />
         <TextField
            label="Category ID"
            type="number"
            value={categoryId ?? ''}
            onChange={(e) => setCategoryId(parseInt(e.target.value))}
            fullWidth
            margin="normal"
            variant="outlined"
         />
         <input type="file" onChange={handleImagesChange} accept="image/*" multiple />
         <Button type="submit" variant="contained" color="primary">
            Create Product
         </Button>
      </form>
   );
}