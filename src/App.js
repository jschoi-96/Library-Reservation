import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Buttons from "./components/Buttons";
import Navbar from "./components/Navbar";
import Usage from "./components/Usage";
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
      { path: "/usage", element: <Usage /> },
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
