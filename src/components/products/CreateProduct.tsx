import React from 'react';
import { useAppDispatch } from '../../redux/store';
import { Product } from '../../misc/type';
import { createProduct, uploadImage } from '../../redux/slices/productSlice';
import { useTheme } from '../contextAPI/ThemeContext';
import useSuccsessMessage from '../../hooks/SuccsessMessage';
import useErrorMessage from '../../hooks/ErrorMessage';
import useInput from '../../hooks/UseInput';

import { Box, Button, Grid, IconButton, TextField } from '@mui/material';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from 'react-router-dom';

export default function CreateProduct() {
   const { theme } = useTheme();
   const { succsessMessage, showSuccessMessage, succsessMessageStyle } = useSuccsessMessage();
   const { errorMessage, showError, errorMessageStyle } = useErrorMessage();

   const dispatch = useAppDispatch();


   const titleInput = useInput();
   const priceInput = useInput();
   const descriptionInput = useInput();
   const categoryIdInput = useInput();

   const [images, setImages] = React.useState<File[]>([]);

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const { value: title } = titleInput;
      const { value: price } = priceInput;
      const { value: description } = descriptionInput;
      const { value: categoryId } = categoryIdInput;

      if (!title || !price || !description || !categoryId || images.length === 0) {
      return showError('Please make sure that you have added title, price, description, category ID, and images');
      }

      try {
      const uploadedImageUrls: string[] = [];
      for (const image of images) {
         const uploadedImageUrl = await uploadImage(image);
         uploadedImageUrls.push(uploadedImageUrl);
      }

      const newProduct: Product = {
         title,
         price: parseFloat(price),
         description,
         categoryId: parseInt(categoryId),
         images: uploadedImageUrls,
      };
      dispatch(createProduct(newProduct));
      showSuccessMessage('Product added successfully');
      titleInput.onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
      priceInput.onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
      descriptionInput.onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
      categoryIdInput.onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
      setImages([]);
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
      <Grid sx={{
      backgroundColor: theme === "bright" ? "white" : "black",
      color: theme === "bright" ? "black" : "white",
      height: '100vh',
      paddingTop: '20vh'
      }} container direction="column" alignItems="center" spacing={3}>
      <Grid item sx={{ alignSelf: 'flex-start', position: 'absolute', top: '10vh', left: '2vw' }}>
         <Link to="/products" style={{ textDecoration: "none" }}>
            <IconButton sx={{ color: theme === 'bright' ? 'black' : 'white' }}>
               <ArrowBackIcon />
               Back
            </IconButton>
         </Link>
      </Grid>
      {errorMessage && <p style={errorMessageStyle}>{errorMessage}</p>}
      {succsessMessage && <p style={succsessMessageStyle}>{succsessMessage}</p>}
      <Grid item>
         <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: "column", alignItems: "center", marginLeft: "1vh" }}>
               <TextField
                  label="Title"
                  value={titleInput.value}
                  onChange={titleInput.onChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                     style: {
                        color: theme === 'bright' ? 'black' : 'white',
                     },
                  }}
                  sx={{ margin: "2vh", width: "500px", borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 'label': {
                  color: theme === 'bright' ? 'black' : 'white',
                  } }}
               />
               <TextField
                  label="Price"
                  type="number"
                  value={priceInput.value}
                  onChange={priceInput.onChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                  style: {
                     color: theme === 'bright' ? 'black' : 'white',
                  },
                  }}
                  sx={{ margin: "2vh", width: "500px", borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 'label': {
                  color: theme === 'bright' ? 'black' : 'white',
                  } }}
               />
               <TextField
                  label="Description"
                  value={descriptionInput.value}
                  onChange={descriptionInput.onChange}
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                  style: {
                     color: theme === 'bright' ? 'black' : 'white',
                  },
                  }}
                  sx={{ margin: "2vh", width: "500px", borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 'label': {
                  color: theme === 'bright' ? 'black' : 'white',
                  } }}
               />
               <TextField
                  label="Category ID"
                  type="number"
                  value={categoryIdInput.value}
                  onChange={categoryIdInput.onChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                  style: {
                     color: theme === 'bright' ? 'black' : 'white',
                  },
                  }}
                  sx={{ margin: "2vh", width: "500px", borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 'label': {
                  color: theme === 'bright' ? 'black' : 'white',
                  } }}
               />
               <input type="file" onChange={handleImagesChange} accept="image/*" multiple />
               <Button sx={{ marginTop: '15px' }} type="submit" variant="contained" color="primary">
                  Create Product
               </Button>
            </Box>
         </form>
      </Grid>
   </Grid>
   );
}
