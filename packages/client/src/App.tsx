import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import './App.css';

function App() {
   const [message, setMessage] = useState('');
   useEffect(() => {
      fetch('/api/message')
         .then((response) => response.json())
         .then((data) => setMessage(data.message))
         .catch((error) => console.error('Error fetching message:', error));
   }, []);

   return (
      <>
         <div className="flex min-h-svh flex-col items-center justify-center py-10">
            <p className="text-lg font-bold">{message}</p>
            <Button className="placeholder-sky-500">Click me</Button>
         </div>
      </>
   );
}

export default App;
