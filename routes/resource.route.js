import express from "express";
import Resource from "../models/resource.model.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import { validateResource } from "../middleware/validation.middleware.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  roleMiddleware(["admin"]),
  validateResource,
  async (req, res) => {
    const { title, description } = req.body;
    const newResource = new Resource({
      title,
      description,
      createdBy: req.user.id,
    });
    await newResource.save();
    res.status(201).json(newResource);
  }
);

router.get("/all", authMiddleware, async (req, res) => {
  const resources = await Resource.find();
  res.json(resources);
});

router.get("/byId/:id", authMiddleware, async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  res.json(resource);
});

router.put(
  "/update/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  async (req, res) => {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(resource);
  }
);

router.delete(
  "/delete/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  async (req, res) => {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: "Resource deleted" });
  }
);

export default router;
