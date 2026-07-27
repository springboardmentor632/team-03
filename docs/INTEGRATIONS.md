# External integrations

PolicyGPT is MERN. Provider adapters are intentionally disabled until deployment secrets are supplied through the hosting platform. Configure SMTP for reset/notification emails, Twilio for SMS, and an S3-compatible bucket for approved document storage. Never put credentials in source, Docker Compose, browser variables, or logs. OAuth/SSO must be implemented against the organisation's approved identity provider and redirect URIs; it is not safe to fabricate one without those details.
