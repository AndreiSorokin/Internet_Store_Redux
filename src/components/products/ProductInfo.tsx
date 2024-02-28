import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { deleteProduct, fetchSingleProduct, updateProduct } from "../../redux/slices/productSlice";
import { AppState, useAppDispatch } from "../../redux/store";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import { Typography, Grid, CardContent, CardMedia, IconButton, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { addToCart } from "../../redux/slices/cartSlice";
import { useTheme } from "../contextAPI/ThemeContext";

const ProductInfo: React.FC = () => {
  const { theme } = useTheme()
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const productItem = useSelector((state: AppState) => state.products.selectedProduct);
  const navigate = useNavigate()

  const [updatedTitle, setUpdatedTitle] = useState<string>(''); 
  const [updatedPrice, setUpdatedPrice] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handleDelete = async () => {
    if (productItem) {
      const answer = window.confirm('Do you want to delete this product?')

      if(answer) {
        const productId = productItem.id.toString();
        await dispatch(deleteProduct(productId));
      }

      alert(`Product ${productItem.title.toString()} has been deleted`)
    }
    navigate('/products')
  };

  const handleUpdate = async () => {
    if (productItem && (updatedTitle || updatedPrice)) {
      await dispatch(updateProduct({
        id: productItem.id.toString(),
        title: updatedTitle || productItem.title,
        price: updatedPrice || productItem.price
      }));
      
      await dispatch(fetchSingleProduct(productItem.id.toString()));
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleProduct(id));
    }
  }, [dispatch, id]);

  const handleAddToCart = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmAddToCart = () => {
    if (productItem && quantity) {
      dispatch(addToCart({ product: productItem, quantity: quantity }));
      alert(`${quantity} ${productItem.title} added to cart!`);
      setOpenDialog(false);

      const cartItems = JSON.parse(localStorage.getItem("cartInformation") || "");
      const newItem = { productId: productItem.id, quantity: quantity };
      const existingItemIndex = cartItems.findIndex((item: { productId: number }) => item.productId === productItem.id);
      if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].quantity += quantity;
      } else {
        cartItems.push(newItem);
      }
      localStorage.setItem("cartInformation", JSON.stringify(cartItems));
    }
  };

  return (
    <Grid style={{
      backgroundColor: theme === "bright" ? "white" : "black",
      color: theme === "bright" ? "black" : "white",
      height: '120vh',
      paddingTop: '20vh'
    }} container direction="column" alignItems="center" spacing={3}>
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
            <Typography variant="body1" color="textSecondary" component="p" align="center" sx={{color: theme === 'bright' ? 'black' : 'white'}}>
              {productItem.description}
            </Typography>
            <Button onClick={handleAddToCart} variant="contained" color="primary">
              Add to Cart
            </Button>
            <TextField
              label="New Title"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
              InputProps={{
                style: {
                  color: theme === 'bright' ? 'black' : 'white',
                },
              }}
              sx={{ margin: "2vh", width: "80%", borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 'label': {
                color: theme === 'bright' ? 'black' : 'white',
              } }} />
            <TextField
              label="New Price"
              type="text"
              value={updatedPrice ?? ''}
              onChange={(e) => setUpdatedPrice(Number(e.target.value))}
              sx={{ margin: "2vh", width: "80%", borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 'label': {
                color: theme === 'bright' ? 'black' : 'white',
              } }}
            />
            <Button onClick={handleUpdate} variant="outlined" color="primary">
              Update
            </Button>
          </CardContent>
        </Grid>
      )}
      <Grid item>
        <Link to="/products" style={{ textDecoration: "none" }}>
          <IconButton sx={{color: theme === 'bright' ? 'black' : 'white'}}>
            <ArrowBackIcon />Back
          </IconButton>
        </Link>
      </Grid>
      <Grid container direction="column" alignItems="center" spacing={3}>
        <Grid item>
          <Button onClick={handleDelete} variant="outlined" color="error">
            Delete Product
          </Button>
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
    </Grid>
  );
};

export default ProductInfo;
