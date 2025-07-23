import { iconsMapping } from "../IconsMapping";

export default function Symbol({ iconLabel = "download-file", className = "" }) {
  const IconComponent = iconsMapping[iconLabel]
  return <IconComponent className={`text-current size-4 ${className}`} />;
}
