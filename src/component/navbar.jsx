import { React } from 'react';

const Navbar = () => {
  return (
    <nav className="flex justify-between bg-indigo-900 text-white py-2 m-0 p-0 w-full">
      <div className="logo">
        <span className="font-bold text-2xl mx-9">Itask</span>
      </div>

      {/* Responsive navigation links */}
      <ul className="flex gap-8 mx-9 md:flex-row flex-col md:items-center">
        <li className="cursor-pointer hover:font-bold transition-all duration-50">
          <a href="#">Home</a>
        </li>
        <li className="cursor-pointer hover:font-bold transition-all duration-50">
          <a href="#">Your task</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
