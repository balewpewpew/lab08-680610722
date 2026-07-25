import { Router, type Request, type Response } from "express";
import {
  zStudentPostBody,
  zStudentPutBody,
  zStudentId,
  zCourseId,
} from "../libs/zodValidators.js";

import type { Student, Course, Enrollment } from "../libs/types.js";

// import database
import { students, courses, enrollments } from "../db/db.js";

const router = Router();

// GET /api/v1/enrollments
router.get("/enrollments", (req: Request, res: Response) => {
  try {
    const courseId = req.query.courseId;
    const result = zCourseId.safeParse(courseId);
    const studentId = req.query.studentId;
    const result2 = zStudentId.safeParse(studentId);

    if (result.success && result2.success) {
      return res.status(400).json({
        ok: false,
        message: "Please provide either studentId or courseId and not both!",
      });
    } else if (result.success) {
      const targetCourseId = Number(result.data);
      const matchedEnrollments = enrollments.filter(
        (e) => e.courseId === targetCourseId
      );
      const studentIdList = matchedEnrollments.map((e) => e.studentId);
      const foundStudents = students
        .filter((std) => studentIdList.includes(String(std.studentId)))
        .map((std) => ({
          studentId: std.studentId,
          firstName: std.firstName,
          lastName: std.lastName,
          program: std.program,
        }));

      return res.status(200).json({
        ok: true,
        students: foundStudents,
      });
    } else if (result2.success){
        const targetStudentId = result2.data;
      const matchedEnrollments = enrollments.filter(
        (e) => e.studentId === targetStudentId
      );
      const courseIdList = matchedEnrollments.map((e) => e.courseId);

      const foundCourses = courses
        .filter((c) => courseIdList.includes(c.courseId))
        .map((c) => ({
          courseId: String(c.courseId),
          title: c.courseTitle,
        }));

      return res.status(200).json({
        ok: true,
        courses: foundCourses,
      });
    } else {
      return res.status(200).json({
        ok: false,
        message: "Please provide either studentId or courseId and not both!",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }
});

export default router;
