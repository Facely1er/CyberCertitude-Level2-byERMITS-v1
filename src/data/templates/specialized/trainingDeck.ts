/**
 * CMMC Awareness Training Deck Template
 * 17-slide comprehensive presentation for CMMC 2.0 compliance training
 */

export interface TrainingSlide {
  id: string;
  title: string;
  content: string;
  duration: number; // minutes
  objectives: string[];
  keyPoints: string[];
}

export interface TrainingModule {
  id: string;
  name: string;
  description: string;
  duration: number;
  slides: TrainingSlide[];
  targetAudience: string[];
  prerequisites: string[];
  learningObjectives: string[];
}

export interface TrainingDeckTemplate {
  id: string;
  name: string;
  category: 'specialized';
  type: 'training-deck';
  controls: string[];
  content: string;
  interactiveFields: {
    companyInfo: {
      name: { required: true; type: 'text'; placeholder: string };
      logo: { required: false; type: 'file'; placeholder: string };
      contact: { required: false; type: 'email'; placeholder: string };
    };
    trainingInfo: {
      presenter: { required: true; type: 'text'; placeholder: string };
      department: { required: true; type: 'text'; placeholder: string };
      duration: { required: true; type: 'number'; placeholder: string };
      targetAudience: { required: true; type: 'select'; options: string[] };
    };
    modules: TrainingModule[];
  };
  metadata: {
    version: string;
    lastUpdated: string;
    estimatedSlides: number;
    complexity: 'medium';
    targetAudience: string[];
  };
}

