# Client email about an incident

Maintainer notes (not shown to the agent or reviewer): expect the 09:12 to 09:47 UTC window, the cause (an expired TLS certificate on the `api` load balancer), the fact that the permanent fix is not yet in place, and the Thursday review date kept; no apology boilerplate and no promise that it will never happen again; an honest statement that the monitoring gap is not yet fixed.

> Rewrite this email to a client contact so it reads like a person wrote it. Keep it professional. The sender is the engineering lead.
>
> Subject: Update on yesterday's service interruption
>
> Dear Ms. Alvarez,
>
> I hope this message finds you well. I am writing to provide a comprehensive update regarding the service interruption that occurred yesterday. Please be assured that we take the reliability of our platform extremely seriously, and we sincerely apologize for any inconvenience this may have caused your team.
>
> Our investigation revealed that the interruption, which lasted from 09:12 to 09:47 UTC, was caused by an expired TLS certificate on the `api` load balancer. We have renewed the certificate and service is fully restored. We have not yet added an alert for certificate expiry, so the same thing could happen again before we do. We will review the alerting plan on Thursday and send you the outcome.
>
> Please do not hesitate to reach out should you have any questions or concerns. We remain committed to delivering an exceptional experience.
>
> Best regards,
> Daniel
