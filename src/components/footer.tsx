import { FaGithubSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

function Footer() {
    return (
      <footer className="bg-gray-800 text-white  mt-auto">
        <div className="container mx-auto flex flex-col items-center">
          <p className="text-lg">© 2025 Michele Simonetti</p>
          <div className=" flex space-x-6 mt-2">
            <a
              href="https://github.com/Mike7s"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 text-lg"
            >
             <FaGithubSquare className="w-10 h-10 pb-2"/>
            </a>
            <a
              href="https://www.linkedin.com/in/michele-simonetti-b88877350/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 text-lg"
            >
              <FaLinkedin className="w-10 h-10 pb-2"/>
            </a>
          </div>
        </div>
      </footer>
    );
  }
  
  export default Footer;
  