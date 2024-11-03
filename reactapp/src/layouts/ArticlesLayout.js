import { Outlet } from "react-router-dom"

import "../styles/ArticlesLayout.css"

export default function ArticlesLayout() {
  return (
    <div className="article-layout container mx-auto font-light">
        <Outlet />
    </div>
  )
}
