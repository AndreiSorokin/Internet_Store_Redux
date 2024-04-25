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
         label="Search Products"
         variant="outlined"
         value={searchQuery}
         placeholder="Search Products"
         onChange={(e) => setSearchQuery(e.target.value)}
         InputProps={{
            style: {
               color: theme === 'bright' ? 'black' : 'white',
            },
         }}
         sx={{ margin: "15vh", width: "80%", borderRadius: '5px', border: theme === 'bright' ? 'none' : '1px solid white', 'label': {
            color: theme === 'bright' ? 'black' : 'white',
            '&:hover': {
               borderColor: 'black'
            }
         } }}
      />
   );
};

export default Search;
