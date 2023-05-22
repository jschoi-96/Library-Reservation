import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";

import AlertDialog from "./AlertDialog";

import { firestoreDb } from "../api/firebase";
import { doc, getDoc } from "firebase/firestore";

// async function getColor() {
//   const snapshot = await firestoreDb.firestore().collection("students").get();
//   return snapshot.docs.map((doc) => doc.data);
// }

export default function Buttons() {
  let seats = [];
  let seatsLength = 10; // allocating size of seats

  const [showDialog, setshowDialog] = useState(false);

  const [seatValue, setseatValue] = useState(0);

  const [color, setColor] = useState("");

  for (let i = 0; i < seatsLength; i++) {
    seats.push(seats[i]);
  }

  const handleClick = (e) => {
    setshowDialog(!showDialog);

    setseatValue((seatValue) => e.target.innerText);

    // getColor();

    // console.log(color);
    console.log("seatValue:  " + seatValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",

        "& > *": {
          mt: 30,
          my: 5,
          mx: 4,
          border: 2,
        },
      }}
    >
      {seats.map((seats, index) => (
        <ButtonGroup
          sx={{
            minWidth: "80px",
            ml: 12,
          }}
          orientation="vertical"
          aria-label="vertical outlined button group"
          size="large"
          key={index}
        >
          <Button
            sx={{
              ":hover": {
                bgcolor: "#26a69a",
              },
              color: "black",
              backgroundColor: "green",
              // ...(color === "red" && {
              //   color: "black",
              //   backgroundColor: "red",
              // }),
            }}
            onClick={handleClick}
          >
            {" "}
            {index + 1}{" "}
          </Button>
        </ButtonGroup>
      ))}
      {showDialog && (
        <AlertDialog
          id={seatValue}
          color={color}
        />
      )}
    </Box>
  );
}
