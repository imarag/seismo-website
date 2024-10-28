import { Outlet } from "react-router-dom"
export default function ArticlesLayout() {
  return (
    <div className="container mx-auto font-light text-lg">
        <Outlet />
    </div>
  )
}
