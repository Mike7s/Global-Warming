import { useState } from "react";

function Prova() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <nav className="fixed w-full top-0 left-0 p-4  flex justify-between">
        <h1 className="text-gray-500">Global warning</h1>
        <button>☰</button>

        <div className="fixed top-0 right-0 hidden text-white">
          <ul className="p-4">
            <li>home</li>
            <li>about</li>
            <li>contact</li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Prova;
