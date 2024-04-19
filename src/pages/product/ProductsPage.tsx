import React, { useEffect, useMemo, useState } from "react";
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
import { LoggedInUser } from "../../misc/type";
import useDebounce from "../../hooks/UseDebounce"

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";


export default function ProductsPage() {
  const { theme } = useTheme()
  
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: AppState) => state.userRegister.user) as LoggedInUser;
  const productList = useAppSelector(state => state.products.products);

  console.log(productList)

  const userData = user?.userData as LoggedInUser
  const isAdmin = user && user?.role === 'ADMIN'

  const [searchQuery, setSearchQuery] = useState(localStorage.getItem("searchQuery") || "");
  const [selectedCategory, setSelectedCategory] = useState(localStorage.getItem("selectedCategory") || "All");
  const [dialog, setDialog] = useState(false);

  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [size, setSize] = useState(localStorage.getItem("selectedSize") || "");
  const [gender, setGender] = useState(localStorage.getItem("selectedGender") || "");

  const debouncedSearch = useDebounce(searchQuery, 500);
  const debouncedMinPrice = useDebounce(minPrice, 500)
  const debouncedMaxPrice = useDebounce(maxPrice, 500)

  useEffect(() => {
    const minPriceValue = typeof debouncedMinPrice === 'number' ? debouncedMinPrice : undefined;
    const maxPriceValue = typeof debouncedMaxPrice === 'number' ? debouncedMaxPrice : undefined

    dispatch(fetchProducts({ 
      limit: 9,
      offset: 0,
      searchQuery: debouncedSearch,
      minPrice: minPriceValue,
      maxPrice: maxPriceValue,
      size,
      gender
    }));
  }, [dispatch, debouncedSearch, selectedCategory, debouncedMinPrice, debouncedMaxPrice, size, gender]);

  useEffect(() => {
    localStorage.setItem("searchQuery", debouncedSearch);
    localStorage.setItem("selectedCategory", selectedCategory);
    localStorage.setItem("selectedSize", size);
    localStorage.setItem("selectedGender", gender);
  }, [debouncedSearch, selectedCategory, size, gender]);

  useEffect(() => {
    localStorage.setItem("selectedCategory", selectedCategory);
  }, [selectedCategory]);

  const filteredProducts = useMemo(() => {
    return productList.filter(product => {
      const titleMatches = product.name.toLowerCase().includes(debouncedSearch.toLowerCase());
      const categoryMatches = selectedCategory === "All" || selectedCategory === product.category.name;
      return titleMatches && categoryMatches;
    });
  }, [productList, debouncedSearch, selectedCategory]);


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
        <Link style={{marginTop:"10vh", display: user && isAdmin ? 'block' : 'none'}} to={'/createNew'}>
          <Button>Create new</Button>
        </Link>

        <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} theme={theme}/>

        <Button style={{transform: 'translate(0,-10vh)'}} onClick={() => setDialog(true)}>Filters</Button>
        <Dialog open={dialog} onClose={() => setDialog(false)}>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ height: '55vh', borderRadius: '5px', backgroundColor: theme === "bright" ? "white" : "black", border: theme === "bright" ? "1px solid black" : "1px solid white", '@media (max-width: 900px)': { width: '45vw', height: '60vh' } }}>
            <Button onClick={() => setDialog(false)} style={{ display: 'block', transform: 'translate(14vw, -2vh)', color: theme === 'bright' ? 'black' : 'white' }}><CloseIcon /></Button>
            <div style={{ height: '40vh', width:'35vw', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Filters selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} productList={productList}/>
              <Box sx={{ margin: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <input
                  type="number"
                  value={minPrice || ''}
                  onChange={(e) => setMinPrice(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Min Price"
                  style={{ padding: '10px', marginRight: '5px', width:'40%', marginBottom: '10px' }}
                />
                <input
                  type="number"
                  value={maxPrice || ''}
                  onChange={(e) => setMaxPrice(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Max Price"
                  style={{ padding: '10px', marginRight: '5px', width:'40%' }}
                />
              </Box>
              <Box display="flex" alignItems="center" sx={{marginLeft: '10vw', flexDirection: 'column'}}>
                <FormControl sx={{width: '110%'}}>
                  <InputLabel id="size-select-label">Size</InputLabel>
                  <Select
                    labelId="size-select-label"
                    id="size-select"
                    value={size}
                    label="Size"
                    onChange={(e) => setSize(e.target.value)}
                    style={{ marginBottom: '20px', width: '60%', alignItems: 'center' }}
                  >
                    <MenuItem value=""><em>All</em></MenuItem>
                    <MenuItem value="Small">Small</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Large">Large</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{width: '110%'}}>
                  <InputLabel id="gender-select-label">Gender</InputLabel>
                  <Select
                    labelId="gender-select-label"
                    id="gender-select"
                    value={gender}
                    label="Gender"
                    onChange={(e) => setGender(e.target.value)}
                    style={{ marginBottom: '20px', width:'60%' }}
                  >
                    <MenuItem value=""><em>All</em></MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </div>
          </Box>
        </Dialog>
        <ProductItem filteredProducts={filteredProducts}/>
        <ScrollToTopButton/>
        <Pagination searchQuery={searchQuery} minPrice={minPrice || 0} maxPrice={maxPrice || Number.MAX_SAFE_INTEGER} size={size} gender={gender} />
    </Box>
    </div>
  );
}