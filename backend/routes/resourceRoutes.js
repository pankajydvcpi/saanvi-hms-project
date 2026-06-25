import express from "express";

const resourceRoutes = (Model) => {
  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      const data = await Model.find().sort({ createdAt: -1 });
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch data" });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const item = await Model.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: "Failed to create data", error });
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });

      res.json(item);
    } catch (error) {
      res.status(400).json({ message: "Failed to update data" });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      await Model.findByIdAndDelete(req.params.id);
      res.json({ message: "Deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Failed to delete data" });
    }
  });

  return router;
};

export default resourceRoutes;