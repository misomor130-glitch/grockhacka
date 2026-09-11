import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Flame,
  FolderOpen,
  GitCompareArrows,
  Layers3,
  LayoutDashboard,
  Map,
  Network,
  PackageCheck,
  PanelLeftClose,
  Plus,
  RotateCcw,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import { type Lang, type Text, documents } from "./data";
import Workspace from "./Workspace";
export default function App() {
  const [lang, setLang] = useState<Lang>(
    () => (localStorage.getItem("saglasnik-lang") as Lang) || "sr",
  );
  const t = (s: string, e: string) => (lang === "sr" ? s : e);
  const [page, setPage] = useState("overview");
  const nav = [
    ["overview", LayoutDashboard, t("Pregled projekta", "Project overview")],
    ["permits", Map, t("Mapa dozvola", "Permit map")],
    ["documents", FolderOpen, t("Dokumenti", "Documents")],
    ["coordination", Network, t("Koordinacija", "Coordination")],
    ["review", Flame, t("Zaštita od požara", "Fire protection")],
    [
      "changes",
      GitCompareArrows,
      t("Izmene i revizije", "Changes & revisions"),
    ],
    ["submissions", PackageCheck, t("Podnesci", "Submissions")],
    ["construction", Building2, t("Izgradnja", "Construction")],
    ["handover", ClipboardCheck, t("Završna dokumentacija", "Handover")],
  ] as const;
  const go = (id: string) => {
    setPage(id);
    history.replaceState(null, "", "#/" + id);
  };
  if (page !== "overview")
    return <Workspace page={page} lang={lang} go={go} setLang={setLang} />;
  return (
    <div className="app">
      <aside className="sidebar">
        <a className="brand" href="#/overview" onClick={() => go("overview")}>
          <span className="brandmark">S</span>Saglasnik
          <span className="beta">BETA</span>
        </a>
        <button className="project-switch" onClick={() => go("projects")}>
          <span className="project-icon">
            <Building2 size={19} />
          </span>
          <span>
            <strong>{t("Poslovni objekat 01", "Office building 01")}</strong>
            <small>PGD · {t("Demo projekat", "Demo project")}</small>
          </span>
          <ChevronDown size={15} />
        </button>
        <div className="nav-group-label">{t("PROJEKAT", "PROJECT")}</div>
        <nav>
          {nav.map(([id, Icon, label], i) => (
            <div key={id}>
              {i === 3 && (
                <div className="nav-group-label">
                  {t("KOORDINACIJA", "COORDINATION")}
                </div>
              )}
              {i === 5 && (
                <div className="nav-group-label">
                  {t("ŽIVOTNI CIKLUS", "LIFECYCLE")}
                </div>
              )}
              <button
                className={"nav-item " + (page === id ? "active" : "")}
                onClick={() => go(id)}
              >
                <Icon size={18} />
                <span>{label}</span>
                {id === "review" ? (
                  <span className="nav-count">6</span>
                ) : [
                    "permits",
                    "coordination",
                    "submissions",
                    "construction",
                    "handover",
                  ].includes(id) ? (
                  <span className="preview-dot" title="Preview" />
                ) : null}
              </button>
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="domain-state">
            <ShieldCheck size={16} />
            <span>
              {t(
                "Prvi domen: zaštita od požara",
                "First domain: fire protection",
              )}
            </span>
          </div>
          <button className="profile">
            <span className="avatar">MP</span>
            <span>
              <strong>{t("Milan Petrović", "Milan Petrović")}</strong>
              <small>{t("Demo projektant", "Demo engineer")}</small>
            </span>
            <Settings2 size={16} />
          </button>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <span className="breadcrumb">
            {t("Projekti", "Projects")} <ChevronRight size={14} />{" "}
            <span>{t("Poslovni objekat 01", "Office building 01")}</span>
            <ChevronRight size={14} />
            <strong>
              {nav.find((x) => x[0] === page)?.[2] || t("Projekti", "Projects")}
            </strong>
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
            {t("INTERAKTIVNI PROTOTIP", "INTERACTIVE PROTOTYPE")}
            <span className="demo-description">
              {t(
                "Sintetički podaci · bez povezane analize",
                "Synthetic data · no connected analysis",
              )}
            </span>
          </span>
          <button
            onClick={() => {
              localStorage.removeItem("saglasnik-decisions");
              go("overview");
            }}
          >
            <RotateCcw size={13} />
            {t("Reset primera", "Reset demo")}
          </button>
        </div>
        <main>
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                PGD / {t("PROJEKTOVANJE", "DESIGN")}
              </div>
              <h1>{t("Poslovni objekat 01", "Office building 01")}</h1>
              <p>
                {t(
                  "Dokumentacija na jednom mestu. Jasno šta zahteva pažnju.",
                  "Documentation in one place. A clear view of what needs attention.",
                )}
              </p>
            </div>
            <button className="button primary" onClick={() => go("review")}>
              <Flame size={17} />
              {t("Otvori pre-pregled ZOP", "Open fire protection review")}
              <ArrowRight size={17} />
            </button>
          </div>
          <div className="project-meta">
            <span>
              <Building2 size={15} />
              {t("Poslovni objekat", "Office building")}
            </span>
            <span>R03 · {t("Aktuelna revizija", "Current revision")}</span>
            <span>{t("Sintetički primer", "Synthetic example")}</span>
            <span className="status-text danger">
              <span className="tiny-square" />
              {t("Nalazi za otklanjanje", "Findings to address")}
            </span>
          </div>
          <section className="lifecycle">
            <div className="section-kicker">
              {t("FAZA PROJEKTA", "PROJECT STAGE")}
              <span>{t("Prikaz životnog ciklusa", "Lifecycle preview")}</span>
            </div>
            <div className="stage-track">
              {[
                ["Uslovi", "Conditions"],
                ["Projektovanje", "Design"],
                ["Građevinska dozvola", "Building permit"],
                ["PZI", "Execution design"],
                ["Izgradnja", "Construction"],
                ["PIO", "As-built"],
                ["Upotrebna dozvola", "Occupancy permit"],
              ].map((s, i) => (
                <div
                  key={s[0]}
                  className={
                    "stage " + (i === 1 ? "current" : i === 0 ? "previous" : "")
                  }
                >
                  <span className="stage-line" />
                  <span className="stage-dot">{i === 0 ? "✓" : i + 1}</span>
                  <strong>{t(s[0], s[1])}</strong>
                  {i === 1 && (
                    <small>{t("TRENUTNA FAZA", "CURRENT STAGE")}</small>
                  )}
                </div>
              ))}
            </div>
          </section>
          <div className="overview-grid">
            <section className="attention panel">
              <div className="panel-head">
                <h2>{t("Zahteva vašu pažnju", "Needs your attention")}</h2>
                <span className="badge neutral">R03</span>
              </div>
              <div className="attention-main">
                <span className="big-number">04</span>
                <div>
                  <h3>{t("blokirajuća nalaza", "blocking findings")}</h3>
                  <p>
                    {t(
                      "u pripremljenom pre-pregledu zaštite od požara",
                      "in the prepared fire protection review",
                    )}
                  </p>
                </div>
                <span className="attention-symbol">
                  <Flame size={27} />
                </span>
              </div>
              <div className="attention-breakdown">
                <span>
                  <b>2</b>
                  {t("konflikta", "conflicts")}
                </span>
                <span>
                  <b>2</b>
                  {t("neusaglašenosti", "non-conformities")}
                </span>
                <span>
                  <b>2</b>
                  {t("nedostajuća podatka", "missing values")}
                </span>
              </div>
              <button className="hero-link" onClick={() => go("review")}>
                <span>
                  <span className="micro-label">
                    C01 ·{" "}
                    {t("MEĐUDOKUMENTNI KONFLIKT", "CROSS-DOCUMENT CONFLICT")}
                  </span>
                  <strong>
                    {t(
                      "Stepen otpornosti: II ≠ III",
                      "Fire resistance: II ≠ III",
                    )}
                  </strong>
                  <small>Tehnički opis ↔ Grafički prilog PS-01</small>
                </span>
                <ArrowUpRight size={22} />
              </button>
              <button className="text-link" onClick={() => go("review")}>
                {t("Pregledaj sve nalaze", "Review all findings")}
                <ArrowRight size={16} />
              </button>
            </section>
            <section className="panel domains">
              <div className="panel-head">
                <h2>{t("Stručne oblasti", "Discipline packs")}</h2>
                <Layers3 size={18} />
              </div>
              <button className="domain-active" onClick={() => go("review")}>
                <span className="domain-icon">
                  <Flame size={22} />
                </span>
                <span>
                  <strong>{t("Zaštita od požara", "Fire protection")}</strong>
                  <small>
                    {t("13 demonstracionih provera", "13 illustrative checks")}
                  </small>
                </span>
                <span className="badge teal">
                  {t("Demo aktivan", "Active demo")}
                </span>
                <ChevronRight size={17} />
              </button>
              {[
                ["Arhitektura", "Architecture"],
                ["Konstrukcija", "Structural engineering"],
                ["Elektro i mašinske instalacije", "Electrical & mechanical"],
                ["Energetska efikasnost", "Energy efficiency"],
              ].map((s) => (
                <button
                  key={s[0]}
                  className="domain-future"
                  onClick={() => go("coordination")}
                >
                  <span>{t(s[0], s[1])}</span>
                  <span className="badge preview">Preview</span>
                </button>
              ))}
              <p className="quiet-note">
                {t(
                  "Isti projekat. Povezane discipline. Jedan trag odluka.",
                  "One project. Connected disciplines. One decision trail.",
                )}
              </p>
            </section>
            <section className="panel document-summary">
              <div className="panel-head">
                <h2>{t("Dokumentacija", "Documentation")}</h2>
                <button className="text-link" onClick={() => go("documents")}>
                  {t("Svi dokumenti", "All documents")}
                  <ArrowUpRight size={15} />
                </button>
              </div>
              {documents.map((d) => (
                <button
                  key={d.id}
                  className="document-row"
                  onClick={() => go("documents")}
                >
                  <span className="file-icon">
                    <FileText size={20} />
                  </span>
                  <strong>{d.name}</strong>
                  <span className="muted">
                    {d.pages} {t("str.", "pp.")}
                  </span>
                  <span className="mono">{d.revision}</span>
                  <span className="read-indicator">
                    {t("Primer", "Example")}
                  </span>
                </button>
              ))}
              <div className="panel-footer">
                4 {t("dokumenta", "documents")}
                <span>12 {t("strana ukupno", "pages total")}</span>
              </div>
            </section>
            <section className="panel activity">
              <div className="panel-head">
                <h2>{t("Poslednje aktivnosti", "Recent activity")}</h2>
                <span className="badge preview">{t("Primer", "Example")}</span>
              </div>
              <div className="timeline">
                <div>
                  <span className="timeline-dot teal" />
                  <small>12 SEP · 14:42</small>
                  <strong>
                    {t("Pripremljen dosije R03", "R03 dossier prepared")}
                  </strong>
                  <p>
                    {t(
                      "13 provera · 6 nalaza za pregled",
                      "13 checks · 6 findings to review",
                    )}
                  </p>
                </div>
                <div>
                  <span className="timeline-dot" />
                  <small>12 SEP · 14:40</small>
                  <strong>
                    {t("Dokumentacija R03 dodata", "R03 documentation added")}
                  </strong>
                  <p>
                    {t(
                      "4 dokumenta u demonstracionom paketu",
                      "4 documents in the example package",
                    )}
                  </p>
                </div>
              </div>
              <button className="text-link" onClick={() => go("changes")}>
                {t("Pogledaj istoriju revizija", "View revision history")}
                <ArrowRight size={15} />
              </button>
            </section>
          </div>
          <div className="disclaimer">
            <ShieldCheck size={17} />
            <p>
              <strong>
                {t("Pre-pregled dokumentacije.", "Document pre-review.")}
              </strong>{" "}
              {t(
                "Saglasnik ne izdaje saglasnost i ne zamenjuje odgovornog projektanta, tehničku kontrolu ili nadležni organ.",
                "Saglasnik does not issue approval or replace the responsible engineer, technical review or competent authority.",
              )}
            </p>
          </div>
        </main>
        <footer>
          SAGLASNIK{" "}
          <span>
            {t(
              "Od dokumenta do obrazložene odluke.",
              "From document to informed decision.",
            )}
          </span>
          <span className="footer-right">
            {t(
              "Prototip 0.1 · Podaci su ilustrativni",
              "Prototype 0.1 · Illustrative data",
            )}
          </span>
        </footer>
      </div>
    </div>
  );
}
