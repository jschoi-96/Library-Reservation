import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import {
  doc,
  collection,
  addDoc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { firestoreDb } from "../api/firebase";

export default function AlertDialog(props) {
  const [open, isOpen] = useState(false);
  const [reserved, isReserved] = useState(false);
  const [cancel, isCanceled] = useState(false);

  const [color, setColor] = useState("red");
  const handleOpen = () => {
    isOpen(!open);
  };
  const handleReserve = (e) => {
    isReserved(!reserved);

    // 여기서 firestore에 데이터 저장!

    const docData = {
      id: props.id,
      isReserved: true,
      color: "green",
      timestamp: serverTimestamp(),
    };
    setDoc(doc(firestoreDb, "students", props.id), docData);
    console.log(props.id);
    isOpen(!open);
  };

  const handleCancel = () => {
    isCanceled(!cancel);

    getDoc(doc(firestoreDb, "students", props.id)).then((docSnap) => {
      // check if collection exist or not and if exists, update reserved status
      if (docSnap.exists()) {
        const updateRef = doc(firestoreDb, "students", props.id);
        updateDoc(updateRef, {
          isReserved: false,
          color: "red",
        });

        setColor((color) => props.color);
      } else {
        console.log("No Such Documents!");
      }
    });

    isOpen(!open);
  };

  return (
    <div>
      <Button
        sx={{
          minWidth: 200,
          minHeight: 100,
          flexGrow: 5,
          flexBasis: "20%",
        }}
        variant="outlined"
        onClick={handleOpen}
      >
        Reserve
      </Button>
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
