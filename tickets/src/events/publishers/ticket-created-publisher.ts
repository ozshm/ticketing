import { Publisher, Subjects, TicketCreatedEvent } from "@osticketing/common";

export class TicketCreatedPublsher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated  = Subjects.TicketCreated;
}
  