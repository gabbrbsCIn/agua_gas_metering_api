import { Request, Response } from "express";

import {
  createCustomer,
  createMeasure,
  generateMeasureValue,
  generateTemporaryImageURL,
} from "../services/services";
import { extractBase64FromHeader, validateRequest } from "../utils/utils";
import { BadRequestError, ConflictError } from "../errors/errors";

export const upload = async (req: Request, res: Response) => {
  try {
    const measureData = validateRequest(req);

    const imagebase64Decoded = extractBase64FromHeader(measureData.image);

    const measure_value = await generateMeasureValue(imagebase64Decoded);

    
    createCustomer(measureData.customer_code);
    
    const image_url = await generateTemporaryImageURL(imagebase64Decoded);

    const measure = await createMeasure({
      measure_datetime: measureData.measure_datetime,
      has_confirmed: false,
      image_url: image_url,
      customer_code: measureData.customer_code,
      measure_value: measure_value,
      measure_type: measureData.measure_type,
    });

    res.send(measure).status(200);
  } catch (err) {
    if (err instanceof BadRequestError || err instanceof ConflictError) {
      res.status(err.status_code).json(err);
    } else {
      console.log(err);
      res.status(500).json({ error: err });
    }
  }
};
