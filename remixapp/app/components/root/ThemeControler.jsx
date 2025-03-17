import { useState } from "react";
import { FiSun } from "react-icons/fi";
import { CiDark } from "react-icons/ci";

export default function ThemeControler() {
    const themeLight = "emerald";
    const themeDark = "forest";
    const [selectedTheme, setSelectedTheme] = useState(themeLight);
    
    const toggleTheme = () => {
        const newTheme = selectedTheme === themeLight ? themeDark : themeLight;
        setSelectedTheme(newTheme)
        document.documentElement.setAttribute("data-theme", newTheme);
      };

    const iconClass = "size-6 transition-all"

    return (
        <label className="swap swap-rotate">
            <input type="checkbox" className="theme-controller" onChange={toggleTheme} value={selectedTheme} />
            {
                selectedTheme === themeLight ? <CiDark className={iconClass}/> : <FiSun className={iconClass} />
            }
        </label>
    )
}