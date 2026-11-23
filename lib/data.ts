export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://dra-vanessa-vittorini.vercel.app",
  name: "Dra. Vanessa Vittorini Sangueza",
  shortName: "Dra. Vanessa Vittorini",
  title: "Dra. Vanessa Vittorini · Ortodoncia y Ortopedia Maxilar en Cochabamba",
  description:
    "Ortodoncia con brackets, ortopedia maxilar y odontología para niños y adultos en Cochabamba. Dra. Vanessa Vittorini Sangueza, Torres Sofer, piso 6, oficina 602.",
  phone: "59175933292",
  phoneLabel: "+591 75933292",
  instagram: "https://www.instagram.com/dra.vanessa_vittorini/",
  instagramHandle: "@dra.vanessa_vittorini",
  address: "Torres Sofer, piso 6, oficina 602",
  city: "Cochabamba, Bolivia",
  mapQuery: "Torres Sofer, Cochabamba, Bolivia",
  // Reemplazar con el enlace real de reseñas del Perfil de Empresa de Google
  reviewUrl: "https://g.page/r/REEMPLAZAR/review",
  author: { name: "Fernando Ponz", url: "https://wa.me/59177108880" },
};

export const waLink = (msg: string) =>
  `https://wa.me/${SITE.phone}?text=${encodeURIComponent(msg)}`;

export type Faq = [string, string];
export type IconName = "implant" | "sparkle" | "crown" | "wisdom" | "jaw" | "gum" | "shield" | "smile";
export type Treatment = {
  slug: string; icon: IconName; cat: string; t: string; short: string; seo: string;
  intro: string; tags: string[]; who: string[]; steps: [string, string][]; faq: Faq[];
};

