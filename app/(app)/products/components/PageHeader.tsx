import React from "react";
import Link from "next/link";
import StickyHeader from "@/components/shared/sticky-header";
import SearchInput from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRightLeft } from "lucide-react";
import NewSheet from "./NewSheet";
import TransferSheet from "./TransferSheet";
const PageHeader = () => {
  return (
    <StickyHeader>
      <div className="grid grid-cols-2 items-center">
        <SearchInput />
        <div className="relative flex gap-4 justify-end">
          <Button>
            <Link href="/products/barcodes" className="flex items-center">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 mr-2 "
                fill="currentColor"
              >
                <path d="M4 5V19H20V5H4ZM3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM6 7H9V17H6V7ZM10 7H12V17H10V7ZM13 7H14V17H13V7ZM15 7H18V17H15V7Z" />
              </svg>
              Barcode
            </Link>
          </Button>
          <Button>
            <TransferSheet>
              <span className="inline-flex items-center">
                <ArrowRightLeft className="w-5 h-5 mr-2" />
                Transfer
              </span>
            </TransferSheet>
          </Button>
          <NewSheet>
            <Button>
              <Plus className="w-5 h-5 mr-2" />
              New
            </Button>
          </NewSheet>
        </div>
      </div>
    </StickyHeader>
  );
};

export default PageHeader;
