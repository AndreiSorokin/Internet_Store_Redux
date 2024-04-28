https://fs17-frontend-project-iota.vercel.app/

This is an online store built on self made API (https://github.com/AndreiSorokin/TheStore_backend) where people can buy different category clothes.

### Deployment:
   Hoisting: Vercel

### Getting Started:
   1. To run the code u need Node.js to execute JavaScript code outside of a web browser, "react": "^18.2.0",
"react-dom": "^18.2.0"
   2. Then you need to clone the repo
   3. After cloning write npm install (or yarn install on MAC)

Usage:
   1. In order to start the project write npm start (yarn start on MAC)
   2. In order to test the application write npm test (yarn test on MAC)

A user has two options to log in: with credentials and by using Google.
Also they can use "forgot password" with the aim of reseting their passwords.

After users sign up they can see "profile", "cart" and "orders" pages in addition to "products" that can be seen by anyone visiting the web site.
Unauthorizrd users can only access the "products" page, in order to add products to the cart you need to log in first. In you don't have an account, you can sign up and you will automatically be redirected to "profile" page. Then you need to go to the "products" page, click on a product you would like to add to the cart and cllick "add" button and select amount.
Admins have access to admin page in addinion to other ones.
Admins can create products and categories (the button will appear on the products page), modify them (on an item's and admin pages respectively).
Also Admins can assign users to be admins and vice versa as well as ban/unban users.
On "profile" page users can change their information and change passwprds.

### Folders:
   1. All the types - src/misc/type.ts
   2. Logic - src/redux/slices
   3. Store - src/redux/store.ts
   4. Pages related to user - src/pages/user
   5. Pages related to products - src/pages/product
   6. Pages related to cart - src/pages/cart
   7. The page related to admin -src/pages/admin
   8. All of the components - src/components
   9. Custom hooks - src/hooks
   10. Tests - src/test

### Data Flow:
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

### Testing:
   For unit testing in this project I used React Testing Library, Jest

### This project has 8 pages:
   1. Landing page where you can find featured products from all available categories

   2. Products page to find all the products and fitler them by price, size, gender and category, also on this page you can find a button to create a new product if you are an admin

   3. Item page shows an item's information, you can choose quantity and add the item to your cart and if you are an admin you can also modify the item as well as delete it.
   Also you can create a new category in case if there is no suitable one

   4. Create product page allows admins to create new products

   5. Login page is used to log in and also gives you a link to sign up and reset a password

   6. Registration page allows you to creat an account

   7. Profile page shows a user's information and allows users to change it as well as change their passwords.

   8. Cart page show items in your cart, you can also change quantity and remove them if needed. Also it is possible to pay for orders

   9. Order page shows all created orders

   10. Admin page allows admins to manage users and modify categories


### Component structure:
![Screenshot 2024-03-06 235402](https://github.com/AndreiSorokin/fs17-Frontend-project/assets/72672144/d1da4e3b-bf58-4823-895a-1943309c6d98)

### Relationship between components:

```
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
```
