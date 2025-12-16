"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRepository = void 0;
const Booking_1 = require("../../../domain/entities/Booking");
const BookingModel_1 = require("../../db/models/BookingModel");
const InternalServerError_1 = require("../../errors/InternalServerError");
class BookingRepository {
    // create() - Creates a new booking.
    async create(booking) {
        try {
            const { id, ...bookingData } = booking;
            const newBooking = new BookingModel_1.BookingModel(bookingData);
            const savedBooking = await newBooking.save();
            return new Booking_1.Booking(savedBooking.id, savedBooking.userId, savedBooking.lawyerId, savedBooking.date, savedBooking.startTime, savedBooking.endTime, savedBooking.consultationFee, savedBooking.status, savedBooking.paymentStatus, savedBooking.paymentId, savedBooking.stripeSessionId, savedBooking.description);
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError("Database error while creating booking.");
        }
    }
    // findById() - Finds a booking by its ID.
    async findById(id) {
        try {
            const booking = await BookingModel_1.BookingModel.findById(id);
            if (!booking)
                return null;
            return new Booking_1.Booking(booking.id, booking.userId, booking.lawyerId, booking.date, booking.startTime, booking.endTime, booking.consultationFee, booking.status, booking.paymentStatus, booking.paymentId, booking.stripeSessionId, booking.description);
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError("Database error while fetching booking by ID.");
        }
    }
    // updateStatus() - Updates the status of a booking.
    async updateStatus(id, status, reason) {
        try {
            const updateData = { status };
            if (reason) {
                updateData.cancellationReason = reason;
            }
            await BookingModel_1.BookingModel.findByIdAndUpdate(id, updateData);
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError("Database error while updating booking status.");
        }
    }
    // findByUserId() - Finds all bookings for a specific user.
    async findByUserId(userId) {
        try {
            const bookings = await BookingModel_1.BookingModel.find({ userId })
                .populate('lawyerId', 'name')
                .sort({ createdAt: -1 });
            return bookings.map(booking => new Booking_1.Booking(booking.id, booking.userId, booking.lawyerId, booking.date, booking.startTime, booking.endTime, booking.consultationFee, booking.status, booking.paymentStatus, booking.paymentId, booking.stripeSessionId, booking.description, undefined, booking.cancellationReason, booking.lawyerId?.name));
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError("Database error while fetching user bookings.");
        }
    }
}
exports.BookingRepository = BookingRepository;
//# sourceMappingURL=BookingRepository.js.map