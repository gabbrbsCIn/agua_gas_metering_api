import { Request } from "express";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../errors/errors";
import {
  Base64Decoded,
  ConfirmRequestData,
  UploadRequestData,
} from "../types/types";
import { checkCustomerCode } from "../services/services";


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

export const isUploadReqBodyEmpty = (
  measureData: UploadRequestData
): boolean => {
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
export const validateMeasureType = (measure_type: string): boolean => {
  const validMeasureTypes = ["water", "gas"];
  const isMeasureTypesValid = validMeasureTypes.includes(
    measure_type.toLowerCase()
  );

  if (!isMeasureTypesValid) {
    throw new BadRequestError("INVALID_TYPE", "Tipo de medição não permitida");
  }
  return true;
};

export const validateUploadRequest = (req: Request): UploadRequestData => {
  const { image, customer_code, measure_datetime, measure_type } = req.body;

  const measureData = { image, customer_code, measure_datetime, measure_type };

  isUploadReqBodyEmpty(measureData);
  validateMeasure_Datetime(measure_datetime);
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

export const isConfirmReqBodyEmpty = (
  measureData: ConfirmRequestData
): boolean => {
  if (!measureData.measure_uuid || !measureData.confirmed_value) {
    throw new BadRequestError("INVALID_DATA", "Measure_Type é inválido");
  }
  return false;
};

export const validateConfirmRequest = (req: Request) => {
  const { measure_uuid, confirmed_value } = req.body;
  const measureData = { measure_uuid, confirmed_value };
  isConfirmReqBodyEmpty(measureData);
  return measureData;
};

export const validateListRequest = async (req: Request) => {
  let measureType = req.query.measure_type;
  const customerCode = req.params.customer_code;


  if (measureType) {
    validateMeasureType(String(measureType));
    await checkCustomerCode(customerCode);
  }
  const data = { customerCode, measureType };
  return data;
};
