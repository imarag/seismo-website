import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";

import RootLayout from './layouts/RootLayout.js';
import ArticlesLayout from './layouts/ArticlesLayout.js';
import ToolsLayout from "./layouts/ToolsLayout.js"

import Home from "./pages/Home.js"
import About from "./pages/About.js"
import Donation from "./pages/Donation.js"
import ArticlesSearch from "./pages/ArticlesSearch.js"
import Article from "./pages/Article.js"
import ToolsSearch from "./pages/ToolsSearch.js"
import DistanceBetweenPoints from './pages/tools/DistanceBetweenPoints.js';
import Matplotlib from "./pages/articles/Matplotlib.js"

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "about",
        element: <About />
      },
      {
        path: "donation",
        element: <Donation />
      },
      {
        path: "articles-search",
        element: <ArticlesSearch />      
      },
      {
        path: "article/:articleName",
        element: <Article />      
      },
      {
        path: "tools-search",
        element: <ToolsSearch />      
      },
      {
        path: "articles",
        element: <ArticlesLayout />,
        children: [
          {
            path: "matplotlib",
            element: <Matplotlib />      
          },
        ]
      },
      {
        path: "tools",
        element: <ToolsLayout />,
        children: [
          {
            path: "distance-between-points",
            element: <DistanceBetweenPoints />      
          },
        ]
      }
    ]
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
