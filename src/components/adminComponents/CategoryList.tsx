import React, { useEffect, useState } from 'react';
import { AppState, useAppDispatch, useAppSelector } from '../../redux/store';
import { Button, TextField } from '@mui/material';
import { fetchCategories, deleteCategory, updateCategory } from '../../redux/slices/categorySlice';
import { useTheme } from '../contextAPI/ThemeContext';

export default function CategoryList() {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state: AppState) => state.categories.categories);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const handleDelete = (id: string) => {
    const answer = window.confirm('Do you want to delete this category?');
    if(answer) {
      dispatch(deleteCategory(id))
      .unwrap()
      .then(() => {
        dispatch(fetchCategories());
      })
    }
  };

  const startEdit = (id: string, name: string) => {
    setEditId(id);
    setEditName(name);
  };

  const handleUpdate = (id: string) => {
  const currentCategory = categories.find(category => category.id.toString() === id);
  if (!currentCategory) {
    console.error('Category not found');
    return;
  }

  dispatch(updateCategory({
    id,
    category: {
      id: Number(editId),
      name: editName,
      image: currentCategory.image
    }
  }))
    .unwrap()
    .then(() => {
      setEditId(null);
      dispatch(fetchCategories());
    });
};

  return (
    <div>
      {categories.map(category => (
        <div key={category.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <img src={category.image} alt={category.name} style={{ marginRight: '20px', width: '150px', height: '150px' }} />
          <div style={{ flex: 1 }}>
          {editId !== null && editId === category.id.toString() ? (
            <>
              <TextField
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                size="small"
                style={{ marginBottom: '10px' }}
              />
              <Button variant="outlined" onClick={() => handleUpdate(category.id.toString())} style={{ marginRight: '10px' }}>
                Save
              </Button>
            </>
          ) : (
            <>
              <div style={{ marginBottom: '10px', color: theme === "bright" ? "black" : "white" }}>{category.name}</div>
              <Button variant="outlined" onClick={() => startEdit(category.id.toString(), category.name)} style={{ marginRight: '10px' }}>
                Edit
              </Button>
            </>
          )}
            <Button variant="outlined" color="error" onClick={() => handleDelete(category.id.toString())} style={{ marginRight: '10px' }}>
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}