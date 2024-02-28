import { useState } from 'react';
import { InlineStyle } from '../misc/type';

const useErrorMessage = () => {
   const [errorMessage, setErrorMessage] = useState<string | null>(null);

   const showError = (message: string) => {
   setErrorMessage(message);
   setTimeout(() => {
      setErrorMessage(null);
   }, 5000);
};

   const errorMessageStyle: InlineStyle = {
      width: '30vw',
      fontSize: '13px',
      color: 'rgb(214, 10, 10)',
      fontWeight: 'bold',
      border: '2px solid rgb(233, 23, 23)',
      borderRadius: '5px',
      margin: 'auto',
      padding: '5px',
      textAlign: 'center',
      lineHeight: '1.5',
      marginBottom: '15px',
};

   return {
      errorMessage,
      showError,
      errorMessageStyle, 
   };
};

export default useErrorMessage;
