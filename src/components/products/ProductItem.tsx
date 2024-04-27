import React from "react";
import { Products } from "../../misc/type";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { Box, Grid } from "@mui/material";
import { useTheme } from "../contextAPI/ThemeContext";

interface ProductItemProps {
   filteredProducts: Products[];
}
const ProductItem: React.FC<ProductItemProps> = ({filteredProducts}) => {

   return (
      <div style={{ padding: '0 10vw' }}>
         <Grid container spacing={3}>
            {filteredProducts.map(product => (
               <Grid item key={product.id} xs={12} sm={6} md={4}>
                  <div>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                     <img style={{ width: '250px', height: '300px' }} src={product.category.image} alt={`a picture of ${product.name} not available`} />
                     <div style={{marginTop: '10px', fontSize: '20px'}}>{product.name}</div>
                     <div style={{fontSize: '17px'}}>Price: ${product.price}</div>
                        <Link to={`/products/${product.id}`}>
                        <Button variant="outlined" sx={{ 
                           color: 'white', border: '2px solid #5F2E2E', 
                           fontSize: { xs: '0.8rem', sm: '1rem' }, 
                           padding: { xs: '5px 10px', sm: '8px 15px' },
                           margin: '20px 0 40px 0',
                           backgroundColor: '#5F2E2E',
                           '&:hover': {
                              borderColor: '#5F2E2E'
                           }
                        }}>
                           View
                        </Button>
                        </Link>
                  </Box>
                  </div>
               </Grid>
            ))}
         </Grid>
      </div>
   );
};

export default ProductItem;
