import { Request, Response, NextFunction } from "express";
import Link from "../models/Link";
import Click from "../models/Click";
import { generateShortCode } from "../services/shortCode.service";
import { isValidUrl } from "../utils/validateUrl";
import { AppError } from "../middleware/error.middleware";

const getBaseUrl = (): string => {
  return process.env.BASE_URL || "http://localhost:5000";
};

export const createLink = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { originalUrl } = req.body;

    if (!isValidUrl(originalUrl)) {
      res.status(400).json({ success: false, message: "Invalid URL" });
      return;
    }

    const shortCode = await generateShortCode();

    const link = await Link.create({ originalUrl, shortCode });

    res.status(201).json({
      success: true,
      data: {
        id: link._id,
        originalUrl: link.originalUrl,
        shortCode: link.shortCode,
        shortUrl: `${getBaseUrl()}/${link.shortCode}`,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getLinks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const links = await Link.find().sort({ createdAt: -1 });

    const data = await Promise.all(
      links.map(async (link) => {
        const clicks = await Click.countDocuments({ linkId: link._id });
        return {
          id: link._id,
          originalUrl: link.originalUrl,
          shortCode: link.shortCode,
          clicks,
        };
      })
    );

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const link = await Link.findById(id);
    if (!link) {
      throw new AppError("Link not found", 404);
    }

    const clicks = await Click.find({ linkId: link._id });

    const totalClicks = clicks.length;

    const clicksByDate: Record<string, number> = {};
    const referrerCounts: Record<string, number> = {};

    clicks.forEach((click) => {
      const date = click.timestamp.toISOString().split("T")[0];
      clicksByDate[date] = (clicksByDate[date] || 0) + 1;

      const referrer = click.referrer || "Direct";
      referrerCounts[referrer] = (referrerCounts[referrer] || 0) + 1;
    });

    const clicksPerDay = Object.entries(clicksByDate)
      .map(([date, count]) => ({ date, clicks: count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const topReferrers = Object.entries(referrerCounts)
      .map(([referrer, count]) => ({ referrer, clicks: count }))
      .sort((a, b) => b.clicks - a.clicks);

    res.status(200).json({
      success: true,
      data: {
        totalClicks,
        clicksPerDay,
        topReferrers,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const redirectToUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { code } = req.params;

    const link = await Link.findOne({ shortCode: code });

    if (!link) {
      res.status(404).json({ success: false, message: "Link not found" });
      return;
    }

    await Click.create({
      linkId: link._id,
      timestamp: new Date(),
      referrer: req.get("referrer") || req.get("referer") || "",
      userAgent: req.get("user-agent") || "",
    });

    res.redirect(302, link.originalUrl);
  } catch (err) {
    next(err);
  }
};
