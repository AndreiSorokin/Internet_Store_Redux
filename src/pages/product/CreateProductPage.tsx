import React, { useEffect } from 'react';
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
import { fetchCategories } from '../../redux/slices/categorySlice';
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
        window.scrollTo(0, 0);
        return showError('Please make sure that you filled out all fields');
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

        await dispatch(createProduct(newProduct)).unwrap();
        showSuccessMessage('Product added successfully');
        nameInput.onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
        priceInput.onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
        descriptionInput.onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
        setImages([]);
        setSelectedSize("");
        setGender("");
        window.scrollTo(0, 0);
      } catch (error) {
        window.scrollTo(0, 0);
        return showError('Somethins went wrong');
      }
  };


  return (
  <Grid sx={{
        background: theme === 'bright' ? 'linear-gradient(to bottom, #B8B8B8  0%, #9C9C9C 25%, #7B7B7B 50%, #353535 100%)' : 'linear-gradient(to bottom, #444444 18%, #414141 38%, #3C3C3C 56%, #212121 97%)',
        color: theme === "bright" ? "black" : "#E9E9E9",
        paddingTop: '20vh',
        transition: '0.5s ease',
        height: '150vh',
        overflow: 'hidden',
      }} container direction="column" alignItems="center" spacing={3}>
      <h2>Create a new product!</h2>
      <Grid item sx={{ alignSelf: 'flex-start', position: 'absolute', top: '10vh', left: '2vw' }}>
          <Link to="/products" style={{ textDecoration: "none" }}>
            <IconButton sx={{ color: theme === 'bright' ? 'black' : '#E9E9E9' }}>
                <ArrowBackIcon />
                Back
            </IconButton>
          </Link>
      </Grid>
      <Grid item>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: "column", alignItems: "center", marginLeft: "1vh" }}>
            <div style={{position: "absolute", top: "5vh", left: "34vw"}}>
              {errorMessage && <p style={errorMessageStyle}>{errorMessage}</p>}
              {succsessMessage && <p style={succsessMessageStyle}>{succsessMessage}</p>}
            </div>
            <TextField
                label="Name"
                value={nameInput.value}
                onChange={nameInput.onChange}
                fullWidth
                margin="normal"
                variant="outlined"
                InputProps={{
                  sx: {
                    color: theme === 'bright' ? 'black' : '#E9E9E9',
                    '@media (max-width: 768px)': {
                      maxWidth: '90%',
                    },
                  },
                }}
                InputLabelProps={{
                  sx: {
                    color: theme === 'bright' ? 'black' : 'white',
                    '&.Mui-focused': {
                      color: theme === 'bright' ? 'black' : '#E9E9E9',
                    },
                  },
                }}
                  sx={{ margin: "2vh", width: "500px", borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                        borderColor: theme === 'bright' ? 'black' : '#E9E9E9',
                    },
                  },
                  'label': {
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
                InputLabelProps={{
                  sx: {
                    color: theme === 'bright' ? 'black' : 'white',
                    '&.Mui-focused': {
                      color: theme === 'bright' ? 'black' : '#E9E9E9',
                    },
                  },
                }}
                sx={{ margin: "2vh", width: "500px", borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                      borderColor: theme === 'bright' ? 'black' : '#E9E9E9',
                  },
                }, 'label': {
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
                  InputLabelProps={{
                    sx: {
                      color: theme === 'bright' ? 'black' : 'white',
                      '&.Mui-focused': {
                        color: theme === 'bright' ? 'black' : '#E9E9E9',
                      },
                    },
                  }}
                  sx={{ margin: "2vh", width: "500px", borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                        borderColor: theme === 'bright' ? 'black' : '#E9E9E9',
                    },
                  }, 'label': {
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
                  InputLabelProps={{
                    sx: {
                      color: theme === 'bright' ? 'black' : 'white',
                      '&.Mui-focused': {
                        color: theme === 'bright' ? 'black' : '#E9E9E9',
                      },
                    },
                  }}
                  sx={{ margin: "2vh", width: "500px", borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                        borderColor: theme === 'bright' ? 'black' : '#E9E9E9',
                    },
                  }, 'label': {
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
                  InputLabelProps={{
                    sx: {
                      color: theme === 'bright' ? 'black' : 'white',
                      '&.Mui-focused': {
                        color: theme === 'bright' ? 'black' : '#E9E9E9',
                      },
                    },
                  }}
                  sx={{ margin: "2vh", width: "500px", borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                        borderColor: theme === 'bright' ? 'black' : '#E9E9E9',
                    },
                  }, 'label': {
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
                InputLabelProps={{
                  sx: {
                    color: theme === 'bright' ? 'black' : 'white',
                    '&.Mui-focused': {
                      color: theme === 'bright' ? 'black' : '#E9E9E9',
                    },
                  },
                }}
                sx={{ margin: "2vh", width: "500px", borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                      borderColor: theme === 'bright' ? 'black' : '#E9E9E9',
                  },
                }, 'label': {
                color: theme === 'bright' ? 'black' : 'white',
                } }}
              />
              <Box sx={{ margin: "2vh" }}>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    color: theme === 'bright'? 'black' : '#E9E9E9', 
                    border: theme === 'bright'? '2px solid black' : '2px solid #E9E9E9', 
                    fontSize: { xs: '0.8rem', sm: '1rem' }, 
                    padding: { xs: '5px 10px', sm: '8px 15px' },
                    backgroundColor: 'transparent',
                    '&:hover': {
                        borderColor: theme === 'bright'? 'black' : '#E9E9E9'
                    }
                  }}
                >
                  Upload File
                  <input
                    type="file"
                    hidden
                    onChange={handleNewProductImageChange}
                    accept="image/*"
                    multiple
                  />
                </Button>
              </Box>
              <Button
                variant="outlined"
                type="submit"
                sx={{ 
                  color: '#E9E9E9', border: '2px solid #5F2E2E', 
                  fontSize: { xs: '0.8rem', sm: '1rem' }, 
                  padding: { xs: '5px 10px', sm: '8px 15px' },
                  backgroundColor: '#5F2E2E',
                  '&:hover': {
                      borderColor: '#5F2E2E'
                  }
                }}
              >
                Create Product
              </Button>
            </Box>
          </form>
          <CreateCategory/>
      </Grid>
  </Grid>
  );
}
