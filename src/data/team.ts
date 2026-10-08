import type { Lang } from '@/i18n/ui';
export const getTeam = (lang: Lang) => {
  const en = lang === 'en';
  return [
    { name: 'Aritz Jaber Lopes', image: 'aritz-9819.webp', role: en ? 'Co-founder · Technical lead' : 'Cofundador · Dirección técnica', description: en ? 'Leads consulting, architecture and technical definition. Connects product needs with evaluation and delivery criteria.' : 'Lidera la consultoría, la arquitectura y la definición técnica. Conecta las necesidades del producto con los criterios de evaluación y entrega.', linkedin: 'https://www.linkedin.com/in/aritzjl/', profileHref: en ? '/en/aritz' : '/aritz' },
    { name: 'Ángel Jiménez', image: 'angel-jimenez.webp', role: 'AI & Full Stack Developer', description: en ? 'Builds AI features and full stack applications, connecting interfaces, APIs and business logic into a complete product.' : 'Desarrolla funcionalidades de IA y aplicaciones full stack, conectando interfaces, APIs y lógica de negocio en un producto completo.', linkedin: 'https://www.linkedin.com/in/angel-jimenezz/' },
    { name: 'Rubén García Hernando', image: 'ruben-garcia.webp', role: en ? 'Senior software architect' : 'Arquitecto de software senior', description: en ? 'Brings experience in complex systems, infrastructure and AI. Founder of Zetesis, with a background at CERN.' : 'Aporta experiencia en sistemas complejos, infraestructura e IA. Fundador de Zetesis, con trayectoria en el CERN.', linkedin: 'https://www.linkedin.com/in/rgarciah/', website: 'https://zetesis.xyz/', websiteLabel: 'Zetesis' },
    { name: 'Artem Pysmak', image: 'artem-pysmak.webp', role: 'AI Engineer', description: en ? 'Works on AI engineering and backend development, connecting models and tools with application logic.' : 'Trabaja en ingeniería de IA y desarrollo backend, conectando modelos y herramientas con la lógica de las aplicaciones.', linkedin: 'https://www.linkedin.com/in/artem-pysmak-a97313293/' },
  ];
};
