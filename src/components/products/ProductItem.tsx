import React from "react";
import { Products } from "../../misc/type";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { Grid } from "@mui/material";
import { useAppSelector } from "../../redux/store";
import { useTheme } from "../contextAPI/ThemeContext";

interface ProductItemProps {
   filteredProducts: Products[];
}
const ProductItem: React.FC<ProductItemProps> = ({filteredProducts}) => {
   const { theme } = useTheme()

   return (
      <div style={{ padding: '0 10vw' }}>
         <Grid container spacing={3}>
            {filteredProducts.map(product => (
               <Grid item key={product.id} xs={12} sm={6} md={4}>
                  <div>
                  <div>{product.name}</div>
                  <div>Price: ${product.price}</div>
                  <div>
                  <img style={{ width: '100%', height: 'auto' }} src={product.category.image} alt={`a picture of ${product.name} not available`} />
                     <Link to={`/products/${product.id}`}>
                        <Button variant="outlined" sx={{color:"red" ,background: theme === 'bright' ? 'linear-gradient(135deg, #F7C585, #F76B19)' : 'linear-gradient(135deg, #431C01, #72571D)'}}>
                           View
                        </Button>
                     </Link>
                  </div>
                  </div>
               </Grid>
            ))}
         </Grid>
      </div>
   );
};

export default ProductItem;
