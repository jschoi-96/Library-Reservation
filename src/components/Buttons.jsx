import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { firestoreDb } from "../api/firebase";
import {
  query,
  doc,
  addDoc,
  getDocs,
  setDoc,
  updateDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { login, logout, onUserStateChange } from "../api/firebase";
import LoginRequired from "../pages/LoginRequired";

// async function getColor() {
//   const snapshot = await firestoreDb.firestore().collection("students").get();
//   return snapshot.docs.map((doc) => doc.data);
// }

export default function Buttons() {
  let seats = [];
  let seatsLength = 20; // allocating size of seats

  let tempColor = [];

  const [open, setOpen] = useState(false);
  const [seatNum, setSeatNum] = useState("");
  const [color, setColor] = useState([]);
  const [user, setUser] = useState();

  useEffect(() => {
    onUserStateChange((user) => {
      setUser(user);
    });
  }, [user]);

  useEffect(() => {
    getColor();
  }, [color]);

  const handleOpen = (seat) => {
    setOpen(!open);
  };

  for (let i = 0; i < seatsLength; i++) {
    seats.push(seats[i]);
  }

  const handleClick = async (e) => {
    handleOpen(e);

    try {
      await setDoc(doc(firestoreDb, "students", e.target.innerText), {
        id: Math.floor(e.target.innerText),
        isReserved: "",
        timestamp: serverTimestamp(),
      });
      setSeatNum(e.target.innerText);
    } catch (error) {
      console.log("error");
    }
  };

  const handleReserve = async () => {
    // 예약 처리 로직 작성

    const reserveRef = doc(firestoreDb, "students", seatNum);

    await updateDoc(reserveRef, {
      isReserved: true,
      timestamp: serverTimestamp(),
    });
    setOpen(false); // 다이얼로그 닫기
  };

  const handleCancel = async () => {
    // 예약 취소 처리 로직 작성
    const reserveRef = doc(firestoreDb, "students", seatNum);

    await updateDoc(reserveRef, {
      isReserved: false,
      timestamp: serverTimestamp(),
    });
    setOpen(false); // 다이얼로그 닫기
  };

  async function getColor() {
    const query = await getDocs(collection(firestoreDb, "students"));
    query.forEach((doc) => {
      tempColor.push(doc.data().isReserved);

      // console.log(doc.id, doc.data().isReserved);
    });
    setColor(tempColor);
  }
  // getColor();
  return (
    <div>
      {!user && <LoginRequired />}
      {user && (
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
          {seats.map((seatData, index) => (
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
                  color: "black",
                  backgroundColor: color[index] === true ? "red" : "green",
                }}
                onClick={handleClick}
              >
                {" "}
                {index}{" "}
              </Button>
            </ButtonGroup>
          ))}
        </Box>
      )}
      <Dialog
        open={open}
        onClose={handleOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to reserve this seat?"}
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReserve}> Yes </Button>
          <Button
            onClick={handleCancel}
            autoFocus
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
