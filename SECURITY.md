# Security Policy

## Supported Versions

We actively maintain security updates for the following versions of the Todo-App project:

| Version | Supported          |
| ------- | ------------------ |
| Backend 1.x.x | :white_check_mark: |
| Frontend 0.x.x | :white_check_mark: |
| Older versions | :x:                |

Please ensure you are using the latest supported versions to receive security patches and updates.

## Reporting a Vulnerability

If you discover a security vulnerability in Todo-App, please report it responsibly by following these guidelines:

- Send an email to the security team at [security@todo-app.example.com] (replace with actual email) with detailed information about the vulnerability.
- Include steps to reproduce, impact assessment, and any relevant logs or screenshots.
- We will acknowledge your report within 48 hours and keep you updated on the progress.
- Once the vulnerability is verified, we will work on a fix and notify you when a patch or update is available.
- If the vulnerability is not accepted or is out of scope, we will explain the reasons clearly.

## Security Practices

- Passwords are securely hashed using bcrypt/bcryptjs in the backend.
- Cross-Origin Resource Sharing (CORS) is configured to restrict access appropriately.
- Environment variables are managed securely using dotenv.
- Dependencies are regularly audited for vulnerabilities.
- Frontend uses React with best practices to prevent XSS and other common attacks.
- We encourage users to keep their dependencies up to date and report any suspicious activity.

## Disclaimer

While we strive to maintain a secure application, no software can be guaranteed to be completely secure. Users are encouraged to follow best security practices on their end as well.
