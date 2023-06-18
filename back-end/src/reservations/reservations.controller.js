const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// MIDDLEWARE //

async function reservationExists(request, response, next) {
  const { reservation_id } = request.params;

  let reservation = await service.read(reservation_id);

  const error = {
    status: 404,
    message: `Reservation ${reservation_id} cannot be found.`,
  };

  if (reservation) {
    response.locals.reservation = reservation;
    return next();
  }

  next(error);
}

async function validateReservation(request, response, next) {
  if (!request.body.data)
    return next({ status: 400, message: "Data Missing!" });
  const {
    first_name,
    last_name,
    mobile_number,
    people,
    reservation_date,
    reservation_time,
    status,
  } = request.body.data;
  let updatedStatus = status;
  if (
    !first_name ||
    !last_name ||
    !mobile_number ||
    !people ||
    !reservation_date ||
    !reservation_time
  )
    return next({
      status: 400,
      message:
        "Please complete the following: first_name, last_name, mobile_number, people, reservation_date, and reservation_time.",
    });
  if (!reservation_date.match(/\d{4}-\d{2}-\d{2}/))
    return next({ status: 400, message: "reservation_date is invalid!" });
  if (!reservation_time.match(/\d{2}:\d{2}/))
    return next({ status: 400, message: "reservation_time is invalid!" });
  if (typeof people !== "number")
    return next({ status: 400, message: "people is not a number!" });
  if (!status) updatedStatus = "booked";
  if (status === "seated")
    return next({ status: 400, message: "reservation is already seated" });
  if (status === "finished")
    return next({ status: 400, message: "reservation is already finished" });
  response.locals.newReservation = {
    first_name,
    last_name,
    mobile_number,
    people,
    reservation_date,
    reservation_time,
    status: updatedStatus,
  };
  next();
}

// END MIDDLEWARE //

// Create
async function create(_, response) {
  const data = await service.create(response.locals.newReservation);
  response.status(201).json({
    data: data[0],
  });
}

// List
async function list(request, response) {
  const { date, mobile_number } = request.query;
  let results = null;

  !date
    ? (results = await service.search(mobile_number))
    : (results = await service.list(date));

  results = results.filter((result) => {
    return result.status !== 'finished';
  });

  response.json({ data: results });
}

module.exports = {
  create: [
    asyncErrorBoundary(validateReservation),
    asyncErrorBoundary(isValidDateTime),
    asyncErrorBoundary(create),
  ],
  list: [asyncErrorBoundary(list)],
};