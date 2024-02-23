export type Category = {
   id: number;
   name: string;
   image: string;
}

export type Products = {
   id: number;
   title: string;
   price: number;
   description: string;
   category: Category;
   images: string[];
}

export type SingleProduct = {
   id: number;
   title: string;
   price: number;
   description: string;
   category: Category;
   images: string[];
}

export type Product = {
   title: string;
   price: number | null;
   description: string;
   categoryId: number | null;
   images: string[];
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

export type InitialStateUser = {
   users: User[];
   loading?: boolean;
   error: string | null;
   userInput: string;
   isAuthenticated: User | null;
}