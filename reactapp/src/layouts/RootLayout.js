import NavMenu from "../components/NavMenu"
import Footer from "../components/Footer"
import { Outlet } from "react-router-dom"
import { useState } from "react"
import "../index.css"

export default function RootLayout() {
  const [errorMessage, setErrorMessage] = useState(null)
  const [infoMessage, setInfoMessage] = useState(null)
  return (
    <>
        <header>
            <NavMenu />
        </header>
        <main className="fw-normal fs-5">
          {
            errorMessage && (
              <div className="alert alert-danger position-fixed start-0 end-0 top-0 text-center opacity-75" style={{zIndex: "999"}} role="alert">
                {errorMessage}
              </div>
            )
          }
          {
            infoMessage && (
              <div className="alert alert-info position-fixed start-0 end-0 top-0 text-center opacity-75" style={{zIndex: "999"}} role="alert">
                {infoMessage}
              </div>
            )
          }
            <Outlet context={{ setErrorMessage, setInfoMessage }} />
        </main>
        <footer>
            <Footer />
        </footer>
    </>
  )
}
