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

export type Product = {
   title: string;
   price: number | null;
   description: string;
   categoryId: number | null;
   images: string[];
}

export type Products = {
   id: number;
   title: string;
   price: number;
   description: string;
   category: Category;
   images: string[];
}

export type CartItem = {
   product: Products;
   quantity: number;
}

export type CartState = {
   items: CartItem[]
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
}

export type Credentials = {
   email: string;
   password: string;
}