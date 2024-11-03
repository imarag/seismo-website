
export default function Title({ text1, text2=null }) {
    return (
      <h1 className="text-4xl md:text-6xl font-semibold mt-10 mb-4 text-center">
        {text1}
        <br />
        {text2 && <span className="text-green-700">{text2}</span>}
      </h1>
    );
  }