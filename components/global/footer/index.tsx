import React from "react";
import format from "date-fns/format";

const Footer = () => {
  const year = format(new Date(), "yyyy");

  return (
    <footer className="footer flex items-center  px-4 mb-[60px] md:mb-0">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-1 py-2 md:py-5 border-t">
        <div className="text-muted-foreground text-center md:text-left">
          Copyright © {year}{" "}
          <span className="font-semibold">Goldy's Nestt</span> All rights
          reserved.
        </div>
        <div className="text-muted-foreground text-center md:text-right">
          <a
            className="hover:underline"
            href="https://www.goldysnestt.com/"
            target="_blank"
          >
            Website
          </a>
          <span className="mx-2 text-muted"> | </span>
          <a
            className="hover:underline transition duration-500"
            href="https://goldysnestt.myshopify.com/admin"
            target="_blank"
          >
            Shopify
          </a>
          <span className="mx-2 text-muted"> | </span>
          <a
            className="hover:underline transition duration-500"
            href="https://app.shiprocket.in/"
            target="_blank"
          >
            Shiprocket
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
