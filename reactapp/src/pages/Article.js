import { useParams } from 'react-router-dom';
import topicComponents from '../all-topics.js';



export default function Article() {
    const { articleName } = useParams();

    const ComponentToRender = topicComponents[articleName];

    return (
        <div>
            <h1>Article Page</h1>
            <p>{articleName}</p>
            {ComponentToRender}
        </div>
    )
}
