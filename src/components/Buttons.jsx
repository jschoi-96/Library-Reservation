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
  getDocs,
  updateDoc,
  collection,
  writeBatch,
  getDoc,
  arrayUnion,
  arrayRemove,
  where,
  setDoc,
  addDoc,
} from "firebase/firestore";

import { onUserStateChange } from "../api/firebase";
import LoginRequired from "../pages/LoginRequired";

export default function Buttons() {
  const [open, setOpen] = useState(false);
  const [seatNum, setSeatNum] = useState("");
  const [user, setUser] = useState(false);
  const [buttons, setButtons] = useState([]);

  const [waitlist, setWaitlist] = useState(false);

  useEffect(() => {
    onUserStateChange((user) => {
      setUser(user);
    });
  }, []);

  // allocating seat data once
  // for (let i = 0; i < 16; i++) {
  //   setDoc(doc(firestoreDb, "students", String(i)), {
  //     id: i,
  //     isReserved: false,
  //     createdTime: new Date(),
  //     reservedTime: "",
  //     endTime: "",
  //     reserved_person: "",

  //     waitlist_info: {
  //       id: 0,
  //       waitlist: "",
  //     },
  //   });
  // }

  // 예약 시간이 지나면 좌석을 available 상태로 변경하는 함수
  const updateSeatAvailability = async (docRef) => {
    try {
      const docSnapshot = await getDoc(docRef);
      const waitlistInfo = docSnapshot.data().waitlist_info;

      if (waitlistInfo && waitlistInfo.length > 0 && waitlistInfo[0] !== null) {
        const now = new Date();
        await updateDoc(docRef, {
          isReserved: true,
          reservedTime: now,
          endTime: new Date(now.getTime() + 60 * 60 * 1000),
          reserved_person: waitlistInfo[0], // replace
          waitlist_info: arrayRemove(waitlistInfo[0]), // after replacing, delete first person in the array
        });

        console.log("좌석이 available 상태로 변경되었습니다.");
      } else {
        await updateDoc(docRef, {
          isReserved: false,
          reservedTime: "",
          endTime: "",
          reserved_person: "",
        });
      }
    } catch (error) {
      console.error("좌석 업데이트 중 오류가 발생했습니다:", error);
    }
  };

  // "users" 컬렉션에서 seat_reservation_status 필드를 0으로 업데이트하는 함수
  const updateUserSeatStatus = async (userId) => {
    const userDocRef = doc(firestoreDb, "users", userId);
    try {
      await updateDoc(userDocRef, { seat_reservation_status: 0 });
      console.log("사용자 좌석 예약 상태가 업데이트되었습니다.");
    } catch (error) {
      console.error(
        "사용자 좌석 예약 상태 업데이트 중 오류가 발생했습니다:",
        error
      );
    }
  };

  // 예약 시간이 지나면 좌석이 available 한 상태로 만들어주는 로직
  const handleTime = async () => {
    const querySnapshot = await getDocs(collection(firestoreDb, "students"));

    const curTime = new Date(); // 현재 시각

    querySnapshot.forEach((doc) => {
      const reserved = doc.data().isReserved;
      const reserved_person = doc.data().reserved_person;

      const timestamp = doc.data().reservedTime; // Get the timestamp field
      if (timestamp) {
        // If timestamp field exists
        const savedTime = timestamp.toDate(); // firestore에 저장된 시간

        const timeDiff = curTime - savedTime;

        if (reserved && timeDiff > 1000 * 60 * 60) {
          const docRef = doc.ref;
          updateSeatAvailability(docRef);

          const userId = doc.data().reserved_person;
          updateUserSeatStatus(userId);
        }
      }
    });
  };

  // 다음 날이 되면 예약 횟수를 초기화하는 로직
  const resetCount = async () => {
    const curDate = new Date();
    const nextDate = new Date(curDate);
    nextDate.setDate(curDate.getDate() + 1);

    const collectionRef = collection(firestoreDb, "users");
    const q = query(collectionRef, where("createdAt", ">", nextDate));

    const querySnapshot = await getDocs(q);
    const batch = writeBatch(firestoreDb);

    querySnapshot.forEach((doc) => {
      const docRef = doc.ref;
      batch.update(docRef, { daily_count: 0 });
    });

    await batch.commit();
  };

  // 색깔 바꾸는 로직
  useEffect(() => {
    const fetchData = async () => {
      // Access the buttons collection
      const colorRef = collection(firestoreDb, "students");

      try {
        const querySnapshot = await getDocs(colorRef);
        const buttonData = querySnapshot.docs.map((doc) => ({
          id: doc.data().id,
          isReserved: doc.data().isReserved,
        }));
        setButtons(buttonData);
        console.log(buttonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    handleTime();
    resetCount();
  }, [open]);

  const getButtonColor = (button) => {
    return button.isReserved ? "red" : "green";
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleClick = async (e) => {
    const seatNumber = e.target.innerText;
    setSeatNum(seatNumber);

    console.log(seatNumber);

    const reservedSnapshot = await getDoc(
      doc(firestoreDb, "students", seatNumber)
    );

    if (
      reservedSnapshot.data().isReserved &&
      user.displayName !== reservedSnapshot.data().reserved_person
    ) {
      setOpen(true); // 예약이 불가능한 경우 다이얼로그 창을 엽니다.
      setWaitlist(true); // waitlist 상태를 활성화합니다.
    } else {
      // 예약 가능한 경우 예약을 진행합니다.
      setSeatNum(seatNumber);
      setOpen(true);
      setWaitlist(false); // waitlist 상태를 비활성화합니다.
    }
  };

  const handleReserve = async () => {
    // 예약 처리 로직 작성

    const studentRef = doc(firestoreDb, "students", seatNum); // 좌석 필드

    const userRef = doc(firestoreDb, "users", user.displayName); // 유저 필드
    const now = new Date();

    const reservedSnapshot = await getDoc(studentRef); // 다른 사람이 예약했는지 확인하기 위해서
    const seatLimitSnapshot = await getDoc(userRef);

    const endTime = new Date(now.getTime() + 60 * 60 * 1000); // 1시간 뒤 좌석 예약 만료

    const daily_count = seatLimitSnapshot.data().daily_count;

    if (daily_count > 3) {
      alert("Students can reserve only 3 times a day!");
    } else if (seatLimitSnapshot.data().seat_reservation_status >= 1) {
      alert("You can only reserve one seat at the time!");
    } else {
      await updateDoc(studentRef, {
        isReserved: true,
        reservedTime: now,
        endTime: endTime,
        reserved_person: user.displayName,
      });

      await updateDoc(userRef, {
        time: now,
        daily_count: daily_count + 1,
        seat_reservation_status: 1,
      });
    }

    setOpen(false); // 다이얼로그 닫기
  };

  const handleCancel = async () => {
    // 예약 취소 처리 로직 작성
    const studentRef = doc(firestoreDb, "students", seatNum); // 좌석 필드

    const userRef = doc(firestoreDb, "users", user.displayName); // 유저 필드
    const otherReserved = await getDoc(studentRef);
    const seatLimitSnapshot = await getDoc(userRef);

    if (
      otherReserved.data().reserved_person !== user.displayName &&
      otherReserved.data().isReserved
    ) {
      // 다른 사람이 예약한 좌석을 취소 못하게 하는 로직
      alert("You cannot cancel other person seat!");
    } else if (!otherReserved.data().isReserved) {
      setOpen(false);
    } else {
      await updateDoc(studentRef, {
        isReserved: false,
        reserved_person: "",
        reservedTime: "",
        endTime: "",
      });

      const daily_count = seatLimitSnapshot.data().daily_count;

      if (daily_count === 0) {
        await updateDoc(userRef, {
          seat_reservation_status: 0,
        });
      } else {
        await updateDoc(userRef, {
          daily_count: daily_count - 1,
          seat_reservation_status: 0,
        });
      }
    }

    setOpen(false); // 다이얼로그 닫기
  };

  const handleWaitlist = async () => {
    // seat에 지금 로그인된 유저 이름과 순서를 array 형태로 추가하기 firebase에

    const stuRef = doc(firestoreDb, "students", seatNum);
    const stuRefQuery = await getDoc(stuRef);

    const currentUser = user.displayName;
    const savedUser = stuRefQuery.data().reserved_person;

    if (currentUser !== savedUser) {
      // 순서대로 waitlist에 등록해주는 로직
      await updateDoc(stuRef, {
        waitlist_info: arrayUnion(currentUser),
      });
    }

    setOpen(false);
  };

  return (
    <div>
      {!user && <LoginRequired />}
      {user && (
        <>
          <h2 className="text-4xl font-roboto text-center mt-6"> SEAT MAPS</h2>

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
            {buttons.map((button) => (
              <ButtonGroup
                sx={{
                  minWidth: "80px",
                  ml: 12,
                }}
                orientation="vertical"
                aria-label="vertical outlined button group"
                size="large"
                key={button.id}
              >
                <Button
                  sx={{
                    color: "black",
                    backgroundColor: getButtonColor(button),
                  }}
                  onClick={handleClick}
                >
                  {" "}
                  {button.id}{" "}
                </Button>
              </ButtonGroup>
            ))}
          </Box>
        </>
      )}
      <Dialog
        open={open}
        onClose={handleOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {waitlist
            ? "This seat is reserved. Do you want to be enrolled in waitlist?"
            : "Do you want to reserve this seat?"}
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText>
        </DialogContent>

        {!waitlist ? (
          <DialogActions>
            <Button onClick={handleReserve}> Reserve </Button>
            <Button
              onClick={handleCancel}
              autoFocus
            >
              Cancel
            </Button>
            <Button onClick={handleOpen}> Close </Button>
          </DialogActions>
        ) : (
          <DialogActions>
            <Button onClick={handleWaitlist}> Yes</Button>
            <Button onClick={handleOpen}> No</Button>
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
}
