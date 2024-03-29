import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormControl, InputLabel, MenuItem, Select, Button, Box, SelectChangeEvent } from "@mui/material";
import { AppState } from "../../redux/store";
import { setPriceFilter, sortByPrice } from "../../redux/slices/productSlice";
import { useTheme } from "../contextAPI/ThemeContext";
import { Products } from "../../misc/type";
interface FiltersProps {
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  productList: Products[];
}

const Filters: React.FC<FiltersProps> = ({ selectedCategory, setSelectedCategory, productList }) => {
  const { theme } = useTheme()
  
  const dispatch = useDispatch();
  const priceFilter = useSelector((state: AppState) => state.products.priceFilter);

  const uniqueCategories = useMemo(() => {
    return ["All", ...Array.from(new Set(productList.map(product => product.category.name)))];
  }, [productList]);


  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
  };

  const handlePriceFilterChange = (e: SelectChangeEvent<string>) => {
    dispatch(setPriceFilter(e.target.value as string));
  };

  const handleSortByPrice = (order: 'from low to high' | 'from high to low') => {
    dispatch(sortByPrice(order));
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
        <FormControl style={{ margin: "1vh" }}>
          <InputLabel sx={{ color: theme === 'bright' ? 'black' : 'white' }} id="demo-simple-select-label">Category</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedCategory}
            label="Category"
            onChange={handleCategoryChange}
            sx={{
              margin: "2vh",
              'div': {
                minWidth: "100px",
                color: theme === 'bright' ? 'black' : 'white',
                border: theme === 'bright' ? '1px solid white' : '1px solid white',
              }
            }}
          >
            {uniqueCategories.map(category => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ margin: "1vh" }}>
          <InputLabel sx={{ color: theme === 'bright' ? 'black' : 'white' }} id="price-range-label">Price Range</InputLabel>
          <Select
            labelId="price-range-label"
            id="price-range-select"
            value={priceFilter}
            label="Price Range"
            onChange={handlePriceFilterChange}
            sx={{ minWidth: "150px", border: theme === 'bright' ? 'none' : '1px solid white', 'div': {
              minWidth: "100px",
              color: theme === 'bright' ? 'black' : 'white',
              border: theme === 'bright' ? '1px solid white' : '1px solid white',
            } }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Under 20">Under $20</MenuItem>
            <MenuItem value="20 to 100">$20 - $100</MenuItem>
            <MenuItem value="Over 100">Over $100</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', flexDirection: "column", alignItems: "center", marginLeft: "1vh" }}>
          <Button sx={{ marginBottom: "1vh", width: "100%" }} onClick={() => handleSortByPrice('from low to high')} variant="outlined">Sort by Price (Low to High)</Button>
          <Button sx={{ width: "100%" }} onClick={() => handleSortByPrice('from high to low')} variant="outlined">Sort by Price (High to Low)</Button>
        </Box>
      </Box>
  );
};

export default Filters;