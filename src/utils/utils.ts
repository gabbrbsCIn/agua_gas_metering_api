import { Request } from "express";
import { BadRequestError } from "../errors/errors";
import { Base64Decoded, MeasureData } from "../types/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const validateBase64Format = (base64Image: string) => {
  let base64Regex = /[A-Za-z0-9+/]+={0,2}$/;

  if (base64Image.startsWith("data:")) {
    base64Regex =
      /^data:image\/(png|jpg|jpeg|gif);base64,[A-Za-z0-9+/]+={0,2}$/;
  }
  if (!base64Regex.test(base64Image)) {
    throw new BadRequestError(
      "INVALID_DATA",
      "Formato da imagem base64 inválido ou não fornecido"
    );
  }
  return true;
};

// {
//     "customer_code": "string",
//     "measure_datetime": "datetime",
//     "measure_type": "WATER",
//     "image": "base64"
// }

export const isReqBodyEmpty = (measureData: MeasureData): boolean => {
  if (
    !measureData.image ||
    !measureData.customer_code ||
    !measureData.measure_datetime ||
    !measureData.measure_type
  ) {
    throw new BadRequestError("INVALID_DATA", "Há campos vazios na requisição");
  }
  return false;
};

export const validateMeasure_Datetime = (measure_datetime: string): boolean => {
  let dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

  if (dateTimeRegex.test(measure_datetime)) {
    return true;
  }
  dateTimeRegex = /^\d{4}-\d{2}-\d{2}/;
  if (!dateTimeRegex.test(measure_datetime)) {
    throw new BadRequestError("INVALID_DATA", "Measure_Datetime é inválido");
  }
  return true;
};
export const validateMeasure_Type = (measure_type: string): boolean => {
  const validMeasureTypes = ["water", "gas"];
  const isMeasureTypesValid = validMeasureTypes.includes(
    measure_type.toLowerCase()
  );
  if (!isMeasureTypesValid) {
    throw new BadRequestError("INVALID_DATA", "Measure_Type é inválido");
  }
  return true;
};

export const validateRequest = (req: Request): MeasureData => {
  const { image, customer_code, measure_datetime, measure_type } = req.body;

  const measureData = { image, customer_code, measure_datetime, measure_type };

  isReqBodyEmpty(measureData);
  validateMeasure_Datetime(measure_datetime);
  validateMeasure_Type(measure_type);
  validateBase64Format(image);

  return measureData;
};

export const extractBase64FromHeader = (base64Image: string): Base64Decoded => {
  if (!base64Image.startsWith("data:")) {
    return {
      inlineData: {
        data: base64Image,
        mimeType: "image/jpeg",
      },
    };
  } else {
    const [header, base64] = base64Image.split(",");
    let extractedMimeType = header.match(/data:(.*?);base64/)?.[1];
    if (!extractedMimeType) {
      extractedMimeType = "image/jpeg";
    }

    return {
      inlineData: {
        data: base64,
        mimeType: extractedMimeType,
      },
    };
  }
};
