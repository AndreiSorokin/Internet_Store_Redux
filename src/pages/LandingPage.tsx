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
import { fetchAllProducts, fetchProducts } from '../redux/slices/productSlice';
import { useTheme } from '../components/contextAPI/ThemeContext';

const LandingPage = () => {
   const { theme } = useTheme()
   
   const dispatch = useAppDispatch();
   const productList = useAppSelector(state => state.products.products);

   useEffect(() => {
      dispatch(fetchAllProducts());
   }, [dispatch]);

   const getOneProductPerCategory = () => {
      if (!Array.isArray(productList)) {
         return [];
      }

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
         background: `url(${require("../img/landingPageImage.jpg")}) top / cover no-repeat`,
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
               <Typography variant="h5" component="p" paragraph sx={{color: 'black'}}>
                  Discover amazing products and shop with ease.
               </Typography>
               <Button variant="contained" size="large" sx={{backgroundColor: '#5F2E2E', '&:hover': { backgroundColor: '#5F2E2E' }}} component={Link} to="/products">
                  Shop Now
               </Button>
            </Container>
         </Box>
         <Box py={[6, 8]} bgcolor="background.default" sx={{backgroundColor: 'transparent'}}>
            <Container maxWidth="lg">
               <Typography variant="h4" align="center" gutterBottom sx={{color: 'white'}}>
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
                        <div>
                           <Link key={product.id} to={`/products/${product.id}`}>
                        <Card sx={{ height: [300, 350], backgroundColor: 'transparent', background: 'linear-gradient(to bottom, #80594D 0%, rgba(231, 82, 33, 0.3) 30%, rgba(231, 82, 33, 0.1) 60%, rgba(180, 172, 172, 0.5) 100%)', margin: ['10px', '20px'] }}>
                           <CardMedia
                              component="img"
                              height="200"
                              image={product.category.image}
                              alt={product.title}
                              sx={{ objectFit: 'contain', margin: '10px auto' }}
                           />
                           <CardContent>
                              <Typography variant="h6" component="div" color='white' sx={{ 
                                 fontSize: {xs: '2.5vw', sm: '1.5vw'}, 
                                 margin: { xs: '-50px auto', sm: '10px auto' },
                                 whiteSpace: 'nowrap',
                                 overflow: 'hidden',
                                 textOverflow: 'ellipsis',
                                 textDecoration: 'underline'
                              }}>
                                 {product.name}
                              </Typography>
                              <Button variant="outlined" sx={{ 
                                 color: 'white', border: '1px solid black', 
                                 fontSize: { xs: '0.8rem', sm: '1rem' }, 
                                 padding: { xs: '5px 10px', sm: '8px 15px' },
                                 marginTop: { xs: '55px', sm: '0' },
                                 backgroundColor: '#5F2E2E',
                                 '&:hover': {
                                    borderColor: '#5F2E2E'
                                 }
                              }}>
                                 View
                              </Button>
                           </CardContent>
                        </Card>
                        </Link>
                        </div>
                     ))}
                  </Carousel>
               </Box>
            </Container>
         </Box>
      </div>
   );
};

export default LandingPage;