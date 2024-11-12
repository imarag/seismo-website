import { useState } from "react"

export default function ContactForm() {
    const [contactInfo, setContactInfo] = useState({
      "name": "",
      "email": "",
      "message": ""
    })

    const [error, setError] = useState({
      name: null, 
      email: null, 
      message: null
    })
  
    return (
      <div>
        <form>
          <div className="my-3">
            <label htmlFor="name" className="form-label text-secondary mb-2">Name</label>
            <input type="text" id="name" className="form-control" value={contactInfo.name} onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}/>
            { error["name"] && <p className="text-red-700 text-start">{ error["name"] }</p> }
          </div>
          <div className="my-3">
            <label htmlFor="email" className="form-label text-secondary mb-2">Email Address</label>
            <input type="email" id="email" className="form-control" value={contactInfo.email} onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}/>
            { error["email"] && <p className="text-red-700 text-start">{ error["email"] }</p> }
          </div>
          <div className="my-3">
            <label htmlFor="message" className="form-label text-secondary mb-2">Message</label>
            <textarea type="text" rows="7" id="message" className="form-control" value={contactInfo.message} onChange={(e) => setContactInfo({...contactInfo, message: e.target.value})}></textarea>
            { error["message"] && <p className="text-red-700 text-start">{ error["message"] }</p> }
          </div>
          <div className="text-center">
            <button className="btn btn-success btn-">Submit</button>
          </div>
        </form>
      </div>
    )
  }