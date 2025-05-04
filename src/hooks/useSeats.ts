import { SeatsioClient, Region } from "seatsio";
const seatsClient = new SeatsioClient(
  Region.NA(),
  process.env.SEATS_IO_SECRET_KEY
);

export const useSeats = () => {
  const validateReserveSeats = async (eventKey, seatsToBook) => {
    try {
      const eventData = await seatsClient.events.retrieveObjectInfos(
        eventKey,
        seatsToBook
      );
      const unavailableSeats = seatsToBook.filter(
        (seat) =>
          eventData[seat]?.status === "reserved" ||
          eventData[seat]?.status === "booked"
      );

      if (unavailableSeats.length > 0) {
        return {
          message: `Some of the seats are already reserved or booked. [${unavailableSeats.join(", ")}]`,
          status: false,
        };
      }

      return { status: true };
    } catch (error) {
      return { message: "Seats not available", status: false };
    }
  };

  const bookSeats = async (eventKey, seatsToBook) => {
    try {
      const booking = await seatsClient.events.book(eventKey, seatsToBook);
      return { success: true, booking };
    } catch (error) {
      return { success: false, message: "Failed to book seats" };
    }
  };

  return { validateReserveSeats, bookSeats };
};
