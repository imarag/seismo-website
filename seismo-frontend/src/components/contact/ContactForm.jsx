import { useRef, useState } from "react";
import Input from "../ui/Input";
import TextArea from "../ui/TextArea";
import Label from "../ui/Label";
import Message from "../ui/Message";
import Button from "../ui/Button";
import emailjs from "@emailjs/browser";
import Spinner from "../ui/Spinner";
import { contactFormElements } from "../../assets/data/static";

export default function ContactForm() {
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formErrors, setFormErrors] = useState({
    nameError: null,
    emailError: null,
    messageError: null,
  });

  function handleSubmitForm(e) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(form.current);
    const userEmail = formData.get("user_email");
    const userName = formData.get("user_name");
    const userMessage = formData.get("message");

    let emailError = null;
    let messageError = null;
    let nameError = null;

    const namePattern = /^[a-zA-z- ]{3,20}$/;
    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const messagePattern = /^[a-zA-z0-9-_ ]{10,500}$/;

    if (!namePattern.test(userName)) {
      nameError =
        "Name must be 3-20 characters long and contain only letters and hyphens.";
    }

    if (!emailPattern.test(userEmail)) {
      emailError = "Please enter a valid email address.";
    }

    if (!messagePattern.test(userMessage)) {
      messageError =
        "Message must be 10-500 characters long and can only contain letters, numbers, hyphens, and underscores.";
    }

    if (emailError || messageError || nameError) {
      setFormErrors({ emailError, nameError, messageError });
      setLoading(false);
      return;
    }

    setFormErrors({ emailError: null, nameError: null, messageError: null });

    const publicKey = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY;
    const serviceId = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID;

    emailjs
      .sendForm(serviceId, templateId, form.current, {
        publicKey: publicKey,
      })
      .then(
        () => {
          setLoading(false);
          setSuccess("You have successfully sent the message. Thank you!");
          setTimeout(() => setSuccess(null), 5000);
          setError([]);
          form.current.reset();
        },
        (error) => {
          setLoading(false);
          setSuccess(null);
          setError(error.text);
          setTimeout(() => setError([]), 5000);
        }
      );
  }

  return (
    <>
      {error && (
        <Message
          type="error"
          text={error}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}
      {success && (
        <Message
          type="success"
          text={success}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}
      <form method="post" onSubmit={handleSubmitForm} ref={form}>
        <div className="flex flex-col item-center gap-4">
          {contactFormElements.map((obj) => {
            const element =
              obj.id == "user_name"
                ? formErrors.nameError
                : obj.id == "user_email"
                ? formErrors.emailError
                : formErrors.messageError;
            return (
              <div key={obj.id} className="flex flex-col gap-1">
                <Label id={obj.id} className="w-full mx-auto">
                  {obj.label}
                </Label>
                {obj.type === "textarea" ? (
                  <TextArea {...obj} className="w-full mx-auto" />
                ) : (
                  <Input {...obj} className="w-full mx-auto" />
                )}
                {element && (
                  <p className="text-error my-2 text-sm">{element}</p>
                )}
              </div>
            );
          })}
          <div className="my-4 flex flex-col items-stretch">
            <Button type="submit" disabled={loading}>
              Submit
              {loading && <Spinner />}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
