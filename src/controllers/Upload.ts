import { Request, Response } from "express";

import {
  generateMeasureValue,
  generateTemporaryImageURL,
} from "../services/services";
import { extractBase64FromHeader, validateRequest } from "../utils/utils";
import { BadRequestError } from "../errors/errors";

export const upload = async (req: Request, res: Response) => {
  try {
    const measureData = validateRequest(req);

    const imagebase64Decoded = extractBase64FromHeader(measureData.image);

    const measure_value = await generateMeasureValue(imagebase64Decoded);

    const image_url = await generateTemporaryImageURL(imagebase64Decoded);
    console.log(image_url);

    res.send(measure_value).status(200);
  } catch (err) {
    if (err instanceof BadRequestError) {
      res.status(err.status_code).json(err);
    } else {
      console.log(err);
      res.status(500).json({ error: err });
    }
  }
};
