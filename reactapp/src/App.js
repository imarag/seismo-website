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
import TopicsSearch from "./pages/TopicsSearch.js"
import Article from "./pages/Article.js"
import Tool from "./pages/Tool.js"
import ToolsSearch from "./pages/ToolsSearch.js"
import Contact from './pages/Contact.js';

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
        path: "contact",
        element: <Contact />
      },
      {
        path: "topics-search",
        element: <TopicsSearch />      
      },
      {
        path: "articles-search",
        element: <ArticlesSearch />      
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
            path: ":articleName",
            element: <Article />      
          }
        ]
      },
      {
        path: "tools",
        element: <ToolsLayout />,
        children: [
          {
            path: ":toolName",
            element: <Tool />      
          }
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
