import React, { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { fetchProducts } from '../redux/slices/productSlice';
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
         background: `url(${require("../img/background.jpg")}) top / cover no-repeat`,
         minHeight: '100vh',
         display: 'flex',
         flexDirection: 'column',
         alignItems: 'center',
         justifyContent: 'center',
         }}>
         <Box
            sx={{
               bgcolor: 'primary.main',
               color: 'primary.contrastText',
               py: [6, 8],
               textAlign: 'center',
               backgroundColor: theme === "bright" ? "white" : "black",
               transition: '0.5s ease',
               background: 'transparent',
            }}
         >
            <Container maxWidth="md" sx={{ color: theme === "bright" ? "black" : "white" }}>
               <Typography variant="h2" component="h1" gutterBottom>
                  <p style={{backgroundImage: `url(${require("../img/flame.gif")})`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'transparent', backgroundClip: 'text', WebkitBackgroundClip: 'text'}}>Welcome to The Store</p>
               </Typography>
               <Typography variant="h5" component="p" paragraph sx={{color: theme === 'bright' ? 'black' : 'white'}}>
                  Discover amazing products and shop with ease.
               </Typography>
               <Button variant="contained" color="secondary" size="large" component={Link} to="/products">
                  Shop Now
               </Button>
            </Container>
         </Box>
         <Box py={[6, 8]} bgcolor="background.default" sx={{backgroundColor: 'transparent'}}>
            <Container maxWidth="lg">
               <Typography variant="h4" align="center" gutterBottom sx={{color: 'black'}}>
                  Featured Products
               </Typography>
               <Box sx={{ color: theme === 'bright' ? 'black' : 'white', width:'70vw' }}>
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
                     autoPlay={true}
                     interval={5000}
                  >
                     {featuredProducts.map((product) => (
                        <Link key={product.id} to={`/products/${product.id}`}>
                        <Card sx={{ height: [300, 350], backgroundColor: 'transparent', border: '1ps solid black', margin: ['10px', '20px'] }}>
                           <CardMedia
                              component="img"
                              height="200"
                              image={product.category.image}
                              alt={product.title}
                              sx={{ objectFit: 'contain', margin: '10px auto' }}
                           />
                           <CardContent>
                              <Typography variant="h6" component="div" color='white' sx={{ fontSize: '1.5vw', margin: { xs: '-50px auto', sm: '10px auto' } }}>
                                 {product.title}
                              </Typography>
                              <Button variant="outlined" sx={{ color: 'white', border: '1px solid black', display: { xs: 'none', sm: 'block' } }}>
                                 View
                              </Button>
                           </CardContent>
                        </Card>
                        </Link>
                     ))}
                  </Carousel>
               </Box>
            </Container>
         </Box>
      </div>
   );
};

export default LandingPage;