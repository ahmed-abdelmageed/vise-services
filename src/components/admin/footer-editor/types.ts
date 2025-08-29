
export interface QuickLink {
  id: string;
  label: string;
  labelAr: string;
  url: string;
}

export interface FooterData {
  websiteName: string;
  email: string;
  phone: string;
  vatNumber: string;
  crNumber: string;
  tradeName: string;
  quickLinks: QuickLink[];
}
