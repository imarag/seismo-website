
export default function Title({ text, styledText=null }) {
    return (
      <h1 className="text-5xl md:text-6xl text-center font-normal my-4">       
        {text}
        <br />
        {styledText && <span className="text-primary">{styledText}</span>}
      </h1>
    );
  }