'use client';
import { useState, useEffect } from "react";
import { FiSun } from "react-icons/fi";
import { CiDark } from "react-icons/ci";

const themeLight = "emerald";
const themeDark = "forest";

export default function ThemeControler() {
    const [theme, setTheme] = useState(themeLight); // Default to light theme

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            setTheme(storedTheme);
        }
    }, []);

    useEffect(() => {
        document.querySelector('html').setAttribute('data-theme', theme);
        localStorage.setItem("theme", theme); // Store theme after it's set
    }, [theme]);

    function toggleTheme() {
        const newTheme = theme === themeDark ? themeLight : themeDark
        setTheme(newTheme);
    }

    const iconClass = "size-6 transition-all";

    return (
        <label className="swap swap-rotate">
            <input
                type="checkbox"
                className="theme-controller"
                onChange={toggleTheme}
                checked={theme === themeDark}
            />
            {theme === themeLight ? (
                <CiDark className={iconClass} />
            ) : (
                <FiSun className={iconClass} />
            )}
        </label>
    );
}
