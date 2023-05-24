import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Buttons from "./components/Buttons";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Root from "./pages/Root";
import LoginRequired from "./pages/LoginRequired";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "/reserve", element: <Buttons /> },
    ],
  },
]);

export default function App() {
  return (
    <RouterProvider router={router}>
      <Navbar />
      <Buttons />
    </RouterProvider>
  );
}
