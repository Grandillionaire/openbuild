# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of OpenBuild seriously. If you have discovered a security vulnerability in our project, please report it to us as described below.

### Reporting Process

1. **DO NOT** open a public issue
2. Email your findings to security@openbuild.dev (or contact the maintainer directly)
3. Include the following in your report:
   - Description of the vulnerability
   - Steps to reproduce
   - Possible impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 1 week
- **Resolution Timeline**: Depends on severity
  - Critical: 1-7 days
  - High: 1-2 weeks
  - Medium: 2-4 weeks
  - Low: Next regular release

## Security Best Practices

### For Users

1. **API Keys**: Never commit API keys to the repository
   - Use environment variables
   - Add `.env` files to `.gitignore`
   - Rotate keys regularly

2. **Dependencies**: Keep dependencies updated
   ```bash
   npm audit
   npm audit fix
   ```

3. **Content Security**: Be cautious with user-generated content
   - Sanitize all inputs
   - Validate file uploads
   - Use CSP headers in production

### For Contributors

1. **Code Review**: All code must be reviewed before merging
2. **Dependencies**: Check new dependencies for vulnerabilities
3. **Sensitive Data**: Never log sensitive information
4. **Error Handling**: Don't expose system details in error messages

## Security Features

### Current Security Measures

- **Input Sanitization**: All user inputs are sanitized
- **XSS Protection**: Content is properly escaped
- **CSP Headers**: Recommended for production deployment
- **Dependency Scanning**: Regular vulnerability checks
- **Secure Communication**: HTTPS enforced in production

### Planned Improvements

- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Enhanced file upload validation
- [ ] Security headers middleware
- [ ] Audit logging

## Known Security Considerations

1. **Local Storage**: Project data is stored in browser local storage
   - Not encrypted
   - Accessible to browser extensions
   - Consider sensitive data implications

2. **External APIs**: When using external image APIs
   - API keys are exposed in network requests
   - Use server-side proxy for production

3. **Code Generation**: Generated code is not sandboxed
   - Review generated code before deployment
   - Don't trust user-provided custom code

## Deployment Security

### Recommended Headers

```javascript
// Example security headers for production
{
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()"
}
```

### Environment Variables

Required environment variables for secure deployment:
- `VITE_UNSPLASH_KEY`: Unsplash API key (optional)
- `VITE_PEXELS_KEY`: Pexels API key (optional)
- `VITE_VERCEL_TOKEN`: Vercel deployment token (optional)

## Attribution

Security policy maintained by **Grandillionaire (Maximillian Grand)** and the OpenBuild community.

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Vue.js Security](https://vuejs.org/guide/best-practices/security.html)