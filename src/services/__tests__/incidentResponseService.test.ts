import { describe, it, expect, beforeEach, vi } from 'vitest';
import incidentResponseService, {
  IncidentResponseService,
  IncidentResponsePlan,
  IncidentClassification,
  ResponsePhase
} from '../incidentResponseService';

// Mock supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ data: [], error: null }),
      update: vi.fn().mockResolvedValue({ data: [], error: null }),
      delete: vi.fn().mockResolvedValue({ data: [], error: null })
    }))
  }
}));

describe('IncidentResponseService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = incidentResponseService;
      const instance2 = incidentResponseService;
      expect(instance1).toBe(instance2);
    });
  });

  describe('createIncidentResponsePlan', () => {
    it('should create a basic incident response plan', async () => {
      const planData: Partial<IncidentResponsePlan> = {
        title: 'Test IR Plan',
        organization: 'Test Org',
        version: '1.0'
      };

      const plan = await incidentResponseService.createIncidentResponsePlan(planData);

      expect(plan).toBeDefined();
      expect(plan.id).toBeDefined();
      expect(plan.title).toBe('Test IR Plan');
      expect(plan.organization).toBe('Test Org');
      expect(plan.version).toBe('1.0');
      expect(plan.effectiveDate).toBeInstanceOf(Date);
      expect(plan.reviewDate).toBeInstanceOf(Date);
    });

    it('should use defaults when optional fields are not provided', async () => {
      const plan = await incidentResponseService.createIncidentResponsePlan({});

      expect(plan.title).toBe('Incident Response Plan');
      expect(plan.version).toBe('1.0');
      expect(plan.classifications).toBeInstanceOf(Array);
      expect(plan.classifications.length).toBeGreaterThan(0);
      expect(plan.responseTeam).toBeInstanceOf(Array);
      expect(plan.communicationTemplates).toBeInstanceOf(Array);
      expect(plan.escalationProcedures).toBeInstanceOf(Array);
      expect(plan.responsePhases).toBeInstanceOf(Array);
    });

    it('should include default classifications', async () => {
      const plan = await incidentResponseService.createIncidentResponsePlan({});

      expect(plan.classifications.length).toBeGreaterThan(0);
      plan.classifications.forEach(classification => {
        expect(classification.category).toBeDefined();
        expect(classification.severity).toBeDefined();
        expect(classification.priority).toBeGreaterThan(0);
        expect(classification.responseTime).toBeDefined();
        expect(classification.cmmcControls).toBeInstanceOf(Array);
      });
    });

    it('should include CUI spillage classification', async () => {
      const plan = await incidentResponseService.createIncidentResponsePlan({});
      const cuiSpillage = plan.classifications.find(c => c.category === 'cui-spillage');

      expect(cuiSpillage).toBeDefined();
      expect(cuiSpillage?.severity).toBe('critical');
      expect(cuiSpillage?.cuiInvolved).toBe(true);
      expect(cuiSpillage?.externalReportingRequired).toBe(true);
      expect(cuiSpillage?.escalationRequired).toBe(true);
    });
  });

  describe('getDefaultClassifications', () => {
    it('should return array of incident classifications', () => {
      // Access the private method through the instance
      const service = incidentResponseService as any;
      const classifications = service.getDefaultClassifications();

      expect(classifications).toBeInstanceOf(Array);
      expect(classifications.length).toBeGreaterThan(0);
    });
  });

  describe('getDefaultCommunicationTemplates', () => {
    it('should return array of communication templates', () => {
      const service = incidentResponseService as any;
      const templates = service.getDefaultCommunicationTemplates();

      expect(templates).toBeInstanceOf(Array);
      expect(templates.length).toBeGreaterThan(0);
      
      templates.forEach((template: any) => {
        expect(template.id).toBeDefined();
        expect(template.name).toBeDefined();
        expect(template.type).toBeDefined();
        expect(template.subject).toBeDefined();
        expect(template.body).toBeDefined();
        expect(template.recipients).toBeInstanceOf(Array);
      });
    });

    it('should include initial incident notification template', () => {
      const service = incidentResponseService as any;
      const templates = service.getDefaultCommunicationTemplates();
      const initialTemplate = templates.find((t: any) => t.name.includes('Initial Incident Notification'));

      expect(initialTemplate).toBeDefined();
      expect(initialTemplate.type).toBe('internal');
    });
  });

  describe('getDefaultEscalationProcedures', () => {
    it('should return array of escalation procedures', () => {
      const service = incidentResponseService as any;
      const procedures = service.getDefaultEscalationProcedures();

      expect(procedures).toBeInstanceOf(Array);
      expect(procedures.length).toBeGreaterThan(0);
      
      procedures.forEach((proc: any) => {
        expect(proc.level).toBeGreaterThan(0);
        expect(proc.name).toBeDefined();
        expect(proc.triggerConditions).toBeInstanceOf(Array);
        expect(proc.notificationMethod).toBeInstanceOf(Array);
        expect(proc.timeframe).toBeDefined();
      });
    });

    it('should include external authorities escalation level', () => {
      const service = incidentResponseService as any;
      const procedures = service.getDefaultEscalationProcedures();
      const externalLevel = procedures.find((p: any) => p.name.includes('External Authorities'));

      expect(externalLevel).toBeDefined();
      expect(externalLevel.level).toBe(4);
    });
  });

  describe('getDefaultResponsePhases', () => {
    it('should return all response phases', () => {
      const service = incidentResponseService as any;
      const phases = service.getDefaultResponsePhases();

      expect(phases).toBeInstanceOf(Array);
      expect(phases.length).toBeGreaterThan(0);
      
      const phaseNames = phases.map((p: any) => p.phase);
      expect(phaseNames).toContain('preparation');
      expect(phaseNames).toContain('detection');
      expect(phaseNames).toContain('containment');
      expect(phaseNames).toContain('eradication');
      expect(phaseNames).toContain('recovery');
      expect(phaseNames).toContain('post-incident');
    });

    it('should include activities for each phase', () => {
      const service = incidentResponseService as any;
      const phases = service.getDefaultResponsePhases();

      phases.forEach((phase: any) => {
        expect(phase.activities).toBeInstanceOf(Array);
        expect(phase.activities.length).toBeGreaterThan(0);
        
        phase.activities.forEach((activity: any) => {
          expect(activity.id).toBeDefined();
          expect(activity.name).toBeDefined();
          expect(activity.description).toBeDefined();
          expect(activity.responsibleRole).toBeDefined();
          expect(activity.steps).toBeInstanceOf(Array);
        });
      });
    });
  });

  describe('getCMMCIncidentMappings', () => {
    it('should return CMMC control mappings', () => {
      const service = incidentResponseService as any;
      const mappings = service.getCMMCIncidentMappings();

      expect(mappings).toBeInstanceOf(Array);
      expect(mappings.length).toBeGreaterThan(0);
      
      mappings.forEach((mapping: any) => {
        expect(mapping.controlId).toBeDefined();
        expect(mapping.controlName).toBeDefined();
        expect(mapping.domain).toBeDefined();
        expect(mapping.incidentPhases).toBeInstanceOf(Array);
      });
    });

    it('should include IR.L2-3.6.1 control mapping', () => {
      const service = incidentResponseService as any;
      const mappings = service.getCMMCIncidentMappings();
      const irMapping = mappings.find((m: any) => m.controlId === 'IR.L2-3.6.1');

      expect(irMapping).toBeDefined();
      expect(irMapping.controlName).toContain('Incident Response');
    });
  });

  describe('getDefaultTrainingRequirements', () => {
    it('should return training requirements', () => {
      const service = incidentResponseService as any;
      const requirements = service.getDefaultTrainingRequirements();

      expect(requirements).toBeInstanceOf(Array);
      expect(requirements.length).toBeGreaterThan(0);
      
      requirements.forEach((req: any) => {
        expect(req.id).toBeDefined();
        expect(req.role).toBeDefined();
        expect(req.trainingType).toBeDefined();
        expect(req.frequency).toBeDefined();
        expect(req.duration).toBeDefined();
      });
    });
  });

  describe('getDefaultTestingSchedule', () => {
    it('should return testing schedule', () => {
      const service = incidentResponseService as any;
      const schedule = service.getDefaultTestingSchedule();

      expect(schedule).toBeInstanceOf(Array);
      expect(schedule.length).toBeGreaterThan(0);
      
      schedule.forEach((test: any) => {
        expect(test.id).toBeDefined();
        expect(test.testType).toBeDefined();
        expect(test.scenario).toBeDefined();
        expect(test.frequency).toBeDefined();
        expect(test.nextScheduled).toBeInstanceOf(Date);
      });
    });
  });

  describe('getDefaultMetrics', () => {
    it('should return default metrics', () => {
      const service = incidentResponseService as any;
      const metrics = service.getDefaultMetrics();

      expect(metrics).toBeDefined();
      expect(metrics.kpis).toBeInstanceOf(Array);
      expect(metrics.incidentTrends).toBeInstanceOf(Array);
      expect(metrics.responseEffectiveness).toBeInstanceOf(Array);
      expect(metrics.complianceMetrics).toBeInstanceOf(Array);
    });

    it('should include MTTD and MTTR KPIs', () => {
      const service = incidentResponseService as any;
      const metrics = service.getDefaultMetrics();
      const mttd = metrics.kpis.find((k: any) => k.name.includes('Mean Time to Detect'));
      const mttr = metrics.kpis.find((k: any) => k.name.includes('Mean Time to Respond'));

      expect(mttd).toBeDefined();
      expect(mttr).toBeDefined();
    });
  });

  describe('exportToHTML', () => {
    it('should export plan to HTML', async () => {
      const plan = await incidentResponseService.createIncidentResponsePlan({
        title: 'Test Plan',
        organization: 'Test Org'
      });

      const service = incidentResponseService as any;
      const html = await service.exportToHTML(plan);

      expect(html).toBeDefined();
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('Test Plan');
      expect(html).toContain('Test Org');
      expect(html).toContain('<html');
      expect(html).toContain('</html>');
    });

    it('should include all plan sections in HTML', async () => {
      const plan = await incidentResponseService.createIncidentResponsePlan({
        title: 'Test Plan'
      });

      const service = incidentResponseService as any;
      const html = await service.exportToHTML(plan);

      expect(html).toContain('Incident Classifications');
      expect(html).toContain('Response Team');
      expect(html).toContain('Incident Response Phases');
      expect(html).toContain('Escalation Procedures');
      expect(html).toContain('Communication Templates');
      expect(html).toContain('CMMC Compliance Mapping');
    });

    it('should format classifications in HTML', async () => {
      const plan = await incidentResponseService.createIncidentResponsePlan({
        title: 'Test Plan'
      });

      const service = incidentResponseService as any;
      const html = await service.exportToHTML(plan);

      // Should include classification cards
      expect(html).toContain('classification-card');
      expect(html).toContain('severity-critical');
    });
  });
});

