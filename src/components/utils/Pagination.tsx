// import React, { useEffect, useState } from 'react';
// import MuiPagination from '@mui/material/Pagination';
// import { AppState, useAppDispatch, useAppSelector } from '../../redux/store';
// import { fetchProducts } from '../../redux/slices/productSlice';
// import { useTheme } from '../contextAPI/ThemeContext';

// const Pagination = () => {
//    const { theme } = useTheme()
   
//    const dispatch = useAppDispatch();
//    const count = useAppSelector((state: AppState) => state.products.totalCount);

//    const [currentPage, setCurrentPage] = useState(0);
//    const rows = 9

//    const handlePageChange = (event: unknown, newPage: number) => {
//       setCurrentPage(newPage - 1);
//    }
   
//    useEffect(() => {
//       dispatch(fetchProducts({ limit: rows, offset: currentPage * rows }));
//    }, [dispatch, rows, currentPage]);

//    return (
//       <MuiPagination
//       count={Math.ceil(count / rows)}
//       page={currentPage + 1}
//       onChange={handlePageChange}
//       variant="outlined"
//       shape="rounded"
//       sx={{
//          'button': {
//             color: theme === 'bright' ? 'black' : 'white',
//             border: theme === 'bright' ? '1px solid white' : '1px solid white',
//          },
//          'div': {
//             color: theme === 'bright' ? 'black' : 'white',
//          }
//       }}
//       />
//    );
// };

// export default Pagination;

export default {}