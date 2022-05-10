import {Projector} from "./common";
import {execute} from "./sqlProjectors";
import {PaymentRegistered, RoomBooked} from "./eventTypes";

export const sqlProjections: Projector = [
    execute<RoomBooked>(
        "V1.RoomBooked",
        event => `INSERT INTO Bookings (BookingId, RoomId, GuestId) 
VALUES ('${event.bookingId}', '${event.roomId}', '${event.guestId}')`
    ),
    execute<PaymentRegistered>(
        "V1.PaymentRegistered",
        event => `UPDATE Bookings 
SET OutstandingAmount = ${event.amount} 
WHERE BookingId = '${event.bookingId}'`
    )
];
