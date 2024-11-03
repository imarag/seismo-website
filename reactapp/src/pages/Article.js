import { useParams } from 'react-router-dom';
import { allArticles } from '../all-topics';
import Title from '../components/Title';
import Subtitle from '../components/Subtitle';


export default function Article() {
    const { articleName } = useParams();
    let ComponentToRender;
    for (let tp of allArticles) {
        if (articleName === tp.template_name){
            ComponentToRender = tp
        }
    }

    return (
        <div className="container mx-auto">
            <Title text1={ComponentToRender.title} />
            {ComponentToRender.component}
        </div>
    )
}
