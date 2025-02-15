import Button from "@/components/ui/Button"

export default function TestPage() {
    return (
        <>
            <div>
                <Button variant="primary">press</Button>
                <Button variant="secondary">press</Button>
                <Button variant="info">press</Button>
                <Button variant="error">press</Button>
                <Button variant="success">press</Button>
                <Button variant="ghost">press</Button>
            </div>
            <div>
                <Button outline={true} variant="primary">press</Button>
                <Button outline={true} variant="secondary">press</Button>
                <Button outline={true} variant="info">press</Button>
                <Button outline={true} variant="error">press</Button>
                <Button outline={true} variant="success">press</Button>
                <Button outline={true} variant="ghost">press</Button>
            </div>
            <div>
                <Button outline={false} size="large" variant="primary">press</Button>
                <Button outline={false} size="large" variant="secondary">press</Button>
                <Button outline={false} size="large" variant="info">press</Button>
                <Button outline={false} size="large" variant="error">press</Button>
                <Button outline={false} size="large" variant="success">press</Button>
                <Button outline={false} size="large" variant="ghost">press</Button>
            </div>
            <div>
                <Button outline={false} size="medium" variant="primary">press</Button>
                <Button outline={false} size="medium" variant="secondary">press</Button>
                <Button outline={false} size="medium" variant="info">press</Button>
                <Button outline={false} size="medium" variant="error">press</Button>
                <Button outline={false} size="medium" variant="success">press</Button>
                <Button outline={false} size="medium" variant="ghost">press</Button>
            </div>
            <div>
                <Button outline={false} size="small" variant="primary">press</Button>
                <Button outline={false} size="small" variant="secondary">press</Button>
                <Button outline={false} size="small" variant="info">press</Button>
                <Button outline={false} size="small" variant="error">press</Button>
                <Button outline={false} size="small" variant="success">press</Button>
                <Button outline={false} size="small" variant="ghost">press</Button>
            </div>
        </>
    )   
}