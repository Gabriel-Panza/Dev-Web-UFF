export interface ErrorResponse {
  localDateTime: string;
  errorCode: number;
  error: string;
  metodo: string;
  requestUri: string;
  map: Record<string, string> | null;
  message: string;
}
