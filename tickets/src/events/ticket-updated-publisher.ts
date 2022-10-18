import { Publisher, Subjects, TicketUpdatedEvent } from "@osticketing/common";

export class TicketUpdatedPublsher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated  = Subjects.TicketUpdated;
}
  