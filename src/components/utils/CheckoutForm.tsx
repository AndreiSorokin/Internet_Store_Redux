import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button } from '@mui/material';


interface CheckoutFormProps {
  totalPrice: number;
  onSuccess: (paymentMethodId: string) => void;
  onError: (errorMessage: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ totalPrice, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
    
  if (!stripe || !elements) {
      return;
  }
  
  const cardElement = elements.getElement(CardElement);
  
  if (!cardElement) {
    console.log('CardElement not found');
    return;
  }
    
  const { error, paymentMethod } = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
  });

  if (error) {
    console.error(error);
    onError(error.message || 'Error');
  } else {
    onSuccess(paymentMethod.id);
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <Button type="submit" disabled={!stripe}>
        Pay ${totalPrice.toFixed(2)}
      </Button>
    </form>
  );
};

export default CheckoutForm;