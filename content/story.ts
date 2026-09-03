/**
 * The brand copy.
 *
 * Written to be specific rather than reassuring. Nothing here claims a founding year, a family
 * recipe, an award, or a number of burgers sold — none of that is on the record, and a story that
 * invents its own history is the fastest way to sound like every other restaurant site. What is
 * here is what the kitchen actually does, said plainly.
 */

export const storyShort = {
  heading: 'Egy lap. Egy mozdulat.',
  paragraphs: [
    'A SmashR egy pult, egy forró lap és egy nagyon rövid lista. Nem akarunk mindent tudni. Azt akarjuk, hogy az a néhány dolog, amit csinálunk, minden alkalommal ugyanúgy sikerüljön.',
    'A hús frissen érkezik, nem fagyasztva. A zöldséget aznap vágjuk. A szószt magunknak keverjük. A többi a lapon dől el: a golyó lemegy, egyszer rányomjuk, és a hús kérget kap. Ez a kéreg az egész.',
  ],
} as const;

export const storyLong = {
  heading: 'Nincs titkos recept. Csak egy mozdulat, amit nem rontunk el.',
  paragraphs: [
    'A SmashR Budapest XXIII. kerületében nyitott, egy pulttal, egy lappal és azzal a meggyőződéssel, hogy a burger nem attól lesz jó, ha sok minden van benne. Attól lesz jó, ha a hús jó, és ha valaki figyel rá, amíg sül.',
    'A smash technika egyszerű és megbocsáthatatlan. A friss marhagolyó a felforrósított lapra kerül, és ott azonnal, egyetlen mozdulattal lenyomjuk. A hús a fémhez tapad, a nedvesség elpárolog, és a felület karamellizálódni kezd. Ez az, amitől a széle csipkésre ropog, miközben a közepe szaftos marad. Ha másodszor is hozzányúlsz, elrontottad.',
    'Emiatt nincs nálunk húsz tételes étlap. Négy burger, néhány köret, két szósz — annyi, amennyit egy műszak alatt tényleg végig lehet csinálni tisztességesen. Ami a lapról lejön, az két percen belül a kezedben van.',
    'A street food nekünk nem stílusirány, hanem a tempó: gyorsan, hangosan, papírban, állva vagy vitelre. A pult mögött ugyanaz a csapat áll nap mint nap, és a legtöbb vendégünket néhány rendelés után már névről ismerjük.',
  ],
} as const;

/** The `/smashr-experience` page: the technique, told as four steps. */
export const technique = [
  {
    title: 'A hús',
    body: 'Friss darált marha, sosem fagyasztva, magas zsírtartalommal — enélkül nincs mit karamellizálni. Golyóba fogjuk, nem lapítjuk előre.',
  },
  {
    title: 'A lap',
    body: 'A sütőlap forróbb, mint amit egy serpenyő otthon elbír. Ezen a hőfokon a hús felülete másodpercek alatt kérget kap, mielőtt a belseje átsülne.',
  },
  {
    title: 'A smash',
    body: 'A golyó lemegy, és egyetlen mozdulattal, teljes súllyal rányomjuk. Egyszer. A hús szétterül, a széle vékonyra fut, és ott indul el a Maillard-reakció.',
  },
  {
    title: 'A perem',
    body: 'A vékonyra futott szél csipkésre ropog, a közép szaftos marad. Erre kerül a sajt, még a lapon, hogy a hús melege olvassza rá.',
  },
] as const;

export const philosophy = [
  {
    title: 'Rövid étlap',
    body: 'Négy burger és néhány köret. Amit egy műszak alatt végig lehet csinálni tisztességesen — se többet, se kevesebbet.',
  },
  {
    title: 'Aznapi alapanyag',
    body: 'A hús frissen érkezik, a zöldséget aznap vágjuk, a szószt magunknak keverjük. Ami megmarad, az másnap nem kerül a lapra.',
  },
  {
    title: 'Rendelésre készül',
    body: 'Nincs melegen tartott készlet. A hús akkor megy a lapra, amikor a rendelés beér, és két percen belül a kezedben van.',
  },
  {
    title: 'Papírban, állva',
    body: 'Nincs terítés, nincs foglalás. Van pult, van papír, és van egy burger, amit két kézzel kell fogni.',
  },
] as const;
