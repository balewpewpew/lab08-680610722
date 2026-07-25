import express, { type Request, type Response } from "express";

// import middlewares
import morgan from "morgan";
import invalidJsonMiddleware from "./middlewares/invalidJsonMiddleware.js";
import notFoundMiddleware from "./middlewares/notFoundMiddleware.js";

// import routes
import enrollmentRouter_v1 from "./routes/enrollmentsRouters_v1.js";
import enrollmentRouter_v2 from "./routes/enrollmentsRouters_v2.js";

const app = express();
const port = 3000;

// body parser middleware
app.use(express.json());

// logger middleware
app.use(morgan("dev"));
// app.use(morgan("combined"));

// JSON parser middleware
app.use(invalidJsonMiddleware);

// Endpoints
app.get("/", (req: Request, res: Response) => {
  res.send("Lab08 API services");
});

app.get("/api/me", (req: Request, res: Response) => {
  res.status(200).json({
    ok: true,
    fullname: "Supapit Chaitan",
    studentId: "680610722"
  });
});

app.use("/api/v1", enrollmentRouter_v1);
app.use("/api/v2", enrollmentRouter_v2);

// endpoint check middleware
app.use(notFoundMiddleware);

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

// Export app for vercel deployment
export default app;
