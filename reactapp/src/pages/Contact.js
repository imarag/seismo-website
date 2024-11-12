import ContactForm from "../components/ContactForm"
import OldSeismogram from "../img/seismometer2.jpg"
import SocialMedia from "../components/SocialMedia"

export default function Contact() {
  return (
    <div className="container-lg my-6">
      <div className="row justify-content-center align-items-center g-5">
        <div className="col-12 col-md-5 col-lg-4">
          <h1 className="display-5 text-center fw-semibold mb-3">Contact Us</h1>
          <h2 className="fs-4 text-center fw-light">Connect with us and share your suggestions and improvements</h2>
          <SocialMedia />
          <ContactForm />
        </div>
        <div className="col-12 col-md-6 col-lg-7">
          <img src={OldSeismogram} className="img-fluid" />
        </div>
      </div>
    </div>
  )
}
