import { Publisher, Subjects, TicketUpdatedEvent } from "@osticketing/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated  = Subjects.TicketUpdated;
}
  