import { useRef, useState } from "react";
import Input from "../ui/Input";
import TextArea from "../ui/TextArea";
import Label from "../ui/Label";
import Message from "../ui/Message";
import Button from "../ui/Button";
import emailjs from "@emailjs/browser";
import Spinner from "../ui/Spinner";

export default function ContactForm() {
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]);
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

    const namePattern = /^[a-zA-Z- ]{3,80}$/;
    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const messagePattern = /^[\s\S]{5,500}$/;

    if (!namePattern.test(userName)) {
      nameError =
        "Please enter your full name (3–80 characters). Only letters, spaces, and hyphens are allowed!";
    }

    if (!emailPattern.test(userEmail)) {
      emailError =
        "The email address you entered is invalid. Please check for typos (e.g. missing @ or domain)!";
    }

    if (!messagePattern.test(userMessage)) {
      messageError = "Your message should be between 5 and 500 characters!";
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
          setSuccess(
            "You have successfully sent the message. Thank you for your feedback !!"
          );
          setTimeout(() => setSuccess(null), 5000);
          setError([]);
          form.current.reset();
        },
        (error) => {
          setLoading(false);
          setSuccess(null);
          setError([
            "We couldn’t send your message at the moment. Please try again shortly or contact us through another method!",
          ]);
          setTimeout(() => setError([]), 5000);
        }
      );
  }

  return (
    <>
      {error.length !== 0 && (
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
          <div className="flex flex-col gap-1">
            <Label htmlFor="user_name" className="w-full mx-auto">
              Name
            </Label>
            <Input
              id="user_name"
              name="user_name"
              className="w-full mx-auto"
              required
            />
            {formErrors.nameError && (
              <p className="text-error my-2 text-sm">{formErrors.nameError}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="user_email" className="w-full mx-auto">
              Email Address
            </Label>
            <Input
              id="user_email"
              name="user_email"
              className="w-full mx-auto"
              required
            />
            {formErrors.emailError && (
              <p className="text-error my-2 text-sm">{formErrors.emailError}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="message" className="w-full mx-auto">
              Feedback
            </Label>
            <TextArea
              id="message"
              name="message"
              className="w-full mx-auto"
              required
            />
            {formErrors.messageError && (
              <p className="text-error my-2 text-sm">
                {formErrors.messageError}
              </p>
            )}
          </div>
          <div className="my-4 flex flex-col items-stretch">
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
              {loading && <Spinner />}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
