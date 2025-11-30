import { TemplateLibraryBrowser } from '../components/TemplateLibraryBrowser';
import { TemplateCustomizationRoute } from './TemplateCustomizationRoute';
import ComplianceToolkit from '../components/ComplianceToolkit';
import ScenarioTemplates from '../components/ScenarioTemplates';

export const templateRoutes = [
  {
    path: "/templates/library",
    element: TemplateLibraryBrowser,
    title: "Template Library"
  },
  {
    path: "/templates/customize/:templateId",
    element: TemplateCustomizationRoute,
    title: "Template Customization"
  },
  {
    path: "/templates/compliance-toolkit",
    element: ComplianceToolkit,
    title: "Compliance Toolkit"
  },
  {
    path: "/templates/scenarios",
    element: ScenarioTemplates,
    title: "Scenario Templates"
  }
];
