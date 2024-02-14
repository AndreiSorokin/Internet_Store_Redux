import { useState, useEffect } from "react"
import axios, { AxiosResponse, AxiosError } from "axios"

export function useFetch<T>(url: string) {
   const [data, setData] = useState<T[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);



   useEffect(() => {
      axios
         .get(url)
         .then((res: AxiosResponse<T[]>) => {
            setData(res.data as T[])
            setLoading(false)
         })
         .catch((err: AxiosError) => {
            setError(err.message)
            setLoading(false)
         })
   }, [])
   return { data, loading, error }
}