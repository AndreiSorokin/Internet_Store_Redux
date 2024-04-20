import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { Gender, NewProduct, Size } from '../../misc/type';
import { createProduct, fetchAllProducts } from '../../redux/slices/productSlice';
import { useTheme } from '../../components/contextAPI/ThemeContext';
import useSuccsessMessage from '../../hooks/SuccsessMessage';
import useErrorMessage from '../../hooks/ErrorMessage';
import useInput from '../../hooks/UseInput';

import { Box, Button, Grid, IconButton, MenuItem, TextField } from '@mui/material';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from 'react-router-dom';
import { createCategory, fetchCategories } from '../../redux/slices/categorySlice';
import { uploadImage } from '../../redux/slices/uploadSlice';
import CreateCategory from '../../components/categories/CreateCategory';

export default function CreateProductPage() {
  const { theme } = useTheme();
  const { succsessMessage, showSuccessMessage, succsessMessageStyle } = useSuccsessMessage();
  const { errorMessage, showError, errorMessageStyle } = useErrorMessage();

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAllProducts());
}, [dispatch]);

const productList = useAppSelector(state => state.products.products);


  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch])
  const categories = useAppSelector(state => state.categories.categories)

  const nameInput = useInput();
  const priceInput = useInput();
  const descriptionInput = useInput();

  const [images, setImages] = React.useState<File[]>([]);
  const [selectedSize, setSelectedSize] = React.useState<Size | "">("");
  const [gender, setGender] = React.useState<Gender | "">("");
  const [category, setCategory] = React.useState("");
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null);

  const handleNewCategoryNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setNewCategoryName(event.target.value);
};

const handleNewCategoryImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files && event.target.files[0]) {
    setNewCategoryImage(event.target.files[0]);
  }
};


const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!newCategoryName || !newCategoryImage) {
    showError('Please make sure to add both a name and an image for the new category');
    return;
  }

  const existingCategory = categories.find(c => c.name.toLowerCase() === newCategoryName.toLowerCase());

  if(existingCategory) {
    showError('A category with that name already exists');
    return;
  }

  const formData = new FormData();
  formData.append('name', newCategoryName);
  formData.append('image', newCategoryImage);

  try {
    await dispatch(createCategory(formData)).unwrap();

    showSuccessMessage('Category created successfully');
    setNewCategoryName('');
    setNewCategoryImage(null);
    dispatch(fetchCategories());
  } catch (error) {
    showError('Something went wrong while creating the category');
  }
};


  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSize(event.target.value as Size);
  };

  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGender(event.target.value as Gender);
  };

  const handleNewProductImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
        const fileArray = Array.from(event.target.files);
        setImages(fileArray);
    }
};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const { value: name } = nameInput;
      const { value: price } = priceInput;
      const { value: description } = descriptionInput;

      if (!name || !price || !description || !selectedSize || !selectedSize || !gender ||images.length === 0) {
      return showError('Please make sure that you have added name, price, description, category ID, and images');
      }

      console.log(images.length)
      const existingProduct = productList.find(product =>
        product.name === name &&
        product.price === parseFloat(price) &&
        product.description === description &&
        product.category.id === parseInt(category) &&
        product.gender === gender &&
        product.size === selectedSize
      );

      if (existingProduct) {
        return showError('A product with similar details already exists.');
      }

      const formData = new FormData();
      formData.append('image', images[0]);

      try {
        const imageUploadPromises = images.map(image => {
            if (image instanceof File) {
                return dispatch(uploadImage(image)).unwrap();
            } else {
                return Promise.resolve(image);
            }
        });

        const uploadedImageUrls = await Promise.all(imageUploadPromises);

        if (uploadedImageUrls.length !== images.length) {
            showError('Failed to upload one or more images.');
            return;
        }

        const selectedCategory = categories.find(c => c.id.toString() === category);
        if (!selectedCategory) {
            showError('Selected category does not exist.');
            return;
        }

        const newProduct: NewProduct = {
            name,
            price: parseFloat(price),
            description,
            category: selectedCategory,
            images: uploadedImageUrls,
            size: selectedSize,
            gender: gender,
            categoryId: selectedCategory.id
        };

        console.log("selectedCategory",selectedCategory);

        await dispatch(createProduct(newProduct)).unwrap();
        showSuccessMessage('Product added successfully');
        nameInput.onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
        priceInput.onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
        descriptionInput.onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
        setImages([]);
        setSelectedSize("");
        setGender("");
      } catch (error) {
        return showError('Somethins went wrong');
      }
  };


  return (
      <Grid sx={{
      backgroundColor: theme === "bright" ? "white" : "black",
      color: theme === "bright" ? "black" : "white",
      paddingTop: '20vh',
      transition: '0.5s ease',
      height: '150vh',
      overflow: 'hidden',
      }} container direction="column" alignItems="center" spacing={3}>
        <h2>Create a new product!</h2>
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
                select
                label="Size"
                value={selectedSize}
                onChange={handleSizeChange}
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
              >
                {Object.values(Size).map(size => (
                  <MenuItem key={size} value={size}>{size}</MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Gender"
                value={gender}
                onChange={handleGenderChange}
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
              >
                {Object.values(Gender).map(gender => (
                  <MenuItem key={gender} value={gender}>{gender}</MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
                >               
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
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
              <input type="file" onChange={handleNewProductImageChange} accept="image/*" multiple />
              <Button sx={{ marginTop: '15px' }} type="submit" variant="outlined" color="primary">
                Create Product
              </Button>
            </Box>
          </form>
          <CreateCategory/>
      </Grid>
  </Grid>
  );
}
