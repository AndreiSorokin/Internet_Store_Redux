import React, { useEffect } from 'react';
import { useAppDispatch } from '../../redux/store';
import { fetchAllUsers } from '../../redux/slices/userSlice';
import { useTheme } from '../../components/contextAPI/ThemeContext';
import UserList from '../../components/adminComponents/UserList';
import { Box, Button, Grid, Modal, Typography } from '@mui/material';
import CategoryList from '../../components/adminComponents/CategoryList';

const AdminPage = () => {
    const { theme } = useTheme();
    const dispatch = useAppDispatch();

    const [open, setOpen] = React.useState(false);
    const [openCategoryList, setOpenCategoryList] = React.useState(false);

    const handleOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    useEffect(() => {
      dispatch(fetchAllUsers());
    }, [dispatch]);

    const handleOpenCategoryList = () => {
      setOpenCategoryList(true);
    };
    const handleCloseCategoryList = () => {
      setOpenCategoryList(false);
    };
  
  return (
    <Grid 
  container
  style={{
    background: theme === 'bright' ? 'linear-gradient(to bottom, #B8B8B8  0%, #9C9C9C 25%, #7B7B7B 50%, #353535 100%)' : 'linear-gradient(to bottom, #444444 18%, #414141 38%, #3C3C3C 56%, #212121 97%)',
    color: theme === "bright" ? "black" : "#E9E9E9",
    minHeight: '100vh',
    transition: '0.5s ease',
    paddingTop: '20vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
    <h2 style={{fontSize: '36px'}}>Admin page</h2>
  <Grid item xs={12} style={{ textAlign: 'center' }}>
    <Typography id="user-list-modal-title" variant="h6" component="h2" style={{ marginBottom: '20px' }}>
      Manage users
    </Typography>
    <Button variant="outlined" onClick={handleOpen}
    sx={{ 
      color: 'white', border: '2px solid #5F2E2E', 
      fontSize: { xs: '0.8rem', sm: '1rem' }, 
      padding: { xs: '5px 10px', sm: '8px 15px' },
      margin: '20px 0 40px 0',
      backgroundColor: '#5F2E2E',
      '&:hover': {
         borderColor: '#5F2E2E'
      }
   }}>Show list of users</Button>
  </Grid>
  <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="user-list-modal-title"
    aria-describedby="user-list-modal-description"
  >
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 450,
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: 24,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: theme === 'bright' ? 'black' : '#E9E9E9',
        border: theme === 'bright' ? '1px solid black' : '1px solid #E9E9E9',
        backgroundColor: theme === "bright" ? "#9C9C9C" : "#353535",
        '@media (max-width: 768px)': {
          maxWidth: '75%',
        }
      }}
    >
      <Typography id="user-list-modal-title" variant="h6" component="h2" style={{ marginBottom: '20px', color: theme === "bright" ? "black" : "white" }}>
        List of users
      </Typography>
      <UserList />
      <Button onClick={handleClose} 
      sx={{color: theme === 'bright' ? 'black' : '#E9E9E9', position: 'absolute', top: '5vh', right: '2vw',
      '&:hover': {
         backgroundColor: 'rgba(95, 46, 46, 0.1)',
         borderColor: theme === 'bright' ? 'black' : '#E9E9E9',
      }
   }}
      >Close</Button>
    </Box>
  </Modal>
  <Grid item xs={12} style={{ textAlign: 'center' }}>
    <Typography id="category-list-modal-title" variant="h6" component="h2" style={{ marginBottom: '20px' }}>
      Modify categories
    </Typography>
    <Button variant="outlined" onClick={handleOpenCategoryList}
    sx={{ 
      color: 'white', border: '2px solid #5F2E2E', 
      fontSize: { xs: '0.8rem', sm: '1rem' }, 
      padding: { xs: '5px 10px', sm: '8px 15px' },
      margin: '20px 0 40px 0',
      backgroundColor: '#5F2E2E',
      '&:hover': {
         borderColor: '#5F2E2E'
      }
   }}>Show Category List</Button>
  </Grid>
  <Modal
    open={openCategoryList}
    onClose={handleCloseCategoryList}
    aria-labelledby="category-list-modal-title"
    aria-describedby="category-list-modal-description"
  >
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 450,
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: 24,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: theme === 'bright' ? 'black' : '#E9E9E9',
        border: theme === 'bright' ? '1px solid black' : '1px solid #E9E9E9',
        backgroundColor: theme === "bright" ? "#9C9C9C" : "#353535",
        '@media (max-width: 768px)': {
          maxWidth: '75%',
        }
      }}
    >
      <Typography id="category-list-modal-title" variant="h6" component="h2" style={{ marginBottom: '20px', color: theme === "bright" ? "black" : "white" }}>
        List of categories
      </Typography>
      <CategoryList />
      <Button onClick={handleCloseCategoryList}
      sx={{color: theme === 'bright' ? 'black' : '#E9E9E9', position: 'absolute', top: '5vh', right: '2vw',
      '&:hover': {
         backgroundColor: 'rgba(95, 46, 46, 0.1)',
         borderColor: theme === 'bright' ? 'black' : '#E9E9E9',
      }
   }}
      >Close</Button>
    </Box>
  </Modal>
</Grid>
  );
}

export default AdminPage
