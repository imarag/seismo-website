import { Outlet, useOutletContext } from "react-router-dom"

import "../styles/ArticlesLayout.css"

export default function ArticlesLayout() {

  return (
    <div className="container mx-auto">
        <Outlet />
    </div>
  )
}
