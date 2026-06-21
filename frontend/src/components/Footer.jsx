import React from 'react'
import { Link } from 'react-router-dom';
import { Leaf} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();


  
  
  
  
  
  return (
    <footer className="bg-emerald-900 text-emerald-300 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <Leaf className="h-6 w-6 fill-emerald-400" />
            <span className="font-display font-extrabold text-xl tracking-tight">
              Eco<span className="text-emerald-400">Berg</span>
            </span>
          </div>
          <div className="text-sm text-center md:text-right">
            <p>&copy; {currentYear} EcoBerg. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer