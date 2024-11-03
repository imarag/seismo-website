
export default function ToolsHoverButtons({ gifURL, icon, title }) {

function handleMouseEnter(file) {
    let displayImage = document.querySelector(".display-image");
    displayImage.src = file;
    }

  return (
    <div className="flex flex-col items-center justify-center" onMouseEnter={() => handleMouseEnter(gifURL)}>
        <button className="rounded hover:bg-gray-100 p-4">
            <img src={icon} />
        </button>
        <p className="text-center">{ title }</p>
    </div>
  )
}
