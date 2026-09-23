import { useEffect, useState } from 'react';
import './App.css';

function App() {
   const [message, setMessage] = useState('');
   useEffect(() => {
      fetch('/api/message')
         .then((response) => response.json())
         .then((data) => setMessage(data.message))
         .catch((error) => console.error('Error fetching message:', error));
   }, []);

   return <p className="text-lg font-bold p-5">{message}</p>;
}

export default App;
