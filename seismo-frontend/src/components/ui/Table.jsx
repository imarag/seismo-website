export default function Table({ records = [], size = "extra-small", rounded = false }) {

    const sizeMapping = {
        "extra-small": "text-xs",
        small: "text-sm",
        medium: "text-base",
        large: "text-lg"
    }

    const bodyCellClass = "text-center overflow-scroll";
    const headerCellClass = "text-center";
    const bodyRowClass = "hover:bg-base-300"

    if (records.length === 0) {
        return null
    }

    const columnNames = Object.keys(records[0]);
    const columnTableHeaders = columnNames.map((colName, colIndex) => (
        <th className={headerCellClass} key={`header-${colIndex}`}>{colName}</th>
    ))

    const bodyTableData = records.map((row, rowIndex) => (
        <tr key={`row-${rowIndex}`} className={bodyRowClass}>
            {columnNames.map((colName, colIndex) => (
                <td className={bodyCellClass} key={`cell-${rowIndex}-${colIndex}`}>{row[colName] ?? "N/A"}</td>
            ))}
        </tr>
    ));



    return (
        <table className={`table overflow-scroll bg-base-200 ${sizeMapping[size] || ""} ${rounded ? "rounded-md" : "rounded-none"}`}>
            <thead>
                <tr>{columnTableHeaders}</tr>
            </thead>
            <tbody>{bodyTableData}</tbody>
        </table>
    );
}
