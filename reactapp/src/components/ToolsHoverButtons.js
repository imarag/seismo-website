
export default function ToolsHoverButtons({ gifURL, icon, title }) {

function handleMouseEnter(file) {
    let displayImage = document.querySelector(".display-image");
    displayImage.src = file;
    }

  return (
    <div className="d-flex flex-column align-items-center justify-content-center" onMouseEnter={() => handleMouseEnter(gifURL)}>
        <button className="rounded p-3">
            <img src={icon} />
        </button>
        <p className="text-center fw-semibold">{ title }</p>
    </div>
  )
}
