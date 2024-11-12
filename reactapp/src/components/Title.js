
export default function Title({ text1, text2=null }) {
    return (
      <h1 className="display-3 fw-semibold mb-2 text-center">
        {text1}
        <br />
        {text2 && <span className="text-success">{text2}</span>}
      </h1>
    );
  }