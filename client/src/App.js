import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Footer from "./components/Footer.jsx";
import Single from "./pages/Single.jsx";
import Post from "./pages/Post.jsx";
import "./style.scss"

const Layout = ()=>{
  return (
    <>
    <Navbar/>
    <Outlet/>
    <Footer/>
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
      {
        path:"/",
        element:<Home/>
      },
      {
        path:"/product/:id",
        element:<Single/>
      },
      {
        path:"/upload",
        element:<Post/>
      },
    ]
  },
  {
    path: "/register",
    element: <Register/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
]);

function App() {
  return (
  <div className="app">
    <div className="container">
      <RouterProvider router = {router}/>
    </div>
  </div>);
}



export default App;