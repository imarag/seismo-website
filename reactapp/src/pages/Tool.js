import { useParams } from 'react-router-dom';
import { allTools } from '../all-topics';
import Title from '../components/Title';
import Subtitle from '../components/Subtitle';

export default function Tool() {
    const { toolName } = useParams();
    let ComponentToRender;
    for (let tp of allTools) {
        if (toolName === tp.template_name){
            ComponentToRender = tp
        }
    }

    return (
        <div className="container mx-auto">
            <Title text1={ComponentToRender.title} />
            <p className="text-start font-light mt-20">{ComponentToRender.description}</p>
            {ComponentToRender.component}
        </div>
    )
}
