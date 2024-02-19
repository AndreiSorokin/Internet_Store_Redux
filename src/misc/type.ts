export type Category = {
   id: string;
   image?: string;
   name: string;
}

export type Data = {
   category: Category,
   id: string,
   images: string[],
   price: number,
   title: string,
}

export type Product = Data & {
   description: string,
}

export type Props = {
   id?: string;
};

export type InitialState = {
   products: Data[];
   userInput: string;
   loading: boolean;
   error: boolean;
   selectedProduct?: Product | null;
   selectedCategory?: string;
   priceFilter: string;
   product?: Product[];
   filteredProducts: Data[];
};

export type UserRegister = {
   name: string;
   email: string;
   password: string;
   avatar: string;
};

export type User = UserRegister & {
   role: "customer" | "admin";
   id: number;
};