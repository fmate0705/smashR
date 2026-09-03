/**
 * The legal documents.
 *
 * These are Hungarian-language starting drafts, not legal advice, and they say so at the top of
 * every page. Where a value can only come from the operator's company records — registration
 * number, tax number, the data protection contact — the text carries a visible placeholder rather
 * than an invented value: a fabricated VAT number on a published impressum is a worse failure than
 * a missing one, and it is the kind of error nobody catches until it matters.
 *
 * `review: true` is what puts the notice on the page. It comes off document by document, once a
 * qualified professional has read that document.
 */

export interface LegalSection {
  readonly heading: string;
  readonly paragraphs?: readonly string[];
  readonly list?: readonly string[];
}

export interface LegalDocument {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly lead: string;
  readonly review: boolean;
  readonly sections: readonly LegalSection[];
}

/** Marks a value the operator must supply. Rendered so it cannot be mistaken for real content. */
const TODO = (label: string) => `[${label} — kitöltendő]`;

export const legalDocuments: readonly LegalDocument[] = [
  {
    slug: 'impresszum',
    title: 'Impresszum',
    description:
      'A SmashR weboldalát üzemeltető vállalkozás adatai, elérhetőségei és nyilvántartási adatai.',
    lead: 'Az elektronikus kereskedelmi szolgáltatásokról szóló jogszabály szerinti közzétételi kötelezettség teljesítése.',
    review: true,
    sections: [
      {
        heading: 'A szolgáltató adatai',
        list: [
          `Cégnév: ${TODO('cégnév')}`,
          `Székhely: ${TODO('székhely')}`,
          'Üzlet címe: 1239 Budapest, Bevásárló u. 2.',
          `Cégjegyzékszám: ${TODO('cégjegyzékszám')}`,
          `Adószám: ${TODO('adószám')}`,
          `Nyilvántartó szerv: ${TODO('nyilvántartó cégbíróság')}`,
        ],
      },
      {
        heading: 'Elérhetőség',
        list: [
          'Telefon: +36 20 447 0900',
          `E-mail: ${TODO('e-mail cím')}`,
          `Képviselő: ${TODO('képviselő neve')}`,
        ],
      },
      {
        heading: 'Tárhelyszolgáltató',
        list: [
          `Név: ${TODO('tárhelyszolgáltató neve')}`,
          `Székhely: ${TODO('tárhelyszolgáltató székhelye')}`,
          `Elérhetőség: ${TODO('tárhelyszolgáltató elérhetősége')}`,
        ],
      },
      {
        heading: 'A weboldal',
        paragraphs: [
          'Ez a weboldal a SmashR bemutatkozó oldala. Rendelést közvetlenül nem fogadunk: a rendelés a foodora, illetve a Wolt felületén történik, az ott közzétett feltételek szerint.',
        ],
      },
      {
        heading: 'Panaszkezelés',
        paragraphs: [
          'Panaszával elsősorban közvetlenül hozzánk fordulhat a fenti elérhetőségeken. Fogyasztói jogvita esetén a lakóhelye szerint illetékes békéltető testülethez fordulhat; a testületek listája a Magyar Kereskedelmi és Iparkamara honlapján érhető el.',
          'A rendelési folyamattal kapcsolatos panaszokat az adott rendelési platform saját ügyfélszolgálata kezeli.',
        ],
      },
    ],
  },
  {
    slug: 'adatkezelesi-tajekoztato',
    title: 'Adatkezelési tájékoztató',
    description:
      'Milyen adatokat kezel a SmashR weboldala, milyen célból és mennyi ideig — a GDPR szerinti tájékoztatás.',
    lead: 'Tájékoztatás a személyes adatok kezeléséről az általános adatvédelmi rendelet (GDPR) alapján.',
    review: true,
    sections: [
      {
        heading: 'Az adatkezelő',
        list: [
          `Adatkezelő: ${TODO('cégnév')}`,
          `Székhely: ${TODO('székhely')}`,
          `Adatvédelmi kapcsolattartó: ${TODO('e-mail cím')}`,
        ],
      },
      {
        heading: 'Mit kezelünk ezen a weboldalon',
        paragraphs: [
          'Ez a weboldal nem tartalmaz regisztrációt, felhasználói fiókot, hírlevél-feliratkozást és kapcsolatfelvételi űrlapot, ezért közvetlenül nem gyűjt Öntől személyes adatot.',
        ],
        list: [
          'Működéshez szükséges tárolás: a sütikre vonatkozó döntése, hogy ne kelljen minden oldalbetöltésnél újra megkérdeznünk. Jogalap: jogos érdek, illetve elektronikus hírközlési jogszabály szerinti feltétlenül szükséges tárolás. Megőrzés: 180 nap.',
          'Analitika: csak akkor, ha Ön ehhez a süti ablakban hozzájárul. Hozzájárulás hiányában semmilyen analitikai eszköz nem töltődik be. Jogalap: hozzájárulás. Visszavonás: bármikor, a lábléc „Süti beállítások” pontjában.',
          'Beágyazott térkép: a Google térkép beágyazása csak az Ön hozzájárulása után töltődik be. Betöltéskor a Google felé továbbítódik az IP-címe és a böngészője adatai. Jogalap: hozzájárulás.',
        ],
      },
      {
        heading: 'Adattovábbítás és külső szolgáltatók',
        paragraphs: [
          'A rendelési gombok a foodora, illetve a Wolt weboldalára vezetnek. Az ott megadott adatok kezelője az adott platform üzemeltetője, saját adatkezelési tájékoztatója szerint; erre az adatkezelésre a jelen tájékoztató nem terjed ki.',
          `A weboldal üzemeltetéséhez tárhelyszolgáltatót veszünk igénybe: ${TODO('tárhelyszolgáltató neve')}.`,
        ],
      },
      {
        heading: 'Az Ön jogai',
        list: [
          'Tájékoztatáshoz és hozzáféréshez való jog',
          'Helyesbítéshez való jog',
          'Törléshez való jog',
          'Az adatkezelés korlátozásához való jog',
          'Adathordozhatósághoz való jog',
          'Tiltakozáshoz való jog, illetve a hozzájárulás bármikori visszavonása',
        ],
        paragraphs: [
          `Kérelmét a ${TODO('e-mail cím')} címen jelentheti be. Panasszal a Nemzeti Adatvédelmi és Információszabadság Hatósághoz (1055 Budapest, Falk Miksa utca 9–11.) vagy bírósághoz fordulhat.`,
        ],
      },
    ],
  },
  {
    slug: 'aszf',
    title: 'Általános szerződési feltételek',
    description:
      'A SmashR weboldalának használatára vonatkozó feltételek, valamint a rendelés és a kiszállítás kereteinek ismertetése.',
    lead: 'A weboldal használatának feltételei, valamint tájékoztatás arról, hol jön létre a szerződés.',
    review: true,
    sections: [
      {
        heading: 'A weboldal célja',
        paragraphs: [
          'Ez a weboldal tájékoztató jellegű: bemutatja a SmashR kínálatát, elérhetőségét és nyitvatartását. Az oldalon keresztül közvetlenül nem lehet rendelést leadni és fizetést teljesíteni.',
        ],
      },
      {
        heading: 'Rendelés és szerződéskötés',
        paragraphs: [
          'A rendelés a foodora, illetve a Wolt platformon történik. A megrendelésre, a fizetésre, a kiszállításra, az elállásra és a panaszkezelésre az adott platform mindenkori általános szerződési feltételei irányadók, a szerződés ott jön létre.',
          'A helyszíni vásárlás esetén a szerződés az üzletben, a vásárlás időpontjában jön létre.',
        ],
      },
      {
        heading: 'Árak és kínálat',
        paragraphs: [
          'A weboldalon feltüntetett árak és termékek tájékoztató jellegűek, és a rendelési platformokon közzétett adatokból származnak. A mindenkor érvényes ár, elérhetőség és kiszállítási díj az adott platform felületén olvasható. Az esetleges eltérésekért felelősséget nem vállalunk.',
        ],
      },
      {
        heading: 'Allergének és összetevők',
        paragraphs: [
          'Az ételek összetevőire és az allergénekre vonatkozó pontos tájékoztatást az üzletben, illetve a rendelési platformok termékadatlapjain adjuk meg. Allergia esetén kérjük, rendelés előtt érdeklődjön.',
        ],
      },
      {
        heading: 'Szellemi tulajdon',
        paragraphs: [
          'A weboldalon szereplő védjegyek, logók, szövegek és képek a jogosultjaik tulajdonát képezik. Felhasználásuk kizárólag előzetes írásbeli engedéllyel lehetséges.',
        ],
      },
      {
        heading: 'A feltételek módosítása',
        paragraphs: [
          'A jelen feltételeket bármikor módosíthatjuk. A módosítás a weboldalon való közzététellel lép hatályba.',
        ],
      },
    ],
  },
  {
    slug: 'suti-tajekoztato',
    title: 'Süti tájékoztató',
    description:
      'Milyen sütiket és tárolási megoldásokat használ a SmashR weboldala, és hogyan módosíthatja a döntését.',
    lead: 'Mit tárolunk a böngészőjében, milyen célból, és hogyan vonhatja vissza a hozzájárulását.',
    review: true,
    sections: [
      {
        heading: 'Az alapelv',
        paragraphs: [
          'Amíg Ön másként nem dönt, csak a működéshez feltétlenül szükséges adatot tároljuk. Analitikai és beágyazási célú tárolás kizárólag az Ön kifejezett hozzájárulása után indul — a hozzájárulás előtt a kapcsolódó szolgáltatások be sem töltődnek.',
        ],
      },
      {
        heading: 'Kategóriák',
        list: [
          'Feltétlenül szükséges — a biztonságos működéshez és magának a hozzájárulási döntésnek a megőrzéséhez. Nem kapcsolható ki. Megőrzés: 180 nap.',
          'Funkcionális — beágyazott tartalmak, például a Google térkép betöltése. Hozzájárulás nélkül a térkép helyén a cím és az útvonaltervezés jelenik meg.',
          'Analitika — az oldalhasználat mérése. Hozzájárulás nélkül nem töltődik be.',
        ],
      },
      {
        heading: 'A döntés módosítása',
        paragraphs: [
          'Döntését bármikor megváltoztathatja a lábléc „Süti beállítások” pontjára kattintva. A tárolt adatokat a böngészője beállításaiban is törölheti.',
        ],
      },
      {
        heading: 'Külső szolgáltatók',
        paragraphs: [
          'A beágyazott térképet a Google szolgáltatja. A rendelési gombok külső oldalakra (foodora, Wolt) vezetnek, amelyek saját sütikezeléssel rendelkeznek; ezekre a jelen tájékoztató nem terjed ki.',
        ],
      },
    ],
  },
];

export function legalDocument(slug: string): LegalDocument | undefined {
  return legalDocuments.find((document) => document.slug === slug);
}
