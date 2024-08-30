import { Request, Response } from "express";
import { validateConfirmRequest } from "../utils/utils";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../errors/errors";
import {
  checkMeasureUuid,
  checkValueHasConfirmedByUuid,
  updateMeasureValue,
} from "../services/services";

export const confirm = async (req: Request, res: Response) => {
  try {
    const measureData = validateConfirmRequest(req);
    const measureUuid = await checkMeasureUuid(measureData.measure_uuid);

    await checkValueHasConfirmedByUuid(measureUuid);

    await updateMeasureValue(measureData.confirmed_value, measureUuid);

    res.send({ sucess: true }).status(200);
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
