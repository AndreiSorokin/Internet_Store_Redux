import { useState } from 'react';
import { InlineStyle } from '../misc/type';

const useSuccsessMessage = () => {
   const [succsessMessage, setSuccsessMessage] = useState<string | null>(null);

   const showSuccessMessage = (message: string) => {
   setSuccsessMessage(message);
   setTimeout(() => {
      setSuccsessMessage(null);
   }, 5000);
};


   const succsessMessageStyle: InlineStyle = {
      width: '30vw',
      fontSize: '13px',
      color: 'rgb(10, 214, 10)',
      fontWeight: 'bold',
      border: '2px solid rgb(23, 233, 23)',
      borderRadius: '5px',
      margin: '15px auto',
      padding: '5px',
      textAlign: 'center',
      lineHeight: '1.5',
      marginBottom: '15px'
};

   return {
      succsessMessage,
      showSuccessMessage,
      succsessMessageStyle,
   };
};

export default useSuccsessMessage;
