export const navLinks = [
    {title: "Home", to: "/"},
    {title: "About", to: "/about"},
    {title: "Articles", to: "/articles-search"},
    {title: "Tools", to: "/tools-search"},
    {title: "Donate", to: "/donation"},
    {title: "Contact", to: "/contact"},
]

export const filterOptions = [
    { name: "initial", value: "initial" },
    { name: "1-2", value: "1-2" },
    { name: "1-3", value: "1-3" },
    { name: "1-5", value: "1-5" },
    { name: "1-10", value: "1-10" },
    { name: "0.1-10", value: "0.1-10" }
];

export const serverUrl = "http://127.0.0.1:8000"

export const arrivalsStyles = {
    line: {
        color: "#d4003c",
        width: 3,
        style: "dot"
    },
    label: {
        size: 30
    }
}

export const fourierWindowStyles = {
    signal: {
        edgeColor: '#1c1d21',
        width: 1,
        fillColor: 'rgba(76, 88, 255, 0.4)'
    },
    noise: {
        edgeColor: '#1c1d21',
        width: 1,
        fillColor: 'rgba(231, 54, 56, 0.4)'
    }
}
