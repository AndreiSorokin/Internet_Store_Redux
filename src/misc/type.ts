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

export type NewProduct = {
   name: string;
   price: number;
   description: string;
   category: Category;
   images: string[];
   size: Size;
}

export type Products = NewProduct & {
   id: number;
}

export type InitialState = {
   products: Products[];
   userInput: string;
   loading: boolean;
   error: string | null;
   selectedProduct: Products | null;
   selectedCategory: string;
   priceFilter: string;
   filteredProducts: Products[];
};

export type CartItem = {
   product: Products;
   quantity: number;
}

export type CartState = {
   items: CartItem[]
}

export type Order = {
   id: number;
   items: CartItem[];
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
   name: string;
   avatar: string;
}

export type LoggedInUser = User & {
   role: "customer" | "admin";
   id: number;
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