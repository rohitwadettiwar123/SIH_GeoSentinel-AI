export type PageId =
  | 'login'
  | 'dashboard'
  | 'semantic-search'
  | 'change-analysis'
  | 'similar-sites'
  | 'tactical'
  | 'explorer3d'
  | 'ask-ai'
  | 'evidence'
  | 'data-ingestion'
  | 'settings'
  | 'reports';

export interface NavItem {
  id: PageId;
  label: string;
  icon: string;
}
