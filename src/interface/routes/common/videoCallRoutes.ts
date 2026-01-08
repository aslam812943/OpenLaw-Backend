import { Router } from "express";
import { VideoCallController } from "../../controllers/common/videoCall/VideoCallController";
import { CanJoinCallUseCase } from "../../../application/useCases/common/videoCall/CanJoinCallUseCase";
import { JoinCallUseCase } from "../../../application/useCases/common/videoCall/JoinCallUseCase";
import { BookingRepository } from "../../../infrastructure/repositories/user/BookingRepository";
import { commonAuthMiddleware } from "../../middlewares/CommonAuthMiddleware";

const router = Router();

const bookingRepository = new BookingRepository();
const canJoinCallUseCase = new CanJoinCallUseCase(bookingRepository);
const joinCallUseCase = new JoinCallUseCase(bookingRepository);

const videoCallController = new VideoCallController(
    canJoinCallUseCase,
    joinCallUseCase
);

router.get("/:bookingId/can-join", commonAuthMiddleware, (req, res, next) => videoCallController.canJoinCall(req, res, next));
router.post("/:bookingId/join", commonAuthMiddleware, (req, res, next) => videoCallController.joinCall(req, res, next));

export default router;
