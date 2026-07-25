import { Router, type Request, type Response } from "express";
import {
  zEnrollmentBody
} from "../libs/zodValidators.js";

import type { Student } from "../libs/types.js";

import notFoundMiddleware from "../middlewares/notFoundMiddleware.js";

// import database
import { readDataFile, writeDataFile } from "../db/db_transactions.js";

const router = Router();


// DELETE /api/v2/enrollments
router.delete("/enrollments", async (req: Request, res: Response) => {
  try {
    const parseResult = zEnrollmentBody.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        ok: false,
        message: "Validation failed",
        errors: parseResult.error.issues[0]?.message,
      });
    }

    const enrollments = await readDataFile();
    const { studentId, courseId } = parseResult.data;
    const targetCourseId = Number(courseId);

    const foundIndex = enrollments.findIndex(
      (e) => e.studentId === studentId && e.courseId === (targetCourseId)
    );

    if (foundIndex === -1) {
      return res.status(404).json({
        ok: false,
        message: "Enrollment does not exist",
      });
    }

    enrollments.splice(foundIndex, 1);

    return res.status(200).json({
      ok: true,
      message: "Enrollment has been deleted",
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }
});

export default router;
