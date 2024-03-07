import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AppState, useAppDispatch, useAppSelector } from "../../redux/store";
import {
  BrowserRouter as Router, Link
} from 'react-router-dom'

import { fetchProducts } from "../../redux/slices/productSlice";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTheme } from "../../components/contextAPI/ThemeContext";
import Filters from "../../components/utils/Filters";
import Search from "../../components/utils/Search";
import Pagination from "../../components/utils/Pagination";
import ProductItem from "../../components/products/ProductItem";
import ScrollToTopButton from "../../components/utils/ScrollToTop";
import { LoggedInUser } from "../../misc/type";


export default function ProductsPage() {
  const { theme } = useTheme()
  
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: AppState) => state.userRegister.user) as LoggedInUser;

  const productList = useAppSelector(state => state.products.products);
  const priceFilter = useAppSelector(state => state.products.priceFilter);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(localStorage.getItem("searchQuery") || "");
  const [selectedCategory, setSelectedCategory] = useState(localStorage.getItem("selectedCategory") || "All");
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("searchQuery", searchQuery);
    localStorage.setItem("selectedCategory", selectedCategory);
  }, [searchQuery, selectedCategory]);

  const filteredProducts = useMemo(() => {
    return productList.filter(product => {
      const titleMatches = product.title.toLowerCase().includes(searchQuery.toLowerCase());
      const categoryMatches = selectedCategory === "All" || selectedCategory === product.category.name;
      const priceMatches = 
        !priceFilter ||
        (priceFilter === "Under 20" && product.price < 20) ||
        (priceFilter === "20 to 100" && product.price >= 20 && product.price <= 100) ||
        (priceFilter === "Over 100" && product.price > 100);
      return titleMatches && categoryMatches && priceMatches;
    });
  }, [productList, searchQuery, selectedCategory, priceFilter]);

  const currentPageData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [currentPage, filteredProducts, itemsPerPage]);

  const handlePageChange = useCallback((e: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  }, []);

  return (
    <div style={{
      backgroundColor: theme === "bright" ? "white" : "black",
      color: theme === "bright" ? "black" : "white",
      height: '400vh',
      paddingTop: '20vh',
      padding:'25px',
      transition: '0.5s ease'
    }} >
      
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Link style={{marginTop:"10vh", display: user?.role === 'admin' ? 'block' : 'none'}} to={'/createNew'}>
          <Button>Create new</Button>
        </Link>

        <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} theme={theme}/>
        <Pagination theme={theme} currentPage={currentPage} filteredProducts={filteredProducts} itemsPerPage={itemsPerPage} handlePageChange={handlePageChange}/>
        <Filters selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} productList={productList}/>
        <ProductItem currentPageData={currentPageData}/>
        <ScrollToTopButton/>
    </Box>
    </div>
  );
}