import { TemplateLibraryBrowser } from '../components/LazyComponents';
import { TemplateCustomizationRoute } from './TemplateCustomizationRoute';

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
  }
];
