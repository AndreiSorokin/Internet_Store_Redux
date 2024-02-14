export type Category = {
   category: string,
   creationAt: string,
   id: number,
   image: string,
   name: string,
   updatedAt: string,
}

export type Data = {
   category: Category,
   creationAt: string,
   description: string,
   id: number,
   images: string[],
   price: number,
   title: string,
   updatedAt: string,
}

export type Props = {
   data?: Data | null;
};

export type InitialState = {
   products: Data[];
   userInput: string;
   loading: boolean;
   error?: string;
};