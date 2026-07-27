/** Provider boundary: enable only with organisation-managed credentials. */
const configured = (keys) => keys.every((key) => Boolean(process.env[key]));
const requireProvider = (name, keys) => { if (!configured(keys)) throw new Error(`${name} is not configured`); };
const email = async ({ to, subject, text }) => { requireProvider('SMTP', ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM']); return { accepted: [to], subject, text }; };
const sms = async ({ to, body }) => { requireProvider('SMS provider', ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_FROM']); return { accepted: [to], body }; };
const objectStorage = { enabled: () => configured(['S3_BUCKET', 'S3_REGION']), assert: () => requireProvider('Object storage', ['S3_BUCKET', 'S3_REGION']) };
module.exports = { email, sms, objectStorage, configured };
