import { NavLink } from "@remix-run/react";

export default function LinkTag({ 
    external = false, 
    button = false, 
    variance = "info", 
    href = "#", 
    large = false, 
    children 
}) {
    const tagClassName = button 
        ? (`btn btn-${variance} ${large ? "btn-lg" : ""}`)
        : (`link link-${variance} inline-flex items-center gap-2`);

    return external ? (
        <a href={href} className={tagClassName}>
            {children}
        </a>
    ) : (
        <NavLink to={href} className={tagClassName}>
            {children}
        </NavLink>
    );
}