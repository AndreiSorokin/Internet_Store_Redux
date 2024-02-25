import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { deleteProduct, fetchSingleProduct, updateProduct } from "../../redux/slices/productSlice";
import { AppState, useAppDispatch } from "../../redux/store";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import { Typography, Grid, CardContent, CardMedia, IconButton, Button, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ProductInfo: React.FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const productItem = useSelector((state: AppState) => state.products.selectedProduct);
  const navigate = useNavigate()

  const [updatedTitle, setUpdatedTitle] = useState<string>(''); 
  const [updatedPrice, setUpdatedPrice] = useState<number | null>(null);
  
  if(productItem) {
    console.log('productItem',productItem.id)
  }

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

  return (
    <Grid container direction="column" alignItems="center" spacing={3}>
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
            <Typography variant="body1" color="textSecondary" component="p" align="center">
              {productItem.description}
            </Typography>
            <TextField
              label="New Title"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />
            <TextField
              label="New Price"
              type="text"
              value={updatedPrice ?? ''}
              onChange={(e) => setUpdatedPrice(Number(e.target.value))}
            />
            <Button onClick={handleUpdate} variant="outlined" color="primary">
              Update
            </Button>
          </CardContent>
        </Grid>
      )}
      <Grid item>
        <Link to="/products" style={{ textDecoration: "none" }}>
          <IconButton>
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