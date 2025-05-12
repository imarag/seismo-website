export default function Spinner({ visible = false }) {
  return (
    <p class={`text-center ${visible ? "visible" : "invisible"}`}>
      <span class="loading loading-ring loading-lg"></span>
    </p>
  );
}
