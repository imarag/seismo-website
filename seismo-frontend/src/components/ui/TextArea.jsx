export default function TextArea({ className, size = "md", ...props }) {
  return (
    <textarea
      className={`textarea textarea-${size} textarea-bordered rounded-md ${className}`}
      {...props}
    ></textarea>
  );
}
