# Security Policy

This document outlines the security practices, threat model, and
responsible disclosure process for this application.

---

## 🔐 Security Overview

This application follows a **defense-in-depth** security approach
covering authentication, authorization, data protection, AI safety,
logging hygiene, and abuse prevention.

Security is treated as a **continuous process**, not a one-time task.

---

## 🔑 Authentication & Authorization

### Authentication
- JWT-based authentication is enforced on all protected routes
- Tokens are validated for signature, expiration, and integrity
- Secrets and API keys are stored only in environment variables

### Authorization
- Role-based access control (RBAC) is implemented
- Object-level authorization checks are enforced to prevent IDOR attacks
- Sensitive resources require both role validation and relationship checks

Example:
- Doctors can only access patient data if an active relationship exists
  (appointment or prescription)

---

## 🛡️ Route Protection

- All sensitive routes are protected using authentication middleware
- Admin-only routes are explicitly restricted
- Public routes are limited, rate-limited, and carefully scoped
- Frontend checks are never relied upon for security

---

## 🤖 AI & LLM Security

AI-powered features follow **responsible AI security practices**:

- All AI endpoints require authentication
- Strict rate limiting is applied to prevent abuse and cost escalation
- User inputs are validated and sanitized before being sent to the LLM
- Defense-in-depth prompt hardening is implemented:
  - Input length limits
  - Structural sanitization
  - Malicious pattern rejection
- System prompts are never exposed to users

AI responses are treated as untrusted output and handled safely.

---

## 🚦 Rate Limiting & Abuse Prevention

- Global rate limiting is enabled for all API routes
- Stricter rate limits are applied to:
  - Authentication endpoints
  - OTP / verification flows
  - AI-powered endpoints
- Rate limiting considers both IP and user context where applicable

---

## 📄 Logging & Monitoring

### Logging Policy
- **Passwords, tokens, API keys, and secrets are NEVER logged**
- Sensitive keys are removed entirely before logs are written
- Logs contain only safe metadata (userId, event type, timestamps)
- Structured logging is used via an industry-standard logger

### Error Handling
- Centralized error handling ensures consistent responses
- Stack traces and internals are not exposed in production

---

## 🔍 Common Attack Mitigations

The application is designed to resist:
- SQL / NoSQL Injection
- IDOR (Insecure Direct Object References)
- XSS and input-based attacks
- Brute-force and credential stuffing
- Prompt injection and AI misuse
- Data scraping via unprotected endpoints

Security headers and best practices are applied consistently.

---

## 🧪 Security Testing & Review

- Security reviews are conducted during feature development
- Authorization logic is reviewed carefully for IDOR risks
- AI features receive additional abuse and misuse review
- Known risks are documented and monitored

---

## 🚨 Reporting Security Issues

If you discover a security vulnerability, please report it responsibly.

- Do NOT create public issues for security vulnerabilities
- Contact the maintainers privately with reproduction details

We appreciate responsible disclosure and take all reports seriously.

---

## 📌 Final Note

Security is an ongoing effort.
As the application evolves, this policy and its protections
will continue to be reviewed and improved.