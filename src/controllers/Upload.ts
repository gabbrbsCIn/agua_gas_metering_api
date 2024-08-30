import { Request, Response } from "express";

import {
  checkMeasureInCurrentMonth,
  createCustomer,
  createMeasure,
  generateMeasureValue,
  generateTemporaryImageURL,
} from "../services/services";
import { extractBase64FromHeader, validateUpdateRequest } from "../utils/utils";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../errors/errors";

export const upload = async (req: Request, res: Response) => {
  try {
    const measureData = validateUpdateRequest(req);

    const imagebase64Decoded = extractBase64FromHeader(measureData.image);

    await createCustomer(measureData.customer_code);
    await checkMeasureInCurrentMonth(
      measureData.measure_datetime,
      measureData.customer_code,
      measureData.measure_type
    );

    const measure_value = await generateMeasureValue(imagebase64Decoded);

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
    if (
      err instanceof BadRequestError ||
      err instanceof ConflictError ||
      err instanceof NotFoundError
    ) {
      res.status(err.status_code).json(err);
    } else {
      console.log(err);
      res.status(500).send({ error: err });
    }
  }
};
