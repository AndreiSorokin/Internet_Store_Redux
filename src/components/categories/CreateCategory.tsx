import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { createCategory, fetchCategories } from '../../redux/slices/categorySlice';
import useSuccsessMessage from '../../hooks/SuccsessMessage';
import useErrorMessage from '../../hooks/ErrorMessage';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useTheme } from '../contextAPI/ThemeContext';

export default function CreateCategory() {
   const { theme } = useTheme();
   const dispatch = useAppDispatch();
   
   const [newCategoryName, setNewCategoryName] = useState('');
   const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null);
   const [open, setOpen] = useState(false);

   const { succsessMessage, showSuccessMessage, succsessMessageStyle } = useSuccsessMessage();
   const { errorMessage, showError, errorMessageStyle } = useErrorMessage();

   useEffect(() => {
      dispatch(fetchCategories());
   }, [dispatch])
   const categories = useAppSelector(state => state.categories.categories)

   const handleNewCategoryNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewCategoryName(event.target.value);
   };
   
   const handleNewCategoryImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
         setNewCategoryImage(event.target.files[0]);
      }
   };

   const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
   
      if (!newCategoryName || !newCategoryImage) {
         showError('Please make sure to add both a name and an image for the new category');
         return;
      }
      
      const existingCategory = categories.find(c => c.name.toLowerCase() === newCategoryName.toLowerCase());
      
      if(existingCategory) {
         showError('A category with that name already exists');
         return;
      }
      
      const formData = new FormData();
      formData.append('name', newCategoryName);
      formData.append('image', newCategoryImage);
      
      try {
         await dispatch(createCategory(formData)).unwrap();
         
         showSuccessMessage('Category created successfully');
         setNewCategoryName('');
         setNewCategoryImage(null);
         dispatch(fetchCategories());
      } catch (error) {
         showError('Something went wrong while creating the category');
      }
      };

   const handleClickOpen = () => {
      setOpen(true);
   };
   
   const handleClose = () => {
      setOpen(false);
   };

   return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
         {errorMessage && <p style={errorMessageStyle}>{errorMessage}</p>}
         {succsessMessage && <p style={succsessMessageStyle}>{succsessMessage}</p>}
         <h2>Category doesn't exist?</h2>
         <Button variant="outlined" color="primary" onClick={handleClickOpen}>
            Create New Category
         </Button>
         <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title" sx={{
               backgroundColor: theme === 'dark' ? 'black' : 'bright',
               border: theme === 'dark' ? '1px solid white' : '1px solid black',
               color: theme === 'dark' ? 'white' : 'black',
               }}>Create New Category</DialogTitle>
            <DialogContent sx={{
               backgroundColor: theme === 'dark' ? 'black' : 'bright',
               border: theme === 'dark' ? '1px solid white' : '1px solid black',
               borderRadius: '5px',
               overflow: 'hidden',
               }}>
               <form onSubmit={(e) => {
                  handleCreateCategory(e);
                  handleClose();
               }}>
               <TextField
                  label="Category Name"
                  value={newCategoryName}
                  onChange={handleNewCategoryNameChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                     sx: {
                        color: theme === 'bright' ? 'black' : 'white',
                        '@media (max-width: 768px)': {
                           maxWidth: '60%',
                        },
                     },
                  }}
                  sx={{ margin: "2vh", width: "500px", borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 'label': {
                     color: theme === 'bright' ? 'black' : 'white',
                  } }}
               />
               <input
                  type="file"
                  onChange={handleNewCategoryImageChange}
                  accept="image/*"
               />
               <DialogActions >
                  <Button onClick={handleClose} color="primary">
                     Cancel
                  </Button>
                  <Button type="submit" variant="outlined" color="primary">
                     Create Category
                  </Button>
               </DialogActions>
               </form>
            </DialogContent>
         </Dialog>
      </div>
   )
}
