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

interface MeasureDataBaseInsert {
  measure_datetime: string;
  measure_type: string;
  has_confirmed: boolean;
  image_url: string;
  measure_value: number;
  customer_code: string;
}

export { Base64Decoded, InlineData, MeasureData, MeasureDataBaseInsert };
