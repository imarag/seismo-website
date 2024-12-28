
export default function Title({ text1, text2=null }) {
    return (
      <h1 className="text-5xl md:text-6xl text-center font-normal mt-4 mb-4">       
        {text1}
        <br />
        {text2 && <span className="text-primary">{text2}</span>}
      </h1>
    );
  }