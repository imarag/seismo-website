import { Outlet } from "react-router-dom"
export default function ToolsLayout() {
  return (
    <div className="container mx-auto">
        <Outlet />
    </div>
  )
}
