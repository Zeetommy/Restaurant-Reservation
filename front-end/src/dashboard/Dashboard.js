import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import { previous, next } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import { useLocation, useHistory } from "react-router-dom";

function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [currentDate, setCurrentDate] = useState(date);

  const [error, setError] = useState(null);

  const history = useHistory();

  // useEffect's to load reservations and tables

  useEffect(() => {
    const abortController = new AbortController();

    async function loadReservations() {
      try {
        if (currentDate === date) {
          const returnedReservations = await listReservations(
            { date },
            abortController.signal
          );
          setReservations(returnedReservations);
        } else {
          const returnedReservations = await listReservations(
            { currentDate },
            abortController.signal
          );
          setReservations(returnedReservations);
        }
      } catch (error) {
        setError(error);
      }
    }
    loadReservations();
    return () => abortController.abort();
  }, [date, currentDate, history.location]);

  const previousHandler = (event) => {
    event.preventDefault();
    history.push("/dashboard");
    setCurrentDate(previous(currentDate));
  };

  const todayHandler = (event) => {
    event.preventDefault();
    history.push("/dashboard");
    setCurrentDate(date);
  };

  const nextHandler = (event) => {
    event.preventDefault();
    history.push("/dashboard");
    setCurrentDate(next(currentDate));
  };

  if (reservations) {
    return (
      <main>
        <div>
          <h1>Dashboard</h1>
        </div>

        <div>
          <div>
            <h4>Reservations for date: {currentDate} </h4>
            <div className="">
              <button onClick={previousHandler}> Previous Day </button>
            </div>
            <div className="">
              <button onClick={todayHandler}> Today </button>
            </div>
            <div className="">
              <button onClick={nextHandler}> Next Day </button>
            </div>
          </div>
        </div>
        <ErrorAlert error={error} />
      </main>
    );
  } else {
    return (
      <div>
        <h4> Dashboard Loading... </h4>
      </div>
    );
  }
}

export default Dashboard;
