"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import * as SearchData from "./data";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const Search = () => {
  const [openModal, setOpenModal] = useState(false);
  const [searchLink, setSearchLink] = useState("");

  // Filter the data based on search input
  const filteredLinks = SearchData.SearchLinks.filter(
    (link) =>
      link.title.toLowerCase().includes(searchLink.toLowerCase()) ||
      link.href.toLowerCase().includes(searchLink.toLowerCase())
  );

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger asChild>
        <button className="px-[15px] hover:text-primary text-link dark:text-darklink dark:hover:text-primary relative after:absolute after:w-10 after:h-10 after:rounded-full hover:after:bg-lightprimary  after:bg-transparent rounded-full flex justify-center items-center cursor-pointer">
          <Icon icon="solar:magnifer-line-duotone" height={20} />
        </button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-2xl p-0 gap-0 [&>button]:hidden">
        <div className="p-6 border-b border-ld">
          <input
            type="text"
            value={searchLink}
            onChange={(e) => setSearchLink(e.target.value)}
            placeholder="Search links..."
            className="w-full bg-transparent border-none outline-none text-lg p-2"
          />
        </div>

        <div className="flex-1 overflow-auto p-6 pt-0">
          <SimpleBar className="max-h-72">
            <h5 className="text-lg pt-5 mb-4">Quick Page Links</h5>
            <div className="flex flex-col gap-2">
              {filteredLinks.length > 0 ? (
                filteredLinks.map((link, index) => (
                  <Link
                    href={link.href}
                    key={index}
                    className="p-3 rounded-lg hover:bg-lightprimary group transition-colors"
                  >
                    <h6 className="group-hover:text-primary mb-1 font-medium text-sm">
                      {link.title}
                    </h6>
                    <p className="text-xs text-link dark:text-darklink opacity-90 font-medium">
                      {link.href}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-center text-gray-500 py-4">
                  No results found.
                </p>
              )}
            </div>
          </SimpleBar>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Search;
