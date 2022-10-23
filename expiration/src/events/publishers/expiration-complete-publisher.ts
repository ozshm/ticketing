import { Subjects, Publisher, ExpirationCompleteEvent } from "@osticketing/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}