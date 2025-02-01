'use client';

import React, { useRef, useState } from 'react';

import { TextInputElement, EmailInputElement, TextAreaElement, LabelElement } from "@/components/UIElements"
import AlignVertical from "@/components/AlignVertical";
import Button from "@/components/Button";

import emailjs from '@emailjs/browser';

export default function ContactForm() {
    const form = useRef();
    const [loading, setLoading] = useState(false)
    const [formErrors, setFormErrors] = useState({
        "nameError": null,
        "emailError": null,
        "messageError": null
    })
    const [error, setError] = useState(null);

    function handleSubmitForm(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const name = formData.get("user_name");
        const email = formData.get("user_email");
        const message = formData.get("message");
        
        if (!name) {
            setFormErrors({...formErrors, nameError: "You must fill your name!"})
            return
        }

        if (!email) {
            setFormErrors({...formErrors, emailError: "You must fill your email!"})
            return
        }

        if (!message) {
            setFormErrors({...formErrors, messageError: "You must fill a message!"})
            return
        }

        setFormErrors({
            "nameError": null,
            "emailError": null,
            "messageError": null
        })
        setLoading(true)
        
        emailjs
        .sendForm('service_ak5azqh', 'template_e9aalni', form.current, {
            publicKey: 'ux8hQOzLCp6f8Utvu',
        })
        .then(
            () => {
                setLoading(false)
                setError(null)
            },
            (error) => {
                setError(error.text)
                setLoading(false)
                console.log('FAILED...', error.text);
            },
        );
    }

    return (
        <section className="px-10">
            {
                error && <p className="text-error my-2 text-sm">{error}</p>
            }
            <form ref={form} onSubmit={handleSubmitForm}>
                <AlignVertical align="stretch">
                    <div>
                        <LabelElement label="Name" id="user_name" />
                        <TextInputElement
                            id="user_name"
                            name="user_name"
                            placeholder="e.g Enter your name"
                            className="w-full"
                            required={true}
                        />
                        {
                            formErrors["nameError"] && (
                                <p className="text-error my-2 text-sm">{formErrors["nameError"]}</p>
                            )
                        }
                    </div>
                    <div>
                        <LabelElement label="Email" id="user_email" />
                        <EmailInputElement
                            id="user_email"
                            name="user_email"
                            placeholder="e.g Enter your email address"
                            className="w-full"
                            required={true}
                        />
                        {
                            formErrors["emailError"] && (
                                <p className="text-error my-2 text-sm">{formErrors["emailError"]}</p>
                            )
                        }
                    </div>
                    <div>
                        <LabelElement label="Feedback" id="message" />
                        <TextAreaElement
                            id="message"
                            name="message"
                            placeholder="e.g Provide a message"
                            className="w-full"
                            required={true}
                        />
                        {
                            formErrors["messageError"] && (
                                <p className="text-error my-2 text-sm">{formErrors["messageError"]}</p>
                            )
                        }
                    </div>
                    <Button type="submit" disabled={loading ? true : false} loading={loading ? true : false}>
                        submit
                    </Button>
                </AlignVertical>
            </form>
        </section>
    )
}