import React from "react";

const Footer = () => {
  return (
    <footer className="footer flex items-center  px-4 mb-[60px] md:mb-0">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-1 py-2 md:py-5 border-t">
        <div className="text-muted-foreground text-center md:text-left">
          Copyright © 2023 <span className="font-semibold">Elstar</span> All
          rights reserved.
        </div>
        <div className="text-muted-foreground text-center md:text-right">
          <a className="hover:underline" href="/" target="_blank">
            Term & Conditions
          </a>
          <span className="mx-2 text-muted"> | </span>
          <a
            className="hover:underline transition duration-500"
            href="/"
            target="_blank"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
