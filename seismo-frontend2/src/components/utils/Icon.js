export default function Icon({ icon: IconComponent, className="" }) {
    const iconClass = `size-4 ${className}`
    return (
        <IconComponent className={iconClass} />
    )
}