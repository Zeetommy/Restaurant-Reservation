import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { updateResStatus, listTables } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function ReservationDetail({ res }) {
  const [reservation, setReservation] = useState(res);
  const [error, setError] = useState(null);
  const history = useHistory();

   const handleCancelRes = (event) => {
     event.preventDefault();
     setError(null);
     if (
       window.confirm(
         "Do you want to cancel this reservation? This cannot be undone."
       )
     ) {
       console.log("Clicked OK in confirmation dialog");
       updateResStatus({ status: "cancelled" }, reservation.reservation_id)
         .then(() => {
           console.log("Reservation cancelled successfully");
           listTables();
           history.push("/dashboard");
         })
         .catch((error) => {
           console.log("Error cancelling reservation:", error);
           setError(error);
         });
     }
   };

  useEffect(() => {
    setReservation(reservation);
  }, [reservation, history]);

  return (
    <>
      <ErrorAlert error={error} />
      <tr>
        <th scope="row"> {reservation.reservation_id} </th>
        <td> {reservation.first_name} </td>
        <td> {reservation.last_name} </td>
        <td> {reservation.people} </td>
        <td> {reservation.mobile_number} </td>
        <td> {reservation.reservation_date} </td>
        <td> {reservation.reservation_time} </td>
        <td data-reservation-id-status={reservation.reservation_id}>
          {" "}
          {reservation.status}{" "}
        </td>
        <td>
          {reservation.status === "booked" ? (
            <a href={`/reservations/${reservation.reservation_id}/seat`}>
              <button className="btn btn-primary"> Seat </button>
            </a>
          ) : (
            <></>
          )}
        </td>
        <td>
          {reservation.status === "booked" ? (
            <a href={`/reservations/${reservation.reservation_id}/edit`}>
              <button className="btn btn-primary "> Edit </button>
            </a>
          ) : (
            <></>
          )}
        </td>
        <td data-reservation-id-cancel={reservation.reservation_id}>
          {reservation.status === "booked" ? (
            <button className="btn btn-danger ml-2" onClick={handleCancelRes}>
              {" "}
              Cancel{" "}
            </button>
          ) : (
            <></>
          )}
        </td>
      </tr>
    </>
  );
}

export default ReservationDetail;
