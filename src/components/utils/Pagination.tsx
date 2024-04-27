import React, { useEffect, useState } from 'react';
import MuiPagination from '@mui/material/Pagination';
import { AppState, useAppDispatch, useAppSelector } from '../../redux/store';
import { fetchProducts } from '../../redux/slices/productSlice';
import { useTheme } from '../contextAPI/ThemeContext';

interface PaginationProps {
   searchQuery: string;
   minPrice: number;
   maxPrice: number;
   size: string;
   gender: string;
}

const Pagination = ({ searchQuery, minPrice, maxPrice, size, gender }: PaginationProps) => {
   const { theme } = useTheme()
   
   const dispatch = useAppDispatch();
   const count = useAppSelector((state: AppState) => state.products.totalCount);

   const [currentPage, setCurrentPage] = useState(0);
   const rows = 9

   const handlePageChange = (event: unknown, newPage: number) => {
      setCurrentPage(newPage - 1);
   }
   
   useEffect(() => {
      dispatch(fetchProducts({
         limit: rows,
         offset: currentPage * rows,
         searchQuery: searchQuery,
         minPrice: minPrice,
         maxPrice: maxPrice,
         size: size,
         gender: gender
      }));
   }, [dispatch, rows, currentPage]);

   return (
      <MuiPagination
      count={Math.ceil(count / rows)}
      page={currentPage + 1}
      onChange={handlePageChange}
      variant="outlined"
      shape="rounded"
      sx={{
         'button': {
            color: theme === 'bright' ? 'black' : '#E9E9E9',
            border: '1px solid #8F5E4E',
         },
         'div': {
            color: theme === 'bright' ? 'black' : 'white',
         }
      }}
      />
   );
};

export default Pagination;