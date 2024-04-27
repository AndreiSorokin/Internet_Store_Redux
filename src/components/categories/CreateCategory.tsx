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
         <Button 
            variant="outlined" sx={{ 
               color: '#E9E9E9', border: '2px solid #5F2E2E', 
               fontSize: { xs: '0.8rem', sm: '1rem' }, 
               padding: { xs: '5px 10px', sm: '8px 15px' },
               backgroundColor: '#5F2E2E',
               '&:hover': {
                     borderColor: '#5F2E2E'
               }
            }}
            onClick={handleClickOpen}
         >
            Create New Category
         </Button>
         <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title" sx={{
               backgroundColor: theme === 'bright' ? '#B8B8B8' : '#444444',
               border: theme === 'bright' ? '1px solid #B8B8B8' : '1px solid #7B7B7B',
               color: theme === 'bright' ? 'black' : '#E9E9E9',
               }}>Create New Category</DialogTitle>
            <DialogContent sx={{
               background: theme === 'bright' ? 'linear-gradient(to bottom, #B8B8B8  0%, #9C9C9C 25%, #7B7B7B 50%, #353535 100%)' : 'linear-gradient(to bottom, #444444 18%, #414141 38%, #3C3C3C 56%, #212121 97%)',
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
                        color: theme === 'bright' ? 'black' : '#E9E9E9',
                        '@media (max-width: 768px)': {
                           maxWidth: '60%',
                        },
                     },
                  }}
                  InputLabelProps={{
                     sx: {
                       color: theme === 'bright' ? 'black' : '#E9E9E9',
                       '&.Mui-focused': {
                         color: theme === 'bright' ? 'black' : '#E9E9E9',
                       },
                     },
                   }}
                  sx={{ margin: "2vh", width: "500px", borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white',
                  '& .MuiOutlinedInput-root': {
                     '&.Mui-focused fieldset': {
                         borderColor: theme === 'bright' ? 'black' : '#E9E9E9',
                     },
                   }, 'label': {
                     color: theme === 'bright' ? 'black' : '#E9E9E9',
                  } }}
               />
               <Button
                  variant="outlined"
                  component="label"
                  sx={{
                     color: theme === 'bright'? 'black' : '#E9E9E9', 
                     border: theme === 'bright'? '2px solid black' : '2px solid #E9E9E9', 
                     fontSize: { xs: '0.8rem', sm: '1rem' }, 
                     padding: { xs: '5px 10px', sm: '8px 15px' },
                     backgroundColor: 'transparent',
                     '&:hover': {
                        borderColor: theme === 'bright'? 'black' : '#E9E9E9'
                     }
                  }}
                  >
                  Upload Image
                  <input
                     type="file"
                     hidden
                     onChange={handleNewCategoryImageChange}
                     accept="image/*"
               />
               </Button>
               <DialogActions >
                  <Button onClick={handleClose} sx={{color: theme === 'bright' ? 'black' : '#E9E9E9', 
                     '&:hover': {
                        backgroundColor: 'rgba(95, 46, 46, 0.1)',
                        borderColor: theme === 'bright' ? 'black' : '#E9E9E9',
                     }
                  }}>
                     Cancel
                  </Button>
                  <Button type="submit" variant="outlined"
                     sx={{ 
                        color: 'white', border: '2px solid #5F2E2E', 
                        fontSize: { xs: '0.8rem', sm: '1rem' }, 
                        padding: { xs: '5px 10px', sm: '8px 15px' },
                        backgroundColor: '#5F2E2E',
                        '&:hover': {
                           borderColor: '#5F2E2E'
                        }
                     }}
                  >
                     Create Category
                  </Button>
               </DialogActions>
               </form>
            </DialogContent>
         </Dialog>
      </div>
   )
}
