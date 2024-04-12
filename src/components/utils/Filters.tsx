import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormControl, InputLabel, MenuItem, Select, Button, Box, SelectChangeEvent } from "@mui/material";
import { AppState } from "../../redux/store";
import { sortByPrice } from "../../redux/slices/productSlice";
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

  const uniqueCategories = useMemo(() => {
    return ["All", ...Array.from(new Set(productList.map(product => product.category.name)))];
  }, [productList]);


  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
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
      </Box>
  );
};

export default Filters;