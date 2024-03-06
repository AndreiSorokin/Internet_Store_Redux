https://fs17-frontend-project.fly.dev/

It may take some time to open the link above

This is the online store with Platzi Fake StoreAPI where people can buy different stuff. The target audience are young generation interested is new clothes, electronics atc. On this website people can but different categories of prudects.

After users sign up they can see "profile" and "cart" pages in addition to "products" that can be seen by anyone visiting the web site.

Getting Started:
   1. To run the code u need Node.js to execute JavaScript code outside of a web browser, "react": "^18.2.0",
"react-dom": "^18.2.0"
   2. ENV variables HERE
   3. Then you need to clone the repo: REPO
   4. After cloning write npm install (or yarn install on MAC)

Usage:
   1. In order to start the project write npm start (yarn start on MAC)
   2. In order to test the application write npm test (yarn test on MAC)

Unauthorizrd users can only access the "products" page, in order to add products to the cart you need to log in first. In you don't have an account, you can sign up and you will automatically be redirected to "profile" page. Then you need to go to the "products" page, click on a product you would like to add to the cart and cllick "add" button.
As a logged in user you can also add new products.
On your "profile" page you can change your information as well as switch role to "admin". Afer you have got "admin" you can modify and delete products. To do so you need to go to a product page and choose the needed option.

Folder Structure:
   1. All the types - src/misc/type.ts
   2. Logic - src/redux/slices
   3. Store - src/redux/store.ts
   4. Pages related to user - src/pages/user
   5. Pages related to products - src/pages/product
   6. Pages related to cart - src/pages/cart
   7. All of the components - src/components
   8. Custom hooks - src/hooks
   9. Tests - src/test

Data Flow:
   1. The ThemeContext.tsx holds two values: theme and toggleTheme. Also we have App component wrappe dwith ThemeProvider in index.tsx.
The ThemeProvider component wraps the entire Navbar component, providing the theme.
ThemeProvider component wraps its children with the ThemeContext.Provider, passing the theme and toggleTheme values as context, useTheme hook is defined to take these values from the context.
In NavBar.tsx component we use useTheme hook to consume the theme and toggleTheme values from the ThemeContext. The theme value is used conditiannoly to style theme. The toggleTheme function is attached to the IconButton component which toggles themes.
Also we call useTheme hook in pages and conditiannoly style the entire page based on the current theme.
   2. The Redux store is created using configureStore from @reduxjs/toolkit. It combines multiple reducers (productsReducer, userReducer, 
cartReducer) into a single root reducer. Each reducer manages a slice of the application state related to products, user registration/authentication, and the shopping cart.
Each time the store's state changes, a subscription is triggered. User information and cart information are extracted from the state and stored in the local storage. 
Slices define actions, reducers and asynchronous thunk functions using createAsyncThunk and createSlice from @reduxjs/toolkit. They hanlde actions.
The initial state includes information retrieved from the local storage. Async thunks are used to perform API requests.
Reducers update sleces' states based on the outcome of the async thunks (fulfilled, pending, rejected).
After that components handle functionalities dispatching async thunks.

Testing:
   For unit testing in this project I used React Testing Library, Jest

Deployment:
   Hoisting: fly.io
   Steps:
      1. Sign Up and Install Flyctl
      2. Navigate to the project directory in the terminal
      3. Initialize Fly.io configuration files by running fly launch
      4. Configure fly.toml file
      5. To deploy run fly deploy
      6. Run fly scale count to adjust the number of instances running the application
      7. To update the project make changes and deploy again

This project has 8 pages:
   1. Landing page where you can find featured products from all available categories
