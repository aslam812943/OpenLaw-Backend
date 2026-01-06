import { Router } from "express";
import { BookingController } from "../../controllers/user/BookingController"
import { CreateBookingPaymentUseCase } from "../../../application/useCases/user/booking/CreateBookingPaymentUseCase";
import { StripeService } from "../../../infrastructure/services/StripeService";

import { BookingRepository } from "../../../infrastructure/repositories/user/BookingRepository";
import { AvailabilityRuleRepository } from "../../../infrastructure/repositories/lawyer/AvailabilityRuleRepository";
import { LawyerRepository } from "../../../infrastructure/repositories/lawyer/LawyerRepository";
import { PaymentRepository } from "../../../infrastructure/repositories/PaymentRepository";
import { ConfirmBookingUseCase } from "../../../application/useCases/user/booking/ConfirmBookingUseCase";
import { GetUserAppointmentsUseCase } from "../../../application/useCases/user/GetUserAppointmentsUseCase";
import { CancelAppointmentUseCase } from "../../../application/useCases/user/CancelAppointmentUseCase";
import { UserAuthMiddleware } from "../../middlewares/UserAuthMiddleware";
import { TokenService } from "../../../infrastructure/services/jwt/TokenService";
import { UserRepository } from "../../../infrastructure/repositories/user/UserRepository";
import { CheckUserStatusUseCase } from "../../../application/useCases/user/checkUserStatusUseCase";

const router = Router();

const stripeService = new StripeService();
const bookingRepository = new BookingRepository();
const availabilityRuleRepository = new AvailabilityRuleRepository();
const lawyerRepository = new LawyerRepository();
const paymentRepository = new PaymentRepository();

const createBookingPaymentUseCase = new CreateBookingPaymentUseCase(stripeService);
const confirmBookingUseCase = new ConfirmBookingUseCase(bookingRepository, stripeService, availabilityRuleRepository, lawyerRepository, paymentRepository);
const getUserAppointmentsUseCase = new GetUserAppointmentsUseCase(bookingRepository);
const cancelAppointmentUseCase = new CancelAppointmentUseCase(bookingRepository, availabilityRuleRepository, stripeService, lawyerRepository);

const bookingController = new BookingController(
    createBookingPaymentUseCase,
    confirmBookingUseCase,
    getUserAppointmentsUseCase,
    cancelAppointmentUseCase
);

const userRepository = new UserRepository();
const tokenService = new TokenService();
const checkUserStatusUseCase = new CheckUserStatusUseCase(userRepository);
const authMiddleware = new UserAuthMiddleware(checkUserStatusUseCase, tokenService);

router.post("/create-checkout-session", (req, res, next) => bookingController.initiatePayment(req, res, next));
router.post("/confirm", (req, res, next) => bookingController.confirmBooking(req, res, next));
router.get("/appointments", (req, res, next) => authMiddleware.execute(req, res, next), (req, res, next) => bookingController.getAppointments(req, res, next));
router.patch("/appointments/:id/cancel", (req, res, next) => authMiddleware.execute(req, res, next), (req, res, next) => bookingController.cancelAppointment(req, res, next));

export default router;



