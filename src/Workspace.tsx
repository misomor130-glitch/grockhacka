import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Flame,
  FolderOpen,
  GitCompareArrows,
  LayoutDashboard,
  Map,
  Maximize2,
  Minus,
  Network,
  PackageCheck,
  PanelRightClose,
  Plus,
  Search,
  ShieldCheck,
  Upload,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  dataSource,
  documents,
  findings,
  statusLabels,
  type Decision,
  type Evidence,
  type Finding,
  type Lang,
} from "./data";

const nav = [
  ["overview", LayoutDashboard],
  ["permits", Map],
  ["documents", FolderOpen],
  ["coordination", Network],
  ["review", Flame],
  ["changes", GitCompareArrows],
  ["submissions", PackageCheck],
  ["construction", Building2],
  ["handover", ClipboardCheck],
] as const;
const names: Record<string, [string, string]> = {
  overview: ["Pregled projekta", "Project overview"],
  permits: ["Mapa dozvola", "Permit map"],
  documents: ["Dokumenti", "Documents"],
  coordination: ["Koordinacija", "Coordination"],
  review: ["Zaštita od požara", "Fire protection"],
  changes: ["Izmene i revizije", "Changes & revisions"],
  submissions: ["Podnesci", "Submissions"],
  construction: ["Izgradnja", "Construction"],
  handover: ["Završna dokumentacija", "Handover"],
};
export default function Workspace({
  page,
  lang,
  go,
  setLang,
}: {
  page: string;
  lang: Lang;
  go: (x: string) => void;
  setLang: (x: Lang) => void;
}) {
  const t = (sr: string, en: string) => (lang === "sr" ? sr : en);
  return (
    <div className="app">
      <aside className="sidebar">
        <button className="brand" onClick={() => go("overview")}>
          <span className="brandmark">S</span>Saglasnik
          <span className="beta">BETA</span>
        </button>
        <button className="project-switch" onClick={() => go("overview")}>
          <Building2 size={19} />
          <span>
            <strong>{t("Poslovni objekat 01", "Office building 01")}</strong>
            <small>PGD · {t("Demo projekat", "Demo project")}</small>
          </span>
          <ChevronDown size={15} />
        </button>
        <nav className="compact-nav">
          {nav.map(([id, Icon]) => (
            <button
              key={id}
              className={"nav-item " + (page === id ? "active" : "")}
              onClick={() => go(id)}
            >
              <Icon size={18} />
              <span>{t(...names[id])}</span>
              {id === "review" && <span className="nav-count">6</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="domain-state">
            <ShieldCheck size={16} />
            {t(
              "Samo ZOP je aktivan u prototipu",
              "Only fire protection is active",
            )}
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <span className="breadcrumb">
            <button onClick={() => go("overview")}>
              {t("Poslovni objekat 01", "Office building 01")}
            </button>
            <ChevronRight size={14} />
            <strong>{t(...names[page])}</strong>
          </span>
          <div className="top-actions">
            <span className="revision-pill">R03</span>
            <div className="language">
              {(["sr", "en"] as const).map((l) => (
                <button
                  key={l}
                  className={lang === l ? "selected" : ""}
                  onClick={() => {
                    setLang(l);
                    localStorage.setItem("saglasnik-lang", l);
                  }}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <span className="avatar small">MP</span>
          </div>
        </header>
        <div className="demo-banner">
          <span>
            <span className="demo-dot" />
            {t(
              "INTERAKTIVNI PROTOTIP · SINTETIČKI PODACI",
              "INTERACTIVE PROTOTYPE · SYNTHETIC DATA",
            )}
          </span>
          <span>
            {t(
              "Nema povezane analize dokumenata",
              "No connected document analysis",
            )}
          </span>
        </div>
        {page === "review" ? (
          <Review lang={lang} />
        ) : page === "documents" ? (
          <Documents lang={lang} />
        ) : page === "changes" ? (
          <Changes lang={lang} />
        ) : page === "permits" ? (
          <PermitMap lang={lang} />
        ) : (
          <Preview page={page} lang={lang} />
        )}
      </div>
    </div>
  );
}

function Review({ lang }: { lang: Lang }) {
  const t = (sr: string, en: string) => (lang === "sr" ? sr : en);
  const [selected, setSelected] = useState(findings[0].id);
  const [showPass, setShowPass] = useState(false);
  const [tab, setTab] = useState<"evidence" | "decision" | "plan">("evidence");
  const [decisions, setDecisions] = useState<Record<string, Decision>>(
    dataSource.loadDecisions,
  );
  const item = findings.find((f) => f.id === selected)!;
  const visible = findings.filter((f) => showPass || f.status !== "PASS");
  const choose = (value: string) => {
    const n = {
      ...decisions,
      [item.id]: {
        value,
        note: "",
        at: new Date().toISOString(),
        by: "Milan Petrović",
      },
    };
    setDecisions(n);
    dataSource.saveDecisions(n);
    setTab("plan");
  };
  return (
    <main className="review-page">
      <header className="review-head">
        <div>
          <div className="eyebrow">
            {t(
              "ZAŠTITA OD POŽARA · PRE-PREGLED",
              "FIRE PROTECTION · PRE-REVIEW",
            )}
          </div>
          <h1>
            {t("Dosije pregleda", "Review dossier")} <span>R03</span>
          </h1>
          <p>
            {t(
              "Pripremljen primer · prethodno obrađen",
              "Prepared example · preprocessed",
            )}
          </p>
        </div>
        <div className="review-state">
          <span>{t("NALAZI ZA OTKLANJANJE", "FINDINGS TO ADDRESS")}</span>
          <button
            className="button"
            disabled
            title={t("Nije povezano u prototipu", "Not connected in prototype")}
          >
            <Plus size={16} />
            {t("Nova provera", "New review")}
          </button>
        </div>
      </header>
      <div className="review-disclaimer">
        <ShieldCheck size={16} />
        <span>
          <strong>{t("Pre-pregled.", "Pre-review.")}</strong>{" "}
          {t(
            "Konačnu stručnu odluku donosi odgovorno lice.",
            "The final professional decision is made by the responsible licensed professional.",
          )}
        </span>
      </div>
      <div className="summary-strip">
        <Metric n="2" label={t("konflikta", "conflicts")} tone="red" />
        <Metric
          n="2"
          label={t("neusaglašenosti", "non-conformities")}
          tone="red"
        />
        <Metric
          n="2"
          label={t("nedostajuća podatka", "missing values")}
          tone="amber"
        />
        <Metric
          n="7"
          label={t("bez primedbe u obuhvatu", "no finding in scope")}
          tone="green"
        />
        <div className="coverage">
          <strong>13/13</strong>
          <span>
            {t(
              "demonstracionih provera izvršeno",
              "illustrative checks executed",
            )}
          </span>
          <small>
            {t("Nije ocena usaglašenosti", "Not a compliance score")}
          </small>
        </div>
      </div>
      <div className="dossier">
        <aside className="finding-list">
          <div className="finding-tools">
            <strong>{t("Nalazi", "Findings")}</strong>
            <span>6 {t("otvorenih", "open")}</span>
            <button aria-label={t("Pretraži", "Search")}>
              <Search size={15} />
            </button>
          </div>
          {visible.map((f) => (
            <FindingRow
              key={f.id}
              item={f}
              lang={lang}
              active={f.id === selected}
              onClick={() => {
                setSelected(f.id);
                setTab("evidence");
              }}
            />
          ))}
          <button className="show-pass" onClick={() => setShowPass(!showPass)}>
            <ChevronDown size={15} />
            {showPass
              ? t(
                  "Sakrij 7 provera bez primedbe",
                  "Hide 7 checks with no finding",
                )
              : t(
                  "Prikaži 7 provera bez primedbe",
                  "Show 7 checks with no finding",
                )}
          </button>
        </aside>
        <section className="finding-detail">
          <div className="detail-title">
            <div>
              <span className={"status-label " + item.status.toLowerCase()}>
                {t(...statusLabels[item.status])}
              </span>
              <span className="rule-id">{item.id}</span>
              <h2>{t(...item.title)}</h2>
              <p>{t(...item.reason)}</p>
            </div>
            <button
              aria-label={t("Zatvori detalj", "Close detail")}
              onClick={() => setSelected(findings[0].id)}
            >
              <PanelRightClose size={18} />
            </button>
          </div>
          {item.status === "CONFLICT" && item.evidence.length === 2 && (
            <div className="conflict-equation">
              <span>{item.evidence[0].value}</span>
              <b>≠</b>
              <span>{item.evidence[1].value}</span>
              <small>
                {t("DVA IZVORA · JEDAN PODATAK", "TWO SOURCES · ONE FACT")}
              </small>
            </div>
          )}
          <div className="detail-tabs">
            <button
              className={tab === "evidence" ? "active" : ""}
              onClick={() => setTab("evidence")}
            >
              {t("Dokazi", "Evidence")}
            </button>
            <button
              className={tab === "decision" ? "active" : ""}
              onClick={() => setTab("decision")}
            >
              {t("Stručna odluka", "Professional decision")}
            </button>
            <button
              className={tab === "plan" ? "active" : ""}
              onClick={() => setTab("plan")}
            >
              {t("Plan ispravke", "Correction plan")}
            </button>
          </div>
          {tab === "evidence" ? (
            <EvidenceView item={item} lang={lang} />
          ) : tab === "decision" ? (
            <DecisionView
              item={item}
              lang={lang}
              decision={decisions[item.id]}
              choose={choose}
            />
          ) : (
            <Plan item={item} lang={lang} decision={decisions[item.id]} />
          )}
        </section>
      </div>
    </main>
  );
}
function Metric({
  n,
  label,
  tone,
}: {
  n: string;
  label: string;
  tone: string;
}) {
  return (
    <div className={"metric " + tone}>
      <strong>{n}</strong>
      <span>{label}</span>
    </div>
  );
}
function FindingRow({
  item,
  lang,
  active,
  onClick,
}: {
  item: Finding;
  lang: Lang;
  active: boolean;
  onClick: () => void;
}) {
  const t = (a: string, b: string) => (lang === "sr" ? a : b);
  return (
    <button
      className={"finding-row " + (active ? "selected" : "")}
      onClick={onClick}
    >
      <span className={"finding-mark " + item.status.toLowerCase()} />
      <div>
        <span className="finding-code">
          {item.id} · {t(...statusLabels[item.status])}
        </span>
        <strong>{t(...item.title)}</strong>
        <small>
          {item.evidence
            .map((e) => e.document + " · " + t("str.", "p.") + e.page)
            .join("  ↔  ") ||
            t("Provereno u 4 dokumenta", "Checked across 4 documents")}
        </small>
        <span className="next">
          {t("Sledeće: ", "Next: ")}
          {t(...item.action)}
        </span>
      </div>
      <ChevronRight size={16} />
    </button>
  );
}
function EvidenceView({ item, lang }: { item: Finding; lang: Lang }) {
  const t = (a: string, b: string) => (lang === "sr" ? a : b);
  return (
    <div className="evidence-area">
      <div
        className={
          "evidence-grid " + (item.evidence.length < 2 ? "single" : "")
        }
      >
        {item.evidence.length ? (
          item.evidence.map((e, i) => (
            <EvidenceCard key={i} e={e} lang={lang} />
          ))
        ) : (
          <div className="missing-state">
            <FileText size={28} />
            <h3>
              {t(
                "Potrebna vrednost nije pronađena",
                "Required value was not found",
              )}
            </h3>
            <p>
              {t(
                "Pregledani su Tehnički opis, grafički prilog, specifikacija i proračun. Potvrdite izvor ili dostavite podatak.",
                "The description, drawing, schedule and calculation were checked. Confirm a source or provide the value.",
              )}
            </p>
            <button className="button primary">
              {t("Dostavi podatak", "Provide value")}
            </button>
          </div>
        )}
      </div>
      <div className="reason-panel">
        <div>
          <span className="micro-label">
            {t("ZAŠTO JE OVO NALAZ?", "WHY IS THIS A FINDING?")}
          </span>
          <h3>{t(...item.rule)}</h3>
          <p>
            {t("Pravilo: ", "Rule: ")}
            <b>{item.id}</b> ·{" "}
            <span className="draft">
              {t(
                "Draft — nije stručno potvrđeno",
                "Draft — not expert-approved",
              )}
            </span>
          </p>
        </div>
        {item.calculation && <code>{item.calculation}</code>}
        <div className="action-block">
          <span>{t("SLEDEĆA RADNJA", "NEXT ACTION")}</span>
          <strong>{t(...item.action)}</strong>
        </div>
      </div>
    </div>
  );
}
function EvidenceCard({ e, lang }: { e: Evidence; lang: Lang }) {
  const t = (a: string, b: string) => (lang === "sr" ? a : b);
  return (
    <article className="evidence-card">
      <header>
        <div>
          <strong>{e.document}</strong>
          <span>
            {e.revision} · {t("strana", "page")} {e.page}
          </span>
        </div>
        <div className="viewer-actions">
          <button aria-label="Zoom out">
            <ZoomOut size={14} />
          </button>
          <button aria-label="Zoom in">
            <ZoomIn size={14} />
          </button>
          <button aria-label="Fullscreen">
            <Maximize2 size={14} />
          </button>
        </div>
      </header>
      <div className={"paper " + e.kind}>
        {e.kind === "drawing" ? (
          <>
            <div className="drawing-plan">
              <div />
              <div />
              <div />
              <div />
            </div>
            <div className="drawing-title">PS-01 · POŽARNI SEKTORI</div>
          </>
        ) : (
          <>
            <div className="paper-title">GLAVNI PROJEKAT ZAŠTITE OD POŽARA</div>
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className="text-line"
                style={{ width: 66 + ((i * 17) % 29) + "%" }}
              />
            ))}
            <div className="section-num">
              4.3. {t("Otpornost prema požaru", "Fire resistance")}
            </div>
          </>
        )}
        <div
          className="evidence-highlight"
          style={
            e.region
              ? {
                  left: e.region.x * 100 + "%",
                  top: e.region.y * 100 + "%",
                  width: e.region.width * 100 + "%",
                  height: e.region.height * 100 + "%",
                }
              : undefined
          }
        >
          <b>{e.value}</b>
        </div>
      </div>
      <blockquote>“{e.quote}”</blockquote>
      <footer>
        <span className="verified">
          <Check size={12} />
          {t("Izvor prikazan", "Source shown")}
        </span>
        <span>{t("Sintetički dokaz", "Synthetic evidence")}</span>
      </footer>
    </article>
  );
}
function DecisionView({
  item,
  lang,
  decision,
  choose,
}: {
  item: Finding;
  lang: Lang;
  decision?: Decision;
  choose: (v: string) => void;
}) {
  const t = (a: string, b: string) => (lang === "sr" ? a : b);
  if (item.status !== "CONFLICT")
    return (
      <div className="decision-box">
        <h3>
          {t(
            "Potvrdite postupanje po nalazu",
            "Confirm how this finding will be handled",
          )}
        </h3>
        <p>
          {t(
            "Ova radnja je deo prototipa i ne menja dokumente.",
            "This prototype action does not modify documents.",
          )}
        </p>
        <button className="button primary" onClick={() => choose("accepted")}>
          {t("Dodaj u plan ispravki", "Add to correction plan")}
        </button>
      </div>
    );
  return (
    <div className="decision-box">
      <span className="micro-label">
        {t("ODLUKA ODGOVORNOG PROJEKTANTA", "RESPONSIBLE ENGINEER DECISION")}
      </span>
      <h3>
        {t(
          "Koja vrednost treba da bude merodavna u sledećoj reviziji?",
          "Which value should govern the next revision?",
        )}
      </h3>
      <p>
        {t(
          "Originalni konflikt ostaje sačuvan kao istorijski dokaz.",
          "The original conflict remains preserved as historical evidence.",
        )}
      </p>
      {decision && (
        <div className="saved-decision">
          <Check size={16} />
          <strong>
            {t("Projektantska odluka sačuvana", "Professional decision saved")}:{" "}
            {decision.value}
          </strong>
          <small>{decision.by}</small>
        </div>
      )}
      <div className="decision-options">
        {item.evidence.map((e) => (
          <button key={e.value} onClick={() => choose(e.value)}>
            <b>{e.value}</b>
            <span>
              {t("prema", "from")} {e.document}
            </span>
            <ChevronRight size={16} />
          </button>
        ))}
        <button
          onClick={() =>
            choose(
              t(
                "Potrebno dodatno razjašnjenje",
                "Further clarification required",
              ),
            )
          }
        >
          <b>—</b>
          <span>
            {t(
              "Nijedna · potrebno razjašnjenje",
              "Neither · clarification required",
            )}
          </span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
function Plan({
  item,
  lang,
  decision,
}: {
  item: Finding;
  lang: Lang;
  decision?: Decision;
}) {
  const t = (a: string, b: string) => (lang === "sr" ? a : b);
  if (!decision)
    return (
      <div className="missing-state plan-empty">
        <ClipboardCheck size={28} />
        <h3>
          {t(
            "Prvo je potrebna stručna odluka",
            "A professional decision is required first",
          )}
        </h3>
        <p>
          {t(
            "Izaberite merodavnu vrednost u kartici „Stručna odluka“.",
            "Choose the authoritative value under “Professional decision”.",
          )}
        </p>
      </div>
    );
  return (
    <div className="correction-plan">
      <div className="plan-intro">
        <Check size={17} />
        <div>
          <strong>
            {t(
              "Odluka otkriva 3 povezana mesta",
              "Decision reveals 3 related locations",
            )}
          </strong>
          <p>
            {t(
              "Predlog je prihvaćen, ali nalaz još nije rešen. Rešenje potvrđuje tek nova revizija.",
              "The proposal is accepted, but the finding is not resolved until verified in a new revision.",
            )}
          </p>
        </div>
      </div>
      {[
        [
          "Tehnički opis",
          t("Nema izmene", "No change"),
          t(
            "Zadržati merodavnu vrednost " + decision.value,
            "Keep authoritative value " + decision.value,
          ),
        ],
        [
          "Specifikacija opreme",
          t("Predložena tekstualna izmena", "Proposed text change"),
          t(
            "Automatska dokumentarna korekcija",
            "Automated document correction",
          ),
        ],
        [
          "Grafički prilog PS-01",
          t("Projektantski zadatak", "Designer task"),
          t("Izmena grafičkog priloga", "Drawing update"),
        ],
      ].map((r, i) => (
        <div className="plan-row" key={r[0]}>
          <FileText size={17} />
          <div>
            <strong>{r[0]}</strong>
            <span>R03</span>
          </div>
          <div>
            <b>{r[1]}</b>
            <small>{r[2]}</small>
          </div>
          <span className={i === 0 ? "badge teal" : "badge preview"}>
            {i === 0
              ? t("Potvrđeno", "Confirmed")
              : t("Čeka R04", "Awaiting R04")}
          </span>
        </div>
      ))}
      <div className="diff">
        <span>{t("PREDLOG TEKSTUALNE IZMENE", "PROPOSED TEXT CHANGE")}</span>
        <del>{t("Stepen otpornosti: III", "Fire resistance: III")}</del>
        <ins>
          {t(
            "Stepen otpornosti: " + decision.value,
            "Fire resistance: " + decision.value,
          )}
        </ins>
        <small>
          {t(
            "Prihvaćen predlog · još nije potvrđeno u novoj reviziji",
            "Accepted proposal · not yet verified in a new revision",
          )}
        </small>
      </div>
      <button className="button" disabled>
        <PackageCheck size={16} />
        {t(
          "Paket ispravki nije povezan u prototipu",
          "Correction package unavailable in prototype",
        )}
      </button>
    </div>
  );
}

function Documents({ lang }: { lang: Lang }) {
  const t = (a: string, b: string) => (lang === "sr" ? a : b);
  return (
    <main className="standard-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            {t("MANIFEST PROJEKTA", "PROJECT MANIFEST")}
          </div>
          <h1>{t("Dokumenti", "Documents")}</h1>
          <p>
            {t(
              "4 dokumenta · 12 strana · sintetički primer",
              "4 documents · 12 pages · synthetic example",
            )}
          </p>
        </div>
        <button className="button" disabled>
          <Upload size={16} />
          {t("Dodaj dokumente", "Add documents")}
        </button>
      </div>
      <div className="prototype-notice">
        {t(
          "Otpremanje nije povezano u ovom prototipu. Tabela prikazuje pripremljeni demonstracioni paket.",
          "Uploads are not connected in this prototype. The table shows the prepared example package.",
        )}
      </div>
      <section className="document-table panel">
        <header>
          <span>{t("Dokument", "Document")}</span>
          <span>{t("Vrsta", "Type")}</span>
          <span>{t("Revizija", "Revision")}</span>
          <span>{t("Obim", "Extent")}</span>
          <span>{t("Činjenice", "Facts")}</span>
          <span>{t("Status", "Status")}</span>
        </header>
        {documents.map((d) => (
          <div key={d.id}>
            <span>
              <FileText size={18} />
              <strong>{d.name}</strong>
            </span>
            <span>{t(...d.type)}</span>
            <span className="mono">{d.revision}</span>
            <span>
              {d.pages} {t("str.", "pp.")}
            </span>
            <span>{d.facts}</span>
            <span>
              <b className="status-ready">
                <Check size={12} />
                {t("Primer spreman", "Example ready")}
              </b>
            </span>
          </div>
        ))}
      </section>
    </main>
  );
}
function Changes({ lang }: { lang: Lang }) {
  const t = (a: string, b: string) => (lang === "sr" ? a : b);
  return (
    <main className="standard-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            {t("POREĐENJE REVIZIJA", "REVISION COMPARISON")}
          </div>
          <h1>{t("Revizija R03 → R04", "Revision R03 → R04")}</h1>
          <p>
            {t(
              "Demonstracija zatvaranja nalaza novim dokazom",
              "Demonstrating closure through new evidence",
            )}
          </p>
        </div>
        <span className="badge preview">
          {t("Pripremljeni primer", "Prepared example")}
        </span>
      </div>
      <div className="revision-summary">
        <Metric n="3" label={t("rešeno", "resolved")} tone="green" />
        <Metric n="1" label={t("i dalje otvoreno", "still open")} tone="red" />
        <Metric n="1" label={t("novo", "new")} tone="amber" />
        <Metric
          n="0"
          label={t("potrebno pojašnjenje", "needs clarification")}
          tone="gray"
        />
      </div>
      <section className="revision-card resolved">
        <header>
          <span>C01</span>
          <b>
            <Check size={14} />
            {t("REŠENO NOVIM DOKAZOM", "RESOLVED BY NEW EVIDENCE")}
          </b>
        </header>
        <h2>
          {t(
            "Stepen otpornosti je usaglašen",
            "Fire resistance is now consistent",
          )}
        </h2>
        <div className="revision-compare">
          <div>
            <small>R03 · {t("PRETHODNO", "PREVIOUS")}</small>
            <strong>
              II <em>≠</em> III
            </strong>
            <span>
              {t(
                "Konflikt između dva dokumenta",
                "Conflict between two documents",
              )}
            </span>
          </div>
          <ArrowRight />
          <div>
            <small>R04 · {t("NOVA REVIZIJA", "NEW REVISION")}</small>
            <strong>
              II <em>=</em> II
            </strong>
            <span>
              {t("Oba izvora ponovo pročitana", "Both sources re-read")}
            </span>
          </div>
        </div>
      </section>
      <section className="revision-card open">
        <header>
          <span>B07</span>
          <b>{t("I DALJE OTVORENO", "STILL OPEN")}</b>
        </header>
        <h2>{t("Broj izlaza nije promenjen", "Exit count has not changed")}</h2>
        <p>
          {t(
            "Nova revizija i dalje prikazuje jedan izlaz. Prihvaćen zadatak nije isto što i verifikovana ispravka.",
            "The new revision still shows one exit. An accepted task is not the same as a verified correction.",
          )}
        </p>
      </section>
    </main>
  );
}
function PermitMap({ lang }: { lang: Lang }) {
  const t = (a: string, b: string) => (lang === "sr" ? a : b);
  const steps: [string, string][] = [
    ["Idejno rešenje", "Concept design"],
    ["Lokacijski uslovi", "Location conditions"],
    ["PGD", "Permit design"],
    ["Tehnička kontrola", "Technical review"],
    ["Građevinska dozvola", "Building permit"],
    ["PZI", "Execution design"],
    ["Izgradnja", "Construction"],
    ["PIO", "As-built"],
    ["Upotrebna dozvola", "Occupancy permit"],
  ];
  return (
    <main className="standard-page">
      <div className="preview-banner">
        <Map size={19} />
        <div>
          <strong>
            {t("Pregled buduće platforme", "Future platform preview")}
          </strong>
          <p>
            {t(
              "U prototipu je operativan samo demonstracioni tok zaštite od požara.",
              "Only the fire protection demo workflow is active in this prototype.",
            )}
          </p>
        </div>
      </div>
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            {t("ZAVISNOSTI I DOZVOLE", "DEPENDENCIES & PERMITS")}
          </div>
          <h1>{t("Mapa životnog ciklusa", "Lifecycle map")}</h1>
        </div>
      </div>
      <div className="permit-map">
        {steps.map((s, i) => (
          <div
            className={"permit-node " + (i === 2 ? "current" : "")}
            key={s[0]}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            <strong>{t(...s)}</strong>
            <small>
              {i === 2
                ? t("Trenutna faza", "Current stage")
                : i < 2
                  ? t("Ulazna dokumentacija", "Input documentation")
                  : t("Nije aktivirano", "Not activated")}
            </small>
            {i < steps.length - 1 && <ArrowRight size={18} />}
          </div>
        ))}
        <div className="fire-link">
          <Flame size={20} />
          <div>
            <strong>{t("Zaštita od požara", "Fire protection")}</strong>
            <span>
              {t(
                "Aktivan demonstracioni domen · vezan za PGD",
                "Active demo domain · linked to permit design",
              )}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
function Preview({ page, lang }: { page: string; lang: Lang }) {
  const t = (a: string, b: string) => (lang === "sr" ? a : b);
  return (
    <main className="standard-page">
      <div className="preview-banner">
        <Network size={19} />
        <div>
          <strong>
            {t(
              "Platform preview — nije aktivirano",
              "Platform preview — not activated",
            )}
          </strong>
          <p>
            {t(
              "Ova površina prikazuje smer razvoja Saglasnika i ne predstavlja funkcionalnost prototipa.",
              "This surface communicates the direction of Saglasnik and is not prototype functionality.",
            )}
          </p>
        </div>
      </div>
      <div className="preview-empty">
        <span className="preview-symbol">
          {page === "coordination" ? (
            <Network />
          ) : page === "submissions" ? (
            <PackageCheck />
          ) : page === "handover" ? (
            <ClipboardCheck />
          ) : (
            <Building2 />
          )}
        </span>
        <div className="eyebrow">{t("BUDUĆI MODUL", "FUTURE MODULE")}</div>
        <h1>{t(...names[page])}</h1>
        <p>
          {t(
            "Zaštita od požara je prvi domain pack. Ovaj modul će povezati dokumente, odluke i uticaj promena kroz isti projekat.",
            "Fire protection is the first domain pack. This module will connect documents, decisions and change impact across the same project.",
          )}
        </p>
        <button className="button" disabled>
          {t("Nije aktivirano u prototipu", "Not activated in prototype")}
        </button>
      </div>
    </main>
  );
}
