from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.models.framework import Framework
from app.db.models.control import Control


async def seed_controls(db: AsyncSession):
    """Seed the database with compliance frameworks and controls."""
    
    # Check if already seeded
    result = await db.execute(select(Framework))
    if result.scalars().first():
        return  # Already seeded
    
    # Create frameworks
    soc2 = Framework(
        name="SOC 2",
        version="2017",
        description="Service Organization Control 2 - Trust Services Criteria"
    )
    
    iso27001 = Framework(
        name="ISO 27001",
        version="2022",
        description="Information Security Management System Standard"
    )
    
    gdpr = Framework(
        name="GDPR",
        version="2018",
        description="General Data Protection Regulation"
    )
    
    db.add_all([soc2, iso27001, gdpr])
    await db.flush()
    
    # SOC 2 Controls
    soc2_controls = [
        # CC1 - Control Environment
        Control(
            framework_id=soc2.id,
            control_code="CC1.1",
            title="COSO Principle 1: Demonstrates Commitment to Integrity",
            description="The entity demonstrates a commitment to integrity and ethical values.",
            category="Control Environment",
            severity="High",
            guidance_text="Establish a code of conduct, ethics policies, and demonstrate leadership commitment to integrity.",
            evidence_guidance="Provide: Code of conduct document, ethics policy, signed acknowledgments, training records."
        ),
        Control(
            framework_id=soc2.id,
            control_code="CC1.2",
            title="COSO Principle 2: Board Independence and Oversight",
            description="The board of directors demonstrates independence from management and exercises oversight.",
            category="Control Environment",
            severity="Medium",
            guidance_text="Establish board charter, define oversight responsibilities, maintain independence.",
            evidence_guidance="Provide: Board charter, meeting minutes, independence declarations, organizational chart."
        ),
        Control(
            framework_id=soc2.id,
            control_code="CC1.3",
            title="COSO Principle 3: Management Structure and Authority",
            description="Management establishes structures, reporting lines, and appropriate authorities and responsibilities.",
            category="Control Environment",
            severity="Medium",
            guidance_text="Define organizational structure, job descriptions, and delegation of authority.",
            evidence_guidance="Provide: Org charts, job descriptions, delegation of authority matrix, RACI charts."
        ),
        Control(
            framework_id=soc2.id,
            control_code="CC1.4",
            title="COSO Principle 4: Commitment to Competence",
            description="The entity demonstrates a commitment to attract, develop, and retain competent individuals.",
            category="Control Environment",
            severity="Medium",
            guidance_text="Implement hiring standards, training programs, and performance evaluations.",
            evidence_guidance="Provide: HR policies, training records, competency assessments, performance reviews."
        ),
        Control(
            framework_id=soc2.id,
            control_code="CC1.5",
            title="COSO Principle 5: Accountability",
            description="The entity holds individuals accountable for their internal control responsibilities.",
            category="Control Environment",
            severity="Medium",
            guidance_text="Define performance metrics, conduct reviews, enforce accountability.",
            evidence_guidance="Provide: Performance metrics, review documentation, disciplinary procedures."
        ),
        
        # CC2 - Communication and Information
        Control(
            framework_id=soc2.id,
            control_code="CC2.1",
            title="Information Quality",
            description="The entity obtains or generates and uses relevant, quality information to support internal control.",
            category="Communication and Information",
            severity="Medium",
            guidance_text="Establish data quality standards and validation processes.",
            evidence_guidance="Provide: Data quality policies, validation procedures, accuracy reports."
        ),
        Control(
            framework_id=soc2.id,
            control_code="CC2.2",
            title="Internal Communication",
            description="The entity internally communicates information necessary for internal control to function.",
            category="Communication and Information",
            severity="Medium",
            guidance_text="Implement internal communication channels and ensure policy distribution.",
            evidence_guidance="Provide: Communication policies, policy acknowledgments, meeting records."
        ),
        Control(
            framework_id=soc2.id,
            control_code="CC2.3",
            title="External Communication",
            description="The entity communicates with external parties regarding matters affecting internal control.",
            category="Communication and Information",
            severity="Medium",
            guidance_text="Establish external communication procedures and disclosure policies.",
            evidence_guidance="Provide: External communication policies, disclosure procedures, stakeholder communications."
        ),
        
        # CC3 - Risk Assessment
        Control(
            framework_id=soc2.id,
            control_code="CC3.1",
            title="Objectives Specification",
            description="The entity specifies objectives with sufficient clarity to identify and assess risks.",
            category="Risk Assessment",
            severity="High",
            guidance_text="Define clear business and security objectives with measurable criteria.",
            evidence_guidance="Provide: Strategic objectives, security objectives, success metrics."
        ),
        Control(
            framework_id=soc2.id,
            control_code="CC3.2",
            title="Risk Identification and Analysis",
            description="The entity identifies risks and analyzes them as a basis for determining how to manage them.",
            category="Risk Assessment",
            severity="High",
            guidance_text="Conduct regular risk assessments covering all areas of the organization.",
            evidence_guidance="Provide: Risk assessment methodology, risk register, risk analysis documentation."
        ),
        Control(
            framework_id=soc2.id,
            control_code="CC3.3",
            title="Fraud Risk Assessment",
            description="The entity considers the potential for fraud in assessing risks.",
            category="Risk Assessment",
            severity="High",
            guidance_text="Include fraud scenarios in risk assessments and implement anti-fraud controls.",
            evidence_guidance="Provide: Fraud risk assessment, anti-fraud policies, fraud detection controls."
        ),
        Control(
            framework_id=soc2.id,
            control_code="CC3.4",
            title="Change Identification",
            description="The entity identifies and assesses changes that could significantly impact internal control.",
            category="Risk Assessment",
            severity="Medium",
            guidance_text="Monitor for internal and external changes that impact controls.",
            evidence_guidance="Provide: Change management procedures, impact assessments, change logs."
        ),
        
        # CC4 - Monitoring Activities
        Control(
            framework_id=soc2.id,
            control_code="CC4.1",
            title="Ongoing and Separate Evaluations",
            description="The entity selects, develops, and performs evaluations to ascertain control components are present.",
            category="Monitoring Activities",
            severity="High",
            guidance_text="Implement continuous monitoring and periodic control assessments.",
            evidence_guidance="Provide: Monitoring procedures, evaluation reports, assessment schedules."
        ),
        Control(
            framework_id=soc2.id,
            control_code="CC4.2",
            title="Deficiency Communication",
            description="The entity evaluates and communicates internal control deficiencies in a timely manner.",
            category="Monitoring Activities",
            severity="High",
            guidance_text="Establish deficiency tracking and escalation procedures.",
            evidence_guidance="Provide: Deficiency logs, remediation tracking, escalation records."
        ),
        
        # CC5 - Control Activities
        Control(
            framework_id=soc2.id,
            control_code="CC5.1",
            title="Control Activity Selection",
            description="The entity selects and develops control activities that mitigate risks.",
            category="Control Activities",
            severity="High",
            guidance_text="Implement controls based on risk assessment results.",
            evidence_guidance="Provide: Control matrix, control documentation, risk-control mapping."
        ),
        Control(
            framework_id=soc2.id,
            control_code="CC5.2",
            title="Technology General Controls",
            description="The entity selects and develops general control activities over technology.",
            category="Control Activities",
            severity="High",
            guidance_text="Implement IT general controls for systems supporting services.",
            evidence_guidance="Provide: ITGC documentation, access controls, change management records."
        ),
        Control(
            framework_id=soc2.id,
            control_code="CC5.3",
            title="Policy and Procedure Deployment",
            description="The entity deploys control activities through policies and procedures.",
            category="Control Activities",
            severity="Medium",
            guidance_text="Document and deploy policies and procedures for all controls.",
            evidence_guidance="Provide: Policies, procedures, deployment records, acknowledgments."
        ),
        
        # CC6 - Logical and Physical Access
        Control(
            framework_id=soc2.id,
            control_code="CC6.1",
            title="Logical Access Security",
            description="The entity implements logical access security software, infrastructure, and architectures.",
            category="Logical and Physical Access",
            severity="Critical",
            guidance_text="Implement access controls, authentication, and authorization mechanisms.",
            evidence_guidance="Provide: Access control policy, system configurations, access logs, MFA evidence."
        ),
        Control(
            framework_id=soc2.id,
            control_code="CC6.2",
            title="Access Registration and Authorization",
            description="Prior to issuing system credentials, the entity registers and authorizes new users.",
            category="Logical and Physical Access",
            severity="Critical",
            guidance_text="Implement user provisioning process with appropriate approvals.",
            evidence_guidance="Provide: User provisioning procedures, approval records, access request forms."
        ),
        Control(
            framework_id=soc2.id,
            control_code="CC6.3",
            title="Access Removal",
            description="The entity removes access to protected information when access is no longer required.",
            category="Logical and Physical Access",
            severity="Critical",
            guidance_text="Implement timely access revocation upon termination or role change.",
            evidence_guidance="Provide: Termination procedures, access removal records, deprovisioning logs."
        ),
        Control(
            framework_id=soc2.id,
            control_code="CC6.4",
            title="Access Review",
            description="The entity restricts and reviews access and changes to system configurations.",
            category="Logical and Physical Access",
            severity="High",
            guidance_text="Conduct periodic access reviews and configuration reviews.",
            evidence_guidance="Provide: Access review reports, configuration review records, recertification evidence."
        ),
        Control(
            framework_id=soc2.id,
            control_code="CC6.5",
            title="Access Restrictions",
            description="The entity restricts physical access to facilities and protected information assets.",
            category="Logical and Physical Access",
            severity="High",
            guidance_text="Implement physical access controls for facilities and data centers.",
            evidence_guidance="Provide: Physical access policy, badge logs, visitor logs, facility security assessments."
        ),
        Control(
            framework_id=soc2.id,
            control_code="CC6.6",
            title="Logical Access Modification",
            description="The entity implements controls to prevent or detect and correct unauthorized or malicious software.",
            category="Logical and Physical Access",
            severity="High",
            guidance_text="Implement endpoint protection, malware prevention, and detection controls.",
            evidence_guidance="Provide: Endpoint protection policy, antivirus configurations, detection logs."
        ),
        Control(
            framework_id=soc2.id,
            control_code="CC6.7",
            title="Transmission Protection",
            description="The entity restricts transmission, movement, and removal of information.",
            category="Logical and Physical Access",
            severity="High",
            guidance_text="Implement encryption, DLP, and secure transmission controls.",
            evidence_guidance="Provide: Encryption policy, TLS configurations, DLP rules, transmission logs."
        ),
        Control(
            framework_id=soc2.id,
            control_code="CC6.8",
            title="Threat Detection",
            description="The entity implements controls to prevent or detect and act upon introduction of malicious threats.",
            category="Logical and Physical Access",
            severity="High",
            guidance_text="Implement threat detection, monitoring, and response capabilities.",
            evidence_guidance="Provide: Security monitoring configurations, SIEM evidence, threat detection logs."
        ),
        
        # CC7 - System Operations
        Control(
            framework_id=soc2.id,
            control_code="CC7.1",
            title="Vulnerability Management",
            description="The entity identifies, tracks, and resolves vulnerabilities in a timely manner.",
            category="System Operations",
            severity="High",
            guidance_text="Implement vulnerability scanning and remediation processes.",
            evidence_guidance="Provide: Vulnerability scan reports, remediation records, patch management evidence."
        ),
        Control(
            framework_id=soc2.id,
            control_code="CC7.2",
            title="Anomaly Detection",
            description="The entity monitors system components for anomalies indicative of malicious acts.",
            category="System Operations",
            severity="High",
            guidance_text="Implement security monitoring and anomaly detection.",
            evidence_guidance="Provide: Monitoring configurations, alert rules, anomaly investigation records."
        ),
        Control(
            framework_id=soc2.id,
            control_code="CC7.3",
            title="Security Event Evaluation",
            description="The entity evaluates security events to determine whether they could impact the system.",
            category="System Operations",
            severity="High",
            guidance_text="Implement security event analysis and triage processes.",
            evidence_guidance="Provide: Event analysis procedures, triage records, event logs."
        ),
        Control(
            framework_id=soc2.id,
            control_code="CC7.4",
            title="Incident Response",
            description="The entity responds to identified security incidents to mitigate impact.",
            category="System Operations",
            severity="Critical",
            guidance_text="Implement incident response procedures and capabilities.",
            evidence_guidance="Provide: Incident response plan, incident records, post-incident reviews."
        ),
        Control(
            framework_id=soc2.id,
            control_code="CC7.5",
            title="Recovery Operations",
            description="The entity identifies, develops, and implements activities to recover from incidents.",
            category="System Operations",
            severity="High",
            guidance_text="Implement recovery procedures and business continuity capabilities.",
            evidence_guidance="Provide: Recovery procedures, BCP documentation, recovery test results."
        ),
        
        # CC8 - Change Management
        Control(
            framework_id=soc2.id,
            control_code="CC8.1",
            title="Infrastructure and Software Changes",
            description="The entity authorizes, designs, develops, configures, documents, tests, and approves changes.",
            category="Change Management",
            severity="High",
            guidance_text="Implement formal change management process with appropriate controls.",
            evidence_guidance="Provide: Change management policy, change records, CAB meeting minutes, test evidence."
        ),
        
        # CC9 - Risk Mitigation
        Control(
            framework_id=soc2.id,
            control_code="CC9.1",
            title="Business Disruption Risk",
            description="The entity identifies, selects, and develops risk mitigation activities for business disruptions.",
            category="Risk Mitigation",
            severity="High",
            guidance_text="Implement business continuity and disaster recovery planning.",
            evidence_guidance="Provide: BCP/DR plans, risk mitigation strategies, testing results."
        ),
        Control(
            framework_id=soc2.id,
            control_code="CC9.2",
            title="Vendor Risk Management",
            description="The entity assesses and manages risks associated with vendors and business partners.",
            category="Risk Mitigation",
            severity="High",
            guidance_text="Implement vendor assessment and ongoing monitoring processes.",
            evidence_guidance="Provide: Vendor policy, risk assessments, contracts, monitoring records."
        ),
    ]
    
    # ISO 27001 Controls (Annex A - Selected)
    iso27001_controls = [
        Control(
            framework_id=iso27001.id,
            control_code="A.5.1",
            title="Policies for Information Security",
            description="A set of policies for information security shall be defined, approved, published and communicated.",
            category="Information Security Policies",
            severity="High",
            guidance_text="Develop comprehensive information security policies aligned with business objectives.",
            evidence_guidance="Provide: Information security policy document, approval records, communication evidence."
        ),
        Control(
            framework_id=iso27001.id,
            control_code="A.5.2",
            title="Review of Policies",
            description="The policies for information security shall be reviewed at planned intervals.",
            category="Information Security Policies",
            severity="Medium",
            guidance_text="Establish policy review schedule and process.",
            evidence_guidance="Provide: Policy review schedule, review records, update history."
        ),
        Control(
            framework_id=iso27001.id,
            control_code="A.6.1",
            title="Internal Organization",
            description="All information security responsibilities shall be defined and allocated.",
            category="Organization of Information Security",
            severity="High",
            guidance_text="Define security roles, responsibilities, and organizational structure.",
            evidence_guidance="Provide: RACI matrix, job descriptions, organizational charts, role definitions."
        ),
        Control(
            framework_id=iso27001.id,
            control_code="A.6.2",
            title="Mobile Devices and Teleworking",
            description="A policy and supporting security measures shall be adopted for mobile devices.",
            category="Organization of Information Security",
            severity="High",
            guidance_text="Implement mobile device management and remote work security policies.",
            evidence_guidance="Provide: Mobile device policy, MDM configurations, remote access procedures."
        ),
        Control(
            framework_id=iso27001.id,
            control_code="A.7.1",
            title="Prior to Employment",
            description="Background verification checks shall be carried out for candidates for employment.",
            category="Human Resource Security",
            severity="Medium",
            guidance_text="Implement pre-employment screening procedures.",
            evidence_guidance="Provide: Background check policy, screening procedures, verification records."
        ),
        Control(
            framework_id=iso27001.id,
            control_code="A.7.2",
            title="During Employment",
            description="Management shall require employees to apply security in accordance with policies.",
            category="Human Resource Security",
            severity="Medium",
            guidance_text="Implement security awareness training and ongoing compliance requirements.",
            evidence_guidance="Provide: Training materials, completion records, acknowledgment forms."
        ),
        Control(
            framework_id=iso27001.id,
            control_code="A.7.3",
            title="Termination and Change",
            description="Information security responsibilities that remain valid after termination shall be communicated.",
            category="Human Resource Security",
            severity="Medium",
            guidance_text="Implement offboarding procedures with security requirements.",
            evidence_guidance="Provide: Termination procedures, exit checklists, NDA reminders."
        ),
        Control(
            framework_id=iso27001.id,
            control_code="A.8.1",
            title="Responsibility for Assets",
            description="Assets associated with information shall be identified and an inventory maintained.",
            category="Asset Management",
            severity="High",
            guidance_text="Maintain comprehensive asset inventory with ownership assigned.",
            evidence_guidance="Provide: Asset inventory, ownership records, classification labels."
        ),
        Control(
            framework_id=iso27001.id,
            control_code="A.8.2",
            title="Information Classification",
            description="Information shall be classified in terms of value, sensitivity and criticality.",
            category="Asset Management",
            severity="High",
            guidance_text="Implement data classification scheme and labeling procedures.",
            evidence_guidance="Provide: Classification policy, classification procedures, labeled data examples."
        ),
        Control(
            framework_id=iso27001.id,
            control_code="A.8.3",
            title="Media Handling",
            description="Procedures shall be implemented for the management of removable media.",
            category="Asset Management",
            severity="Medium",
            guidance_text="Implement media handling and disposal procedures.",
            evidence_guidance="Provide: Media handling policy, disposal records, encryption requirements."
        ),
        Control(
            framework_id=iso27001.id,
            control_code="A.9.1",
            title="Business Requirements of Access Control",
            description="An access control policy shall be established, documented and reviewed.",
            category="Access Control",
            severity="Critical",
            guidance_text="Implement access control policy based on business and security requirements.",
            evidence_guidance="Provide: Access control policy, access requirements documentation."
        ),
        Control(
            framework_id=iso27001.id,
            control_code="A.9.2",
            title="User Access Management",
            description="A formal user registration and de-registration process shall be implemented.",
            category="Access Control",
            severity="Critical",
            guidance_text="Implement formal user provisioning and deprovisioning processes.",
            evidence_guidance="Provide: User management procedures, provisioning records, access request forms."
        ),
        Control(
            framework_id=iso27001.id,
            control_code="A.9.3",
            title="User Responsibilities",
            description="Users shall be required to follow practices in the use of secret authentication.",
            category="Access Control",
            severity="High",
            guidance_text="Implement password policies and user security responsibilities.",
            evidence_guidance="Provide: Password policy, user guidelines, acknowledgment records."
        ),
        Control(
            framework_id=iso27001.id,
            control_code="A.9.4",
            title="System and Application Access Control",
            description="Access to systems and applications shall be controlled by a secure log-on procedure.",
            category="Access Control",
            severity="Critical",
            guidance_text="Implement secure authentication for all systems and applications.",
            evidence_guidance="Provide: Authentication configurations, login procedures, MFA evidence."
        ),
        Control(
            framework_id=iso27001.id,
            control_code="A.10.1",
            title="Cryptographic Controls",
            description="A policy on the use of cryptographic controls shall be developed and implemented.",
            category="Cryptography",
            severity="High",
            guidance_text="Implement cryptographic policy covering encryption requirements.",
            evidence_guidance="Provide: Cryptography policy, encryption configurations, key management procedures."
        ),
        Control(
            framework_id=iso27001.id,
            control_code="A.11.1",
            title="Secure Areas",
            description="Physical security perimeters shall be defined to protect areas containing information.",
            category="Physical Security",
            severity="High",
            guidance_text="Implement physical security controls for facilities.",
            evidence_guidance="Provide: Physical security policy, access logs, facility assessments."
        ),
        Control(
            framework_id=iso27001.id,
            control_code="A.11.2",
            title="Equipment Security",
            description="Equipment shall be protected to reduce the risks from environmental threats.",
            category="Physical Security",
            severity="Medium",
            guidance_text="Implement equipment protection and environmental controls.",
            evidence_guidance="Provide: Equipment protection procedures, environmental monitoring, maintenance records."
        ),
        Control(
            framework_id=iso27001.id,
            control_code="A.12.1",
            title="Operational Procedures",
            description="Operating procedures shall be documented and made available to users.",
            category="Operations Security",
            severity="Medium",
            guidance_text="Document operational procedures for all critical systems.",
            evidence_guidance="Provide: Operations manuals, runbooks, procedure documentation."
        ),
        Control(
            framework_id=iso27001.id,
            control_code="A.12.2",
            title="Protection from Malware",
            description="Controls against malware shall be implemented with appropriate awareness.",
            category="Operations Security",
            severity="High",
            guidance_text="Implement malware protection across all systems.",
            evidence_guidance="Provide: Antimalware policy, protection configurations, scan reports."
        ),
        Control(
            framework_id=iso27001.id,
            control_code="A.12.3",
            title="Backup",
            description="Backup copies of information shall be taken and tested regularly.",
            category="Operations Security",
            severity="High",
            guidance_text="Implement backup procedures with regular testing.",
            evidence_guidance="Provide: Backup policy, backup logs, restoration test results."
        ),
        Control(
            framework_id=iso27001.id,
            control_code="A.12.4",
            title="Logging and Monitoring",
            description="Event logs shall be produced, retained, and regularly reviewed.",
            category="Operations Security",
            severity="High",
            guidance_text="Implement comprehensive logging and monitoring.",
            evidence_guidance="Provide: Logging policy, log configurations, review procedures, sample logs."
        ),
        Control(
            framework_id=iso27001.id,
            control_code="A.12.5",
            title="Control of Operational Software",
            description="Procedures shall be implemented to control the installation of software.",
            category="Operations Security",
            severity="Medium",
            guidance_text="Implement software installation controls.",
            evidence_guidance="Provide: Software management policy, approved software list, installation procedures."
        ),
        Control(
            framework_id=iso27001.id,
            control_code="A.12.6",
            title="Technical Vulnerability Management",
            description="Information about technical vulnerabilities shall be obtained and evaluated.",
            category="Operations Security",
            severity="High",
            guidance_text="Implement vulnerability management program.",
            evidence_guidance="Provide: Vulnerability management policy, scan results, remediation records."
        ),
        Control(
            framework_id=iso27001.id,
            control_code="A.13.1",
            title="Network Security Management",
            description="Networks shall be managed and controlled to protect information in systems.",
            category="Communications Security",
            severity="High",
            guidance_text="Implement network security controls and segmentation.",
            evidence_guidance="Provide: Network security policy, architecture diagrams, firewall rules."
        ),
        Control(
            framework_id=iso27001.id,
            control_code="A.13.2",
            title="Information Transfer",
            description="Policies and procedures shall be in place to protect information transfer.",
            category="Communications Security",
            severity="High",
            guidance_text="Implement secure information transfer procedures.",
            evidence_guidance="Provide: Data transfer policy, encryption requirements, transfer logs."
        ),
        Control(
            framework_id=iso27001.id,
            control_code="A.14.1",
            title="Security Requirements of Information Systems",
            description="Security requirements shall be included in requirements for new systems.",
            category="System Development",
            severity="High",
            guidance_text="Integrate security into system development lifecycle.",
            evidence_guidance="Provide: SDLC documentation, security requirements, design reviews."
        ),
        Control(
            framework_id=iso27001.id,
            control_code="A.14.2",
            title="Security in Development",
            description="Rules for the development of software shall be established and applied.",
            category="System Development",
            severity="High",
            guidance_text="Implement secure development practices.",
            evidence_guidance="Provide: Secure coding standards, code review records, security testing results."
        ),
        Control(
            framework_id=iso27001.id,
            control_code="A.15.1",
            title="Supplier Relationships",
            description="Security requirements shall be agreed with suppliers.",
            category="Supplier Relationships",
            severity="High",
            guidance_text="Implement supplier security requirements and assessments.",
            evidence_guidance="Provide: Supplier security policy, contracts, assessment records."
        ),
        Control(
            framework_id=iso27001.id,
            control_code="A.16.1",
            title="Management of Security Incidents",
            description="Responsibilities and procedures shall be established for security incidents.",
            category="Incident Management",
            severity="Critical",
            guidance_text="Implement incident management procedures.",
            evidence_guidance="Provide: Incident response plan, incident records, lessons learned."
        ),
        Control(
            framework_id=iso27001.id,
            control_code="A.17.1",
            title="Information Security Continuity",
            description="Information security continuity shall be embedded in business continuity.",
            category="Business Continuity",
            severity="High",
            guidance_text="Integrate information security into business continuity planning.",
            evidence_guidance="Provide: BCP with security requirements, DR plans, test results."
        ),
        Control(
            framework_id=iso27001.id,
            control_code="A.18.1",
            title="Compliance with Legal Requirements",
            description="All relevant requirements shall be explicitly identified and documented.",
            category="Compliance",
            severity="High",
            guidance_text="Identify and document applicable legal and regulatory requirements.",
            evidence_guidance="Provide: Legal requirements register, compliance assessments, audit records."
        ),
        Control(
            framework_id=iso27001.id,
            control_code="A.18.2",
            title="Information Security Reviews",
            description="Independent review of information security shall be conducted regularly.",
            category="Compliance",
            severity="Medium",
            guidance_text="Conduct periodic independent security reviews.",
            evidence_guidance="Provide: Review schedule, audit reports, remediation tracking."
        ),
    ]
    
    # GDPR Controls
    gdpr_controls = [
        Control(
            framework_id=gdpr.id,
            control_code="GDPR-5",
            title="Principles of Processing",
            description="Personal data shall be processed lawfully, fairly and in a transparent manner.",
            category="Principles",
            severity="Critical",
            guidance_text="Ensure all processing activities comply with the six principles of GDPR.",
            evidence_guidance="Provide: Data processing documentation, legal basis records, transparency notices."
        ),
        Control(
            framework_id=gdpr.id,
            control_code="GDPR-6",
            title="Lawfulness of Processing",
            description="Processing shall be lawful only if at least one legal basis applies.",
            category="Lawful Basis",
            severity="Critical",
            guidance_text="Document legal basis for each processing activity.",
            evidence_guidance="Provide: Legal basis documentation, consent records, contract references."
        ),
        Control(
            framework_id=gdpr.id,
            control_code="GDPR-7",
            title="Conditions for Consent",
            description="Where consent is the legal basis, controller must demonstrate valid consent.",
            category="Consent",
            severity="High",
            guidance_text="Implement proper consent collection and management.",
            evidence_guidance="Provide: Consent forms, consent logs, withdrawal mechanisms."
        ),
        Control(
            framework_id=gdpr.id,
            control_code="GDPR-12",
            title="Transparent Information",
            description="The controller shall provide information to data subjects in a clear manner.",
            category="Data Subject Rights",
            severity="High",
            guidance_text="Provide clear and accessible privacy notices.",
            evidence_guidance="Provide: Privacy notices, layered notices, communication templates."
        ),
        Control(
            framework_id=gdpr.id,
            control_code="GDPR-13",
            title="Information at Collection",
            description="Information shall be provided to data subjects at the time of data collection.",
            category="Data Subject Rights",
            severity="High",
            guidance_text="Provide privacy information at point of data collection.",
            evidence_guidance="Provide: Collection notices, form privacy statements, verbal scripts."
        ),
        Control(
            framework_id=gdpr.id,
            control_code="GDPR-15",
            title="Right of Access",
            description="Data subjects have the right to obtain confirmation and access to their data.",
            category="Data Subject Rights",
            severity="High",
            guidance_text="Implement subject access request (SAR) procedures.",
            evidence_guidance="Provide: SAR procedures, request forms, response templates, tracking logs."
        ),
        Control(
            framework_id=gdpr.id,
            control_code="GDPR-16",
            title="Right to Rectification",
            description="Data subjects have the right to have inaccurate personal data corrected.",
            category="Data Subject Rights",
            severity="Medium",
            guidance_text="Implement procedures to correct inaccurate data upon request.",
            evidence_guidance="Provide: Rectification procedures, request tracking, correction logs."
        ),
        Control(
            framework_id=gdpr.id,
            control_code="GDPR-17",
            title="Right to Erasure",
            description="Data subjects have the right to have their personal data erased.",
            category="Data Subject Rights",
            severity="High",
            guidance_text="Implement data deletion procedures (right to be forgotten).",
            evidence_guidance="Provide: Erasure procedures, deletion logs, exception documentation."
        ),
        Control(
            framework_id=gdpr.id,
            control_code="GDPR-20",
            title="Right to Data Portability",
            description="Data subjects have the right to receive their data in a portable format.",
            category="Data Subject Rights",
            severity="Medium",
            guidance_text="Implement data export capabilities in machine-readable format.",
            evidence_guidance="Provide: Export procedures, format specifications, sample exports."
        ),
        Control(
            framework_id=gdpr.id,
            control_code="GDPR-25",
            title="Data Protection by Design",
            description="Appropriate measures shall be implemented both at design time and processing time.",
            category="Privacy by Design",
            severity="High",
            guidance_text="Integrate privacy into system design and development.",
            evidence_guidance="Provide: Privacy requirements, design documentation, privacy reviews."
        ),
        Control(
            framework_id=gdpr.id,
            control_code="GDPR-28",
            title="Processor Requirements",
            description="Processing by a processor shall be governed by a contract or legal act.",
            category="Processors",
            severity="High",
            guidance_text="Ensure all data processors have appropriate contracts.",
            evidence_guidance="Provide: Data processing agreements, processor list, contract templates."
        ),
        Control(
            framework_id=gdpr.id,
            control_code="GDPR-30",
            title="Records of Processing",
            description="Each controller shall maintain records of processing activities.",
            category="Accountability",
            severity="Critical",
            guidance_text="Maintain comprehensive records of all processing activities.",
            evidence_guidance="Provide: Records of processing activities (ROPA), data inventory."
        ),
        Control(
            framework_id=gdpr.id,
            control_code="GDPR-32",
            title="Security of Processing",
            description="Appropriate technical and organizational measures shall be implemented.",
            category="Security",
            severity="Critical",
            guidance_text="Implement appropriate security measures for personal data.",
            evidence_guidance="Provide: Security measures documentation, risk assessments, controls evidence."
        ),
        Control(
            framework_id=gdpr.id,
            control_code="GDPR-33",
            title="Breach Notification to Authority",
            description="Personal data breaches shall be notified to supervisory authority within 72 hours.",
            category="Breach Notification",
            severity="Critical",
            guidance_text="Implement breach detection and notification procedures.",
            evidence_guidance="Provide: Breach response procedures, notification templates, breach log."
        ),
        Control(
            framework_id=gdpr.id,
            control_code="GDPR-34",
            title="Breach Notification to Data Subjects",
            description="When breach poses high risk, data subjects shall be notified without undue delay.",
            category="Breach Notification",
            severity="Critical",
            guidance_text="Implement data subject notification procedures for high-risk breaches.",
            evidence_guidance="Provide: Subject notification procedures, templates, communication records."
        ),
        Control(
            framework_id=gdpr.id,
            control_code="GDPR-35",
            title="Data Protection Impact Assessment",
            description="DPIA shall be carried out for processing likely to result in high risk.",
            category="Risk Assessment",
            severity="High",
            guidance_text="Conduct DPIAs for high-risk processing activities.",
            evidence_guidance="Provide: DPIA template, completed DPIAs, approval records."
        ),
        Control(
            framework_id=gdpr.id,
            control_code="GDPR-37",
            title="Data Protection Officer",
            description="A DPO shall be designated in certain circumstances.",
            category="Governance",
            severity="Medium",
            guidance_text="Designate DPO if required, or document why not required.",
            evidence_guidance="Provide: DPO appointment records, DPO contact details, or requirement assessment."
        ),
        Control(
            framework_id=gdpr.id,
            control_code="GDPR-44",
            title="International Transfers",
            description="Transfers to third countries shall only occur under certain conditions.",
            category="International Transfers",
            severity="High",
            guidance_text="Ensure appropriate safeguards for international data transfers.",
            evidence_guidance="Provide: Transfer assessment, SCCs, adequacy decisions, transfer records."
        ),
    ]
    
    db.add_all(soc2_controls)
    db.add_all(iso27001_controls)
    db.add_all(gdpr_controls)
    await db.commit()