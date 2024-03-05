import { useState } from 'react';

export default function useInput() {
   const [value, setValue] = useState<string>('');

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
   };

   const reset = () => {
      setValue('');
   };

   return {
      value,
      onChange: handleChange,
      reset,
   };
}
