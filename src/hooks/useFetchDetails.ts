import { useState, useEffect } from "react";
import axios, { AxiosResponse, AxiosError } from "axios";
import { Data } from '../misc/type';

export function useFetchDetails(id: string) {
   const [data, setData] = useState<Data | null>(null);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      axios
         .get(`https://api.escuelajs.co/api/v1/products/${id}`)
         .then((res: AxiosResponse) => {
            setData(res.data);
         })
         .catch((err: AxiosError) => {
            setError(err.message)
         });
   }, [id])

   return { data, error }
}