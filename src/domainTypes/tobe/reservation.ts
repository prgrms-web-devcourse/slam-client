import { APICommon, OmitAt } from "./common";
import { APICourt } from "./court";

export interface APIReservation extends APICommon {
  numberOfReservations: number;
  startTime: string;
  endTime: string;
  court: OmitAt<APICourt>;
}
