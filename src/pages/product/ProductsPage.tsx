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
import useDebounce from "../../hooks/UseDebounce"

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import parseJwt from "../../helpers/decode";


export default function ProductsPage() {
  const { theme } = useTheme()
  
  const dispatch = useAppDispatch();
  const productList = useAppSelector(state => state.products.products);

  const userData = parseJwt(localStorage.getItem('token'));
  const isAdmin = userData?.role === 'ADMIN';

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
    <Box sx={{
      background: theme === 'bright' ? 'linear-gradient(to bottom, #B8B8B8  0%, #9C9C9C 25%, #7B7B7B 50%, #353535 100%)' : 'linear-gradient(to bottom, #444444 18%, #414141 38%, #3C3C3C 56%, #212121 97%)',
      color: theme === "bright" ? "black" : "#E9E9E9",
      height: '300vh',
      paddingTop: '20vh',
      padding:'25px',
      transition: '0.5s ease',
      '@media (max-width: 900px)': {
        height: '400vh', 
      },
      '@media (max-width: 600px)': {
        height: '720vh', 
      },
    }}>
      
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Link style={{marginTop:"10vh", display: userData && isAdmin ? 'block' : 'none'}} to={'/createNew'}>
          <Button sx={{color: theme === "bright" ? "black" : "#E9E9E9"}}>Create new</Button>
        </Link>

        <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} theme={theme}/>

        <Button style={{transform: 'translate(0,-10vh)', color: theme === "bright" ? "black" : "#E9E9E9"}} onClick={() => setDialog(true)}>Filters</Button>
        <Dialog open={dialog} onClose={() => setDialog(false)}>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{overflow: 'hidden', height: '55vh', borderRadius: '5px',
            background: theme === 'bright' ? 'linear-gradient(to top, #66605B 11%, #B8B8B8 85%)' : 'linear-gradient(to bottom, #9C9C9C 11%, #353535 98%)',
            '@media (max-width: 900px)': { width: '45vw', height: '60vh' } }}>
            <Button onClick={() => setDialog(false)} style={{ display: 'block', transform: 'translate(14vw, -2vh)', color: theme === 'bright' ? 'black' : '#E9E9E9' }}><CloseIcon /></Button>
            <div style={{ height: '40vh', width:'35vw', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Filters selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} productList={productList}/>
              <Box sx={{ margin: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <input
                  type="number"
                  value={minPrice || ''}
                  onChange={(e) => setMinPrice(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Min Price"
                  style={{ padding: '10px', marginRight: '5px', width:'40%', marginBottom: '10px', backgroundColor: 'transparent', border: theme === 'bright' ? '1px solid black' : '1px solid #E9E9E9' }}
                />
                <input
                  type="number"
                  value={maxPrice || ''}
                  onChange={(e) => setMaxPrice(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Max Price"
                  style={{ padding: '10px', marginRight: '5px', width:'40%', backgroundColor: 'transparent', border: theme === 'bright' ? '1px solid black' : '1px solid #E9E9E9' }}
                />
              </Box>
              <Box display="flex" alignItems="center" sx={{marginLeft: '10vw', flexDirection: 'column'}}>
                <FormControl sx={{width: '110%'}}>
                <InputLabel sx={{ color: theme === 'bright' ? 'black' : 'white', '&.Mui-focused': { color: theme === 'bright' ? 'black' : 'white' } }} id="demo-simple-select-label">Size</InputLabel>
                  <Select
                    labelId="size-select-label"
                    id="size-select"
                    value={size}
                    label="Size"
                    onChange={(e) => setSize(e.target.value)}
                    sx={{ marginBottom: '20px', width: '60%', alignItems: 'center',
                    'div': {
                      minWidth: "100px",
                      color: theme === 'bright' ? 'black' : '#E9E9E9',
                      border: theme === 'bright' ? '1px solid black' : '1px solid #E9E9E9',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'inherit',
                      }
                    }}
                  >
                    <MenuItem value=""><em>All</em></MenuItem>
                    <MenuItem value="Small">Small</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Large">Large</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{width: '110%'}}>
                <InputLabel sx={{ color: theme === 'bright' ? 'black' : 'white', '&.Mui-focused': { color: theme === 'bright' ? 'black' : 'white' } }} id="demo-simple-select-label">Gender</InputLabel>
                  <Select
                    labelId="gender-select-label"
                    id="gender-select"
                    value={gender}
                    label="Gender"
                    onChange={(e) => setGender(e.target.value)}
                    sx={{ marginBottom: '20px', width:'60%',
                    'div': {
                      minWidth: "100px",
                      color: theme === 'bright' ? 'black' : '#E9E9E9',
                      border: theme === 'bright' ? '1px solid black' : '1px solid #E9E9E9',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'inherit',
                      }
                    }}
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
    </Box>
  );
}