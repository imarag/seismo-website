import { useRef, useState } from "react";
import {
    FormElement,
    LabelElement,
} from "@/components/ui/UIElements";
import Message from "@/components/ui/Message";
import Button from "@/components/ui/Button";
import emailjs from "@emailjs/browser";
import { contactFormElements } from "@/utils/static"

export default function ContactForm() {
    const form = useRef();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [formErrors, setFormErrors] = useState({
        nameError: null,
        emailError: null,
        messageError: null
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

        emailjs
            .sendForm("service_ak5azqh", "template_e9aalni", form.current, {
                publicKey: "ux8hQOzLCp6f8Utvu",
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
        <section>
            {error && <Message type="error" text={error} />}
            {success && <Message type="success" text={success} />}
            <form method="post" onSubmit={handleSubmitForm} ref={form}>
                <div className="flex flex-col item-stretch gap-4">
                    {
                        contactFormElements.map(obj => {
                            const element = (
                                obj.id == "user_name" ? formErrors.nameError : 
                                obj.id == "user_email" ? formErrors.emailError : 
                                formErrors.messageError
                            )
                            return (
                                <div key={obj.id} className="flex flex-col items-stretch gap-1">
                                    <LabelElement label={obj.label} id={obj.id} />
                                    <FormElement {...obj}/>
                                    {
                                        element && (
                                            <p className="text-error my-2 text-sm">
                                                {element}
                                            </p>
                                        )
                                    }
                                </div>
                            )
                        })
                    }
                    <div className="my-4 flex flex-col items-stretch">
                        <Button type="submit" disabled={loading} loading={loading}>
                            Submit
                        </Button>
                    </div>
                </div>
            </form>
        </section>
    );
}
