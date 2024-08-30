type InlineData = {
  data: string;
  mimeType: string;
};

type Base64Decoded = {
  inlineData: InlineData;
};
interface UploadRequestData {
  image: string;
  customer_code: string;
  measure_datetime: string;
  measure_type: string;
}

interface MeasureDataBaseInsert {
  measure_datetime: string;
  measure_type: string;
  has_confirmed: boolean;
  image_url: string;
  measure_value: number;
  customer_code: string;
}

interface ConfirmRequestData {
  measure_uuid: string;
  confirmed_value: number;
}

export {
  Base64Decoded,
  InlineData,
  UploadRequestData,
  MeasureDataBaseInsert,
  ConfirmRequestData,
};
