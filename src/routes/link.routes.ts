import { Router } from "express";
import {
  createLink,
  getLinks,
  getAnalytics,
  redirectToUrl,
} from "../controllers/link.controller";

const router = Router();

router.post("/api/links", createLink);
router.get("/api/links", getLinks);
router.get("/api/links/:id/analytics", getAnalytics);
router.get("/:code", redirectToUrl);

export default router;
