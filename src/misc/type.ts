export type Theme = "bright" | "dark"

export type ThemeContextType = {
   theme: Theme;
   toggleTheme: () => void;
}

export type Category = {
   id: number;
   name: string;
   image: string;
}

export type CategoryState = {
   categories: Category[];
   loading: boolean;
   error: string | null;
}

export enum Size {
   Small = "Small",
   Medium = "Medium",
   Large = "Large",
}

export enum Gender {
   Male = "Male",
   Female = "Female"
}

export type NewProduct = {
   categoryId: number;
   name: string;
   price: number;
   description: string;
   category: Category;
   images: string[];
   size: Size;
   gender: Gender;
}

export type Products = NewProduct & {
   id: number;
}

export type addProduct = {
   userId: number;
   productId: number;
   quantity: number;
}

export type InitialState = {
   products: Products[];
   userInput: string;
   loading: boolean;
   error: string | null;
   selectedProduct: Products | null;
   selectedCategory: string;
   filteredProducts: Products[];
   totalCount: number;
};

export type CartItem = {
   product: Products;
   quantity: number;
}

export type CartState = {
   items: CartItem[];
}

export type Order = {
   id: string;
   orderItems: CartItem[];
}

export type Orders = {
   orders: Order[];
}

export type OrderState = {
   orders: Order[];
   loading: boolean;
   error: string | null;
}

export type User = {
   email: string;
   password: string;
   firstName: string;
   lastName: string;
   avatar: string;
   username: string;
}

export type UserData = {
   email: string;
   password: string;
   firstName: string;
   lastName: string;
   avatar: string;
   username: string;
   id: number;
}

export enum UserStatus {
   ACTIVE = "ACTIVE",
   INACTIVE = "INACTIVE",
}

export type LoggedInUser = User & {
   role: "CUSTOMER" | "ADMIN";
   id: number;
   userData: UserData;
   status: UserStatus;
   cart: CartState;
   orders: Orders;
}

export type InitialStateUser = {
   user: User | null;
   loading: boolean,
   error: string | null,
}

export type Credentials = {
   email: string;
   password: string;
}

export type InlineStyle = {
   [key: string]: string | number;
};