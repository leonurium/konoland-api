import { randomUUID } from 'crypto';

export interface ResponseData {
  data_header: {
    status: string;
    message: string;
    time_stamp: string;
    trace_code: string;
  };
  data_body: any;
}

export function generateResponse(
  message: string,
  dataBody: any,
  status: number,
): ResponseData {
  const currentTimeStamp: string = new Date().toISOString();
  const traceCode: string = randomUUID();

  const ok = status === 200 ? 'OK' : 'FAILED';

  const responseData: ResponseData = {
    data_header: {
      status: ok,
      message: message,
      time_stamp: currentTimeStamp,
      trace_code: traceCode,
    },
    data_body: dataBody,
  };

  return responseData;
}

