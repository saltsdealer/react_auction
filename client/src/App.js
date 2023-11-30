import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Footer from "./components/Footer.jsx";
import Single from "./pages/Single.jsx";
import Post from "./pages/Post.jsx";
import Chat from "./pages/Chat.jsx";
import User from "./pages/User.jsx";
import PostUser from "./pages/PostUser.jsx";
import Order from "./pages/Order.jsx"
import Bidding from "./components/Bidding.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminNavbar from "./components/AdminNavbar.jsx";
import AdminHome from "./pages/AdminHome.jsx";
import DeleteUser from "./pages/DeleteUser.jsx";
import DeleteProduct from "./pages/DeleteProduct.jsx";
import Statistics from "./pages/Statistics.jsx";
import "./style.scss";


const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

const AdminLayout = () => {
  return (
    <>
      <AdminNavbar />
      <Outlet />
      <Footer />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/product/:id",
        element: <Single />,
      },
      {
        path: "/upload",
        element: <Post />,
      },
      {
        path: "/user/:id",
        element: <User />,
      },
      {
        path: "/change",
        element: <PostUser />,
      },
      {
        path:"/order/:id",
        element:<Order/>
      },
      {
        path:"/chat",
        element:<Chat/>
      },
    ]
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "user",
        element: <DeleteUser />,
      },
      {
        path: "home",
        element: <AdminHome />,
      },
      {
        path: "product",
        element: <DeleteProduct />,
      },
      {
        path:"chat",
        element:<Chat />
      },
      {
        path: "statistics",
        element: <Statistics />,
      },
    ],
  },
]);

function App() {
  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
