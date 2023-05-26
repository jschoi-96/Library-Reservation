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
  writeBatch,
  onSnapshot,
} from "firebase/firestore";

import { getAuth } from "firebase/auth";

import { onUserStateChange } from "../api/firebase";
import LoginRequired from "../pages/LoginRequired";
import { onAuthStateChanged } from "firebase/auth";

// async function getColor() {
//   const snapshot = await firestoreDb.firestore().collection("students").get();
//   return snapshot.docs.map((doc) => doc.data);
// }

export default function Buttons() {
  const [open, setOpen] = useState(false);
  const [seatNum, setSeatNum] = useState("");
  const [user, setUser] = useState(false);
  const [buttons, setButtons] = useState([]);

  const [over, isOver] = useState(false);

  // allocating seat data once
  // for (let i = 0; i < 10; i++) {
  //   setDoc(doc(firestoreDb, "students", String(i)), {
  //     id: i,
  //     isReserved: "",
  //     timestamp: serverTimestamp(),
  //   });
  // }

  useEffect(() => {
    onUserStateChange((user) => {
      console.log(user);
      setUser(user);
    });
  }, []);

  // 예약 시간이 지나면 예약이 풀리는 로직
  const handleTime = async () => {
    const timeRef = collection(firestoreDb, "students");

    try {
      const querySnapshot = await getDocs(timeRef);

      querySnapshot.forEach((doc) => {
        const timestamp = doc.data().timestamp;

        const currentTime = new Date(); // 현재 시간
        const serverTime = timestamp.toDate(); // 상태가 변경된 시간

        const diffInMilliseconds = currentTime - serverTime;
        if (doc.data().isReserved && diffInMilliseconds >= 3000) {
          try {
            updateDoc(doc.ref, {
              isReserved: false,
            });

            console.log("Time is over, so seat status changes");
          } catch (error) {
            console.log(error);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  // 색깔 바꾸는 로직
  // needs to fix in terms of effective code (even it's same state as before, still gets rendered)
  useEffect(() => {
    const fetchData = async () => {
      // Access the buttons collection
      const colorRef = collection(firestoreDb, "students");

      try {
        const querySnapshot = await getDocs(colorRef);
        const buttonData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          isReserved: doc.data().isReserved,
        }));
        setButtons(buttonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    handleTime();
    //console.log("?");
  }, [open]);

  const getButtonColor = (isReserved) => {
    return isReserved ? "red" : "green";
  };

  const handleOpen = (seat) => {
    setOpen(!open);
  };

  const handleClick = async (e) => {
    handleOpen(e);

    setSeatNum(e.target.innerText);
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
    console.log(seatNum);
    setOpen(false); // 다이얼로그 닫기
  };

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
          {buttons.map((button, index) => (
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
                  backgroundColor: getButtonColor(button.isReserved),
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
