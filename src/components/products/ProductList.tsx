import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import {
  BrowserRouter as Router, Link
} from 'react-router-dom'

import { fetchProducts, filterByCategory, setPriceFilter, sortByPrice } from "../../redux/slices/productSlice";

import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";


export default function ProductList() {
  const dispatch = useAppDispatch();

  const productList = useAppSelector(state => state.products.products);
  const priceFilter = useAppSelector(state => state.products.priceFilter);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = productList.filter(product => {
    const titleMatches = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatches = selectedCategory === "All" || selectedCategory === product.category.name;
    const priceMatches = 
      !priceFilter ||
      (priceFilter === "Under 20" && product.price < 20) ||
      (priceFilter === "20 to 100" && product.price >= 20 && product.price <= 100) ||
      (priceFilter === "Over 100" && product.price > 100);
    return titleMatches && categoryMatches && priceMatches;
  });
  const currentPageData = filteredProducts.slice(startIndex, endIndex);
  const uniqueCategories = ["All", ...Array.from(new Set(productList.map(product => product.category.name)))];

  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    setSelectedCategory(e.target.value);
    dispatch(filterByCategory(e.target.value));
  };

  const handlePageChange = (e: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handlePriceFilterChange = (e: SelectChangeEvent<string>) => {
    dispatch(setPriceFilter(e.target.value));
  };
  const handleSortByPrice = (order: 'from low to high' | 'from high to low') => {
    dispatch(sortByPrice(order));
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Link to={'/createNew'}>
        <Button>Create new</Button>
      </Link>
      <TextField
        label="Search Products"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ margin: "2vh", width: "80%" }}
      />
      <Pagination
        count={Math.ceil(filteredProducts.length / itemsPerPage)}
        variant="outlined"
        shape="rounded"
        page={currentPage}
        onChange={handlePageChange}
        style={{ margin: "2vh" }}
      />
      <Box display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
        <FormControl style={{ margin: "1vh" }}>
          <InputLabel id="demo-simple-select-label">Category</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedCategory}
            label="Category"
            onChange={handleCategoryChange}
            style={{ minWidth: "100px" }}
          >
            {uniqueCategories.map(category => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl style={{ margin: "1vh" }}>
          <InputLabel id="price-range-label">Price Range</InputLabel>
          <Select
            labelId="price-range-label"
            id="price-range-select"
            value={priceFilter}
            label="Price Range"
            onChange={handlePriceFilterChange}
            style={{ minWidth: "150px" }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Under 20">Under $20</MenuItem>
            <MenuItem value="20 to 100">$20 - $100</MenuItem>
            <MenuItem value="Over 100">Over $100</MenuItem>
          </Select>
        </FormControl>
        <Box style={{ display: 'flex', flexDirection: "column", alignItems: "center", marginLeft: "1vh" }}>
          <Button style={{ marginBottom: "1vh", width: "100%" }} onClick={() => handleSortByPrice('from low to high')} variant="outlined">Sort by Price (Low to High)</Button>
          <Button style={{ width: "100%" }} onClick={() => handleSortByPrice('from high to low')} variant="outlined">Sort by Price (High to Low)</Button>
        </Box>
      </Box>
      <Grid container spacing={3}>
        {currentPageData.map(product => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <div>
              <div>{product.title}</div>
              <div>Price: ${product.price}</div>
              <div>
                <img style={{ width: '100%', height: 'auto' }} src={product.category.image} alt={`a picture of ${product.title}`} />
                <Link to={`/products/${product.id}`}>
                  <Button variant="outlined">
                    View
                  </Button>
                </Link>
              </div>
            </div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}