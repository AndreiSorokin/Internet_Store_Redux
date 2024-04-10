import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AppState, useAppDispatch, useAppSelector } from "../../redux/store";
import {
  BrowserRouter as Router, Link
} from 'react-router-dom'

import { fetchProducts } from "../../redux/slices/productSlice";
import { useTheme } from "../../components/contextAPI/ThemeContext";
import Filters from "../../components/utils/Filters";
import Search from "../../components/utils/Search";
import Pagination from "../../components/utils/Pagination";
import ProductItem from "../../components/products/ProductItem";
import ScrollToTopButton from "../../components/utils/ScrollToTop";
import { LoggedInUser, NewProduct } from "../../misc/type";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';


export default function ProductsPage() {
  const { theme } = useTheme()
  
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: AppState) => state.userRegister.user) as LoggedInUser;

  const productList = useAppSelector(state => state.products.products);
  const priceFilter = useAppSelector(state => state.products.priceFilter);

  console.log('ProductPage', productList)

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(localStorage.getItem("searchQuery") || "");
  const [selectedCategory, setSelectedCategory] = useState(localStorage.getItem("selectedCategory") || "All");
  const [dialog, setDialog] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("searchQuery", searchQuery);
    localStorage.setItem("selectedCategory", selectedCategory);
  }, [searchQuery, selectedCategory]);

  // const filteredProducts = useMemo(() => {
  //   if (Array.isArray(productList)) {
  //     return productList.filter((product: NewProduct) => {
  //       const titleMatches = product.name.toLowerCase().includes(searchQuery.toLowerCase());
  //       const categoryMatches = selectedCategory === "All" || selectedCategory === product.category.name;
  //       const priceMatches = 
  //         !priceFilter ||
  //         (priceFilter === "Under 20" && product.price < 20) ||
  //         (priceFilter === "20 to 100" && product.price >= 20 && product.price <= 100) ||
  //         (priceFilter === "Over 100" && product.price > 100);
  //       return titleMatches && categoryMatches && priceMatches;
  //     });
  //   }
  //   return [];
  // }, [productList, searchQuery, selectedCategory, priceFilter]);

  // console.log('filteredProducts', filteredProducts) // []

  // const currentPageData = useMemo(() => {
  //   const startIndex = (currentPage - 1) * itemsPerPage;
  //   const endIndex = currentPage * itemsPerPage;
  //   return filteredProducts.slice(startIndex, endIndex);
  // }, [currentPage, filteredProducts, itemsPerPage]);

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
        <Link style={{marginTop:"10vh", display: user?.role === 'ADMIN' ? 'block' : 'none'}} to={'/createNew'}>
          <Button>Create new</Button>
        </Link>

        <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} theme={theme}/>

        <Button style={{transform: 'translate(0,-10vh)'}} onClick={() => setDialog(true)}>Filters</Button>
        <Dialog open={dialog} onClose={() => setDialog(false)}>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ borderRadius: '5px', backgroundColor: theme === "bright" ? "white" : "black", border: theme === "bright" ? "1px solid black" : "1px solid white", '@media (max-width: 900px)': { width: '45vw', height: '50vh' } }}>
          <Button onClick={() => setDialog(false)} style={{ display: 'block', transform: 'translate(14vw, 2vh)', color: theme === 'bright' ? 'black' : 'white' }}><CloseIcon /></Button>
            <div style={{ height: '40vh', width:'35vw', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Filters selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} productList={productList}/>
            </div>
          </Box>
        </Dialog>

        <ProductItem />
        <ScrollToTopButton/>
        {/* <Pagination theme={theme} currentPage={currentPage} filteredProducts={filteredProducts} itemsPerPage={itemsPerPage} handlePageChange={handlePageChange}/> */}
    </Box>
    </div>
  );
}