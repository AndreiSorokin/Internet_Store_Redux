import React from "react";
import { TextField } from "@mui/material";

interface SearchProps {
   searchQuery: string;
   setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
   theme: string;
}

const Search: React.FC<SearchProps> = ({ searchQuery, setSearchQuery, theme }) => {

   return (
      <TextField
         variant="outlined"
         value={searchQuery}
         placeholder="Search Products"
         onChange={(e) => setSearchQuery(e.target.value)}
         InputProps={{
            style: {
               color: theme === 'bright' ? 'black' : '#E9E9E9',
            },
         }}
         sx={{ margin: "15vh", width: "80%", borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 'label': {
            '&:hover': {
               color: '#E9E9E9'
            }
         },
         '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
               borderColor: theme === 'bright' ? 'black' : '#E9E9E9',
            },
         },
      }}
      />
   );
};

export default Search;
