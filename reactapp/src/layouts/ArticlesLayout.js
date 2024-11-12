import { Outlet, useOutletContext } from "react-router-dom"

import "../styles/ArticlesLayout.css"

export default function ArticlesLayout() {
  const [errorMessage, setErrorMessage, infoMessage, setInfoMessage] = useOutletContext();
  return (
    <div className="article-layout container mx-auto font-light">
        <Outlet />
    </div>
  )
}
