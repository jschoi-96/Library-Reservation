import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { firestoreDb } from "../api/firebase";
import { collection, getDocs } from "firebase/firestore";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Usage() {
  const [empty, emptyNum] = useState(0);
  const [reserved, reservedNum] = useState(0);

  const data = {
    labels: ["Empty", "Reserved"],
    datasets: [
      {
        data: [empty, reserved],
        backgroundColor: ["rgb(34,139,34)", "rgb(220,20,60)"],

        hoverOffset: 4,
      },
    ],
  };

  const options = {};

  useEffect(() => {
    seatSummary();
  }, []);

  const seatSummary = async () => {
    const querySnapshot = await getDocs(collection(firestoreDb, "students"));

    let emp = 0,
      res = 0;
    querySnapshot.forEach((doc) => {
      if (doc.data().isReserved) {
        res += 1;
      } else {
        emp += 1;
      }
    });
    reservedNum(res);
    emptyNum(emp);
  };

  return (
    <div>
      <h2 className="text-2xl ml-16 mt-2"> Seat Reservation Status </h2>
      <div className="w-96 h-96">
        <Doughnut
          data={data}
          options={options}
        >
          {" "}
        </Doughnut>
      </div>
    </div>
  );
}
