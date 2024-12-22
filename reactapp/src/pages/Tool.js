import { useParams } from 'react-router-dom';
import { allTools } from '../all-topics';
import Accordion from "../components/Accordion"

export default function Tool() {
    const { toolName } = useParams();
    let ComponentToRender;
    for (let tp of allTools) {
        if (toolName === tp.template_name){
            ComponentToRender = tp
        }
    }



    return (
        <div className="fw-light">
            <div className="py-5 bg-light">
                <h1 className="text-center display-3 fw-semibold mb-3">{ComponentToRender.title}</h1>
                <h2 className="text-center fs-3 mb-4 fw-light">{ComponentToRender["small-description"]}</h2>
                <img src={ComponentToRender.image_name} className="image image-md"/>
            </div>
            <section className="container-lg">
                <div className="col-lg-8 mx-auto mt-5">
                    <p className="mt-25">{ComponentToRender.description}</p>
                    <Accordion label="User guide" show={false}>
                        <p>{ComponentToRender["user-guide"]}</p>
                    </Accordion>
                </div>
                {ComponentToRender.component}
            </section>
        </div>
    )
}
