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

export type Product = {
   name: string;
   price: number;
   description: string;
   category: Category;
   images: string[];
   size: Size;
   products: Product[];
}

export type Products = Product & {
   id: number;
}

// export type Product = {
//    title: string;
//    price: number | null;
//    description: string;
//    categoryId: number | null;
//    images: string[];
// }

// export type Products = {
//    id: number;
//    title: string;
//    price: number;
//    description: string;
//    category: Category;
//    images: string[];
// }

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