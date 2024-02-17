import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleProduct } from "../../redux/slices/productSlice";
import { AppState, useAppDispatch } from "../../redux/store";
import { Link, useParams } from "react-router-dom";

import { CircularProgress, Typography, Grid, CardContent, CardMedia, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ProductInfo: React.FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const productItem = useSelector((state: AppState) => state.products.selectedProduct);
  console.log('product',productItem)

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
    </Grid>
  );
};

export default ProductInfo;