import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { deleteProduct, fetchSingleProduct, updateProduct } from "../../redux/slices/productSlice";
import { AppState, useAppDispatch } from "../../redux/store";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import { Typography, Grid, CardContent, CardMedia, IconButton, Button, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "../contextAPI/ThemeContext";
import useSuccsessMessage from '../../hooks/SuccsessMessage';
import useInput from '../../hooks/UseInput';

const ProductInfo: React.FC = () => {
  const { theme } = useTheme()
  const { succsessMessage, showSuccessMessage, succsessMessageStyle } = useSuccsessMessage();

  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const productItem = useSelector((state: AppState) => state.products.selectedProduct);
  const navigate = useNavigate()

  const updatedTitleInput = useInput();
  const updatedPriceInput = useInput();

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
    if (productItem && (updatedTitleInput.value || updatedPriceInput.value)) {
      const updatedPriceValue = typeof updatedPriceInput.value === 'string' ? parseFloat(updatedPriceInput.value) : updatedPriceInput.value;
      await dispatch(updateProduct({
        id: productItem.id.toString(),
        title: updatedTitleInput.value || productItem.title,
        price: updatedPriceValue || productItem.price
      }));
      
      await dispatch(fetchSingleProduct(productItem.id.toString()));
      showSuccessMessage('Product updated successfully');
    }
  };
  

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleProduct(id));
    }
  }, [dispatch, id]);

  return (
    <Grid style={{
      backgroundColor: theme === "bright" ? "white" : "black",
      color: theme === "bright" ? "black" : "white",
      height: '120vh',
      paddingTop: '20vh'
    }} container direction="column" alignItems="center" spacing={3}>
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
            <Typography variant="body1" color="textSecondary" component="p" align="center" sx={{color: theme === 'bright' ? 'black' : 'white'}}>
              {productItem.description}
            </Typography>
            <TextField
              {...updatedTitleInput}
              label="New Title"
              type="text"
              InputProps={{
                style: {
                  color: theme === 'bright' ? 'black' : 'white',
                },
              }}
              sx={{ margin: "2vh", width: "80%", borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 'label': {
                color: theme === 'bright' ? 'black' : 'white',
              } }} />
            <TextField
              {...updatedPriceInput}
              label="New Price"
              type="text"
              InputProps={{
                style: {
                  color: theme === 'bright' ? 'black' : 'white',
                },
              }}
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
    </Grid>
  );
};

export default ProductInfo;
