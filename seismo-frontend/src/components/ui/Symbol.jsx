export default function Symbol({ IconComponent, className = "" }) {
  return <IconComponent className={`text-current ${className}`} />;
}
