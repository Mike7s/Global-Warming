import { useState, useEffect } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        
        const response: AxiosResponse<T> = await axios.get(url);
        setData(response.data); 
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(axiosError.message || 'Si è verificato un errore');
      } finally {
        setLoading(false); 
      }
    };

    fetchData(); 

  }, [url]); 

  return { data, loading, error };
}

export default useFetch;
