import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Bookshelf from "../components/images/Bookshelf.gif";
import { useLocation } from "react-router-dom";
import Button from "@mui/material/Button";

export default function Home() {
  const location = useLocation();

  useEffect(() => {}, [location]);

  return (
    <div>
      <h2 className="text-3xl text-center mt-10 animate-pulse font-mono">
        {" "}
        Library Reservation System{" "}
      </h2>
      <div
        className="text-center font-roboto font-extralight
      "
      >
        {" "}
        makes you to find perfect place for studying{" "}
      </div>
      <div>
        {" "}
        <img
          className="h-auto max-w-sm mx-auto rounded-lg mt-10"
          src={Bookshelf}
          alt=""
        />
      </div>

      {location.pathname === "/" && (
        <Button
          sx={{
            "&:hover": {
              fontWeight: "bold",
              bgcolor: "white",
            },
            color: "black",
            display: "center",
            mt: 3,
            fontWeight: "Light",
            fontSize: 20,
          }}
          href="/reserve"
        >
          Reserve Your Seat!
        </Button>
      )}
    </div>
  );
}
