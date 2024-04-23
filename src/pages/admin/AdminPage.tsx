import React, { useEffect } from 'react';
import { AppState, useAppDispatch, useAppSelector } from '../../redux/store';
import { LoggedInUser } from '../../misc/type';
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
    backgroundColor: theme === "bright" ? "white" : "black",
    color: theme === "bright" ? "black" : "white",
    minHeight: '100vh',
    transition: '0.5s ease',
    paddingTop: '20vh',
    display: 'flex',
    flexDirection: 'column', // Set the direction of items to column
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  <Grid item xs={12} style={{ textAlign: 'center' }}> {/* Ensure content is centered and responsive */}
    <h2>Admin page</h2>
    <p>Here you can access information of all of the users and created categories</p>
  </Grid>
  <Grid item xs={12} style={{ textAlign: 'center' }}>
    <Typography id="user-list-modal-title" variant="h6" component="h2" style={{ marginBottom: '20px' }}>
      List of users
    </Typography>
    <Button variant="outlined" onClick={handleOpen} style={{ marginBottom: '20px' }}>Show list of users</Button>
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
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: theme === "bright" ? "white" : "black",
        border: theme === 'bright' ? '1px solid white' : '1px solid white',
      }}
    >
      <Typography id="user-list-modal-title" variant="h6" component="h2" style={{ marginBottom: '20px', color: theme === "bright" ? "black" : "white" }}>
        List of users
      </Typography>
      <UserList />
      <Button onClick={handleClose} style={{ marginTop: '20px', position: 'absolute', right: '20px' }}>Close</Button>
    </Box>
  </Modal>
  <Grid item xs={12} style={{ textAlign: 'center' }}>
    <Typography id="category-list-modal-title" variant="h6" component="h2" style={{ marginBottom: '20px' }}>
      List of categories
    </Typography>
    <Button variant="outlined" onClick={handleOpenCategoryList} style={{ marginBottom: '20px' }}>Show Category List</Button>
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
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: theme === "bright" ? "white" : "black",
        border: theme === 'bright' ? '1px solid white' : '1px solid white',
      }}
    >
      <Typography id="category-list-modal-title" variant="h6" component="h2" style={{ marginBottom: '20px', color: theme === "bright" ? "black" : "white" }}>
        List of categories
      </Typography>
      <CategoryList />
      <Button onClick={handleCloseCategoryList} style={{ marginTop: '20px', position: 'absolute', right: '20px' }}>Close</Button>
    </Box>
  </Modal>
</Grid>
  );
}

export default AdminPage
