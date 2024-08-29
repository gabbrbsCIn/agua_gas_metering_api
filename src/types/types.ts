type InlineData = {
  data: string;
  mimeType: string;
};

type Base64Decoded = {
  inlineData: InlineData;
};
interface MeasureData {
    image: string;
    customer_code: string;
    measure_datetime: string;
    measure_type: string;
  }

export { Base64Decoded, InlineData, MeasureData };
