https://fs17-frontend-project-iota.vercel.app/

This is an online store built on self made API (https://github.com/AndreiSorokin/TheStore_backend) where people can buy different category clothes.

### Deployment:
   Hoisting: Vercel

#### Since the project is uploaded to a free version hosting it might take some time to load information, thus if you are logged in you may not have immediate access to some pages where user information is required

### Getting Started:
   1. To run the code u need Node.js to execute JavaScript code outside of a web browser, "react": "^18.2.0",
"react-dom": "^18.2.0"
   2. Then you need to clone the repo
   3. After cloning write npm install (or yarn install on MAC)

Usage:
   1. In order to start the project write npm start (yarn start on MAC)
   2. In order to test the application write npm test (yarn test on MAC)

### Login
   1. To login as an admin: email: admin@gmail.com password: 123456
   2. To login as a customer: email: customer@gmail.com password: 123456

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
![Screenshot 2024-04-29 011235](https://github.com/AndreiSorokin/fs17-Frontend-project/assets/72672144/8a157a87-f9d4-4a3c-ac3c-ffe4ad03aed2)
![Landing1](https://github.com/AndreiSorokin/fs17-Frontend-project/assets/72672144/b7d23c13-90c9-4bee-b5ee-78dd57fdce24)



   2. Products page to find all the products and fitler them by price, size, gender and category, also on this page you can find a button to create a new product if you are an admin
![Products](https://github.com/AndreiSorokin/fs17-Frontend-project/assets/72672144/e046b540-da35-4ed3-bbc4-852d0fdcf001)


   3. Item page shows an item's information, you can choose quantity and add the item to your cart and if you are an admin you can also modify the item as well as delete it.
   Also you can create a new category in case if there is no suitable one.
![Item](https://github.com/AndreiSorokin/fs17-Frontend-project/assets/72672144/9b1cc468-8c3c-450c-9369-085ad6986352)


   4. Create product page allows admins to create new products
![create1](https://github.com/AndreiSorokin/fs17-Frontend-project/assets/72672144/98ea9a56-75d5-44ad-a1c6-0f0e9104b16b)
![crete2](https://github.com/AndreiSorokin/fs17-Frontend-project/assets/72672144/6108ae35-089f-484e-b818-40004d367a54)



   5. Login page is used to log in and also gives you a link to sign up and reset a password
![Login](https://github.com/AndreiSorokin/fs17-Frontend-project/assets/72672144/eba313f5-034e-42c2-aaa7-bea1a08981a5)


   6. Registration page allows you to creat an account
![reg](https://github.com/AndreiSorokin/fs17-Frontend-project/assets/72672144/519b88ca-0c8b-4d2d-a3e6-74cb120a9a20)


   7. Profile page shows a user's information and allows users to change it as well as change their passwords.
![prof1](https://github.com/AndreiSorokin/fs17-Frontend-project/assets/72672144/fa283375-8bd9-4a61-8346-e606a226708b)
![prof2](https://github.com/AndreiSorokin/fs17-Frontend-project/assets/72672144/6668d954-6d57-40ba-ab3b-052e3fce8b69)



   8. Cart page show items in your cart, you can also change quantity and remove them if needed. Also it is possible to pay for orders
![cart1](https://github.com/AndreiSorokin/fs17-Frontend-project/assets/72672144/253166c5-ff66-4390-9e99-96a97ed3e252)
![cart2](https://github.com/AndreiSorokin/fs17-Frontend-project/assets/72672144/d843d88e-1e25-4d86-8830-5b8825d1606b)



   9. Order page shows all created orders
![orders](https://github.com/AndreiSorokin/fs17-Frontend-project/assets/72672144/44210339-9e6b-44ce-a1be-e62d23fed674)


   10. Admin page allows admins to manage users and modify categories
![admin](https://github.com/AndreiSorokin/fs17-Frontend-project/assets/72672144/85118c2c-74aa-4978-86bd-396a7bce08d0)


### Component structure:
![Diagram](https://github.com/AndreiSorokin/fs17-Frontend-project/assets/72672144/e4bdda27-82df-48da-b2a5-ac4049e2f80f)


### Relationship between components:

```
src/
┣ api/
┃ ┗ axiosConfig.ts
┣ components/
┃ ┣ adminComponents/
┃ ┃ ┣ CategoryList.tsx
┃ ┃ ┗ UserList.tsx
┃ ┣ categories/
┃ ┃ ┗ CreateCategory.tsx
┃ ┣ contextAPI/
┃ ┃ ┣ PriceContext.tsx
┃ ┃ ┗ ThemeContext.tsx
┃ ┣ products/
┃ ┃ ┗ ProductItem.tsx
┃ ┣ utils/
┃ ┃ ┣ CheckoutForm.tsx
┃ ┃ ┣ Filters.tsx
┃ ┃ ┣ Pagination.tsx
┃ ┃ ┣ ScrollToTop.tsx
┃ ┃ ┗ Search.tsx
┃ ┗ NavBar.tsx
┣ helpers/
┃ ┗ decode.ts
┣ hooks/
┃ ┣ ErrorMessage.tsx
┃ ┣ SuccsessMessage.tsx
┃ ┣ UseDebounce.tsx
┃ ┗ UseInput.tsx
┣ img/
┃ ┣ defaultPicture.png
┃ ┣ flame.gif
┃ ┗ landingPageImage.jpg
┣ misc/
┃ ┗ type.ts
┣ pages/
┃ ┣ admin/
┃ ┃ ┗ AdminPage.tsx
┃ ┣ cart/
┃ ┃ ┗ CartPage.tsx
┃ ┣ product/
┃ ┃ ┣ CreateProductPage.tsx
┃ ┃ ┣ ItemPage.tsx
┃ ┃ ┗ ProductsPage.tsx
┃ ┣ user/
┃ ┃ ┣ LoginPage.tsx
┃ ┃ ┣ ProfilePage.tsx
┃ ┃ ┣ RegisterPage.tsx
┃ ┃ ┣ ResetPassword.tsx
┃ ┃ ┗ SingleUserPage.tsx
┃ ┣ LandingPage.tsx
┃ ┗ Orders.tsx
┣ redux/
┃ ┣ slices/
┃ ┃ ┣ cartSlice.ts
┃ ┃ ┣ categorySlice.ts
┃ ┃ ┣ orderSlice.ts
┃ ┃ ┣ productSlice.ts
┃ ┃ ┣ uploadSlice.ts
┃ ┃ ┗ userSlice.ts
┃ ┗ store.ts
┣ test/
┃ ┣ cartSlice.test.ts
┃ ┣ categorySlice.test.ts
┃ ┣ orderSlice.test.ts
┃ ┣ productsSlice.test.ts
┃ ┣ uploadSlice.test.ts
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
