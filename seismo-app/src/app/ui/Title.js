
export default function Title({ text1, text2=null }) {
    return (
      <h1 className="text-5xl md:text-6xl text-center font-semibold text-gray-900 mt-4 mb-4">       
        {text1}
        <br />
        {text2 && <span className="text-green-500">{text2}</span>}
      </h1>
    );
  }