import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { Category, Gender, NewProduct, Size } from '../../misc/type';
import { createProduct, fetchProducts, uploadImage } from '../../redux/slices/productSlice';
import { useTheme } from '../../components/contextAPI/ThemeContext';
import useSuccsessMessage from '../../hooks/SuccsessMessage';
import useErrorMessage from '../../hooks/ErrorMessage';
import useInput from '../../hooks/UseInput';

import { Box, Button, Grid, IconButton, MenuItem, TextField } from '@mui/material';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from 'react-router-dom';

export default function CreateProductPage() {
  const { theme } = useTheme();
  const { succsessMessage, showSuccessMessage, succsessMessageStyle } = useSuccsessMessage();
  const { errorMessage, showError, errorMessageStyle } = useErrorMessage();

  const dispatch = useAppDispatch();
  const productList = useAppSelector(state => state.products.products);

  //create category slice
  // const categories = useAppSelector(state => state.categories.categories);

//   useEffect(() => {
//     dispatch(fetchProducts());
// }, [dispatch]);

  const nameInput = useInput();
  const priceInput = useInput();
  const descriptionInput = useInput();
  const categoryInput = useInput();

  const [images, setImages] = React.useState<File[]>([]);
  const [selectedSize, setSelectedSize] = React.useState<Size | "">("");
  const [gender, setGender] = React.useState<Gender | "">("");

  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSize(event.target.value as Size);
  };

  const handleGenderSubmit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGender(event.target.value as Gender);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const { value: name } = nameInput;
      const { value: price } = priceInput;
      const { value: description } = descriptionInput;
      const { value: category } = categoryInput;

      if (!name || !price || !description || !category || !selectedSize || !images || !selectedSize || !gender) {
      return showError('Please make sure that you have added name, price, description, category ID, and images');
      }

      const existingProduct = productList.find(product =>
        product.name === name &&
        product.price === parseFloat(price) &&
        product.description === description &&
        product.category.id === parseInt(category)
      );

      if (existingProduct) {
        return showError('A product with similar details already exists.');
      }

      try {
        const uploadedImageUrls: string[] = [];
            for (const image of images) {
              if (typeof image === 'string') {
                  uploadedImageUrls.push(image);
              } else {
                  const uploadedImageUrl = await uploadImage(image);
                  uploadedImageUrls.push(uploadedImageUrl);
              }
            }
            
          const newProduct: NewProduct = {
            name,
            price: parseFloat(price),
            description,
            category: {id:1, name:"name", image:"image"},
            images: uploadedImageUrls,
            size: selectedSize,
            gender: gender
          };
        dispatch(createProduct(newProduct));
        showSuccessMessage('Product added successfully');
        nameInput.onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
        priceInput.onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
        descriptionInput.onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
        categoryInput.onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
        setImages([]);
        setSelectedSize("");
      } catch (error) {
        return showError('Somethins went wrong');
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
      paddingTop: '20vh',
      transition: '0.5s ease',
      height: '110vh',
      overflow: 'hidden',
      }} container direction="column" alignItems="center" spacing={3}>
      <Grid item sx={{ alignSelf: 'flex-start', position: 'absolute', top: '10vh', left: '2vw' }}>
          <Link to="/products" style={{ textDecoration: "none" }}>
            <IconButton sx={{ color: theme === 'bright' ? 'black' : 'white' }}>
                <ArrowBackIcon />
                Back
            </IconButton>
          </Link>
      </Grid>
      <Grid item>
        <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: "column", alignItems: "center", marginLeft: "1vh" }}>
            {errorMessage && <p style={errorMessageStyle}>{errorMessage}</p>}
            {succsessMessage && <p style={succsessMessageStyle}>{succsessMessage}</p>}
              <TextField
                  label="Name"
                  value={nameInput.value}
                  onChange={nameInput.onChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  sx={{ margin: "2vh", width: "500px", borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 'label': {
                  color: theme === 'bright' ? 'black' : 'white',
                  } }}
                />
                <TextField
                  select
                  label="Size"
                  value={selectedSize}
                  onChange={handleSizeChange}
                  margin="normal"
                  variant="outlined"
                  fullWidth
                >
                  {Object.values(Size).map(size => (
                    <MenuItem key={size} value={size}>{size}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Price"
                  type="number"
                  value={priceInput.value}
                  onChange={priceInput.onChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                  sx: {
                    color: theme === 'bright' ? 'black' : 'white',
                    '@media (max-width: 768px)': {
                      maxWidth: '90%',
                    },
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
                  sx: {
                    color: theme === 'bright' ? 'black' : 'white',
                    '@media (max-width: 768px)': {
                      maxWidth: '90%',
                    },
                  },
                  }}
                  sx={{ margin: "2vh", width: "500px", borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 'label': {
                  color: theme === 'bright' ? 'black' : 'white',
                  } }}
                />
                <TextField
                  label="Category"
                  type="text"
                  value={categoryInput.value}
                  onChange={categoryInput.onChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                  sx: {
                    color: theme === 'bright' ? 'black' : 'white',
                    '@media (max-width: 768px)': {
                      maxWidth: '90%',
                    },
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
