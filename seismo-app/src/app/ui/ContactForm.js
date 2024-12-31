import { TextInputElement, EmailInputElement, TextAreaElement, LabelElement } from "@/components/UIElements"

export default function ContactForm() {
    return (
        <section className="px-10">
            <form>
                <div className="flex flex-col gap-5">
                    <div>
                        <LabelElement label="Name" className="text-lg" />
                        <TextInputElement
                            id="name"
                            name="name"
                            placeholder="e.g Enter your name"
                            className="w-full"
                        />
                    </div>
                    <div>
                        <LabelElement label="Email" className="text-lg" />
                        <EmailInputElement
                            id="email"
                            name="email"
                            placeholder="e.g Enter your email address"
                            className="w-full"
                        />
                    </div>
                    <div>
                        <LabelElement label="Feedback" className="text-lg" />
                        <TextAreaElement
                            id="feedback"
                            name="feedback"
                            placeholder="e.g Provide feedback"
                            className="w-full"
                        />
                    </div>
                </div>
                <button className="btn btn-primary btn-block block mx-auto mt-8">
                    Submit
                </button>
            </form>
        </section>
    )
}