import React from "react";
import Button from "@mui/material/Button";

export default function LoginRequired() {
  return (
    <div>
      <h2 className="text-center text-3xl mt-10 font-roboto">
        {" "}
        Login required to reserve seats
      </h2>

      <h2 className="text-lg text-center mt-10">
        {" "}
        Please click login button at the top!
      </h2>
    </div>
  );
}
