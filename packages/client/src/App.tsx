import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ChatPage } from './pages/ChatPage';
import { SummaryPage } from './pages/SummaryPage';

const router = createBrowserRouter([
   {
      element: <Layout />,
      children: [
         { path: '/', element: <HomePage /> },
         { path: '/chat', element: <ChatPage /> },
         { path: '/summary', element: <SummaryPage /> },
      ],
   },
]);

function App() {
   return <RouterProvider router={router} />;
}

export default App;
