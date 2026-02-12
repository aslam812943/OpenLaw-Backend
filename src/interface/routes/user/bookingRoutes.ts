import { Router } from "express";
import { bookingController, authMiddleware } from "../../../di/userContainer";

const router = Router();

router.post("/create-checkout-session", (req, res, next) => bookingController.initiatePayment(req, res, next));
router.post("/confirm", (req, res, next) => bookingController.confirmBooking(req, res, next));
router.get("/appointments", (req, res, next) => authMiddleware.execute(req, res, next), (req, res, next) => bookingController.getAppointments(req, res, next));
router.get("/appointments/:id", (req, res, next) => authMiddleware.execute(req, res, next), (req, res, next) => bookingController.getBookingDetails(req, res, next));
router.patch("/appointments/:id/cancel", (req, res, next) => authMiddleware.execute(req, res, next), (req, res, next) => bookingController.cancelAppointment(req, res, next));

export default router;



