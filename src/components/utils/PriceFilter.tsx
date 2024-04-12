// import { Box, Button, Dialog } from '@mui/material'
// import React from 'react'

// const PriceFilter = () => {

//    return (
//       <div>
//       <Dialog open={dialog} onClose={() => setDialog(false)}>
//   <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ borderRadius: '5px', backgroundColor: theme === "bright" ? "white" : "black", border: theme === "bright" ? "1px solid black" : "1px solid white", '@media (max-width: 900px)': { width: '45vw', height: '50vh' } }}>
//     <Button onClick={() => setDialog(false)} style={{ display: 'block', transform: 'translate(14vw, 2vh)', color: theme === 'bright' ? 'black' : 'white' }}><CloseIcon /></Button>
//     <div style={{ height: '40vh', width:'35vw', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
//       <Box sx={{ margin: '10px' }}>
//         <input
//           type="number"
//           value={minPrice || ''}
//           onChange={(e) => setMinPrice(e.target.value ? parseInt(e.target.value) : undefined)}
//           placeholder="Min Price"
//           style={{ padding: '10px', marginRight: '5px' }}
//         />
//         {/* Max Price Input */}
//         <input
//           type="number"
//           value={maxPrice || ''}
//           onChange={(e) => setMaxPrice(e.target.value ? parseInt(e.target.value) : undefined)}
//           placeholder="Max Price"
//           style={{ padding: '10px' }}
//         />
//       </Box>
//     </div>
//   </Box>
// </Dialog>
//       </div>
//    )
// }

// export default PriceFilter

export default {}