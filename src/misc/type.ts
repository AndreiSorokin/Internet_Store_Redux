export type Category = {
   creationAt: string;
   id: string;
   image: string;
   name: string;
   updatedAt: string;
}

export type Data = {
   category: Category,
   id: string,
   images: string[],
   price: number,
   title: string,
}

export type Product = Data & {
   creationAt: string,
   description: string,
   updatedAt: string,
}

export type Props = {
   product?: Product;
};

export type InitialState = {
   products: Data[];
   userInput: string;
   loading: boolean;
   error: boolean;
   selectedProduct?: Data[] | null;
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