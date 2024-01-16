export default function MobileNav({ isOpen }: { isOpen: boolean }) {
  return (
    <div
      className={`absolute top-0 h-screen w-full bg-green-100 ${
        isOpen ? "flex" : "hidden"
      }`}
    ></div>
  );
}
