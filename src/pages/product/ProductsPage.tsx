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
import { useSelector } from "react-redux";
import TablePagination from "@mui/material/TablePagination";
import MuiPagination from '@mui/material/Pagination';
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";


export default function ProductsPage() {
  const { theme } = useTheme()
  
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: AppState) => state.userRegister.user) as LoggedInUser;

  const productList = useAppSelector(state => state.products.products);
  const count = useAppSelector((state: AppState) => state.products.totalCount);

  console.log('ProductPage', productList)

  const [searchQuery, setSearchQuery] = useState(localStorage.getItem("searchQuery") || "");
  const [selectedCategory, setSelectedCategory] = useState(localStorage.getItem("selectedCategory") || "All");
  const [dialog, setDialog] = useState(false);

  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [size, setSize] = useState("");
  const [gender, setGender] = useState("");

  useEffect(() => {
    dispatch(fetchProducts({ 
      limit: 9,
      offset: 0,
      searchQuery: searchQuery,
      minPrice: minPrice,
      maxPrice: maxPrice,
      size,
      gender
    }));
  }, [dispatch, searchQuery, selectedCategory, minPrice, maxPrice, size, gender]);

  useEffect(() => {
    localStorage.setItem("searchQuery", searchQuery);
    localStorage.setItem("selectedCategory", selectedCategory);
    localStorage.setItem("selectedSize", size);
    localStorage.setItem("selectedGender", gender);
  }, [searchQuery, selectedCategory, size, gender]);

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
              <Box sx={{ margin: '10px' }}>
                <input
                  type="number"
                  value={minPrice || ''}
                  onChange={(e) => setMinPrice(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Min Price"
                  style={{ padding: '10px', marginRight: '5px' }}
                />
                <input
                  type="number"
                  value={maxPrice || ''}
                  onChange={(e) => setMaxPrice(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Max Price"
                  style={{ padding: '10px' }}
                />
              </Box>
            </div>
          </Box>
        </Dialog>
        <Dialog open={dialog} onClose={() => setDialog(false)}>
            <FormControl fullWidth>
              <InputLabel id="size-select-label">Size</InputLabel>
              <Select
                labelId="size-select-label"
                id="size-select"
                value={size}
                label="Size"
                onChange={(e) => setSize(e.target.value)}
                style={{ marginBottom: '20px' }}
              >
                <MenuItem value=""><em>All</em></MenuItem>
                <MenuItem value="Small">Small</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Large">Large</MenuItem>
              </Select>
            </FormControl>
          </Dialog>
          <Dialog open={dialog} onClose={() => setDialog(false)}>
            <FormControl fullWidth>
              <InputLabel id="size-select-label">Size</InputLabel>
              <Select
                labelId="gender-select-label"
                id="gender-select"
                value={gender}
                label="Gender"
                onChange={(e) => setGender(e.target.value)}
                style={{ marginBottom: '20px' }}
              >
                <MenuItem value=""><em>All</em></MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </FormControl>
          </Dialog>
        
        <ProductItem />
        <ScrollToTopButton/>
        {/* <Pagination /> */}
    </Box>
    </div>
  );
}