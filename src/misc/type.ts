export type Category = {
   id: string;
   image?: string;
   name: string;
   creationAt?: number;
   updatedAt?: number;
}

export type Data = {
   category: Category,
   categoryId?: string;
   id: string,
   images: string[],
   price: number,
   title: string,
   creationAt?: number,
   updatedAt?: number
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

export type User = {
   id: string;
   email: string;
   password: string;
   name: string;
   role: "customer" | "admin";
   avatar: string;
   loading?: boolean;
}

// export type User = InitialStateUser & {
//    role: "customer" | "admin";
//    id: number;
// };

// export type UserRegister = {
//    id: string;
//    email: string;
//    password: string;
//    name: string;
//    role: string;
//    avatar: string;
//    creationAt: string;
//    undatedAt: string;
// };