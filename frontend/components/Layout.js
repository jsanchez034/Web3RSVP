import { useReactiveVar } from "@apollo/client";

import Navbar from "./Navbar";
import Footer from "./Footer";
import { themeVar } from '../apollo-client';


const Layout = ({ children }) => {
  let currentTheme = useReactiveVar(themeVar);
  
  return (
    <div className={`${currentTheme} font-serif flex flex-col min-h-screen`}>
      <Navbar />
      <main className="flex-1 dark:bg-slate-700">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
