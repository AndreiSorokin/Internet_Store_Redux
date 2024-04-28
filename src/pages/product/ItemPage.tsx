import React, { useEffect, useState } from "react";
import { deleteProduct, fetchSingleProduct, updateProduct } from "../../redux/slices/productSlice";
import { AppState, useAppDispatch, useAppSelector } from "../../redux/store";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useTheme } from "../../components/contextAPI/ThemeContext";
import useSuccsessMessage from '../../hooks/SuccsessMessage';
import useInput from '../../hooks/UseInput';
import { LoggedInUser } from "../../misc/type";
import { addToCart } from "../../redux/slices/cartSlice";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Typography, Grid, CardContent, CardMedia, IconButton, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Modal } from "@mui/material";
import useErrorMessage from "../../hooks/ErrorMessage";
import parseJwt from "../../helpers/decode";


const ItemPage: React.FC = () => {
  const { theme } = useTheme();
  const { succsessMessage, showSuccessMessage, succsessMessageStyle } = useSuccsessMessage();
  const { errorMessage, showError, errorMessageStyle } = useErrorMessage();

  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const productItem = useAppSelector((state: AppState) => state.products.selectedProduct);
  const user = useAppSelector((state: AppState) => state.userRegister.user) as LoggedInUser;
  const navigate = useNavigate();

  const updatedTitleInput = useInput();
  const updatedPriceInput = useInput();

  const [quantity, setQuantity] = useState<number>(1);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [openUserInputs, setOpenUserInputs] = useState<boolean>(false);

  const userData = parseJwt(localStorage.getItem('token'));
  const isAdmin = userData && userData?.role === 'ADMIN'
  
  const handleAddToCart = () => {
    setOpenDialog(true);
  };

  const handleConfirmAddToCart = () => {
    if(userData.status === "INACTIVE") {
      showError('Your account is not active. Please contact the support');
      return
    }

    if (productItem && quantity) {
      dispatch(addToCart({ productId: productItem, quantity: quantity }));

      const cartItems = JSON.parse(localStorage.getItem("cartInformation") || "[]");
      const newItem = { productId: productItem.id, quantity: quantity };
      const existingItemIndex = cartItems.findIndex((item: { productId: number }) => item.productId === productItem.id);

      if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].quantity += quantity;
      } else {
        cartItems.push(newItem);
      }

      setOpenDialog(false);
      
      localStorage.setItem("cartInformation", JSON.stringify(cartItems));
      showSuccessMessage(`${quantity} ${productItem.name} added to cart!`);
      setQuantity(1)
    }
  };

  const handleDelete = async () => {
    if (productItem) {
      const answer = window.confirm('Do you want to delete this product?');

      if (answer) {
        const productId = productItem.id.toString();
        await dispatch(deleteProduct(productId));
        alert(`Product ${productItem.name.toString()} has been deleted`);
        navigate('/products');
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (productItem && (updatedTitleInput.value || updatedPriceInput.value)) {
      const updatedPriceValue = typeof updatedPriceInput.value === 'string' ? parseFloat(updatedPriceInput.value) : updatedPriceInput.value;
      await dispatch(updateProduct({
        id: productItem.id.toString(),
        name: updatedTitleInput.value || productItem.name,
        price: updatedPriceValue || productItem.price
      }));

      await dispatch(fetchSingleProduct(productItem.id.toString()));
      showSuccessMessage('Product updated successfully');
      updatedTitleInput.onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)
      updatedPriceInput.onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleProduct(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleOpenImage = (image: string) => {
    setSelectedImage(image);
  };
  
  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseUserInputs = () => {
    setOpenUserInputs(false);
  };

  const handleNextImage = () => {
    if (productItem) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % productItem.images.length);
      setSelectedImage(productItem.images[(currentImageIndex + 1) % productItem.images.length]);
    }
  };

  const handlePreviousImage = () => {
    if (productItem) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + productItem.images.length) % productItem.images.length);
      setSelectedImage(productItem.images[(currentImageIndex - 1 + productItem.images.length) % productItem.images.length]);
    }
  };

  return (
    <Grid
      container
      style={{
        background: theme === 'bright' ? 'linear-gradient(to bottom, #B8B8B8  0%, #9C9C9C 25%, #7B7B7B 50%, #353535 100%)' : 'linear-gradient(to bottom, #444444 18%, #414141 38%, #3C3C3C 56%, #212121 97%)',
        color: theme === "bright" ? "black" : "#E9E9E9",
        minHeight: '100vh',
        transition: '0.5s ease',
        paddingTop: '20vh'
      }}
    >
      {succsessMessage && <p style={succsessMessageStyle}>{succsessMessage}</p>}
      {errorMessage && <p style={errorMessageStyle}>{errorMessage}</p>}
      <Grid item>
        <Link to="/products" style={{ textDecoration: "none" }}>
          <IconButton sx={{ position: 'absolute', top: '15vh', left: '2vw', color: theme === 'bright' ? 'black' : 'white' }}>
            <ArrowBackIcon />
            Back
          </IconButton>
        </Link>
      </Grid>
      {productItem && (
        <Grid item xs={12}>
          <Typography variant="h4" align="center" gutterBottom style={{ padding: '20px' }}>
            {productItem.name}
          </Typography>
        </Grid>
      )}
      <Grid item xs={12} sm={6}>
        <Grid
        container
        direction="column"
        alignItems="center"
        spacing={3}
        style={{ padding: '20px' }}
        >
        {productItem && (
          <Grid item>
            <CardContent>
              <Grid container justifyContent="center" spacing={2}>
                {productItem.images.map((image, index) => (
                  <Grid item key={index} xs={index === 0 ? 12 : 4}>
                    <Button onClick={() => handleOpenImage(image)}>
                      <CardMedia
                        component="img"
                        height={index === 0 ? "auto" : "140"}
                        image={image}
                        alt="An item's pictures not available"
                        sx={{ maxWidth: '100%' }}
                      />
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Grid>
        )}
        </Grid>      
          <Modal
            open={selectedImage !== null}
            onClose={handleCloseImage}
            aria-labelledby="image-modal"
            aria-describedby="image-modal-description"
            sx={{
              '& .MuiBackdrop-root': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)'
              }
            }}
            >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              {selectedImage && (
                <div style={{ textAlign: "center", position: "relative" }}>
                  <IconButton onClick={handlePreviousImage} style={{ position: "absolute", top: '40%' ,left: "-100px" }}>
                    <ArrowBackIcon sx={{fontSize: '50px', color: theme === 'bright' ? '#e6e2d3' : 'white'}} />
                  </IconButton>
                  <Box
                    sx={{
                      borderRadius: '5px',
                      width: '100%',
                      maxWidth: '400px',
                      height: 'auto',
                      maxHeight: '400px',
                      margin: '0 auto',
                      '@media (max-width: 768px)': {
                        maxWidth: '200px',
                        maxHeight: '200px',
                      },
                    }}
                    >
                    <img src={selectedImage} alt="Selected item" style={{ width: '100%', height: '100%' }} />
                  </Box>
                  <IconButton onClick={handleNextImage} style={{ position: "absolute", top: '40%', right: "-100px" }}>
                    <ArrowForwardIcon sx={{fontSize: '50px', color: theme === 'bright' ? '#e6e2d3' : 'white'}} />
                  </IconButton>
                  <IconButton onClick={handleCloseImage} style={{ position: "absolute", top: "-50px", right: "-35px", color: "white" }}>
                    <CloseIcon sx={{fontSize: '40px' ,color: theme === 'bright' ? '#e6e2d3' : 'white'}} />
                  </IconButton>
                </div>
              )}
            </div>
          </Modal>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Grid
          container
          direction="column"
          alignItems="center"
          spacing={3}
          style={{ padding: '20px' }}
        >
          {productItem && (
            <Grid item>
              <CardContent>
                <Typography gutterBottom variant="h6" component="p" align="center">
                  Price: ${productItem.price}
                </Typography>
                <Typography gutterBottom variant="h6" component="p" align="center">
                  Category: {productItem.category.name}
                </Typography>
                <Typography variant="body1" color="textSecondary" component="p" align="center" sx={{ color: theme === 'bright' ? 'black' : 'white' }}>
                  {productItem.description}
                </Typography>
              </CardContent>
            </Grid>
          )}
          <Grid item>
            {userData
              ? <Button onClick={handleAddToCart} variant="outlined"
              sx={{ 
                color: 'white', border: '2px solid #5F2E2E', 
                fontSize: { xs: '0.8rem', sm: '1rem' }, 
                padding: { xs: '5px 10px', sm: '8px 15px' },
                margin: '20px 0 40px 0',
                '&:hover': {
                  borderColor: '#5F2E2E',
                  backgroundColor: '#5F2E2E',
                  transition: '0.5s ease'
                }
              }}
              >
                  Add to Cart
                </Button>
              : <Link style={{color: theme === 'bright' ? 'black' : 'white'}} to="/auth/login">Want to add this item? Sign in first!</Link>
            }
          </Grid>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
              <Box sx={{backgroundColor: theme === 'bright' ? 'white' : 'black'}}>
              <DialogTitle sx={{
                backgroundColor: theme === 'bright' ? '#B8B8B8' : '#444444',
                color: theme === 'bright' ? 'black' : '#E9E9E9',
              }}>Select Quantity</DialogTitle>
                <DialogContent sx={{
               backgroundColor: theme === 'bright' ? '#B8B8B8' : '#444444',
               overflow: 'hidden',
               }}>
                  <TextField
                    label="Quantity"
                    type="string"
                    value={quantity ?? ''}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    InputProps={{
                      sx: {
                         color: theme === 'bright' ? 'black' : 'white',
                         '@media (max-width: 768px)': {
                            maxWidth: '60%',
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
                   sx={{ margin: "2vh", width: "200px", borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white',
                   '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                          borderColor: theme === 'bright' ? 'black' : '#E9E9E9',
                      },
                    }, 'label': {
                      color: theme === 'bright' ? 'black' : '#E9E9E9',
                   } }}
                  />
                </DialogContent>
              <DialogActions style={{backgroundColor: theme === 'bright' ? '#B8B8B8' : '#444444'}}>
                <Button sx={{color: theme === 'bright' ? 'black' : 'white'}} onClick={handleCloseDialog}>Cancel</Button>
                <Button sx={{color: theme === 'bright' ? 'black' : 'white'}} onClick={handleConfirmAddToCart} color="primary">Add to Cart</Button>
              </DialogActions>
              </Box>
            </Dialog>
          {isAdmin && (
            <Grid item>
              <Button onClick={() => setOpenUserInputs(true)} variant="outlined"
                sx={{ 
                  color: 'white', border: '2px solid #5F2E2E', 
                  fontSize: { xs: '0.8rem', sm: '1rem' }, 
                  padding: { xs: '5px 10px', sm: '8px 15px' },
                  margin: '20px 0 40px 0',
                  backgroundColor: '#5F2E2E',
                  '&:hover': {
                    borderColor: '#5F2E2E',
                    transition: '0.5s ease'
                  }
                }}
              >
                Update Product
              </Button>
                <Dialog open={openUserInputs} onClose={() => setOpenUserInputs(false)}>
                <DialogTitle sx={{
               backgroundColor: theme === 'bright' ? '#B8B8B8' : '#444444',
               border: theme === 'bright' ? '1px solid #B8B8B8' : '1px solid #7B7B7B',
               color: theme === 'bright' ? 'black' : '#E9E9E9',
               }}>Update Product</DialogTitle>
                <DialogContent sx={{
               background: theme === 'bright' ? 'linear-gradient(to bottom, #B8B8B8  0%, #9C9C9C 25%, #7B7B7B 50%, #353535 100%)' : 'linear-gradient(to bottom, #444444 18%, #414141 38%, #3C3C3C 56%, #212121 97%)',
               border: theme === 'dark' ? '1px solid white' : '1px solid black',
               borderRadius: '5px',
               overflow: 'hidden',
               }}>
                <form onSubmit={(e) => { handleUpdate(e); setOpenUserInputs(false); }}>
                  <Box sx={{
                    flexDirection: "column",
                    alignItems: "center",
                    width: "fit-content",
                    marginTop: '5vh'
                  }}>
                    <TextField
                      value={updatedTitleInput.value}
                      onChange={updatedTitleInput.onChange}
                      label="New Title"
                      type="text"
                      InputProps={{
                        sx: {
                          color: theme === 'bright' ? 'black' : 'white',
                          '@media (max-width: 768px)': {
                            maxWidth: '100%',
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
                      sx={{ 
                        margin: "2vh",
                        width: "100%",
                        maxWidth: "480px",
                        borderRadius: '5px', 
                        border: theme === 'bright' ? 'none' : '1px solid white',
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: theme === 'bright' ? 'black' : '#E9E9E9',
                          },
                        }, 
                        'label': {
                          color: theme === 'bright' ? 'black' : '#E9E9E9',
                        },
                        '@media (max-width: 768px)': {
                          maxWidth: '250px',
                        }
                      }}
                    />
                    <TextField
                      value={updatedPriceInput.value}
                      onChange={updatedPriceInput.onChange}
                      label="New Price"
                      type="text"
                      InputProps={{
                        sx: {
                          color: theme === 'bright' ? 'black' : 'white',
                          '@media (max-width: 768px)': {
                            maxWidth: '100%',
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
                      sx={{ 
                        margin: "2vh", 
                        width: "100%",
                        maxWidth: "480px",
                        borderRadius: '5px', 
                        border: theme === 'bright' ? 'none' : '1px solid white',
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: theme === 'bright' ? 'black' : '#E9E9E9',
                          },
                        }, 
                        'label': {
                          color: theme === 'bright' ? 'black' : '#E9E9E9',
                        },
                        '@media (max-width: 768px)': {
                          maxWidth: '250px',
                        }
                      }}
                    />
                    <Grid container justifyContent="center">
                      <Grid item>
                        <Button type="submit" onClick={handleCloseUserInputs}
                          sx={{
                            color: theme === 'bright' ? 'black' : '#E9E9E9', 
                            '&:hover': {
                              backgroundColor: 'rgba(95, 46, 46, 0.1)',
                              borderColor: theme === 'bright' ? 'black' : '#E9E9E9',
                            },
                            '@media (max-width: 768px)': {
                              fontSize: '0.7rem',
                              padding: '5px 10px',
                            },
                          }}
                        >Cancel</Button>
                        <Button type="submit" 
                          sx={{
                            color: 'white', 
                            border: '2px solid #5F2E2E', 
                            fontSize: { xs: '0.8rem', sm: '1rem' }, 
                            padding: { xs: '5px 10px', sm: '8px 15px' },
                            backgroundColor: '#5F2E2E',
                            '&:hover': {
                              borderColor: '#5F2E2E'
                            },
                            '@media (max-width: 768px)': {
                              fontSize: '0.7rem',
                              padding: '5px 10px',
                            },
                          }}
                        >Update</Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </form>
              </DialogContent>
            </Dialog>

              <Grid container justifyContent="center" marginTop="15px" spacing={3}>
                <Grid item>
                  <Button onClick={handleDelete} variant="outlined" color="error">
                    Delete Product
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ItemPage;
