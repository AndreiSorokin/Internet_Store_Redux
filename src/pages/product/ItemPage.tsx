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
import { Box, Typography, Grid, CardContent, CardMedia, IconButton, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";


const ItemPage: React.FC = () => {
  const { theme } = useTheme();
  const { succsessMessage, showSuccessMessage, succsessMessageStyle } = useSuccsessMessage();

  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const productItem = useAppSelector((state: AppState) => state.products.selectedProduct);
  const user = useAppSelector((state: AppState) => state.userRegister.user) as LoggedInUser;
  const navigate = useNavigate();

  const updatedTitleInput = useInput();
  const updatedPriceInput = useInput();

  const [quantity, setQuantity] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handleAddToCart = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmAddToCart = () => {
    if (productItem && quantity) {
      dispatch(addToCart({ product: productItem, quantity: quantity }));

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
      showSuccessMessage(`${quantity} ${productItem.title} added to cart!`);
    }
  };

  const handleDelete = async () => {
    if (productItem) {
      const answer = window.confirm('Do you want to delete this product?');

      if (answer) {
        const productId = productItem.id.toString();
        await dispatch(deleteProduct(productId));
        alert(`Product ${productItem.title.toString()} has been deleted`);
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
        title: updatedTitleInput.value || productItem.title,
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

  return (
    <Grid style={{
      backgroundColor: theme === "bright" ? "white" : "black",
      color: theme === "bright" ? "black" : "white",
      height: '120vh',
      paddingTop: '20vh',
      transition: '0.5s ease'
    }} container direction="column" alignItems="center" spacing={3}>
      <Grid item sx={{ alignSelf: 'flex-start', position: 'absolute', top: '10vh', left: '2vw' }}>
        <Link to="/products" style={{ textDecoration: "none" }}>
          <IconButton sx={{ color: theme === 'bright' ? 'black' : 'white' }}>
            <ArrowBackIcon />
            Back
          </IconButton>
        </Link>
      </Grid>
      {succsessMessage && <p style={succsessMessageStyle}>{succsessMessage}</p>}
      {productItem && (
        <Grid item>
          <CardContent>
            <Typography variant="h5" component="h2" align="center" gutterBottom>
              {productItem.title}
            </Typography>
            <Grid container justifyContent="center" spacing={2}>
              {productItem.images.map((image: string, index: number) => (
                <Grid item key={index}>
                  <CardMedia component="img" height="140" image={image} alt="An item's picture" />
                </Grid>
              ))}
            </Grid>
            <Typography gutterBottom variant="h6" component="p" align="center">
              Price: ${productItem.price}
            </Typography>
            <Typography variant="body1" color="textSecondary" component="p" align="center" sx={{ color: theme === 'bright' ? 'black' : 'white' }}>
              {productItem.description}
            </Typography>
            <Grid container justifyContent="center">
            <Grid sx={{ marginTop: '15px' }} item>
                {user
                ? <Button onClick={handleAddToCart} variant="outlined" color="primary">
                    Add to Cart
                  </Button>
                : <Link style={{color: theme === 'bright' ? 'black' : 'white'}} to="/auth/login">Want to add this item? Sign in first!</Link>
                }
              </Grid>
            </Grid>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>Select Quantity</DialogTitle>
              <DialogContent>
                <TextField
                  label="Quantity"
                  type="string"
                  value={quantity ?? ''}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button onClick={handleConfirmAddToCart} color="primary">Add to Cart</Button>
              </DialogActions>
            </Dialog>
            <form onSubmit={handleUpdate}>
            <Box sx={{
              display: user?.role === 'admin' ? 'block' : 'none',
              flexDirection: "column",
              alignItems: "center",
              marginLeft: "auto",
              marginRight: "auto",
              width: "fit-content",
              marginTop: '5vh'
              }}
              >
              <TextField
                value={updatedTitleInput.value}
                onChange={updatedTitleInput.onChange}
                label="New Title"
                type="text"
                InputProps={{
                  style: {
                    color: theme === 'bright' ? 'black' : 'white',
                  },
                }}
                sx={{ margin: "2vh", width: "350px", borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 'label': {
                  color: theme === 'bright' ? 'black' : 'white',
                } }}
              />
              <TextField
                value={updatedPriceInput.value}
                onChange={updatedPriceInput.onChange}
                label="New Price"
                type="text"
                InputProps={{
                  style: {
                    color: theme === 'bright' ? 'black' : 'white',
                  },
                }}
                sx={{ margin: "2vh", width: "350px", borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 'label': {
                  color: theme === 'bright' ? 'black' : 'white',
                } }}
              />
              <Grid container justifyContent="center">
                <Grid item>
                  <Button type="submit" variant="outlined" color="primary">
                    Update
                  </Button>
                </Grid>
              </Grid>
            </Box>
            </form>
            <Grid container sx={{ display: user?.role === 'admin' ? 'flex' : 'none' }} marginTop="15px" justifyContent="center" alignItems="center" spacing={3}>
              <Grid item>
                <Button onClick={handleDelete} variant="outlined" color="error">
                  Delete Product
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Grid>
      )}
    </Grid>
  );
};

export default ItemPage;