![Screenshot 2024-03-06 211632](https://github.com/AndreiSorokin/fs17-Frontend-project/assets/72672144/5c2c638a-4729-46e6-ad06-ebe9e86cd0f8)

   2. Products page to find all the products and fitlet them by price and category, also on this page you can find a button to create a new product if you are a logged in user
![Screenshot 2024-03-06 211918](https://github.com/AndreiSorokin/fs17-Frontend-project/assets/72672144/1d77208d-9d8f-44ce-909a-988b35cd80b7)
![Screenshot 2024-03-06 214054](https://github.com/AndreiSorokin/fs17-Frontend-project/assets/72672144/b1b9553c-8835-453d-b62c-525a3fca01b9)

   3. Item page shows an item's information, you can choose quantity and add the item to your cart and if you are an admin you can also modify the item and delete as well as delete it
![Screenshot 2024-03-06 214216](https://github.com/AndreiSorokin/fs17-Frontend-project/assets/72672144/db511679-5466-4d6b-80c8-2a3c30f9be03)

   4. Create product page allows logged in users to create new products
![Screenshot 2024-03-06 214132](https://github.com/AndreiSorokin/fs17-Frontend-project/assets/72672144/5d3a26b3-e5c4-472b-a539-f98c1ce36f24)

   5. Login page is used to log in and also gives you a link to sign up
![Screenshot 2024-03-06 214353](https://github.com/AndreiSorokin/fs17-Frontend-project/assets/72672144/ab5b1fa8-57fb-414d-b092-34bddbfd2cf3)

   6. Registration page allows you to creat an account
![Screenshot 2024-03-06 214412](https://github.com/AndreiSorokin/fs17-Frontend-project/assets/72672144/36d9bcb5-9d25-4b18-a3c8-fd07c417e771)

   7. Profile page shows a user's information and also you cat cwith your role to admin
![Screenshot 2024-03-06 211810](https://github.com/AndreiSorokin/fs17-Frontend-project/assets/72672144/f267bfa4-76ff-4309-8d59-7a05703b22b1)

   8. Cart page show items in your cart, you can also change quantity and remove them
![Screenshot 2024-03-06 214326](https://github.com/AndreiSorokin/fs17-Frontend-project/assets/72672144/48188414-84ac-4175-b608-78229b0d32c4)

Component structure:
![Screenshot 2024-03-06 235402](https://github.com/AndreiSorokin/fs17-Frontend-project/assets/72672144/d1da4e3b-bf58-4823-895a-1943309c6d98)

Relationship between components:

src/
┣ components/
┃ ┣ contextAPI/
┃ ┃ ┗ ThemeContext.tsx
┃ ┣ products/
┃ ┃ ┗ ProductItem.tsx
┃ ┣ utils/
┃ ┃ ┣ Filters.tsx
┃ ┃ ┣ Pagination.tsx
┃ ┃ ┗ Search.tsx
┃ ┣ NavBar.tsx
┃ ┗ ScrollToTop.tsx
┣ hooks/
┃ ┣ ErrorMessage.tsx
┃ ┣ SuccsessMessage.tsx
┃ ┗ UseInput.tsx
┣ misc/
┃ ┗ type.ts
┣ pages/
┃ ┣ cart/
┃ ┃ ┗ CartPage.tsx
┃ ┣ product/
┃ ┃ ┣ CreateProductPage.tsx
┃ ┃ ┣ ItemPage.tsx
┃ ┃ ┗ ProductsPage.tsx
┃ ┣ user/
┃ ┃ ┣ LoginPage.tsx
┃ ┃ ┣ ProfilePage.tsx
┃ ┃ ┗ RegisterPage.tsx
┃ ┗ LandingPage.tsx
┣ redux/
┃ ┣ slices/
┃ ┃ ┣ cartSlice.ts
┃ ┃ ┣ productSlice.ts
┃ ┃ ┗ userSlice.ts
┃ ┗ store.ts
┣ test/
┃ ┣ cartSlice.test.ts
┃ ┣ productsSlice.test.ts
┃ ┗ userSlice.test.ts
┣ App.css
┣ App.tsx
┣ index.css
┣ index.tsx
┣ logo.svg
┣ react-app-env.d.ts
┣ reportWebVitals.ts
┗ setupTests.ts