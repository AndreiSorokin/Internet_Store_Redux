import React, { useEffect, useState } from "react";
import { AppState, useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";
import {
  BrowserRouter as Router, Link
} from 'react-router-dom'

import { fetchProducts, filterByCategory  } from "../../redux/slices/productSlice";

import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from "@mui/material/TextField";


export default function ProductList() {
  const dispatch = useAppDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const productList = useSelector((state: AppState) => state.products.products);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredProducts = searchQuery
    ? productList.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : productList;

  const currentPageData = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  console.log(productList.map(p=> 
    p
  ))

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <TextField
        label="Search Products"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: 20, width: 300 }}
      />
      <Pagination 
        count={Math.ceil(filteredProducts.length / itemsPerPage)} 
        variant="outlined" 
        shape="rounded" 
        page={currentPage}
        onChange={handlePageChange}
      />
      <Grid container spacing={3}>
        {currentPageData.map(product => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <div>
              <div>{product.title}</div>
              <div>
                <img style={{width: '150px', height: '150px'}} src={product.category.image} alt={`a picture of ${product.title}`} />
                <Link to={`/products/${product.id}`}>
                  <button>
                    View
                  </button>
                </Link>
              </div>
            </div>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
