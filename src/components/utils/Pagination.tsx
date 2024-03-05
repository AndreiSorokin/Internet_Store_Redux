import React from 'react';
import MuiPagination from '@mui/material/Pagination';

interface CustomPaginationProps {
   theme: string;
   currentPage: number;
   filteredProducts: any[];
   itemsPerPage: number;
   handlePageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}

const Pagination: React.FC<CustomPaginationProps> = ({ theme, currentPage, filteredProducts, itemsPerPage, handlePageChange }) => {
   return (
      <MuiPagination
      count={Math.ceil(filteredProducts.length / itemsPerPage)}
      variant="outlined"
      shape="rounded"
      page={currentPage}
      onChange={handlePageChange}
      sx={{
         'button': {
            color: theme === 'bright' ? 'black' : 'white',
            border: theme === 'bright' ? '1px solid white' : '1px solid white',
         },
         'div': {
            color: theme === 'bright' ? 'black' : 'white',
         }
      }}
      />
   );
};

export default Pagination;
