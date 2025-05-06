export default function MockupCode({ bgColor="primary", codeItems=[] }) {
    return (
        <div className="mockup-code my-4">
            {
                codeItems.map((codeElement, ind) => (
                    <pre key={codeElement} data-prefix={ind+1}>
                        <code>{ codeElement }</code>
                    </pre>
                ))
            }
            
        </div>
    )
}