// Tratamientos tomados de su perfil (ortodoncia, ortopedia maxilar, odontología general). Confirmar con la doctora.
export const TREATMENTS: Treatment[] = [
  {
    slug: "ortodoncia-con-brackets", icon: "smile", cat: "Ortodoncia", t: "Ortodoncia con brackets",
    short: "Alinea los dientes y corrige la mordida en jóvenes y adultos.",
    seo: "Ortodoncia con brackets en Cochabamba",
    intro: "Los brackets mueven los dientes poco a poco hasta su lugar, para que la sonrisa se vea alineada y la mordida funcione bien. Cada tratamiento se planifica con estudios y se acompaña con controles periódicos.",
    tags: ["Jóvenes", "Adultos", "Brackets metálicos"],
    who: ["Dientes apiñados o torcidos", "Espacios entre los dientes", "La mordida no cierra bien", "Quieres una sonrisa alineada"],
    steps: [["Valoración", "Revisión de dientes, mordida y fotos de la sonrisa."], ["Estudios", "Radiografías y modelos para planificar el caso."], ["Colocación", "Se colocan los brackets y se explica cómo cuidarlos."], ["Controles", "Ajustes periódicos hasta terminar el tratamiento."]],
    faq: [["¿Cuánto tiempo se usan los brackets?", "Depende de cada caso. En la valoración la doctora le explica el tiempo estimado según su mordida y lo que hay que corregir."], ["¿Duele usar brackets?", "Los primeros días después de colocarlos o ajustarlos puede haber molestias leves que pasan solas. Le damos indicaciones para estar más cómodo."]],
  },
  {
    slug: "ortopedia-maxilar", icon: "jaw", cat: "Ortopedia", t: "Ortopedia maxilar",
    short: "Guía el crecimiento de los maxilares en niños.",
    seo: "Ortopedia maxilar para niños en Cochabamba",
    intro: "La ortopedia maxilar aprovecha el crecimiento de los niños para guiar el desarrollo de los maxilares. Tratar a tiempo puede evitar o simplificar tratamientos más largos en el futuro.",
    tags: ["Niños", "Crecimiento", "Aparatos funcionales"],
    who: ["Mandíbula muy adelante o muy atrás", "Paladar estrecho", "Respira por la boca", "Problemas de mordida desde pequeño"],
    steps: [["Valoración", "Evaluación del crecimiento y la mordida del niño."], ["Diagnóstico", "Estudios para ver cómo están creciendo los maxilares."], ["Aparato", "Se indica el aparato adecuado para su edad."], ["Seguimiento", "Controles para medir el avance."]],
    faq: [["¿A qué edad conviene la primera consulta?", "Se recomienda una primera revisión alrededor de los 6 a 7 años, aunque cada caso es distinto. Así se detectan a tiempo los problemas de crecimiento."], ["¿Qué diferencia hay entre ortopedia y ortodoncia?", "La ortopedia guía el crecimiento de los huesos maxilares; la ortodoncia mueve los dientes. Muchas veces se complementan."]],
  },
  {
    slug: "ortodoncia-para-ninos", icon: "sparkle", cat: "Niños", t: "Ortodoncia para niños",
    short: "Tratamiento temprano para que la sonrisa crezca alineada.",
    seo: "Ortodoncia para niños en Cochabamba",
    intro: "La ortodoncia temprana corrige a tiempo problemas de mordida y de espacio en los niños, mientras todavía están creciendo. Explicamos todo a los papás en un lenguaje simple.",
    tags: ["Ortodoncia temprana", "Dientes de leche", "Papás informados"],
    who: ["Dientes que salen torcidos", "Falta de espacio", "Hábitos como chuparse el dedo", "Mordida cruzada"],
    steps: [["Primera visita", "Conocemos al niño y revisamos su sonrisa sin apuros."], ["Plan", "Explicamos a los papás qué conviene y cuándo."], ["Tratamiento", "Aparatos adaptados a su edad."], ["Acompañamiento", "Controles y consejos para casa."]],
    faq: [["¿Es mejor esperar a que salgan todos los dientes?", "No siempre. Algunos problemas son más fáciles de corregir mientras el niño crece. En la valoración se define el mejor momento."], ["¿Mi hijo va a usar brackets?", "Depende del caso. A veces basta con un aparato removible o funcional en la etapa de crecimiento."]],
  },
  {
    slug: "aparatos-removibles", icon: "gum", cat: "Ortopedia", t: "Aparatos removibles",
    short: "Aparatos como el lip bumper para guiar dientes y labios.",
    seo: "Aparatos de ortopedia removibles en Cochabamba",
    intro: "Los aparatos removibles, como el lip bumper o las placas, ayudan a ganar espacio, corregir hábitos y guiar la posición de los dientes. Se quitan para limpiarlos y se ajustan en cada control.",
    tags: ["Lip bumper", "Placas", "Hábitos"],
    who: ["Falta de espacio para los dientes", "Labio que empuja los dientes", "Hábitos que afectan la mordida", "Etapa de crecimiento"],
    steps: [["Valoración", "Se identifica qué necesita corregirse."], ["Medidas", "Se toman impresiones para el aparato."], ["Entrega", "Se coloca y se enseña a usarlo y limpiarlo."], ["Controles", "Ajustes hasta lograr el objetivo."]],
    faq: [["¿Cuántas horas al día se usa?", "Depende del aparato y del caso; la doctora indica el tiempo exacto. La constancia es clave para el resultado."], ["¿Se puede comer con el aparato?", "En general se retira para comer y se limpia antes de volver a colocarlo."]],
  },
  {
    slug: "odontopediatria", icon: "smile", cat: "Niños", t: "Odontopediatría",
    short: "Cuidado dental para los más pequeños, con paciencia.",
    seo: "Odontopediatría en Cochabamba",
    intro: "Atención dental pensada para niños: revisiones, prevención y tratamientos en un ambiente tranquilo, para que la visita al dentista sea una buena experiencia desde pequeños.",
    tags: ["Prevención", "Primera visita", "Hábitos de higiene"],
    who: ["Primera visita al dentista", "Caries en dientes de leche", "Enseñar a cepillarse", "Controles de rutina"],
    steps: [["Conocernos", "El niño se familiariza con el consultorio."], ["Revisión", "Evaluación de dientes y encías."], ["Prevención", "Limpieza y consejos de higiene."], ["Seguimiento", "Controles periódicos."]],
    faq: [["¿Cuándo debe ser la primera visita?", "Se recomienda con la aparición de los primeros dientes o alrededor del primer año."], ["¿Cómo preparo a mi hijo?", "Hablarle de la visita con naturalidad y sin miedo ayuda mucho. Nosotros hacemos el resto con calma."]],
  },
  {
    slug: "odontologia-general", icon: "shield", cat: "General", t: "Odontología general",
    short: "Curaciones, revisiones y tratamientos para toda la familia.",
    seo: "Dentista general en Cochabamba",
    intro: "Revisiones, curaciones de caries con resina del color del diente y tratamientos de rutina para mantener sana la sonrisa de toda la familia.",
    tags: ["Curaciones", "Resinas estéticas", "Toda la familia"],
    who: ["Sensibilidad o dolor dental", "Manchas o caries", "Revisión de rutina", "Curaciones antiguas"],
    steps: [["Revisión", "Evaluación completa de la boca."], ["Diagnóstico", "Se explica qué hace falta y por qué."], ["Tratamiento", "Curaciones y procedimientos necesarios."], ["Control", "Seguimiento para cuidar el resultado."]],
    faq: [["¿Cada cuánto debo ir al dentista?", "En general se recomienda una revisión cada seis meses."], ["¿Las curaciones se notan?", "Usamos resinas del color del diente para que la curación no se note."]],
  },
  {
    slug: "limpieza-y-prevencion", icon: "sparkle", cat: "Prevención", t: "Limpieza y prevención",
    short: "Elimina sarro y protege dientes y brackets.",
    seo: "Limpieza dental en Cochabamba",
    intro: "Limpieza profesional que elimina sarro y manchas y protege las encías. Es especialmente importante durante la ortodoncia, cuando los brackets dificultan el cepillado.",
    tags: ["Profilaxis", "Pacientes con brackets", "Encías sanas"],
    who: ["Sangrado de encías", "Sarro visible", "Uso de brackets", "Más de seis meses sin limpieza"],
    steps: [["Revisión", "Se evalúan dientes y encías."], ["Limpieza", "Se retira el sarro y la placa."], ["Pulido", "Se quitan manchas superficiales."], ["Consejos", "Técnica de cepillado según su caso."]],
    faq: [["¿Con brackets también debo hacerme limpiezas?", "Sí, y con más razón: los brackets acumulan placa y una limpieza profesional ayuda a evitar manchas y caries."], ["¿La limpieza daña el esmalte?", "No. Una limpieza profesional bien hecha no daña el esmalte."]],
  },
  {
    slug: "controles-de-ortodoncia", icon: "crown", cat: "Ortodoncia", t: "Controles y retención",
    short: "Seguimiento y retenedores para que el resultado dure.",
    seo: "Controles de ortodoncia y retenedores en Cochabamba",
    intro: "Al terminar la ortodoncia, los retenedores y los controles mantienen los dientes en su nuevo lugar. Es la etapa que asegura que el resultado dure muchos años.",
    tags: ["Retenedores", "Controles", "Resultado estable"],
    who: ["Terminaste tu ortodoncia", "Usas retenedor", "Notas que los dientes se mueven", "Ortodoncia hecha en otro lugar"],
    steps: [["Evaluación", "Revisión del resultado y la mordida."], ["Retenedor", "Fijo o removible, según el caso."], ["Controles", "Visitas espaciadas para vigilar."], ["Ajustes", "Si hace falta, pequeños retoques."]],
    faq: [["¿Por cuánto tiempo uso el retenedor?", "La doctora le indica el tiempo según su caso. Usarlo como se indica evita que los dientes vuelvan a moverse."], ["¿Atienden a pacientes tratados en otro lugar?", "Sí. Se hace una valoración y se define el mejor seguimiento."]],
  },
];

export const GENERAL_FAQ: Faq[] = [
  TREATMENTS[1].faq[0], TREATMENTS[0].faq[0], TREATMENTS[2].faq[0], TREATMENTS[4].faq[0], TREATMENTS[6].faq[0],
];

// Sin videos por ahora: cargar aquí cuando la doctora los envíe (mp4 + poster en /public/video).
export const VIDEOS: { src: string; poster: string; who: string; title: string; desc: string }[] = [];

export const FORMACION = [
  { pais: "Estados Unidos", titulo: "Bioquímica", lugar: "University of Arkansas (UARK)" },
  { pais: "Bolivia", titulo: "Odontología", lugar: "Univalle" },
  { pais: "Uruguay", titulo: "Odontología", lugar: "Udelar" },
  { pais: "Brasil", titulo: "Ortodoncia y ortopedia maxilar", lugar: "Team Trevisi · Facop" },
];

export const faqJsonLd = (list: Faq[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: list.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});
