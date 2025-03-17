import { FaGithubSquare, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white w-full py-3 text-center mt-auto">
      <div className="container mx-auto flex flex-col items-center">
        <p className="text-sm">© 2025 Michele Simonetti</p>
        <div className="flex space-x-4 mt-2">
          <a
            href="https://github.com/Mike7s"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400"
          >
            <FaGithubSquare className="w-8 h-8" />
          </a>
          <a
            href="https://www.linkedin.com/in/michele-simonetti-b88877350/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400"
          >
            <FaLinkedin className="w-8 h-8" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;