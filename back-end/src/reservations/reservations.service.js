const knex = require("../db/connection");

const create = (newReservation) =>
  knex("reservations").insert(newReservation).returning("*");

const list = (reservationDate) =>
  knex("reservations")
    .select("*")
    .where({ reservation_date: reservationDate })
    .orderBy("reservation_time");


module.exports = {
  create,
  list,
};