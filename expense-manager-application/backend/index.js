const express = require("express");
const connect = require("./connection/db");
const app = express();
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoute");
const expenseRoutes = require("./routes/expenseRoute");
const checkAuth = require("./middleware/checkAuth");
const { z } = require("zod");
const userModel = require("./model/user");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/api", userRoutes);
app.use("/api/expense", checkAuth, expenseRoutes);
const port = process.env.PORT || 5001;
const postValidation = z.object({
  caption: z.string().max(2200).optional(),
  images: z.array(z.string().url()).min(1).max(2),
  visibility: z.enum(["public", "followers", "private"]),
  location: z.string().max(100).optional(),
  tags: z.array(z.string().min(1).max(30)).optional(),
});
const videoValidation = z
  .object({
    title: z.string().min(5).max(100),
    description: z.string().max(5000).optional(),
    category: z.enum([
      "education",
      "gaming",
      "music",
      "entertainment",
      "technology",
    ]),
    visibility: z.enum(["public", "followers", "private"]),
    tags: z.array(z.string().min(2).max(30)).max(15).optional(),
    ageRestriction: z.boolean().default(false),
  })
  .strict();
const netflixValidation = z
  .object({
    language: z.enum(["en", "hi", "es", "fr", "de", "ja"]).optional(),
    quality: z.enum(["auto", "low", "medium", "high"]).optional(),
    autoplay: z.boolean().optional(),
    subtitle: z.boolean().optional(),
    maturityLevel: z.enum(["kids", "teen", "adult"]).optional(),
  })
  .strict()
  .refine((preferences) => Object.keys(preferences).length > 0, {
    messgae: "Atleast one key should be present",
  });
app.patch("/api/users/preferences", checkAuth, async (req, res) => {
  const result = netflixValidation.safeParse(req.body);
  if (!result.success) {
    return res.status(422).json({
      message: "Invalid preferences",
      errors: result.error.issues,
    });
  } else {
    return res.status(200).json({
      message: "Preferences updated",
      data: result.data,
    });
  }
});

app.post("/api/posts", (req, res) => {
  const { caption, images, visibility, location, tags } = req.body;
  const result = postValidation.safeParse({
    caption,
    images,
    visibility,
    location,
    tags,
  });

  if (result.success) {
    res.status(201).json({
      message: "Success",
      data: result.data,
    });
  } else {
    res.status(422).json({
      message: "Error",
      errors: result.error.issues,
    });
  }
});

connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("ERROR connecting to db:", err.message);
    process.exitCode = 1;
  });
