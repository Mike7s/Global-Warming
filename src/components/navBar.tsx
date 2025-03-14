import { useState } from "react";
import { Link } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"; 
import { GiWorld } from "react-icons/gi";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className=" text-black fixed w-full  top-0 left-0 z-50 ">
      <div className="container mx-auto flex justify-between items-center p-4">
        
        <a href="/"> <GiWorld  className="h-16 w-16 hover:text-blue-600 cursor-pointer" />
        </a>

       
        <button onClick={toggleMenu} className="text-white hover:scale-110">
          <Bars3Icon className="h-8 w-8" />
        </button>
      </div>

      
      <div
        className={`fixed top-0 right-0 h-screen w-64 bg-gray-800 shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
       
        <button onClick={toggleMenu} className="absolute top-4 right-4 text-white">
          <XMarkIcon className="h-6 w-6" />
        </button>

        
        <ul className="flex flex-col items-center mt-16 space-y-6">
          <li>
            <Link to="/" className="block py-2 px-4 text-lg hover:bg-gray-600">Home</Link>
          </li>
          <li>
            <Link to="/temperature" className="block py-2 px-4 text-lg hover:bg-gray-600">Temperature</Link>
          </li>
          <li>
            <Link to="/co2" className="block py-2 px-4 text-lg hover:bg-gray-600">CO2</Link>
          </li>
          <li>
            <Link to="/methane" className="block py-2 px-4 text-lg hover:bg-gray-600">Methane</Link>
          </li>
          <li>
            <Link to="/nitrous" className="block py-2 px-4 text-lg hover:bg-gray-600">NO2</Link>
          </li>
          <li>
            <Link to="/artic" className="block py-2 px-4 text-lg hover:bg-gray-600">Artic</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