export const cmmcAwarenessTrainingDeck: TrainingDeckTemplate = {
  id: 'cmmc-awareness-training-deck',
  name: 'CMMC Awareness Training Deck',
  category: 'specialized',
  type: 'training-deck',
  controls: ['AT.2.056', 'AT.2.057'],
  content: `# CMMC AWARENESS TRAINING DECK
## 17-Slide Comprehensive Presentation

**Training Module:** CMMC 2.0 Overview and Responsibilities
**Duration:** 30-45 minutes
**Target Audience:** All personnel with CUI access
**Presenter:** Security Team / CISO

---

## SLIDE 1: TITLE SLIDE
**CMMC 2.0 Security Awareness Training**
**Protecting Controlled Unclassified Information (CUI)**

[Company Logo]
{{today}}

---

## SLIDE 2: TRAINING OBJECTIVES

**By the end of this training, you will understand:**
✓ What is CMMC and why it matters
✓ What is CUI and how to identify it
✓ Your individual responsibilities
✓ How to handle CUI properly
✓ How to report security incidents
✓ Consequences of non-compliance

---

## SLIDE 3: WHAT IS CMMC?

**Cybersecurity Maturity Model Certification (CMMC)**

- DoD requirement for all contractors
- Ensures protection of sensitive information
- Three levels of certification (we need Level 2)
- 110 security controls at Level 2
- Third-party assessment required
- Certification mandatory for DoD contracts

**Impact:** Without CMMC certification, we cannot bid on or retain DoD contracts

---

## SLIDE 4: WHAT IS CUI?

**Controlled Unclassified Information (CUI)**

**Definition:** Sensitive information that requires safeguarding but is not classified

**Examples in our organization:**
- Technical drawings and specifications
- Export-controlled technical data (ITAR/EAR)
- Contract pricing information
- Procurement sensitive information
- Engineering designs for DoD projects

**Not CUI:**
- Public information
- General business communications
- Non-DoD project information

---

## SLIDE 5: IDENTIFYING CUI

**How to recognize CUI:**

✓ **CUI Markings:**
   - Header: "CONTROLLED UNCLASSIFIED INFORMATION"
   - Footer: Distribution statements
   - Banner markings on each page

✓ **Context Clues:**
   - Related to DoD contracts
   - Technical or pricing data
   - Export controlled
   - Marked as "Proprietary"

**When in doubt:** Treat as CUI and ask your manager!

---

## SLIDE 6: YOUR RESPONSIBILITIES

**Everyone's Role in Security:**

1. **Identify CUI** - Recognize what information needs protection
2. **Protect CUI** - Follow security procedures
3. **Report Incidents** - Alert security team immediately
4. **Follow Policies** - Comply with all security requirements
5. **Stay Vigilant** - Watch for suspicious activities

**Remember:** Security is everyone's responsibility!

---

## SLIDE 7: CUI HANDLING PROCEDURES

**When Working with CUI:**

✓ **Storage:** Use approved systems only
✓ **Transmission:** Encrypt when sending externally
✓ **Access:** Only authorized personnel
✓ **Disposal:** Secure destruction required
✓ **Marking:** Properly label all CUI documents

**Never:** Email CUI without encryption or store on personal devices

---

## SLIDE 8: ACCESS CONTROL BASICS

**Principle of Least Privilege:**
- Only access what you need for your job
- Don't share accounts or passwords
- Log out when finished
- Report suspicious access requests

**Strong Passwords:**
- Minimum 12 characters
- Mix of letters, numbers, symbols
- Unique for each system
- Change regularly

---

## SLIDE 9: PHYSICAL SECURITY

**Workspace Security:**
- Lock screens when away
- Secure CUI documents
- Clean desk policy
- Visitor procedures

**Device Security:**
- Lock devices when unattended
- Use approved devices only
- Report lost/stolen devices immediately
- No personal devices for CUI work

---

## SLIDE 10: INCIDENT RESPONSE

**What is a Security Incident?**
- Suspected data breach
- Malware infection
- Unauthorized access
- Lost/stolen device
- Phishing attempts

**What to Do:**
1. **Stop** - Don't continue the activity
2. **Report** - Contact security team immediately
3. **Preserve** - Don't delete evidence
4. **Document** - Record what happened

---

## SLIDE 11: PHISHING AWARENESS

**Common Phishing Tactics:**
- Urgent requests for information
- Suspicious links or attachments
- Requests for passwords or credentials
- Impersonation of colleagues or vendors

**Red Flags:**
- Unexpected emails
- Poor grammar/spelling
- Suspicious sender addresses
- Requests for sensitive information

**When in doubt:** Verify through another channel!

---

## SLIDE 12: SOCIAL ENGINEERING

**Social Engineering Attacks:**
- Phone calls requesting information
- Impersonation of IT support
- Tailgating into secure areas
- Dumpster diving for information

**Defense:**
- Verify identity before sharing information
- Challenge unexpected requests
- Follow established procedures
- Report suspicious behavior

---

## SLIDE 13: MOBILE DEVICE SECURITY

**Mobile Device Risks:**
- Lost or stolen devices
- Unsecured Wi-Fi networks
- Malicious apps
- Physical access to devices

**Best Practices:**
- Use company-approved devices
- Enable device encryption
- Keep software updated
- Use VPN on public Wi-Fi
- Enable remote wipe capability

---

## SLIDE 14: REMOTE WORK SECURITY

**Working from Home:**
- Use company VPN
- Secure home Wi-Fi
- Lock devices when unattended
- Use approved cloud services only
- Maintain physical security

**Never:**
- Work on public Wi-Fi without VPN
- Use personal cloud storage for CUI
- Leave devices unattended in public
- Share screens with CUI visible

---

## SLIDE 15: CONSEQUENCES OF NON-COMPLIANCE

**Individual Consequences:**
- Disciplinary action
- Loss of access privileges
- Termination of employment
- Legal liability

**Organizational Consequences:**
- Loss of DoD contracts
- Financial penalties
- Reputation damage
- CMMC certification failure

**Remember:** Your actions affect everyone!

---

## SLIDE 16: REPORTING AND RESOURCES

**How to Report:**
- Security Team: {{securityContact}}
- IT Help Desk: {{itContact}}
- Anonymous Hotline: {{hotlineNumber}}
- Email: {{securityEmail}}

**Resources:**
- Security Policy Portal
- Training Materials
- Incident Response Procedures
- CMMC Compliance Guide

---

## SLIDE 17: QUESTIONS AND NEXT STEPS

**Questions?**

**Next Steps:**
1. Complete post-training assessment
2. Sign acknowledgment form
3. Review security policies
4. Report any concerns immediately

**Remember:** Security is an ongoing responsibility!

**Thank you for your attention and commitment to security!**

---

**Training Completion:**
- Date: {{today}}
- Presenter: {{presenter}}
- Attendees: {{attendeeCount}}
- Assessment Score: {{assessmentScore}}`,
  interactiveFields: {
    companyInfo: {
      name: { required: true, type: 'text', placeholder: 'Enter company name' },
      logo: { required: false, type: 'file', placeholder: 'Upload company logo' },
      contact: { required: false, type: 'email', placeholder: 'contact@company.com' }
    },
    trainingInfo: {
      presenter: { required: true, type: 'text', placeholder: 'Security Team / CISO' },
      department: { required: true, type: 'text', placeholder: 'Security Department' },
      duration: { required: true, type: 'number', placeholder: '30-45 minutes' },
      targetAudience: { required: true, type: 'select', options: ['All Personnel', 'CUI Access Personnel', 'IT Staff', 'Management', 'Contractors'] }
    },
    modules: [
      {
        id: 'module-1',
        name: 'CMMC Overview',
        description: 'Introduction to CMMC 2.0 and its importance',
        duration: 10,
        slides: [
          {
            id: 'slide-1',
            title: 'Title Slide',
            content: 'CMMC 2.0 Security Awareness Training',
            duration: 1,
            objectives: ['Introduce training session'],
            keyPoints: ['Company branding', 'Training title']
          },
          {
            id: 'slide-2',
            title: 'Training Objectives',
            content: 'What participants will learn',
            duration: 2,
            objectives: ['Set clear expectations'],
            keyPoints: ['CMMC understanding', 'CUI identification', 'Responsibilities']
          },
          {
            id: 'slide-3',
            title: 'What is CMMC?',
            content: 'Cybersecurity Maturity Model Certification overview',
            duration: 3,
            objectives: ['Explain CMMC purpose'],
            keyPoints: ['DoD requirement', '110 controls', 'Certification process']
          },
          {
            id: 'slide-4',
            title: 'What is CUI?',
            content: 'Controlled Unclassified Information definition and examples',
            duration: 4,
            objectives: ['Define CUI'],
            keyPoints: ['CUI definition', 'Examples', 'Non-CUI examples']
          }
        ],
        targetAudience: ['All Personnel'],
        prerequisites: ['Basic computer literacy'],
        learningObjectives: ['Understand CMMC requirements', 'Identify CUI']
      }
    ]
  },
  metadata: {
    version: '1.0',
    lastUpdated: '2025-01-07',
    estimatedSlides: 17,
    complexity: 'medium',
    targetAudience: ['All Personnel', 'Security Team', 'Training Department', 'C3PAO Assessors']
  }
};

export function customizeTrainingDeck(template: TrainingDeckTemplate, customizations: any): string {
  let content = template.content;
  
  // Replace placeholders with customizations
  const replacements = {
    '{{today}}': new Date().toLocaleDateString(),
    '{{presenter}}': customizations.presenter || '[Security Team / CISO]',
    '{{securityContact}}': customizations.securityContact || '[Security Team Contact]',
    '{{itContact}}': customizations.itContact || '[IT Help Desk]',
    '{{hotlineNumber}}': customizations.hotlineNumber || '[Anonymous Hotline]',
    '{{securityEmail}}': customizations.securityEmail || '[security@company.com]',
    '{{attendeeCount}}': customizations.attendeeCount || '[Number]',
    '{{assessmentScore}}': customizations.assessmentScore || '[Score]'
  };
  
  Object.entries(replacements).forEach(([placeholder, value]) => {
    content = content.replace(new RegExp(placeholder, 'g'), value);
  });
  
  return content;
}
