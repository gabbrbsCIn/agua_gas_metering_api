import { Request, Response } from "express";
import { validateListRequest } from "../utils/utils";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../errors/errors";
import { getAllMeasuresByCustomerCode } from "../services/services";

export const list = async (req: Request, res: Response) => {
  try {
    const data = await validateListRequest(req);

    if (data.measureType) {
      const measures = await getAllMeasuresByCustomerCode(
        data.customerCode,
        String(data.measureType).toUpperCase()
      );
      res.send(measures).status(200)
    } else {
      const measures = await getAllMeasuresByCustomerCode(
        data.customerCode,
        ""
      );
      res.send(measures).status(200)
    }
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
