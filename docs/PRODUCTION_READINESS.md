# Production baseline

This project is MERN only: React/Vite client, Express/Mongoose API, MongoDB. Supply secrets via the deployment platform, use HTTPS, rotate JWT secrets, configure an email provider for password reset, and restrict privileged role provisioning to a verified admin workflow. Third-party services (object storage, SMTP, SMS, OAuth, FCM) are intentionally configuration-driven and must be enabled with the organisation's credentials; no credentials are committed.
