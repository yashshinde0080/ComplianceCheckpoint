from typing import Tuple
from datetime import datetime

POLICY_TEMPLATES = {
    "information_security": {
        "title": "Information Security Policy",
        "content": """# Information Security Policy

## 1. Purpose

This policy establishes the framework for protecting {company_name}'s information assets and ensuring the confidentiality, integrity, and availability of data.

## 2. Scope

This policy applies to all employees, contractors, and third parties who access {company_name}'s information systems and data.

## 3. Policy Statements

### 3.1 Data Classification

All data shall be classified according to the following levels:
- **Confidential**: Sensitive business data requiring strict access controls
- **Internal**: Information for internal use only
- **Public**: Information approved for public release

### 3.2 Access Control

- Access to information systems shall be granted on a need-to-know basis
- All access shall be authenticated using strong credentials
- Multi-factor authentication is required for accessing sensitive systems
- Access rights shall be reviewed quarterly

### 3.3 Data Protection

- Confidential data must be encrypted at rest and in transit
- Data backups shall be performed daily and tested monthly
- Personal data shall be handled in accordance with applicable privacy laws

### 3.4 Incident Response

- All security incidents must be reported immediately to the security team
- Incident response procedures shall be followed as documented
- Post-incident reviews shall be conducted within 5 business days

## 4. Responsibilities

- **Security Team**: Implement and maintain security controls
- **Managers**: Ensure team compliance with this policy
- **All Staff**: Follow security procedures and report incidents

## 5. Compliance

Violations of this policy may result in disciplinary action up to and including termination.

## 6. Review

This policy shall be reviewed annually and updated as needed.

---
*Last Updated: {date}*
*Version: 1.0*
*Owner: Security Team*
"""
    },
    
    "access_control": {
        "title": "Access Control Policy",
        "content": """# Access Control Policy

## 1. Purpose

This policy defines the requirements for controlling access to {company_name}'s information systems, applications, and data.

## 2. Scope

This policy applies to all systems, applications, and data owned or managed by {company_name}.

## 3. Policy Statements

### 3.1 User Account Management

- Unique user accounts shall be created for all authorized users
- Shared accounts are prohibited except where technically required and documented
- Accounts shall be disabled immediately upon termination
- Dormant accounts (90+ days inactive) shall be reviewed and disabled

### 3.2 Authentication Requirements

| System Type | Minimum Requirements |
|-------------|---------------------|
| Production Systems | MFA + 16-char password |
| Internal Applications | 12-char password |
| External Services | MFA required |

### 3.3 Password Requirements

- Minimum 12 characters
- Combination of uppercase, lowercase, numbers, and symbols
- Password rotation: 90 days for privileged accounts
- No password reuse within 12 generations

### 3.4 Access Reviews

- Quarterly access reviews for all systems
- Monthly reviews for privileged access
- Documented approval for all access changes

### 3.5 Remote Access

- VPN required for accessing internal systems
- Company-managed devices required for sensitive data access
- Session timeout: 15 minutes of inactivity

## 4. Privileged Access

- Privileged access requires manager and security team approval
- Privileged actions shall be logged and monitored
- Separate accounts required for privileged activities

## 5. Third-Party Access

- Third-party access requires signed security agreements
- Access limited to minimum necessary
- Third-party access reviewed monthly

---
*Last Updated: {date}*
*Version: 1.0*
*Owner: IT Security*
"""
    },
    
    "incident_response": {
        "title": "Incident Response Policy",
        "content": """# Incident Response Policy

## 1. Purpose

This policy establishes procedures for detecting, responding to, and recovering from security incidents at {company_name}.

## 2. Scope

This policy covers all security incidents affecting {company_name}'s systems, data, and operations.

## 3. Incident Classification

### Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| Critical | Data breach, system compromise | Immediate |
| High | Potential breach, significant risk | 1 hour |
| Medium | Contained threat, limited impact | 4 hours |
| Low | Minor issue, no data at risk | 24 hours |

## 4. Incident Response Phases

### 4.1 Detection & Reporting

- All staff must report suspected incidents immediately
- Security monitoring tools shall alert on suspicious activity
- Report incidents to: security@company.com

### 4.2 Containment

- Isolate affected systems immediately
- Preserve evidence for investigation
- Document all containment actions

### 4.3 Eradication

- Remove malicious software/access
- Patch vulnerabilities
- Reset compromised credentials

### 4.4 Recovery

- Restore systems from clean backups
- Verify system integrity
- Monitor for signs of persistent threat

### 4.5 Post-Incident

- Conduct post-incident review within 5 days
- Document lessons learned
- Update procedures as needed
- Report to stakeholders and regulators as required

## 5. Communication

- Internal: Incident response team → Management → Affected parties
- External: Legal review required before external communication
- Regulatory: Notify within required timeframes

## 6. Documentation

All incidents shall be documented including:
- Timeline of events
- Actions taken
- Evidence collected
- Root cause analysis
- Remediation steps

---
*Last Updated: {date}*
*Version: 1.0*
*Owner: Security Team*
"""
    },
    
    "data_protection": {
        "title": "Data Protection Policy",
        "content": """# Data Protection Policy

## 1. Purpose

This policy establishes requirements for protecting personal and sensitive data processed by {company_name} in compliance with applicable data protection regulations.

## 2. Scope

This policy applies to all personal data and sensitive information processed by {company_name}, regardless of format or location.

## 3. Data Protection Principles

{company_name} adheres to the following principles:

1. **Lawfulness, Fairness, Transparency**: Data processing must have a legal basis
2. **Purpose Limitation**: Data collected for specified, legitimate purposes only
3. **Data Minimization**: Only necessary data shall be collected
4. **Accuracy**: Data must be accurate and kept up to date
5. **Storage Limitation**: Data retained only as long as necessary
6. **Integrity & Confidentiality**: Appropriate security measures applied
7. **Accountability**: Compliance must be demonstrable

## 4. Data Subject Rights

{company_name} supports the following data subject rights:

- Right to access personal data
- Right to rectification of inaccurate data
- Right to erasure ("right to be forgotten")
- Right to restrict processing
- Right to data portability
- Right to object to processing

### Response Timeframes

| Request Type | Response Time |
|--------------|---------------|
| Access Request | 30 days |
| Rectification | 30 days |
| Erasure | 30 days |
| Portability | 30 days |

## 5. Data Processing

### 5.1 Legal Basis

All processing must have one of the following legal bases:
- Consent
- Contract performance
- Legal obligation
- Vital interests
- Public task
- Legitimate interests

### 5.2 Data Processing Agreements

Third-party processors must sign Data Processing Agreements including:
- Processing instructions
- Confidentiality obligations
- Security requirements
- Sub-processor restrictions
- Audit rights

## 6. International Transfers

Data transfers outside approved jurisdictions require:
- Appropriate safeguards (Standard Contractual Clauses, etc.)
- Transfer impact assessments
- Legal review and approval

## 7. Data Breach Notification

In case of a personal data breach:
- Internal notification: Immediately
- Regulatory notification: Within 72 hours (if required)
- Data subject notification: Without undue delay (if high risk)

## 8. Privacy by Design

All new systems and processes must incorporate:
- Privacy impact assessments
- Data minimization
- Security controls
- Retention policies

---
*Last Updated: {date}*
*Version: 1.0*
*Owner: Data Protection Officer*
"""
    },
    
    "acceptable_use": {
        "title": "Acceptable Use Policy",
        "content": """# Acceptable Use Policy

## 1. Purpose

This policy defines acceptable use of {company_name}'s information technology resources and sets expectations for user behavior.

## 2. Scope

This policy applies to all employees, contractors, and third parties using {company_name}'s IT resources.

## 3. Acceptable Use

### 3.1 General Principles

Users shall:
- Use IT resources primarily for business purposes
- Protect credentials and not share accounts
- Report security incidents promptly
- Comply with all applicable laws and policies
- Respect intellectual property rights

### 3.2 Email and Communications

Users shall:
- Use professional language in business communications
- Not send confidential data to personal accounts
- Not open suspicious attachments or links
- Include appropriate disclaimers on external emails

### 3.3 Internet Use

Users may:
- Access the internet for business purposes
- Use limited personal browsing during breaks

Users shall not:
- Access inappropriate or illegal content
- Download unauthorized software
- Bypass security controls
- Stream excessive media content

### 3.4 Mobile Devices

- Company data on personal devices requires MDM enrollment
- Devices must have screen locks enabled
- Lost/stolen devices must be reported immediately
- Remote wipe capability required for devices with company data

## 4. Prohibited Activities

The following are strictly prohibited:

- Unauthorized access to systems or data
- Installing unauthorized software
- Sharing credentials or access
- Connecting unauthorized devices to the network
- Circumventing security controls
- Storing company data on unapproved cloud services
- Harassment or discrimination via company systems
- Using company resources for personal business
- Cryptocurrency mining
- Unauthorized data exfiltration

## 5. Monitoring

{company_name} reserves the right to:
- Monitor network traffic and system usage
- Inspect devices connected to company networks
- Review email and communications
- Audit system access and activities

Users have no expectation of privacy when using company resources.

## 6. Enforcement

Violations may result in:
- Warning
- Revocation of access privileges
- Disciplinary action
- Termination
- Legal action

---
*Last Updated: {date}*
*Version: 1.0*
*Owner: IT Department*
"""
    },
    
    "business_continuity": {
        "title": "Business Continuity Policy",
        "content": """# Business Continuity Policy

## 1. Purpose

This policy establishes the framework for ensuring {company_name} can continue critical operations during and after a disruptive event.

## 2. Scope

This policy covers all business functions, systems, and facilities operated by {company_name}.

## 3. Policy Statements

### 3.1 Business Impact Analysis

- Critical business functions shall be identified and documented
- Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO) shall be defined
- Dependencies shall be mapped and documented
- Business impact analysis shall be reviewed annually

### 3.2 Recovery Objectives

| Tier | Function Type | RTO | RPO |
|------|--------------|-----|-----|
| 1 | Critical | 4 hours | 1 hour |
| 2 | Essential | 24 hours | 4 hours |
| 3 | Normal | 72 hours | 24 hours |
| 4 | Non-essential | 1 week | 48 hours |

### 3.3 Backup Requirements

- Critical data backed up continuously or hourly
- All data backed up daily at minimum
- Backups stored in geographically separate location
- Backup restoration tested quarterly

### 3.4 Disaster Recovery

- DR site capable of supporting Tier 1 functions
- Automated failover for critical systems
- Manual failover procedures documented and tested
- DR testing conducted semi-annually

## 4. Plan Requirements

Business Continuity Plans shall include:

1. Emergency contact information
2. Activation criteria and procedures
3. Communication plans
4. Recovery procedures
5. Resource requirements
6. Vendor/supplier contacts
7. Return to normal operations procedures

## 5. Testing

| Test Type | Frequency |
|-----------|-----------|
| Tabletop Exercise | Quarterly |
| Functional Test | Semi-annually |
| Full-scale Test | Annually |

## 6. Roles and Responsibilities

- **Executive Team**: Approve plans and provide resources
- **BC Coordinator**: Maintain plans and coordinate testing
- **Department Heads**: Develop departmental plans
- **IT**: Maintain technical recovery capabilities
- **All Staff**: Understand roles in emergency response

## 7. Plan Maintenance

- Plans reviewed and updated annually
- Updates required after significant changes
- Lessons learned incorporated after incidents/tests

---
*Last Updated: {date}*
*Version: 1.0*
*Owner: Business Continuity Team*
"""
    },
    
    "vendor_management": {
        "title": "Vendor Management Policy",
        "content": """# Vendor Management Policy

## 1. Purpose

This policy establishes requirements for assessing, selecting, and managing third-party vendors who access {company_name}'s data or systems.

## 2. Scope

This policy applies to all third-party vendors, suppliers, and service providers who:
- Access company systems or data
- Process data on behalf of {company_name}
- Provide critical business services
- Have physical access to facilities

## 3. Vendor Classification

### Risk Tiers

| Tier | Criteria | Assessment |
|------|----------|------------|
| Critical | Access to sensitive data, critical services | Full assessment, annual review |
| High | Access to internal data, important services | Standard assessment, annual review |
| Medium | Limited data access, standard services | Basic assessment, biennial review |
| Low | No data access, non-critical services | Minimal assessment |

## 4. Vendor Assessment

### 4.1 Pre-Engagement

Before engaging vendors:
- Complete vendor risk questionnaire
- Review security certifications (SOC 2, ISO 27001)
- Assess financial stability
- Check references
- Legal review of contracts

### 4.2 Required Security Controls

Critical and High-tier vendors must demonstrate:
- Information security program
- Access controls
- Encryption capabilities
- Incident response procedures
- Business continuity plans
- Employee security training

### 4.3 Contractual Requirements

Vendor contracts shall include:
- Data protection obligations
- Security requirements
- Audit rights
- Breach notification requirements
- Confidentiality provisions
- Termination and data return procedures
- Insurance requirements

## 5. Ongoing Management

### 5.1 Monitoring

- Review vendor performance regularly
- Monitor security incidents
- Track compliance with SLAs
- Verify continued certification status

### 5.2 Access Management

- Vendor access requires business justification
- Access limited to minimum necessary
- Access reviewed quarterly
- Access revoked upon contract termination

### 5.3 Periodic Review

| Vendor Tier | Review Frequency |
|-------------|------------------|
| Critical | Annually |
| High | Annually |
| Medium | Every 2 years |
| Low | Every 3 years |

## 6. Offboarding

When vendor relationships end:
- Revoke all access immediately
- Retrieve company assets
- Ensure data deletion/return
- Document offboarding completion

---
*Last Updated: {date}*
*Version: 1.0*
*Owner: Procurement/Security*
"""
    },
    
    "change_management": {
        "title": "Change Management Policy",
        "content": """# Change Management Policy

## 1. Purpose

This policy establishes the process for managing changes to {company_name}'s IT systems, applications, and infrastructure to minimize risk and ensure stability.

## 2. Scope

This policy applies to all changes to:
- Production systems and applications
- Network infrastructure
- Security configurations
- Databases
- Cloud services
- Critical business applications

## 3. Change Classification

| Type | Description | Approval Required | Lead Time |
|------|-------------|-------------------|-----------|
| Standard | Pre-approved, low-risk | None | 24 hours |
| Normal | Moderate risk, planned | CAB | 5 business days |
| Emergency | Critical fix needed | Emergency CAB | Immediate |
| Major | High risk, significant impact | Executive + CAB | 2 weeks |

## 4. Change Process

### 4.1 Request

All changes require:
- Description of change
- Business justification
- Risk assessment
- Implementation plan
- Rollback plan
- Testing evidence

### 4.2 Review

Changes reviewed for:
- Technical accuracy
- Risk assessment completeness
- Impact on other systems
- Resource requirements
- Scheduling conflicts

### 4.3 Approval

| Change Type | Approvers |
|-------------|-----------|
| Standard | Auto-approved |
| Normal | CAB |
| Emergency | Emergency CAB (2 members) |
| Major | CAB + Executive Sponsor |

### 4.4 Implementation

- Follow approved implementation plan
- Document all actions taken
- Monitor for issues
- Communicate status to stakeholders

### 4.5 Post-Implementation

- Verify change success
- Update documentation
- Close change ticket
- Conduct PIR for major/failed changes

## 5. Change Advisory Board (CAB)

### Membership
- IT Operations Manager
- Security Representative
- Application Owners (as needed)
- Infrastructure Lead

### Meetings
- Weekly CAB meetings
- Emergency CAB: On-demand

## 6. Emergency Changes

Emergency changes may bypass normal approval when:
- Critical security vulnerability
- Production outage
- Regulatory requirement

Emergency changes require:
- Verbal approval from 2 CAB members
- Retrospective documentation within 24 hours
- Post-implementation review

## 7. Documentation

All changes must be documented in the change management system including:
- Change details
- Approvals
- Implementation notes
- Test results
- Rollback status (if applicable)

---
*Last Updated: {date}*
*Version: 1.0*
*Owner: IT Operations*
"""
    },
    
    "encryption": {
        "title": "Encryption Policy",
        "content": """# Encryption Policy

## 1. Purpose

This policy establishes requirements for the use of encryption to protect {company_name}'s data and communications.

## 2. Scope

This policy applies to all data owned or processed by {company_name}, including data at rest, in transit, and in use.

## 3. Encryption Standards

### 3.1 Approved Algorithms

| Purpose | Approved Algorithms |
|---------|---------------------|
| Symmetric Encryption | AES-256, AES-128 |
| Asymmetric Encryption | RSA-2048+, ECDSA P-256+ |
| Hashing | SHA-256, SHA-384, SHA-512 |
| Key Exchange | ECDH, DH-2048+ |
| TLS | TLS 1.2, TLS 1.3 |

### 3.2 Prohibited Algorithms

The following are prohibited:
- DES, 3DES
- MD5, SHA-1 (for security purposes)
- RC4
- SSL, TLS 1.0, TLS 1.1
- RSA < 2048 bits

## 4. Data at Rest

### 4.1 Requirements

| Data Type | Encryption Required |
|-----------|---------------------|
| Confidential | Required - AES-256 |
| PII/Sensitive | Required - AES-256 |
| Internal | Required for portable media |
| Public | Not required |

### 4.2 Storage Encryption

- Database encryption: Transparent Data Encryption (TDE) or application-level
- File storage: Encrypted at rest
- Backups: Encrypted before storage
- Portable devices: Full disk encryption required

## 5. Data in Transit

### 5.1 Requirements

- All external communications: TLS 1.2+
- Internal sensitive data: TLS 1.2+ or VPN
- API communications: TLS 1.2+ with certificate validation
- Email with sensitive data: TLS required

### 5.2 Certificate Requirements

- Minimum 2048-bit RSA or 256-bit ECDSA
- Certificates from approved CAs only
- Certificate expiration monitoring
- Revocation checking enabled

## 6. Key Management

### 6.1 Key Generation

- Keys generated using approved random number generators
- Key generation in secure environments only
- Separation of duties for critical keys

### 6.2 Key Storage

- Keys stored in hardware security modules (HSM) or approved key management systems
- Keys never stored with encrypted data
- Key access strictly controlled

### 6.3 Key Rotation

| Key Type | Rotation Frequency |
|----------|-------------------|
| TLS Certificates | Annually |
| Database Keys | Annually |
| API Keys | 90 days |
| User Passwords | 90 days (privileged) |

### 6.4 Key Destruction

- Keys destroyed when no longer needed
- Secure deletion methods used
- Destruction documented

## 7. Exceptions

Any exceptions require:
- Security team approval
- Risk assessment
- Compensating controls
- Documented expiration date

---
*Last Updated: {date}*
*Version: 1.0*
*Owner: Security Team*
"""
    }
}


def generate_policy_content(policy_type: str, company_name: str) -> Tuple[str, str]:
    """
    Generate policy content based on policy type and company name.
    
    Args:
        policy_type: Type of policy to generate
        company_name: Name of the company to insert into template
    
    Returns:
        Tuple of (title, content)
    """
    template = POLICY_TEMPLATES.get(policy_type)
    
    if not template:
        # Default generic policy if type not found
        return (
            f"{policy_type.replace('_', ' ').title()} Policy",
            f"""# {policy_type.replace('_', ' ').title()} Policy

## 1. Purpose

This policy establishes guidelines for {policy_type.replace('_', ' ')} at {company_name}.

## 2. Scope

This policy applies to all employees and contractors of {company_name}.

## 3. Policy

[Policy content to be developed]

## 4. Responsibilities

[Responsibilities to be defined]

## 5. Compliance

Violations of this policy may result in disciplinary action.

## 6. Review

This policy shall be reviewed annually.

---
*Last Updated: {datetime.utcnow().strftime('%Y-%m-%d')}*
*Version: 1.0*
"""
        )
    
    content = template["content"].format(
        company_name=company_name,
        date=datetime.utcnow().strftime('%Y-%m-%d')
    )
    
    return (template["title"], content)