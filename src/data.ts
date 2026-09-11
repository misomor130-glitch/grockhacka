export type Lang = "sr" | "en";
export type Text = [string, string];
export type Status = "CONFLICT" | "FAIL" | "MISSING" | "PASS";
export type Evidence = {
  document: string;
  revision: string;
  page: number;
  value: string;
  quote: string;
  kind: "text" | "drawing" | "table";
  region?: { x: number; y: number; width: number; height: number };
};
export type Finding = {
  id: string;
  title: Text;
  status: Status;
  severity: "blocking" | "important" | "formal";
  action: Text;
  reason: Text;
  rule: Text;
  evidence: Evidence[];
  calculation?: string;
};
export type Decision = { value: string; note: string; at: string; by: string };
export const documents = [
  {
    id: "doc-1",
    name: "Tehnički opis",
    type: ["Tekstualni prilog", "Technical description"] as Text,
    pages: 8,
    revision: "R03",
    facts: 11,
  },
  {
    id: "doc-2",
    name: "Grafički prilog PS-01",
    type: ["Požarni sektori", "Fire compartments"] as Text,
    pages: 1,
    revision: "R03",
    facts: 4,
  },
  {
    id: "doc-3",
    name: "Specifikacija opreme",
    type: ["Tabelarni prilog", "Equipment schedule"] as Text,
    pages: 2,
    revision: "R03",
    facts: 6,
  },
  {
    id: "doc-4",
    name: "Proračun evakuacije",
    type: ["Proračunski prilog", "Evacuation calculation"] as Text,
    pages: 1,
    revision: "R03",
    facts: 3,
  },
];
const technical: Evidence = {
  document: "Tehnički opis",
  revision: "R03",
  page: 7,
  value: "II",
  quote: "Objekat je svrstan u II stepen otpornosti prema požaru.",
  kind: "text",
  region: { x: 0.08, y: 0.36, width: 0.84, height: 0.14 },
};
const drawing: Evidence = {
  document: "Grafički prilog PS-01",
  revision: "R03",
  page: 1,
  value: "III",
  quote: "Stepen otpornosti objekta prema požaru: III",
  kind: "drawing",
  region: { x: 0.06, y: 0.73, width: 0.88, height: 0.17 },
};
export const findings: Finding[] = [
  {
    id: "C01",
    title: [
      "Stepen otpornosti nije usaglašen",
      "Fire resistance classifications differ",
    ],
    status: "CONFLICT",
    severity: "blocking",
    action: ["Usaglasi dokumente", "Reconcile documents"],
    reason: [
      "Dve reprezentacije istog objekta u reviziji R03 navode različit stepen otpornosti. Saglasnik ne bira merodavnu vrednost bez odluke odgovornog projektanta.",
      "Two representations of the same building in revision R03 give different fire resistance classifications. The responsible engineer must choose the authoritative value.",
    ],
    rule: [
      "Jednakost podatka za isti objekat i istu reviziju",
      "Consistency for the same building and revision",
    ],
    evidence: [technical, drawing],
  },
  {
    id: "C02",
    title: ["Broj hidranata se razlikuje", "Hydrant quantities differ"],
    status: "CONFLICT",
    severity: "blocking",
    action: ["Usaglasi specifikaciju", "Reconcile the equipment schedule"],
    reason: [
      "Tehnički opis i specifikacija za isti objekat navode različit broj unutrašnjih hidranata. Potrebna je stručna potvrda merodavnog podatka.",
      "The description and equipment schedule list different internal hydrant quantities for the same building. Confirm the authoritative value.",
    ],
    rule: [
      "Broj hidranata: opis ↔ specifikacija",
      "Hydrant quantity: description ↔ schedule",
    ],
    evidence: [
      {
        ...technical,
        page: 6,
        value: "4",
        quote: "Predviđena su 4 unutrašnja hidranta.",
      },
      {
        document: "Specifikacija opreme",
        revision: "R03",
        page: 1,
        value: "3",
        quote: "Unutrašnji zidni hidrant — 3 kom.",
        kind: "table",
      },
    ],
  },
  {
    id: "B06",
    title: [
      "Otpornost noseće konstrukcije",
      "Load-bearing structure resistance",
    ],
    status: "FAIL",
    severity: "blocking",
    action: ["Potrebna stručna odluka", "Professional decision required"],
    reason: [
      "Prikazan je demonstracioni proračun sa izmišljenim zahtevom. Primenljivost i prag nisu potvrđeni; ovaj primer nije regulatorni zaključak.",
      "This is an illustrative calculation with a synthetic requirement. Neither its applicability nor threshold is verified; it is not a regulatory conclusion.",
    ],
    rule: ["Demonstraciono pravilo otpornosti", "Illustrative resistance rule"],
    calculation: "1,0 h < 1,5 h",
    evidence: [
      {
        ...technical,
        page: 8,
        value: "1,0 h",
        quote: "Otpornost noseće konstrukcije: 1,0 h.",
      },
    ],
  },
  {
    id: "B07",
    title: ["Broj izlaza u proračunu", "Exit count in the calculation"],
    status: "FAIL",
    severity: "blocking",
    action: ["Proveri projektantsko rešenje", "Review the design solution"],
    reason: [
      "Sintetički primer poređenja jednog izlaza sa demonstracionim zahtevom za dva. Stvarna primenljivost zavisi od objekta i potvrđenog propisa.",
      "A synthetic comparison of one exit against an illustrative requirement of two. Actual applicability depends on the building and verified regulation.",
    ],
    rule: [
      "Demonstraciono pravilo broja izlaza",
      "Illustrative exit count rule",
    ],
    calculation: "1 < 2",
    evidence: [
      {
        document: "Proračun evakuacije",
        revision: "R03",
        page: 1,
        value: "1",
        quote: "Evakuacija sa etaže ostvaruje se preko jednog izlaza.",
        kind: "text",
      },
    ],
  },
  {
    id: "B03",
    title: [
      "Dužina evakuacionog puta nije navedena",
      "Evacuation travel distance is missing",
    ],
    status: "MISSING",
    severity: "important",
    action: ["Dostavi nedostajući podatak", "Provide the missing value"],
    reason: [
      "U pripremljenom primeru nisu navedeni pouzdani podaci o dužini puta. Nema osnova za poređenje sa pragom.",
      "The prepared example has no reliable travel-distance value. A threshold comparison cannot be made.",
    ],
    rule: [
      "Dostupnost podatka za proveru",
      "Availability of the required value",
    ],
    evidence: [],
  },
  {
    id: "A02",
    title: ["Nedostaje prilog o opremi", "Equipment attachment is missing"],
    status: "MISSING",
    severity: "formal",
    action: ["Dodaj nedostajući prilog", "Add the missing attachment"],
    reason: [
      "U manifestu sintetičkog projekta nije priložen tehnički list opreme.",
      "The synthetic project manifest does not contain the equipment data sheet.",
    ],
    rule: [
      "Kompletnost demonstracionog paketa",
      "Completeness of the example package",
    ],
    evidence: [],
  },
  ...[
    "Namena objekta je navedena",
    "Oznaka projekta je usaglašena",
    "Revizije dokumenata su označene",
    "Površina sektora je navedena",
    "Etažnost je navedena",
    "Tip opreme je označen",
    "Dokumenti imaju oznake strana",
  ].map((name, i): Finding => ({
    id: "P0" + (i + 1),
    title: [
      name,
      [
        "Building use is stated",
        "Project identifiers agree",
        "Document revisions are labeled",
        "Compartment area is stated",
        "Floor count is stated",
        "Equipment type is labeled",
        "Document pages are numbered",
      ][i],
    ],
    status: "PASS",
    severity: "formal",
    action: ["Nema radnje", "No action"],
    reason: [
      "U ovom sintetičkom primeru nije prikazana primedba u navedenom obuhvatu. To nije potvrda usaglašenosti projekta.",
      "The synthetic example shows no finding within this limited scope. This is not project compliance approval.",
    ],
    rule: ["Demonstraciona provera", "Illustrative check"],
    evidence: [
      {
        ...technical,
        page: 2,
        value: "Navedeno",
        quote: "Poslovni objekat 01 · PGD · Revizija R03",
      },
    ],
  })),
];
export const statusLabels: Record<Status, Text> = {
  CONFLICT: ["Konflikt", "Conflict"],
  FAIL: ["Neusaglašeno", "Non-conforming"],
  MISSING: ["Nedostaje podatak", "Missing information"],
  PASS: ["Bez primedbe u obuhvatu", "No finding within scope"],
};
export const dataSource = {
  mode: "mock" as const,
  getFindings: () => findings,
  getDocuments: () => documents,
  loadDecisions: (): Record<string, Decision> => {
    try {
      return JSON.parse(localStorage.getItem("saglasnik-decisions") || "{}");
    } catch {
      return {};
    }
  },
  saveDecisions: (value: Record<string, Decision>) =>
    localStorage.setItem("saglasnik-decisions", JSON.stringify(value)),
};
