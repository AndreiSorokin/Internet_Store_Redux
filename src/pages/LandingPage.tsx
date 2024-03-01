import React, { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { fetchProducts } from '../redux/slices/productSlice';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useTheme } from '../components/contextAPI/ThemeContext';

const LandingPage = () => {
   const { theme } = useTheme()
   
   const dispatch = useAppDispatch();
   const productList = useAppSelector(state => state.products.products);

   useEffect(() => {
      dispatch(fetchProducts());
   }, [dispatch]);

   const getOneProductPerCategory = () => {
      const productMap = new Map();
      productList.forEach(product => {
         if (!productMap.has(product.category.id)) {
            productMap.set(product.category.id, product);
         }
      });
      return Array.from(productMap.values());
   };

   const featuredProducts = getOneProductPerCategory();

   return (
      <div style={{
         backgroundColor: theme === "bright" ? "white" : "black",
         color: theme === "bright" ? "black" : "white",
         height: '100%',
         paddingTop: '20vh'
      }}>
         <Box
            sx={{
               bgcolor: 'primary.main',
               color: 'primary.contrastText',
               py: 8,
               textAlign: 'center',
               backgroundColor: theme === "bright" ? "white" : "black"
            }}
         >
            <Container maxWidth="md" sx={{ color: theme === "bright" ? "black" : "white" }}>
               <Typography variant="h2" component="h1" gutterBottom>
                  Welcome to The Store
               </Typography>
               <Typography variant="h5" component="p" paragraph>
                  Discover amazing products and shop with ease.
               </Typography>
               <Button variant="contained" color="secondary" size="large" component={Link} to="/products">
                  Shop Now
               </Button>
            </Container>
         </Box>
         <Box py={8} bgcolor="background.default" sx={{ backgroundColor: theme === "bright" ? "white" : "black" }}>
            <Container maxWidth="lg">
               <Typography variant="h4" align="center" gutterBottom>
                  Featured Products
               </Typography>
               <Box sx={{ color: theme === 'bright' ? 'black' : 'white' }}>
                  <Carousel
                     showArrows
                     showIndicators={false}
                     showThumbs={false}
                     infiniteLoop
                     centerMode
                     centerSlidePercentage={33.3}
                     emulateTouch
                     swipeable
                     selectedItem={1}
                     autoPlay
                     interval={5000}
                  >
                     {featuredProducts.map((product) => (
                        <Card key={product.id} sx={{height: '350px', margin:'20px'}}>
                           <CardMedia
                              component="img"
                              height="200"
                              image={product.category.image}
                              alt={product.title}
                              sx={{ objectFit: 'contain', margin:'10px auto'}}
                           />
                           <CardContent>
                              <Typography variant="h6" component="div">
                                 {product.title}
                              </Typography>
                              <Link to={`/products/${product.id}`}>
                                 <Button variant="outlined">
                                    View
                                 </Button>
                              </Link>
                           </CardContent>
                        </Card>
                     ))}
                  </Carousel>
               </Box>
            </Container>
         </Box>
      </div>
   );
};

export default LandingPage;
