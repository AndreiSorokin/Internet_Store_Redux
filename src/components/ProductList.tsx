// import { useState } from 'react';
// import {
//   BrowserRouter as Router,
//   Routes, Route, Link
// } from 'react-router-dom'

// import { useFetch } from '../hooks/useFetch'
// import { Data } from '../misc/type'

// import Pagination from '@mui/material/Pagination';
// import { experimentalStyled as styled } from '@mui/material/styles';
// import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper';
// import Grid from '@mui/material/Unstable_Grid2';

// export default function ProductList() {
//   const { data, loading, error } = useFetch<Data>('https://api.escuelajs.co/api/v1/products')

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   if(loading) {
//     return <div>Loading...</div>
//   }
//   if(error) {
//     return <div>Error: {error}</div>
//   }

//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = currentPage * itemsPerPage;

//   const currentPageData = data.slice(startIndex, endIndex);

//   const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
//     setCurrentPage(page);
//   };
  

//   return (
//     <Box display="flex" flexDirection="column" alignItems="center">
//       <Pagination 
//         count={Math.ceil(data.length / itemsPerPage)} 
//         variant="outlined" 
//         shape="rounded" 
//         page={currentPage}
//         onChange={handlePageChange}
//       />
//         {currentPageData.map(product => (
//           <div key={product.id}>
//             <div>{product.title}</div>
//             <div>
//               <img style={{width: '150px', height: '150px'}} src={product.category.image} alt={`a picture of ${product.title}`} />
//               <Link to={`/products/${product.id}`}>
//                 <button>
//                   View
//                 </button>
//               </Link>
//             </div>
//           </div>
//         ))}
//     </Box>
//   )
// }

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import { AppState, useAppDispatch } from "../redux/store";
import { useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'


import Pagination from '@mui/material/Pagination';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { Data } from "../misc/type";

export default function ProductList() {
  const dispatch = useAppDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  // Fetch products from Redux store
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Select products from Redux store
  const productList = useSelector((state: AppState) => state.products.products);
  console.log(productList, "list");

  const currentPageData = productList.slice(startIndex, endIndex);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Pagination 
        count={Math.ceil(productList.length / itemsPerPage)} 
        variant="outlined" 
        shape="rounded" 
        page={currentPage}
        onChange={handlePageChange}
      />
      {currentPageData.map(product => (
        <div key={product.id}>
          <div>{product.title}</div>
          <div>
            <img style={{width: '150px', height: '150px'}} src={product.category.image} alt={`a picture of ${product.title}`} />
            <Link to={`/products/${product.id}`}>
              <button>
                View
              </button>
            </Link>
          </div>
        </div>
      ))}
    </Box>
  )
}
