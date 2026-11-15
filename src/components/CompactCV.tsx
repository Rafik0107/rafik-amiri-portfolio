import { portfolio, t, type Lang } from "@/lib/content";

/** One-page CV used only for printing / PDF export. The web page keeps the detailed version. */
export default function CompactCV({ lang }: { lang: Lang }) {
  const fr = lang === "fr";
  const pr = portfolio.profile;
  const L = (f: string, e: string) => (fr ? f : e);
  const site = "rafik-amiri-portfolio.vercel.app";

  const H = ({ children }: { children: React.ReactNode }) => (
    <h2 className="cv1-h">{children}</h2>
  );
  const Item = ({ head, when, sub, children }: { head: string; when?: string; sub?: string; children?: React.ReactNode }) => (
    <div className="cv1-item">
      <div className="cv1-row"><strong>{head}</strong>{when && <span className="cv1-when">{when}</span>}</div>
      {sub && <div className="cv1-sub">{sub}</div>}
      {children && <div className="cv1-txt">{children}</div>}
    </div>
  );

  const internships = portfolio.internships.filter((e) => e.start);
  const projects = fr
    ? [
        ["Application web Smart Factory", "Angular, JavaScript", "Supervision de processus industriels, réalisée en stage chez WiKeys."],
        ["12 projets Python d’ingénierie", "Python, NumPy, tests", "Régulation PID, filtre de Kalman, cinématique de bras, A*, vision, signal ; 41 tests automatisés."],
        ["Ligne de production robotisée Arduino", "Arduino", "Maquette de ligne de production robotisée pilotée par Arduino."],
        ["Simulation de production Factory I/O", "Factory I/O", "Simulation d’un procédé de production automatisé."],
      ]
    : [
        ["Smart Factory web application", "Angular, JavaScript", "Industrial process monitoring, built during the WiKeys internship."],
        ["12 Python engineering projects", "Python, NumPy, tests", "PID control, Kalman filter, arm kinematics, A*, vision, signal; 41 automated tests."],
        ["Arduino robotic production line", "Arduino", "Robotic production-line model controlled by Arduino."],
        ["Factory I/O production simulation", "Factory I/O", "Simulation of an automated production process."],
      ];

  return (
    <article className="cv1 hidden print:block">
      <header className="cv1-head">
        <div>
          <p className="cv1-name">RAFIK AMIRI <span>(RAIDEN)</span></p>
          <p className="cv1-title">{L("Master 1 Automatique et Robotique — Mécatronique Design for Health · Sorbonne Université", "Master 1 Automation and Robotics — Mechatronics Design for Health · Sorbonne Université")}</p>
          <p className="cv1-avail">{t(pr.availability, lang)}</p>
        </div>
        <p className="cv1-contact">Paris<br />{pr.links.email}<br />{site}<br />github.com/Rafik0107</p>
      </header>

      <div className="cv1-grid">
        <div>
          <H>{L("Formation", "Education")}</H>
          {portfolio.education.map((e) => <Item key={e.id} head={t(e.title, lang)} when={t(e.period, lang)} sub={`${t(e.org, lang)} — ${e.place}`} />)}

          <H>{L("Stages", "Internships")}</H>
          {internships.map((e) => <Item key={e.id} head={`${t(e.title, lang)} — ${t(e.org, lang)}`} when={t(e.period, lang)} sub={e.place}>{t(e.details, lang)}</Item>)}

          <H>{L("Projets", "Projects")}</H>
          {projects.map(([h, tech, txt]) => <Item key={h} head={h} when={tech}>{txt}</Item>)}

          <H>{L("Expérience professionnelle", "Work experience")}</H>
          <Item head={L("Sandwich Artist / Équipier polyvalent — Subway", "Sandwich Artist / Crew member — Subway")} when={L("1 an et 8 mois", "1 year 8 months")} sub={L("Paris — 4 établissements", "Paris — 4 restaurants")}>
            {L("Accueil, préparation, commandes, encaissement, livraisons, normes HACCP.", "Customer service, preparation, orders, cash handling, deliveries, HACCP standards.")}
          </Item>
          <Item head={L("Missions en hôtellerie-restauration — Auto-entrepreneur", "Hospitality assignments — Self-employed")} sub="Île-de-France">
            {L("Chef de rang (Le Balthazar, Gonesse), employé polyvalent (Taksim, Paris), serveur (Le 130, Boulogne-Billancourt).", "Chef de rang (Le Balthazar, Gonesse), restaurant staff (Taksim, Paris), waiter (Le 130, Boulogne-Billancourt).")}
          </Item>
          <Item head={L("Commerce, service et production", "Retail, service and production")} sub={L("Algérie", "Algeria")}>
            {L("Caissier (bureau de tabac), employé polyvalent (Carrefour City Center), serveur (La Rambla), livraison et production (usine de noix, Boumerdès).", "Cashier (tobacconist), store staff (Carrefour City Center), waiter (La Rambla), delivery and production (nut factory, Boumerdès).")}
          </Item>
          <Item head={L("Photographe freelance · E-commerce — Auto-entrepreneur", "Freelance photographer · E-commerce — Self-employed")}>
            {L("Portraits, événements, retouche, communication ; vente en ligne (cosmétiques, produits digitaux).", "Portraits, events, retouching, communication; online sales (cosmetics, digital products).")}
          </Item>
        </div>

        <aside>
          <H>{L("Compétences", "Skills")}</H>
          <p className="cv1-txt"><strong>{L("Automatique", "Control")}</strong> : MATLAB/Simulink, PID, Kalman, {L("automates", "PLC")}, Factory I/O, Arduino</p>
          <p className="cv1-txt"><strong>{L("Programmation", "Programming")}</strong> : Python, C/C++, Java, JavaScript, TypeScript</p>
          <p className="cv1-txt"><strong>Web</strong> : Angular, Node.js, Flutter, Git</p>
          <p className="cv1-txt"><strong>{L("Création", "Creative")}</strong> : {L("photographie, retouche, design graphique, Adobe CC", "photography, retouching, graphic design, Adobe CC")}</p>
          <p className="cv1-txt"><strong>{L("Relationnel", "Interpersonal")}</strong> : {L("relation client, travail en équipe, adaptabilité", "customer relations, teamwork, adaptability")}</p>

          <H>{L("Langues", "Languages")}</H>
          <p className="cv1-txt">{pr.languages.map((l) => t(l, lang)).join(" · ")}</p>

          {portfolio.hackathons.length > 0 && (
            <>
              <H>Hackathons</H>
              {portfolio.hackathons.map((h) => <p key={h.id} className="cv1-txt"><strong>{h.name}</strong> — {h.status === "accepted" ? L("candidature acceptée", "application accepted") : "participation"}</p>)}
            </>
          )}

          <H>{L("Divers", "Other")}</H>
          <p className="cv1-txt">{L("Permis B · Auto-entrepreneur déclaré", "Driving licence (B) · Registered self-employed")}</p>
          <p className="cv1-txt">{L("Intérêts : technologies, sport, photographie, lecture", "Interests: technology, sport, photography, reading")}</p>
          <p className="cv1-txt">{L("Portfolio photo", "Photo portfolio")} : meinfewminites.carrd.co</p>
        </aside>
      </div>
    </article>
  );
}
