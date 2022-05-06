export interface RoomBooked {
    bookingId: string;
    roomId: string;
    guestId: string;
    checkIn: Date;
    checkOut: Date;
    price: number;
}

export interface PaymentRegistered {
    bookingId: string;
    paymentId: string;
    amount: number;
    outstandingAmount: number;
}
