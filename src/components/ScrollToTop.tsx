import React from "react";
import Button from '@mui/material/Button';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ScrollToTopButton = () => {
   const scrollToTop = () => {
      window.scrollTo({
         top: 0,
         behavior: "smooth"
      });
   };

   return (
      <Button 
         sx={{ 
            position: 'fixed', 
            bottom: '5vh', 
            right: '5vw',
            backgroundColor: 'white',
            borderRadius: '50%',
            width: '50px',
            height: '60px',
            '& .MuiButton-label': {
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
            },
            '& .MuiSvgIcon-root': {
               color: 'black', // Set the color of the arrow icon
            }
         }} 
         onClick={scrollToTop} 
         variant="contained" 
         color="primary"
      >
         <KeyboardArrowUpIcon />
      </Button>
   );
};

export default ScrollToTopButton;
