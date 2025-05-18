
import React from 'react';
import { Button } from '@/components/ui/button';

const SignInMessage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <p className="mb-6">You need to be signed in to complete your purchase.</p>
        <Button asChild className="bg-shop-primary hover:bg-shop-primary/90">
          <a href="/login?redirect=checkout">Sign In</a>
        </Button>
      </div>
    </div>
  );
};

export default SignInMessage;
