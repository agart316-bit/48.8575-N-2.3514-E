"use strict";

// External deps (loaded via <script defer ...> in index.html)
const { d3, topojson } = window;

if (!d3 || !topojson) {
  throw new Error(
    "Missing deps: d3/topojson not found. Check the <script> tags in index.html."
  );
}

const momentContent = [
  {
    id: 1,
    dec: "1920s",
    city: "Paris",
    title: "The Harem Pant",
    subtitle: "Paris, 1910s-1920s",
    sectionA: "Paul Poiret looked at Ottoman dress and decided Parisian women should wear it. He introduced harem pants and draped silhouettes that had nothing to do with European tailoring. Women who wore them were called scandalous. Women who did not were jealous.",
    sectionB: "Poiret also threw parties in costume. He understood that fashion was not just clothing, it was performance. He was one of the first designers to treat a collection like a show, and the industry copied that idea for the next hundred years.",
    "p-ph": "In the 1920s, buttons were still being made by hand. Pearl buttons were cut from freshwater mussel shells and polished. A single coat could have thirty of them. They were small, decorative, and extremely labor intensive to produce.",
    bs: "pearl",
  },
  {
    id: 2,
    dec: "1920s",
    city: "Paris",
    title: "The Bias Cut",
    subtitle: "Paris, 1920s",
    sectionA: "Madeleine Vionnet figured out that if you cut fabric at a 45 degree angle instead of straight across the grain, it moved completely differently. It clung, it draped, it followed the body. Before this, fabric sat on the body. After Vionnet, it moved with it.",
    sectionB: "She barely gets the credit she deserves. Vionnet never advertised, never did interviews, just worked. Other designers copied her constantly, including people who are now far more famous. The bias cut is everywhere today and most people have no idea where it came from.",
    "p-ph": "Vionnet's dresses often had no buttons at all. The bias cut meant the fabric could stretch over the body without needing a fastening. When she did use closures, they were hidden. The button was becoming optional for the first time.",
    bs: "pearl",
  },
  {
    id: 3,
    dec: "1920s",
    city: "Berlin",
    title: "Cabaret Dressing",
    subtitle: "Berlin, 1920s",
    sectionA: "Weimar Berlin was a strange and specific moment. The city had no money, no stability, and complete creative freedom. The cabarets were full of people dressing however they wanted. Men in gowns. Women in suits. Nobody had language for it yet but they were doing it anyway.",
    sectionB: "This was not fashion in the industry sense. There were no designers involved. It was people figuring out identity through clothing before the culture had caught up. Fashion historians look back at it now as one of the most forward moments in the history of dress.",
    "p-ph": "In Weimar cabaret, costume buttons were theatrical. Big, mismatched, worn wrong on purpose. A man in a gown might fasten it with military buttons. The button was being used to signal something, not just to close something.",
    bs: "pearl",
  },
  {
    id: 4,
    dec: "1930s",
    city: "Paris",
    title: "The Little Black Dress",
    subtitle: "Paris, 1926",
    sectionA: "Chanel published a simple black dress in Vogue in 1926. The magazine called it the Ford of fashion, meaning it was for everyone. Before this, black was for mourning. Chanel made it for everything. It became the most copied silhouette in fashion history.",
    sectionB: "The reason it worked is because it had nothing. No color, no pattern, no decoration. It was a blank space you could wear anywhere. Chanel understood that simplicity is harder to design than ornamentation, and that most women did not want to think too hard about getting dressed.",
    "p-ph": "By the 1930s, Bakelite had arrived. It was the first synthetic plastic and manufacturers could mold it into any shape. Buttons became cheaper, more colorful, and weirder. You could get a button shaped like a flower, a face, or an airplane. Mass production changed everything.",
    bs: "horn",
  },
  {
    id: 5,
    dec: "1930s",
    city: "Hollywood",
    title: "The Shoulder Pad",
    subtitle: "Hollywood, 1930s",
    sectionA: "Adrian was MGM's costume designer and Joan Crawford was his best subject. He padded her shoulders to balance her hips and the look ended up in every women's magazine in America. Hollywood was now setting the agenda. Paris still thought it was in charge but it was not.",
    sectionB: "This is when cinema became the most powerful fashion medium in the world. Women did not just watch the movies, they copied them. Department stores started selling clothes based on what was on screen. The idea of a celebrity collaboration is not new, it just used to be called going to the pictures.",
    "p-ph": "Hollywood costume departments had extensive button archives. Adrian would source buttons from Europe specifically to add detail to shoulders, cuffs, and lapels. A button in film had to read from the back row, so they got bigger and more dramatic through the 1930s.",
    bs: "horn",
  },
  {
    id: 6,
    dec: "1940s",
    city: "London",
    title: "Utility Clothing",
    subtitle: "London, 1941",
    sectionA: "The British government told people exactly what they could wear. The CC41 Utility scheme set rules for fabric use, number of seams, width of lapels, number of buttons. Fashion became a matter of national policy. Designers had to make something beautiful within strict limits.",
    sectionB: "The surprising thing is some of it was actually good. When you cannot add anything, you have to get the shape right. Norman Hartnell and Hardy Amies both worked within the utility framework and produced clothes that held up. Constraint turned out to be useful.",
    "p-ph": "Buttons were rationed. The CC41 scheme limited the number of buttons per garment. A jacket could have no more than three. Buttons were recycled from old clothes and saved. People kept button tins. The button became genuinely precious for the first time in a century.",
    bs: "fabric",
  },
  {
    id: 7,
    dec: "1940s",
    city: "Paris",
    title: "The New Look",
    subtitle: "Paris, 1947",
    sectionA: "In February 1947, Dior showed a collection with full skirts, tiny waists, and padded hips. The silhouette used meters of fabric at a time when fabric was still being rationed. Some women loved it. Some threw things at the models in the street. Nobody ignored it.",
    sectionB: "What Dior was really doing was offering women an escape from the war. He gave them something deliberately impractical, expensive, and luxurious. The New Look said the war is over and we can be frivolous again. For a lot of people that was exactly what they needed to hear.",
    "p-ph": "Dior used buttons architecturally. His jackets had rows of covered buttons down the front, functioning as structure as much as fastening. They were fabric-covered to match the garment exactly, invisible as closures but very visible as design elements.",
    bs: "fabric",
  },
  {
    id: 8,
    dec: "1940s",
    city: "New York",
    title: "The Nylon Riot",
    subtitle: "New York, 1945",
    sectionA: "DuPont had been making nylon stockings since 1940 but stopped during the war to produce parachutes. When they went back on sale in 1945, women lined up for miles. In Pittsburgh, 40,000 women queued for 13,000 pairs. It turned into a riot. A synthetic fiber had become that important.",
    sectionB: "The nylon riot is a strange story because it is about wanting something ordinary. Stockings. But they had been unavailable for years and women had been drawing lines on their legs with pencil to simulate them. When the real thing came back, people lost their minds.",
    "p-ph": "Nylon changed buttons too. Synthetic materials meant buttons could be molded in bulk at very low cost. By the late 1940s, nylon buttons were replacing bone, horn, and shell in cheaper garments. The handmade button was becoming a luxury item.",
    bs: "fabric",
  },
  {
    id: 9,
    dec: "1940s",
    city: "New York",
    title: "American Sportswear",
    subtitle: "New York, 1940s",
    sectionA: "Claire McCardell designed for women who moved. Separates, wrap dresses, jersey fabric, flat shoes. She ignored Paris completely and looked at American women's actual lives instead. She was the first American designer to build a career without reference to French fashion.",
    sectionB: "Her clothes were practical but not boring. She used hardware instead of buttons, tied things instead of zipping them, left seams visible. She made casual dressing feel considered. Everything in athleisure and normcore traces back to what she was doing in the 1940s.",
    "p-ph": "McCardell famously avoided buttons when she could. She preferred hooks, ties, and metal hardware. When she did use buttons, they were often functional toggles rather than decorative. She thought buttons were fussy. Her work helped establish that closures did not need to perform elegance.",
    bs: "fabric",
  },
  {
    id: 10,
    dec: "1950s",
    city: "Rome",
    title: "La Dolce Vita",
    subtitle: "Rome, 1950s",
    sectionA: "Italian cinema in the 1950s invented a way of dressing that felt completely different from Paris. It was relaxed and confident at the same time. Capri pants, linen shirts, sandals on cobblestones. Audrey Hepburn in Roman Holiday. The whole thing felt like a vacation and everyone wanted in.",
    sectionB: "This was the beginning of Italian fashion as a real industry. Rome and then Milan started drawing international buyers. The idea that you could be well dressed without being formal, that ease was its own kind of sophistication, that came from this moment.",
    "p-ph": "Italian tailoring in this period was known for its buttons. Small, closely spaced, often in unusual materials like tortoiseshell or painted metal. Italian shirtmakers began to differentiate themselves through button quality. The button became a mark of craft.",
    bs: "metal",
  },
  {
    id: 11,
    dec: "1950s",
    city: "Hollywood",
    title: "Denim Goes Rebellious",
    subtitle: "Hollywood, 1953-1955",
    sectionA: "Before James Dean and Marlon Brando, jeans were workwear. Farmers wore them. After Rebel Without a Cause and The Wild One, every teenager in America wanted a pair. The clothing industry tried to ban denim from schools. That only made it more appealing.",
    sectionB: "What happened here is that clothing became generational. Young people dressed differently from their parents on purpose, for the first time. Jeans were the signal. It started a split in fashion between what adults wore and what young people wore that has never really closed.",
    "p-ph": "Levi's jeans used copper rivets and a five-button fly. No zipper. The buttons were functional and industrial looking, stamped metal with the brand name. When jeans became fashionable, those buttons became iconic. The functional detail became the aesthetic.",
    bs: "metal",
  },
  {
    id: 12,
    dec: "1950s",
    city: "Paris",
    title: "The Silhouette Wars",
    subtitle: "Paris, 1950s",
    sectionA: "Dior and Balenciaga disagreed about everything. Dior built his clothes around an idealized female shape, padding and boning to create curves. Balenciaga cut away from the body, created space between the fabric and the wearer. One defined the body. The other freed it.",
    sectionB: "The press covered this like a sports rivalry. Which silhouette would win? Both did. Dior's approach became ready-to-wear. Balenciaga's became the foundation for conceptual fashion. You can trace a straight line from Balenciaga's 1950s work to Rei Kawakubo in the 1980s.",
    "p-ph": "Balenciaga's buttons were almost architectural. He used them as punctuation rather than fastening, placed precisely to direct the eye. His workrooms sourced unusual buttons from around the world. A single button choice could change the reading of an entire garment.",
    bs: "metal",
  },
  {
    id: 13,
    dec: "1960s",
    city: "London",
    title: "The Miniskirt",
    subtitle: "London, 1965",
    sectionA: "Mary Quant had a shop on King's Road called Bazaar and she was making clothes for the young women who lived near it. She kept shortening the hemline because her customers kept asking her to. By the time the miniskirt became news she had been selling it for years.",
    sectionB: "The miniskirt became a political argument instantly. It was called immoral, dangerous, and irresponsible by people who had opinions about hemlines. Quant said women should be able to dress however they wanted. That was the real point and the length was just the evidence.",
    "p-ph": "1960s fashion used buttons as decoration more than function. Big plastic buttons in primary colors, sometimes several down the front of a shift dress as the only visual detail. The Mod aesthetic needed bold, graphic closures and the button provided them.",
    bs: "pmod",
  },
  {
    id: 14,
    dec: "1960s",
    city: "Paris",
    title: "Le Smoking",
    subtitle: "Paris, 1966",
    sectionA: "Yves Saint Laurent took a man's tuxedo, cut it for a woman, and showed it in 1966. Women had worn trousers before but not like this, not this deliberately, not to a formal dinner. He called it Le Smoking. Women who wore it to restaurants were sometimes refused entry.",
    sectionB: "Le Smoking became the most recurring piece in Saint Laurent's career. He showed versions of it every few years for decades. It was his argument about what women should be able to wear, made over and over. The tuxedo still reads as a statement on a woman, which tells you how unresolved the argument still is.",
    "p-ph": "The tuxedo's buttons were part of the statement. Saint Laurent kept the original menswear details, including silk-covered buttons on the jacket. Putting men's buttons on a woman's body was part of the point. The button carried the gender coding.",
    bs: "pmod",
  },
  {
    id: 15,
    dec: "1970s",
    city: "New York",
    title: "Studio 54",
    subtitle: "New York, 1977-1980",
    sectionA: "Studio 54 was a club that lasted three years and people are still writing about it. Halston dressed half the people there. The other half dressed themselves in things that barely qualified as clothing. It was the first time a nightclub functioned as a fashion show and the audience was the talent.",
    sectionB: "What made it matter was the mix. Bianca Jagger next to a kid from the Bronx next to a drag performer. Fashion had always been hierarchical and Studio 54 scrambled it. Getting dressed for that room meant something different from dressing for Paris or Hollywood.",
    "p-ph": "Halston famously minimized fastening. His disco-era clothes were designed to come off as easily as possible, often wrapped or tied. When buttons appeared they were almost invisible. The button was becoming an embarrassment to a certain idea of glamour.",
    bs: "pgrv",
  },
  {
    id: 16,
    dec: "1970s",
    city: "London",
    title: "Punk",
    subtitle: "London, 1975-1979",
    sectionA: "Vivienne Westwood and Malcolm McLaren had a shop on King's Road called SEX. They were making clothes with bondage straps, safety pins, and ripped fabric on purpose. When the Sex Pistols started wearing them the look went everywhere. Punk was fashion that wanted to be ugly and ended up being beautiful.",
    sectionB: "The important thing about punk clothing was that anyone could do it. You did not need money or access. You needed a safety pin and something to rip. It democratized getting dressed in a way that expensive fashion never has and probably never will.",
    "p-ph": "Punk replaced buttons with safety pins. This was both practical and deliberate. A safety pin is an industrial fastener, not a decorative one, and using it on clothing was a refusal of the idea that clothes should be finished or refined. The safety pin as anti-button.",
    bs: "pgrv",
  },
  {
    id: 17,
    dec: "1980s",
    city: "New York",
    title: "Dapper Dan",
    subtitle: "Harlem, New York, 1982-1992",
    sectionA: "Daniel Day ran an atelier in Harlem that was open 24 hours. He took luxury brand fabrics, or made his own versions of them, and created pieces for rappers, athletes, and anyone with money and style who felt excluded from the actual luxury industry. He invented logomania before the brands did.",
    sectionB: "The luxury houses sued him and shut him down in 1992. Then spent the next twenty years copying what he had built. Gucci eventually collaborated with him officially in 2017. The industry stole his work, then came back for his name. He is now credited as one of the most influential designers of the century.",
    "p-ph": "In the 1980s, designer buttons became status symbols. Chanel's interlocked CC buttons were copied constantly. Dapper Dan used buttons to reinforce the logo-heavy aesthetic, sourcing or creating hardware that matched his custom fabrics. The button as brand identity.",
    bs: "neon",
  },
  {
    id: 18,
    dec: "1980s",
    city: "Milan",
    title: "The Unstructured Suit",
    subtitle: "Milan, 1980",
    sectionA: "Armani took the suit apart. He removed the padding, the canvas, the lining that held everything rigid. What remained was soft and light and moved when you moved. Richard Gere wore it in American Gigolo and suddenly every man in America wanted a suit that did not feel like a suit.",
    sectionB: "This is when Milan became a serious fashion capital. Armani and then Versace showed that Italian designers could set the agenda globally, not just produce good tailoring. The power suit of the 1980s is usually associated with shoulder pads and aggression but Armani's version was about ease.",
    "p-ph": "Armani's buttons were understated, almost invisible. He chose matte, tonal buttons that did not announce themselves. This was a direct contrast to the flashy hardware of the early 1980s. The button became quiet on purpose, as a statement about sophistication.",
    bs: "neon",
  },
  {
    id: 19,
    dec: "1990s",
    city: "New York",
    title: "The Grunge Collection",
    subtitle: "New York, 1993",
    sectionA: "Marc Jacobs was the designer at Perry Ellis, a respectable American sportswear brand. In 1993 he sent flannel shirts, ripped jeans, and Doc Martens down the runway. The board fired him the next day. The collection is now in the Metropolitan Museum of Art.",
    sectionB: "What Jacobs did was bring street dressing into formal fashion. The clothes looked like what people were actually wearing in Seattle and on college campuses. The industry said that was not fashion. Then copied it for the next decade. He went on to design for Louis Vuitton.",
    "p-ph": "Grunge styling used buttons badly on purpose. Shirts left partially buttoned, collar buttons ignored, flannel buttons mismatched with the garment's intention. The deliberate misuse of the button was part of the aesthetic. It said I got dressed without thinking about it even when you clearly had.",
    bs: "skeu",
  },
  {
    id: 20,
    dec: "1990s",
    city: "London",
    title: "Heroin Chic",
    subtitle: "London / New York, 1993-1997",
    sectionA: "Calvin Klein put Kate Moss in ads that looked like they were taken in someone's apartment with a disposable camera. The models looked pale, thin, and vacant. The industry called it heroin chic. It replaced the athletic supermodel look almost overnight and made a whole generation feel wrong in their bodies.",
    sectionB: "The thing about heroin chic is that it was presented as anti-fashion, raw and real, when it was actually very constructed and expensive. The disheveled look required specific bodies and specific lighting and specific retouching. The naturalness was entirely manufactured.",
    "p-ph": "1990s fashion digitized buttons for the first time. Web pages in 1995 needed clickable elements and early HTML introduced the button element as a grey, beveled rectangle. It looked like a physical button translated badly into pixels, complete with a raised 3D effect.",
    bs: "skeu",
  },
  {
    id: 21,
    dec: "1990s",
    city: "Antwerp",
    title: "McQueen's Highland Rape",
    subtitle: "London, 1995",
    sectionA: "Alexander McQueen's third collection was called Highland Rape. The models wore torn clothing and walked through dry ice. The show was a response to the British colonization of Scotland, though many people who saw it did not read it that way. It was one of the most controversial shows in fashion history.",
    sectionB: "McQueen's bumster trouser, which dropped to expose the base of the spine, came from the same collection. He called it the most erotic part of the body. The fashion industry spent years trying to figure out what to do with him, someone who used the runway to say things fashion usually avoided.",
    "p-ph": "McQueen's relationship with the button was confrontational. He used large, often handmade closures that felt more like sculpture than fastening. In Highland Rape, some garments appeared to be torn open, the button made irrelevant by force. The button as something that had failed to hold.",
    bs: "skeu",
  },
  {
    id: 22,
    dec: "2000s",
    city: "Tokyo",
    title: "Harajuku",
    subtitle: "Tokyo, 1997-2006",
    sectionA: "Shoichi Aoki started photographing teenagers on the streets of Harajuku in 1997 and publishing the photos in a magazine called Fruits. The kids he photographed were mixing gothic lolita with anime references with vintage Western clothes with things they had made themselves. There was no Western reference point for any of it.",
    sectionB: "The fashion industry took about twenty years to catch up. What was happening in Harajuku in the late 1990s anticipated subculture mixing, DIY aesthetics, and the rejection of single coherent style identities. It is only recently that the industry has started crediting Tokyo as a source rather than a curiosity.",
    "p-ph": "Harajuku style layered buttons. Multiple fastened cardigans, mismatched buttons on handmade pieces, buttons as accessories worn separately from any garment. In digital design, the early 2000s brought the first glossy web buttons, rounded corners and gradient fills simulating physical depth.",
    bs: "web2",
  },
  {
    id: 23,
    dec: "2000s",
    city: "Paris",
    title: "Logo Mania",
    subtitle: "Paris, 2000-2006",
    sectionA: "John Galliano at Dior and Marc Jacobs at Louis Vuitton both understood something about the early 2000s: people wanted to be seen wearing the name. The monogram bag became the most copied object in fashion history. Counterfeit LV canvas was everywhere. Luxury became loud and then louder.",
    sectionB: "This period ended badly. By 2007 the logo bag was over and quiet luxury was beginning. But logo mania left something permanent: it showed that fashion was now completely global, that a bag designed in Paris would be desired in Tokyo and Lagos and Sao Paulo simultaneously.",
    "p-ph": "Logo buttons appeared on everything in this period. Chanel's CC, Gucci's GG, Dior's CD were all rendered as buttons, clasps, and closures. The button became a vehicle for brand identity. On websites, buttons were growing too, the glossy pill-shaped clickable element became standard in every interface.",
    bs: "web2",
  },
  {
    id: 24,
    dec: "2010s",
    city: "New York",
    title: "Off-White",
    subtitle: "New York / Milan, 2013",
    sectionA: "Virgil Abloh put quotation marks around words on his clothing. A zip tie tagged SHOELACES on the shoelaces. ZIP TIE on the zip tie. He was pointing at the thing while selling the thing and somehow both gestures worked at the same time. Off-White made streetwear self-aware.",
    sectionB: "Abloh was the first Black artistic director at a major French fashion house when he took Louis Vuitton menswear in 2018. He died in 2021. His work is still being processed by the industry. He showed that the boundary between streetwear and luxury was a decision, not a fact.",
    "p-ph": "Flat design arrived around 2013 and took buttons with it. Apple's iOS 7 removed all the gradients and bevels. Buttons became flat colored rectangles with no depth at all. The physical metaphor was dropped. A button was now just a colored area you were expected to press.",
    bs: "flat",
  },
  {
    id: 25,
    dec: "2020s",
    city: "Paris",
    title: "The Spray-On Dress",
    subtitle: "Paris, October 2022",
    sectionA: "At Coperni's Spring 2023 show, Bella Hadid walked out in just underwear and stood in the middle of the runway while two technicians sprayed her with a substance called Fabrican. It dried into a white dress in about ten minutes. The video of it has been watched hundreds of millions of times.",
    sectionB: "The spray-on dress worked because it collapsed several things at once: fashion show, science demonstration, performance art, and social media content. It existed for a few hours before Hadid cut it off backstage. The dress was the moment, not the garment. Fashion had become completely comfortable with that.",
    "p-ph": "The spray-on dress had no buttons. It had no seams, no closures, no fastening of any kind. It was removed with scissors. In interface design, buttons in 2022 were often invisible, replaced by gestures, voice commands, and AI prompts. Both the garment button and the digital button were being made unnecessary.",
    bs: "brut",
  },
];

const CITY_COUNTRY_BY_CITY = Object.freeze({
  paris: "France",
  berlin: "Germany",
  hollywood: "United States",
  london: "United Kingdom",
  "new york": "United States",
  rome: "Italy",
  milan: "Italy",
  antwerp: "Belgium",
  tokyo: "Japan",
});

function countryFromCity(city) {
  return CITY_COUNTRY_BY_CITY[(city || "").toLowerCase()] || "Unknown";
}

function readMomentNodes() {
  const nodes = [...document.querySelectorAll("#moment-source .moment-node")];
  const nodeMap = new Map();
  nodes.forEach((node) => {
    const id = Number(node.dataset.id);
    const lat = Number(node.dataset.lat);
    const lon = Number(node.dataset.lon);
    if (!Number.isFinite(id) || !Number.isFinite(lat) || !Number.isFinite(lon)) return;
    nodeMap.set(id, {
      id,
      title: node.dataset.title || "",
      dec: node.dataset.dec || "",
      city: node.dataset.city || "",
      country: node.dataset.country || "",
      bs: node.dataset.bs || "",
      lat,
      lon,
    });
  });
  return nodeMap;
}

const momentNodeMap = readMomentNodes();
const moments = momentContent.map((moment) => {
  const node = momentNodeMap.get(moment.id);
  if (!node) {
    throw new Error(`Missing HTML moment button for id ${moment.id}`);
  }
  return {
    ...moment,
    title: node.title || moment.title,
    dec: node.dec || moment.dec,
    city: node.city || moment.city,
    country: node.country || countryFromCity(node.city || moment.city),
    bs: node.bs || moment.bs,
    lat: node.lat,
    lon: node.lon,
  };
});

const BS = {
  pearl: {
    fill: "#ede8e0",
    stroke: "#bca88a",
    sw: 2.5,
    r: 10,
    ring: true,
    rc: "#bca88a",
    holes: 4,
    hc: "#8a7860",
    glow: null,
  },
  horn: {
    fill: "#7a5c10",
    stroke: "#4a3608",
    sw: 2,
    r: 9,
    ring: false,
    rc: null,
    holes: 2,
    hc: "#2e2006",
    glow: null,
  },
  fabric: {
    fill: "#3e4a58",
    stroke: "#28323e",
    sw: 2,
    r: 9,
    ring: true,
    rc: "#607080",
    holes: 4,
    hc: "#16202a",
    glow: null,
  },
  metal: {
    fill: "#b8c4cc",
    stroke: "#7888a0",
    sw: 1.5,
    r: 10,
    ring: true,
    rc: "#d8e4ee",
    holes: 2,
    hc: "#58707e",
    glow: null,
  },
  pmod: {
    fill: "#ff2244",
    stroke: "#cc0022",
    sw: 2,
    r: 11,
    ring: false,
    rc: null,
    holes: 4,
    hc: "#880018",
    glow: "rgba(255,40,70,.55)",
  },
  pgrv: {
    fill: "#f07800",
    stroke: "#c05800",
    sw: 2,
    r: 10,
    ring: true,
    rc: "#ffa030",
    holes: 4,
    hc: "#804000",
    glow: "rgba(240,120,0,.45)",
  },
  neon: {
    fill: "#08080f",
    stroke: "#ff00ee",
    sw: 2.5,
    r: 11,
    ring: true,
    rc: "#00eeff",
    holes: 4,
    hc: "#ff00ee",
    glow: "rgba(255,0,240,.65)",
  },
  skeu: {
    fill: "#d4d0cc",
    stroke: "#989090",
    sw: 2,
    r: 10,
    ring: true,
    rc: "#e4dcd8",
    holes: 2,
    hc: "#787068",
    glow: null,
  },
  web2: {
    fill: "#2277ee",
    stroke: "#0044bb",
    sw: 1.5,
    r: 11,
    ring: true,
    rc: "#66aaff",
    holes: 0,
    hc: null,
    glow: "rgba(40,100,240,.5)",
  },
  flat: {
    fill: "#f0ebe3",
    stroke: "#f0ebe3",
    sw: 0,
    r: 9,
    ring: false,
    rc: null,
    holes: 0,
    hc: null,
    glow: null,
  },
  brut: {
    fill: "#080604",
    stroke: "#f0ebe3",
    sw: 3,
    r: 12,
    ring: false,
    rc: null,
    holes: 4,
    hc: "#f0ebe3",
    glow: null,
  },
};

const PANEL_COPY = {
  1: { sectionA: "The Designer", sectionB: "The Controversy", buttonHistory: "The Physical Button" },
  2: { sectionA: "The Technique", sectionB: "The Legacy", buttonHistory: "The Physical Button" },
  3: { sectionA: "The Scene", sectionB: "The Significance", buttonHistory: "The Physical Button" },
  4: { sectionA: "The Garment", sectionB: "The Idea", buttonHistory: "The Physical Button" },
  5: { sectionA: "The Costume Designer", sectionB: "The Hollywood Effect", buttonHistory: "The Physical Button" },
  6: { sectionA: "The Policy", sectionB: "The Result", buttonHistory: "The Physical Button" },
  7: { sectionA: "The Show", sectionB: "The Reaction", buttonHistory: "The Physical Button" },
  8: { sectionA: "The Product", sectionB: "The Frenzy", buttonHistory: "The Physical Button" },
  9: { sectionA: "The Designer", sectionB: "The Ideology", buttonHistory: "The Physical Button" },
  10: { sectionA: "The Scene", sectionB: "The Influence", buttonHistory: "The Physical Button" },
  11: { sectionA: "The Icons", sectionB: "The Generation", buttonHistory: "The Physical Button" },
  12: { sectionA: "Dior's Vision", sectionB: "Balenciaga's Answer", buttonHistory: "The Physical Button" },
  13: { sectionA: "The Designer", sectionB: "The Politics", buttonHistory: "The Physical Button" },
  14: { sectionA: "The Garment", sectionB: "The Statement", buttonHistory: "The Physical Button" },
  15: { sectionA: "The Club", sectionB: "The Mix", buttonHistory: "The Physical Button" },
  16: { sectionA: "The Shop", sectionB: "The Movement", buttonHistory: "The Physical Button" },
  17: { sectionA: "The Atelier", sectionB: "The Legacy", buttonHistory: "The Physical Button" },
  18: { sectionA: "The Construction", sectionB: "The Impact", buttonHistory: "The Physical Button" },
  19: { sectionA: "The Collection", sectionB: "The Fallout", buttonHistory: "The Physical Button" },
  20: { sectionA: "The Aesthetic", sectionB: "The Construction", buttonHistory: "The Physical Button" },
  21: { sectionA: "The Collection", sectionB: "The Meaning", buttonHistory: "The Physical Button" },
  22: { sectionA: "The Street", sectionB: "The Documentation", buttonHistory: "The Digital Button" },
  23: { sectionA: "The Monogram", sectionB: "The Market", buttonHistory: "The Digital Button" },
  24: { sectionA: "THE DESIGNER", sectionB: "THE CONCEPT", buttonHistory: "THE BUTTON" },
  25: { sectionA: "The Show", sectionB: "The Meaning", buttonHistory: "The Digital Button" },
};

const MINI_MAP_THEMES = {
  1: { bg: "#1C0A2E", border: "#C9860A", grid: "#C9860A", gridAlpha: 0.16, active: "#C9860A", pins: "rgba(201,134,10,0.28)" },
  2: { bg: "#F0EDE8", border: "#C4B8A8", grid: "#C4B8A8", gridAlpha: 0.09, active: "#A08060", noLandFill: true },
  3: { bg: "#0D0D0D", border: "#E8E0D0", grid: "#C41E3A", gridAlpha: 0.2, active: "#C41E3A", rough: true },
  4: { bg: "#0A0A0A", border: "#FFFFFF", noGrid: true, noLandFill: true, active: "#FFFFFF", pins: "rgba(255,255,255,0.18)" },
  5: { bg: "#1A1200", border: "#D4AF37", grid: "#D4AF37", active: "#D4AF37", highlight: "rgba(212,175,55,0.28)" },
  6: { bg: "#4A4A3A", border: "#8A8A7A", grid: "#2A2A20", active: "#D4CDB8", landFill: "rgba(138,138,122,0.28)" },
  7: { bg: "#F5EEE8", border: "#C4708A", grid: "#8A6070", active: "#C4708A", highlight: "rgba(196,112,138,0.22)" },
  8: { bg: "#F0F4F8", border: "#4A8AB4", grid: "#C4D8E8", active: "#2A4A6A" },
  9: { bg: "#F4F0E8", border: "#C84B0A", grid: "#8A9878", active: "#C84B0A" },
  10: { bg: "#FDF6E3", border: "#C4502A", grid: "#E8A020", active: "#E8A020" },
  11: { bg: "#1A2A4A", border: "#E8D4A8", grid: "#C84B0A", active: "#C84B0A" },
  12: { bg: "#F8F4F0", border: "#3A3038", grid: "#8A7888", active: "#8A7888" },
  13: { bg: "#FFFFFF", border: "#1A1A1A", grid: "#1A1A1A", gridAlpha: 0.24, active: "#FF2D55" },
  14: { bg: "#080808", border: "#F5F0E8", grid: "#C4A040", gridAlpha: 0.18, active: "#C4A040" },
  15: { bg: "#0A0818", border: "#FF6EC7", grid: "#8A2BE2", active: "#FFD700", highlight: "rgba(255,215,0,0.3)" },
  16: { bg: "#0A0A0A", border: "#FFFFFF", grid: "#FF2400", active: "#FF2400", rough: true },
  17: { bg: "#0A0808", border: "#FFD700", grid: "#C41E3A", active: "#FFD700" },
  18: { bg: "#F0EDE8", border: "#2A2825", grid: "#8A8078", active: "#4A4440" },
  19: { bg: "#D4CEC8", border: "#8A6848", grid: "#5A7858", active: "#8A6848", landFill: "rgba(138,104,72,0.14)" },
  20: { bg: "#E8E4E0", border: "#A09898", noGrid: true, active: "#4A4848", noLandFill: true },
  21: { bg: "#1A0A0A", border: "#E8E0D8", grid: "#4A3038", active: "#8B0000", rough: true },
  22: { bg: "#FFFFFF", border: "#00CED1", grid: "#00CED1", active: "#FFD700", altLandColors: ["#FF69B4", "#00CED1", "#FFD700", "#9400D3"] },
  23: { bg: "#3D2B1F", border: "#C9A840", grid: "#8A6830", active: "#C9A840" },
  24: { bg: "#F8F6F0", border: "#1A1A1A", grid: "#E8A020", active: "#1A1A1A", overlayStripes: true },
  25: { bg: "#F8F8F8", border: "#A0A0C0", noGrid: true, active: "#2A2A3A", noLandFill: true, highlight: "rgba(160,160,192,0.24)" },
};

const els = {
  loader: document.getElementById("loader"),
  globe: document.getElementById("globe"),
  hint: document.getElementById("hint"),
  sub: document.querySelector(".sub"),
  panel: document.getElementById("panel"),
  panelInner: document.getElementById("panelInner"),
  close: document.getElementById("pcls"),
  panelBack: document.getElementById("panelBack"),
  panelNext: document.getElementById("panelNext"),
  panelNav: document.querySelector(".panel-nav"),
  panelBody: document.querySelector("#panel .panel-body"),
  gw: document.getElementById("gw"),
  info: document.getElementById("info"),
  infoClose: document.getElementById("infoClose"),
  infoToggle: document.getElementById("itog"),
  mmap: document.getElementById("mmap"),
  mapArea: document.querySelector(".map-area"),
  zoomIn: document.getElementById("zoomIn"),
  zoomOut: document.getElementById("zoomOut"),
  pinst: document.getElementById("pinst"),
  ptitle: document.getElementById("ptitle"),
  ptext: document.getElementById("ptext"),
  psecATitle: document.getElementById("psecATitle"),
  psecBTitle: document.getElementById("psecBTitle"),
  psecA: document.getElementById("psecA"),
  psecB: document.getElementById("psecB"),
  pphLabel: document.getElementById("pphLabel"),
  pph: document.getElementById("pph"),
};

// ---- World data (actual countries) -----------------------------------------
const WORLD = {
  ready: false,
  land: null,
  borders: null,
  countries: null,
};

async function loadWorld() {
  const landUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json";
  const countriesUrl =
    "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

  const [landTopo, countriesTopo] = await Promise.all([
    fetch(landUrl).then((r) => r.json()),
    fetch(countriesUrl).then((r) => r.json()),
  ]);

  const land = topojson.feature(landTopo, landTopo.objects.land);
  const countries = topojson.feature(
    countriesTopo,
    countriesTopo.objects.countries
  );
  const borders = topojson.mesh(
    countriesTopo,
    countriesTopo.objects.countries,
    (a, b) => a !== b
  );

  WORLD.land = land;
  WORLD.borders = borders;
  WORLD.countries = countries.features || [];
  WORLD.ready = true;
}

// ---- Globe render -----------------------------------------------------------
const cv = els.globe;
const ctx = cv.getContext("2d");

let W = 700;
let H = 700;
let cx = W / 2;
let cy = H / 2;
let baseR = W * 0.41;
let zoomLevel = 1;
const ZOOM_MIN = 0.55;
const ZOOM_MAX = 4.4;
let R = baseR * zoomLevel;
let dpr = Math.max(1, window.devicePixelRatio || 1);

let projection = null;
let path = null;
const graticule = d3.geoGraticule().step([20, 20]);

let rotate = [20, -18]; // degrees: [lambda, phi]
let spin = true;
let pOpen = false;
let hov = null;
let hintGone = false;
let spiderCityKey = null;
let spiderPinned = false;

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function withAlpha(color, alpha) {
  if (!color) return `rgba(0,0,0,${alpha})`;
  const value = color.trim();
  if (value.startsWith("#")) {
    const hex = value.slice(1);
    const chunk = hex.length === 3
      ? hex.split("").map((char) => char + char).join("")
      : hex.length >= 6
        ? hex.slice(0, 6)
        : "000000";
    const number = parseInt(chunk, 16);
    const r = (number >> 16) & 255;
    const g = (number >> 8) & 255;
    const b = number & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }
  if (value.startsWith("rgba(")) {
    const payload = value.slice(5, -1).split(",").map((chunk) => chunk.trim());
    return `rgba(${payload[0] || 0},${payload[1] || 0},${payload[2] || 0},${alpha})`;
  }
  if (value.startsWith("rgb(")) {
    const payload = value.slice(4, -1);
    return `rgba(${payload},${alpha})`;
  }
  return value;
}

function getPanelVisualTheme() {
  const style = getComputedStyle(els.panel);
  return {
    cardBg: style.getPropertyValue("--panel-bg").trim() || "#0f0d0a",
    cardText: style.getPropertyValue("--panel-text").trim() || "#f0ebe3",
    cardAccent: style.getPropertyValue("--panel-accent").trim() || "#c4a86e",
    cardSecondary: style.getPropertyValue("--panel-secondary").trim() || "#7f6b4f",
  };
}

function getPanelCopy(momentId) {
  return PANEL_COPY[momentId] || {
    sectionA: "Section A",
    sectionB: "Section B",
    buttonHistory: "Button History",
  };
}

function getMiniMapTheme(moment) {
  const panelTheme = getPanelVisualTheme();
  const override = MINI_MAP_THEMES[moment.id] || {};
  return {
    bg: override.bg || panelTheme.cardBg,
    landFill:
      override.landFill !== undefined
        ? override.landFill
        : withAlpha(panelTheme.cardText, 0.14),
    border: override.border || withAlpha(panelTheme.cardAccent, 0.82),
    grid: override.grid || withAlpha(panelTheme.cardSecondary, 0.72),
    gridAlpha: override.gridAlpha ?? 0.15,
    pins: override.pins || withAlpha(panelTheme.cardAccent, 0.24),
    active: override.active || panelTheme.cardAccent,
    label: override.label || panelTheme.cardText,
    crosshair: override.crosshair || withAlpha(panelTheme.cardAccent, 0.34),
    highlight: override.highlight || withAlpha(panelTheme.cardAccent, 0.22),
    noGrid: Boolean(override.noGrid),
    noLandFill: Boolean(override.noLandFill),
    rough: Boolean(override.rough),
    altLandColors: override.altLandColors || null,
    overlayStripes: Boolean(override.overlayStripes),
  };
}

function applyPanelTheme(moment) {
  els.panel.dataset.theme = String(moment.id);
  const panelTheme = getPanelVisualTheme();
  els.panel.style.setProperty("--panel-line", withAlpha(panelTheme.cardText, 0.24));
  els.panel.style.setProperty("--panel-soft", withAlpha(panelTheme.cardText, 0.14));
  els.panel.style.setProperty("--panel-surface", withAlpha(panelTheme.cardText, 0.06));
  els.panel.style.setProperty("--panel-surface-strong", withAlpha(panelTheme.cardText, 0.1));
  els.panel.style.setProperty("--panel-map-bg", "#f3eee4");

  const panelCopy = getPanelCopy(moment.id);
  els.psecATitle.textContent = panelCopy.sectionA;
  els.psecBTitle.textContent = panelCopy.sectionB;
  els.pphLabel.textContent = panelCopy.buttonHistory;
}

function cityKeyOf(moment) {
  return moment.city.toLowerCase();
}

const CITY_COUNTS = moments.reduce((counts, moment) => {
  const key = cityKeyOf(moment);
  counts.set(key, (counts.get(key) || 0) + 1);
  return counts;
}, new Map());

const STACKED_LAYOUT_MAX_WIDTH = 1400;
const MOBILE_LAYOUT_MAX_WIDTH = 640;

function isStackedLayout() {
  return window.innerWidth <= STACKED_LAYOUT_MAX_WIDTH;
}

function isMobile() {
  return window.innerWidth <= MOBILE_LAYOUT_MAX_WIDTH;
}

function targetGlobeSize() {
  if (isStackedLayout()) {
    const containerH = document.getElementById("gw")?.offsetHeight || window.innerHeight * 0.58;
    const maxSize = isMobile() ? 380 : 600;
    const widthScale = isMobile() ? 0.86 : 0.8;
    return Math.min(window.innerWidth * widthScale, containerH * 0.9, maxSize);
  }
  return Math.min(window.innerWidth * 0.82, window.innerHeight * 0.78, 700);
}

function zoomFrameSize() {
  // Always render at full canvas size — no zoom clipping
  return W;
}

function syncPanelHeightToFrame() {
  if (!els.panel) return;

  // In stacked layout, let CSS control panel height naturally.
  if (isStackedLayout()) {
    els.panel.style.removeProperty("top");
    els.panel.style.removeProperty("height");
    return;
  }

  const frameSize = Math.round(zoomFrameSize());
  const canvasRect = cv.getBoundingClientRect();
  const frameInset = Math.round((W - frameSize) / 2);
  const frameTop = Math.round(canvasRect.top + frameInset);

  if (Number.isFinite(frameTop)) {
    els.panel.style.top = `${frameTop}px`;
  }
  if (frameSize > 0) {
    els.panel.style.height = `${frameSize}px`;
  }
}

function resizeGlobe() {
  const size = targetGlobeSize();
  dpr = Math.max(1, window.devicePixelRatio || 1);

  cv.style.width = `${size}px`;
  cv.style.height = `${size}px`;
  cv.width = Math.round(size * dpr);
  cv.height = Math.round(size * dpr);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  W = size;
  H = size;
  cx = W / 2;
  cy = H / 2;
  baseR = W * 0.41;
  R = baseR * zoomLevel;

  projection = d3
    .geoOrthographic()
    .translate([cx, cy])
    .scale(R)
    .clipAngle(90)
    .precision(0.5)
    .rotate(rotate);

  path = d3.geoPath(projection, ctx);
  syncPanelHeightToFrame();
  draw();
}

function setZoom(nextZoom) {
  zoomLevel = clamp(nextZoom, ZOOM_MIN, ZOOM_MAX);
  R = baseR * zoomLevel;
  if (projection) projection.scale(R);
  syncPanelHeightToFrame();
  draw();
}

function globeBackground() {
  // Rich deep navy-indigo base — fashion editorial dark
  const bg = ctx.createRadialGradient(cx - R * 0.28, cy - R * 0.28, R * 0.04, cx, cy, R);
  bg.addColorStop(0,    "#1e1a3a");   // deep indigo highlight
  bg.addColorStop(0.38, "#0d0c22");   // near-black indigo
  bg.addColorStop(0.72, "#090816");
  bg.addColorStop(1,    "#04030d");
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fillStyle = bg;
  ctx.fill();
}

function globeGlow() {
  // Outer atmospheric glow — warm coral/gold tones (Vogue-inspired)
  const glowR = R * 1.1;
  const glow = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, glowR);
  glow.addColorStop(0,   "rgba(200, 65, 74, 0.22)");   // Vogue red
  glow.addColorStop(0.4, "rgba(196, 146, 58, 0.14)");  // editorial gold
  glow.addColorStop(0.7, "rgba(42, 107, 156, 0.10)");  // cobalt blue
  glow.addColorStop(1,   "rgba(0,0,0,0)");
  ctx.beginPath();
  ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
  ctx.fillStyle = glow;
  ctx.fill();
}

function globeLighting() {
  // Upper-left highlight (white-warm)
  const light = ctx.createRadialGradient(
    cx - R * 0.62,
    cy - R * 0.52,
    0,
    cx - R * 0.28,
    cy - R * 0.18,
    R * 1.15
  );
  light.addColorStop(0,    "rgba(255,245,230,.28)");
  light.addColorStop(0.32, "rgba(255,235,210,.10)");
  light.addColorStop(1,    "rgba(0,0,0,0)");
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, W, H);

  // Coral accent rim (lower-right, like a setting sun behind the globe)
  const rim2 = ctx.createRadialGradient(cx + R * 0.5, cy + R * 0.44, R * 0.06, cx, cy, R);
  rim2.addColorStop(0,   "rgba(200,65,74,.22)");
  rim2.addColorStop(0.4, "rgba(200,65,74,.08)");
  rim2.addColorStop(1,   "rgba(0,0,0,0)");
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fillStyle = rim2;
  ctx.fill();
}

function drawLand() {
  if (!WORLD.ready) return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, R - 0.5, 0, Math.PI * 2);
  ctx.clip();

  // Graticule — subtle warm tint
  ctx.beginPath();
  path(graticule());
  ctx.strokeStyle = "rgba(196,146,58,.10)";
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // Land — warm cream/ecru with slight tint
  ctx.beginPath();
  path(WORLD.land);
  ctx.fillStyle = "rgba(240,232,210,.88)";
  ctx.fill();

  // Country borders
  ctx.beginPath();
  path(WORLD.borders);
  ctx.strokeStyle = "rgba(200,65,74,.18)";
  ctx.lineWidth = 0.45;
  ctx.stroke();

  globeLighting();
  ctx.restore();
}

function drawRim() {
  // Draw outer glow first
  globeGlow();

  // Rim ring — gold accent
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(196,146,58,.55)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Thin inner white ring
  ctx.beginPath();
  ctx.arc(cx, cy, R - 1.5, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,245,230,.14)";
  ctx.lineWidth = 1;
  ctx.stroke();
}

function pinDepth(lon, lat) {
  const center = projection.invert([cx, cy]);
  if (!center) return { visible: false, depth: 0 };
  const dist = d3.geoDistance([lon, lat], center); // radians
  if (dist > Math.PI / 2) return { visible: false, depth: 0 };
  return { visible: true, depth: Math.cos(dist) };
}

function getVisiblePins() {
  const pins = [];
  const grouped = new Map();

  for (const m of moments) {
    const xy = projection([m.lon, m.lat]);
    if (!xy) continue;
    const { visible, depth } = pinDepth(m.lon, m.lat);
    if (!visible) continue;

    const key = cityKeyOf(m);
    const pin = {
      m,
      cityKey: key,
      cityCount: CITY_COUNTS.get(key) || 1,
      x: xy[0],
      y: xy[1],
      baseX: xy[0],
      baseY: xy[1],
      depth,
      spider: false,
      anchorX: xy[0],
      anchorY: xy[1],
    };
    pins.push(pin);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(pin);
  }

  for (const [key, cityPins] of grouped.entries()) {
    if (key !== spiderCityKey || cityPins.length <= 1) continue;

    const anchorX = cityPins.reduce((sum, pin) => sum + pin.baseX, 0) / cityPins.length;
    const anchorY = cityPins.reduce((sum, pin) => sum + pin.baseY, 0) / cityPins.length;
    const spreadRadius = 18 + Math.max(0, cityPins.length - 3) * 2;

    cityPins
      .slice()
      .sort((left, right) => left.m.id - right.m.id)
      .forEach((pin, index, ordered) => {
        const angle = -Math.PI / 2 + (index * Math.PI * 2) / ordered.length;
        pin.x = anchorX + Math.cos(angle) * spreadRadius;
        pin.y = anchorY + Math.sin(angle) * spreadRadius;
        pin.spider = true;
        pin.anchorX = anchorX;
        pin.anchorY = anchorY;
      });
  }

  return pins;
}

function drawPinCityLabel(pin) {
  if (!pin || !pin.m || !pin.m.city) return;
  const style = BS[pin.m.bs];
  const scale = 0.55 + pin.depth * 0.6;
  const radius = style.r * scale * (hov === pin.m.id ? 1.4 : 1);
  const label = pin.m.city;

  ctx.save();
  ctx.font = '700 9px "ITC Avant Garde Gothic Std", "Century Gothic", "Helvetica Neue", Arial, sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const textWidth = ctx.measureText(label).width;
  const boxWidth = textWidth + 12;
  const boxHeight = 18;
  const x = pin.x;
  const y = pin.y - radius - 16;

  ctx.fillStyle = "rgba(12,10,8,0.78)";
  ctx.fillRect(x - boxWidth / 2, y - boxHeight / 2, boxWidth, boxHeight);

  ctx.fillStyle = "rgba(247,243,236,0.94)";
  ctx.fillText(label, x, y + 0.5);
  ctx.restore();
}

function drawPins() {
  const pins = getVisiblePins().sort((a, b) => a.depth - b.depth);
  let hoveredPin = null;

  for (const pin of pins) {
    if (!pin.spider) continue;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(pin.anchorX, pin.anchorY);
    ctx.lineTo(pin.x, pin.y);
    ctx.strokeStyle = "rgba(196,168,110,.42)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  for (const pin of pins) {
    const m = pin.m;
    const s = BS[m.bs];
    const isHover = hov === m.id;
    if (isHover) hoveredPin = pin;

    const sc = 0.55 + pin.depth * 0.6;
    const br = s.r * sc * (isHover ? 1.4 : 1);
    const alpha = clamp(0.45 + pin.depth * 0.7, 0, 1);

    ctx.save();
    ctx.globalAlpha = alpha;

    if (s.glow && (isHover || pin.depth > 0.55)) {
      const g = ctx.createRadialGradient(pin.x, pin.y, 0, pin.x, pin.y, br * 2.2);
      g.addColorStop(0, s.glow);
      g.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(pin.x, pin.y, br * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.globalAlpha = alpha * 0.7;
      ctx.fill();
      ctx.globalAlpha = alpha;
    }

    // Shadow
    ctx.beginPath();
    ctx.arc(pin.x + 1.2 * sc, pin.y + 1.2 * sc, br, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,.55)";
    ctx.fill();

    // Body
    ctx.beginPath();
    ctx.arc(pin.x, pin.y, br, 0, Math.PI * 2);
    ctx.fillStyle = s.fill;
    ctx.fill();

    if (s.sw > 0) {
      ctx.strokeStyle = s.stroke;
      ctx.lineWidth = s.sw * sc * (isHover ? 1.4 : 1);
      ctx.stroke();
    }

    if (s.ring && s.rc) {
      ctx.beginPath();
      ctx.arc(pin.x, pin.y, br * 0.72, 0, Math.PI * 2);
      ctx.strokeStyle = s.rc;
      ctx.lineWidth = 0.65 * sc;
      ctx.stroke();
    }

    const ho = br * 0.3;
    if (s.holes === 4) {
      for (const [dx, dy] of [
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ]) {
        ctx.beginPath();
        ctx.arc(pin.x + dx * ho, pin.y + dy * ho, br * 0.1, 0, Math.PI * 2);
        ctx.fillStyle = s.hc;
        ctx.fill();
      }
    } else if (s.holes === 2) {
      for (const dx of [-1, 1]) {
        ctx.beginPath();
        ctx.arc(pin.x + dx * ho, pin.y, br * 0.1, 0, Math.PI * 2);
        ctx.fillStyle = s.hc;
        ctx.fill();
      }
    }

    if (isHover) {
      ctx.beginPath();
      ctx.arc(pin.x, pin.y, br + 5, 0, Math.PI * 2);
      ctx.strokeStyle = s.stroke || s.fill;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;
      ctx.stroke();
    }

    ctx.restore();
  }

  drawPinCityLabel(hoveredPin);
}

function drawLoadingLabel(label) {
  ctx.save();
  ctx.fillStyle = "rgba(240,235,227,.18)";
  ctx.font = '9px "Courier Prime",monospace';
  ctx.textAlign = "center";
  ctx.fillText(label, cx, cy + R + 28);
  ctx.restore();
}

function draw() {
  if (!projection || !path) return;
  projection.rotate(rotate).scale(R);

  ctx.clearRect(0, 0, W, H);
  const frameSize = zoomFrameSize();
  const frameInset = (W - frameSize) / 2;
  if (frameSize < W) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(frameInset, frameInset, frameSize, frameSize);
    ctx.clip();
  }

  globeBackground();
  drawLand();
  drawRim();
  drawPins();

  if (!WORLD.ready) drawLoadingLabel("loading countries…");
  if (frameSize < W) ctx.restore();
}

// ---- Mini map (unfold panel) ------------------------------------------------
const mcv = els.mmap;
const mctx = mcv.getContext("2d");

let mapW = 0;
let mapH = 0;
let mapDpr = Math.max(1, window.devicePixelRatio || 1);

function resizeMap() {
  const area = mcv.parentElement;
  if (!area) return;
  mapDpr = Math.max(1, window.devicePixelRatio || 1);

  mapW = Math.max(1, Math.ceil(area.clientWidth));
  mapH = Math.max(1, Math.ceil(area.clientHeight));
  mcv.style.width = "100%";
  mcv.style.height = "100%";
  mcv.width = Math.round(mapW * mapDpr);
  mcv.height = Math.round(mapH * mapDpr);

  mctx.setTransform(mapDpr, 0, 0, mapDpr, 0, 0);
}

function drawMapBackground(style) {
  mctx.fillStyle = "#f3eee4";
  mctx.fillRect(0, 0, mapW, mapH);
  mctx.fillStyle = withAlpha(style.bg, 0.28);
  mctx.fillRect(0, 0, mapW, mapH);
  if (style.overlayStripes) {
    mctx.save();
    mctx.strokeStyle = "rgba(0,0,0,0.22)";
    mctx.lineWidth = 1;
    for (let x = -mapH; x < mapW + mapH; x += 22) {
      mctx.beginPath();
      mctx.moveTo(x, 0);
      mctx.lineTo(x - mapH, mapH);
      mctx.stroke();
    }
    mctx.restore();
  }

  if (style.noGrid) return;

  mctx.strokeStyle = withAlpha(style.grid, style.gridAlpha);
  mctx.lineWidth = style.rough ? 0.9 : 0.5;
  const xStep = Math.max(18, Math.round(mapW / 12));
  const yStep = Math.max(14, Math.round(mapH / 6));
  for (let x = 0; x < mapW; x += xStep) {
    mctx.beginPath();
    mctx.moveTo(x, 0);
    mctx.lineTo(x, mapH);
    mctx.stroke();
  }
  for (let y = 0; y < mapH; y += yStep) {
    mctx.beginPath();
    mctx.moveTo(0, y);
    mctx.lineTo(mapW, y);
    mctx.stroke();
  }
}

function drawMiniMap(activeMoment) {
  resizeMap();
  const mapStyle = activeMoment ? getMiniMapTheme(activeMoment) : getMiniMapTheme(moments[0]);
  drawMapBackground(mapStyle);

  if (!WORLD.ready) {
    mctx.fillStyle = mapStyle.label;
    mctx.font = '9px "Courier Prime", monospace';
    mctx.textAlign = "center";
    mctx.fillText("loading map…", mapW / 2, mapH / 2);
    return;
  }

  const proj = d3
    .geoEquirectangular()
    .fitExtent(
      [
        [12, 10],
        [mapW - 12, mapH - 10],
      ],
      WORLD.land
    );
  const p = d3.geoPath(proj, mctx);

  if (mapStyle.altLandColors && WORLD.countries.length) {
    WORLD.countries.forEach((country, index) => {
      mctx.beginPath();
      p(country);
      mctx.fillStyle = withAlpha(
        mapStyle.altLandColors[index % mapStyle.altLandColors.length],
        0.18
      );
      mctx.fill();
    });
  } else if (!mapStyle.noLandFill) {
    mctx.beginPath();
    p(WORLD.land);
    mctx.fillStyle = mapStyle.landFill;
    mctx.fill();
  }

  // Borders
  mctx.beginPath();
  p(WORLD.borders);
  mctx.strokeStyle = withAlpha(mapStyle.border, mapStyle.rough ? 0.92 : 0.72);
  mctx.lineWidth = mapStyle.rough ? 0.9 : 0.55;
  mctx.stroke();

  // All pins (faint)
  for (const mo of moments) {
    const pt = proj([mo.lon, mo.lat]);
    if (!pt) continue;
    mctx.beginPath();
    mctx.arc(pt[0], pt[1], 2, 0, Math.PI * 2);
    mctx.fillStyle = mapStyle.pins;
    mctx.fill();
  }

  // Active pin highlight
  if (!activeMoment) return;
  const ap = proj([activeMoment.lon, activeMoment.lat]);
  if (!ap) return;

  if (!mapStyle.noGrid) {
    mctx.strokeStyle = mapStyle.crosshair;
    mctx.lineWidth = 0.7;
    mctx.setLineDash([2, 4]);
    mctx.beginPath();
    mctx.moveTo(ap[0], 0);
    mctx.lineTo(ap[0], mapH);
    mctx.stroke();
    mctx.beginPath();
    mctx.moveTo(0, ap[1]);
    mctx.lineTo(mapW, ap[1]);
    mctx.stroke();
    mctx.setLineDash([]);
  }

  const glow = mctx.createRadialGradient(ap[0], ap[1], 0, ap[0], ap[1], 24);
  glow.addColorStop(0, mapStyle.highlight);
  glow.addColorStop(1, "transparent");
  mctx.beginPath();
  mctx.arc(ap[0], ap[1], 24, 0, Math.PI * 2);
  mctx.fillStyle = glow;
  mctx.fill();

  mctx.beginPath();
  mctx.arc(ap[0], ap[1], 10, 0, Math.PI * 2);
  mctx.strokeStyle = withAlpha(mapStyle.active, 0.45);
  mctx.lineWidth = 1;
  mctx.stroke();

  mctx.beginPath();
  mctx.arc(ap[0], ap[1], 4, 0, Math.PI * 2);
  mctx.fillStyle = mapStyle.active;
  mctx.fill();

  const label = `${activeMoment.city.toUpperCase()} · ${activeMoment.dec}`;
  const accentFontVar = getComputedStyle(els.panel).getPropertyValue("--panel-accent-font").trim();
  const accentFont = accentFontVar.replace(/^["']|["']$/g, "") || "Courier Prime";
  mctx.font = `bold 8px "${accentFont}", "Courier Prime", monospace`;
  mctx.fillStyle = mapStyle.label;
  mctx.textAlign = "left";
  const lx = ap[0] + 12 < mapW - 140 ? ap[0] + 12 : ap[0] - 140;
  const ly = ap[1] - 10 < 18 ? ap[1] + 18 : ap[1] - 10;
  mctx.fillText(label, lx, ly);
}

// ---- Panel open/close -------------------------------------------------------
let selected = null;
let closeCleanupTimer = 0;

function updatePanelInsets() {
  if (!els.sub) return;
  const subBottom = els.sub.getBoundingClientRect().bottom;
  const inset = Math.max(72, Math.round(subBottom + 8));
  document.documentElement.style.setProperty("--panel-inset", `${inset}px`);
}

function setPanelOpen(open) {
  const isOpen = els.panel.classList.contains("open");
  if (open === isOpen) return;

  if (open) {
    if (closeCleanupTimer) window.clearTimeout(closeCleanupTimer);
    closeCleanupTimer = 0;
    els.panel.classList.remove("closing");
    els.panel.classList.add("open");
    els.panel.setAttribute("aria-hidden", "false");
    if (!isStackedLayout()) els.gw.classList.add("shifted");
    // In stacked layout, keep the viewport anchored at the top.
    if (isStackedLayout()) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  } else {
    els.panel.classList.add("closing");
    els.panel.classList.remove("open");
    els.panel.setAttribute("aria-hidden", "true");
    closeCleanupTimer = window.setTimeout(() => {
      els.panel.classList.remove("closing");
      els.gw.classList.remove("shifted");
      closeCleanupTimer = 0;
    }, 640);
  }
}

function openPanel(m) {
  selected = m;
  pOpen = true;
  spin = false;
  applyPanelTheme(m);
  if (els.panelBody) {
    els.panelBody.scrollTop = 0;
  }

  els.pinst.textContent = `${m.dec} · ${m.city}`;
  els.ptitle.textContent = m.id === 24 ? `"${m.title}"` : m.title;
  els.ptext.textContent = m.subtitle;
  els.psecA.textContent = m.sectionA;
  els.psecB.textContent = m.sectionB;
  els.pph.textContent = m["p-ph"];

  const alreadyOpen =
    els.panel.classList.contains("open") && !els.panel.classList.contains("closing");
  setPanelOpen(true);
  if (alreadyOpen) {
    drawMiniMap(m);
  } else {
    window.setTimeout(() => {
      if (selected && selected.id === m.id) drawMiniMap(m);
    }, 980);
    window.setTimeout(() => {
      if (selected && selected.id === m.id) drawMiniMap(m);
    }, 1620);
  }
  spinTo(m);
  updatePanelNavVisibility();
}

function selectedMomentIndex() {
  if (!selected) return -1;
  return moments.findIndex((moment) => moment.id === selected.id);
}

function openRelativePanel(step) {
  if (!moments.length) return;
  const currentIndex = selectedMomentIndex();
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const nextIndex = (safeIndex + step + moments.length) % moments.length;
  openPanel(moments[nextIndex]);
}

function closePanel() {
  pOpen = false;
  setPanelOpen(false);
  selected = null;
  if (els.panelNav) {
    els.panelNav.classList.remove("is-visible");
  }
  draw();
}

els.close.addEventListener("click", closePanel);
els.panelBack?.addEventListener("click", () => openRelativePanel(-1));
els.panelNext?.addEventListener("click", () => openRelativePanel(1));

function closeInfo() {
  els.info.classList.remove("open");
  els.infoToggle.textContent = "about ↗";
}

function toggleInfo() {
  const willOpen = !els.info.classList.contains("open");
  if (willOpen) {
    els.info.classList.add("open");
    els.infoToggle.textContent = "close ✕";
  } else {
    closeInfo();
  }
}

function maybeCloseInfoFromOutside(target) {
  if (!els.info.classList.contains("open")) return;
  if (els.info.contains(target)) return;
  if (target === els.infoToggle || els.infoToggle.contains(target)) return;
  closeInfo();
}

function maybeClosePanelFromOutside(target) {
  const panelIsOpen = pOpen || els.panel.classList.contains("open");
  if (!panelIsOpen) return;
  if (!target) return;
  if (els.panelInner?.contains(target)) return;
  if (els.info.contains(target)) return;
  if (target === els.infoToggle || els.infoToggle.contains(target)) return;
  closePanel();
}

function panelAtBottom() {
  if (!els.panelBody) return true;
  const maxScroll = Math.max(0, els.panelBody.scrollHeight - els.panelBody.clientHeight);
  if (maxScroll <= 2) return true;
  return els.panelBody.scrollTop >= maxScroll - 2;
}

function updatePanelNavVisibility() {
  if (!els.panelNav) return;
  els.panelNav.classList.toggle("is-visible", panelAtBottom());
}

window.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (els.info.classList.contains("open")) {
    closeInfo();
    return;
  }
  if (pOpen || els.panel.classList.contains("open")) closePanel();
});

window.addEventListener("keydown", (e) => {
  const panelIsOpen = pOpen || els.panel.classList.contains("open");
  if (!panelIsOpen) return;
  if (e.key === "ArrowRight") {
    e.preventDefault();
    openRelativePanel(1);
  } else if (e.key === "ArrowLeft") {
    e.preventDefault();
    openRelativePanel(-1);
  }
});

// ---- Rotate to a location ---------------------------------------------------
function spinTo(m) {
  const target = [-m.lon, -m.lat];
  const start = [...rotate];

  let dLon = target[0] - start[0];
  while (dLon > 180) dLon -= 360;
  while (dLon < -180) dLon += 360;

  const dLat = target[1] - start[1];
  const steps = 52;
  let i = 0;

  function ease(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function tick() {
    if (i > steps) return;
    const t = ease(i / steps);
    rotate[0] = start[0] + dLon * t;
    rotate[1] = clamp(start[1] + dLat * t, -90, 90);
    draw();
    i += 1;
    if (i <= steps) requestAnimationFrame(tick);
  }
  tick();
}

// ---- Input (drag + click pins) ---------------------------------------------
let isDragging = false;
let moved = false;
let lastX = 0;
let lastY = 0;

function canvasPoint(evt) {
  const rect = cv.getBoundingClientRect();
  const x = (evt.clientX - rect.left) * (W / rect.width);
  const y = (evt.clientY - rect.top) * (H / rect.height);
  return { x, y };
}

function pinAt(x, y, hitPadding = 0) {
  const pins = getVisiblePins();
  let hit = null;
  let best = 1e9;
  for (const pin of pins) {
    const cityPad = pin.cityKey === spiderCityKey ? 5 : 0;
    const r = BS[pin.m.bs].r * (0.55 + pin.depth * 0.6) + 7 + hitPadding + cityPad;
    const dist = Math.hypot(x - pin.x, y - pin.y);
    if (dist < r && dist < best) {
      best = dist;
      hit = pin;
    }
  }
  return hit;
}

function spiderClusterCenter(cityKey) {
  if (!cityKey) return null;
  const cityPins = getVisiblePins().filter((pin) => pin.cityKey === cityKey);
  if (!cityPins.length) return null;
  const x = cityPins.reduce((sum, pin) => sum + pin.baseX, 0) / cityPins.length;
  const y = cityPins.reduce((sum, pin) => sum + pin.baseY, 0) / cityPins.length;
  return { x, y };
}

function isNearSpiderCluster(x, y, cityKey, radius = 36) {
  const center = spiderClusterCenter(cityKey);
  if (!center) return false;
  return Math.hypot(x - center.x, y - center.y) <= radius;
}

cv.addEventListener("pointerdown", (e) => {
  cv.setPointerCapture(e.pointerId);
  const p = canvasPoint(e);
  lastX = p.x;
  lastY = p.y;
  isDragging = true;
  moved = false;
  spin = false;
  if (!hintGone) {
    hintGone = true;
    els.hint.classList.add("gone");
  }
});

cv.addEventListener("pointermove", (e) => {
  const p = canvasPoint(e);
  if (isDragging) {
    const dx = p.x - lastX;
    const dy = p.y - lastY;
    if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;

    rotate[0] += dx * 0.25;
    rotate[1] = clamp(rotate[1] - dy * 0.25, -90, 90);
    lastX = p.x;
    lastY = p.y;
    draw();
    return;
  }

  // Hover (mouse only)
  if (e.pointerType === "mouse") {
    const pin = pinAt(p.x, p.y, spiderCityKey && !spiderPinned ? 8 : 2);
    const keepSpiderHover =
      !spiderPinned &&
      !pin &&
      Boolean(spiderCityKey) &&
      isNearSpiderCluster(p.x, p.y, spiderCityKey, 40);

    let nextHoverId = pin ? pin.m.id : null;
    if (keepSpiderHover && !nextHoverId) {
      const center = spiderClusterCenter(spiderCityKey);
      if (center) {
        const cityPins = getVisiblePins()
          .filter((cityPin) => cityPin.cityKey === spiderCityKey)
          .sort(
            (left, right) =>
              Math.hypot(left.x - p.x, left.y - p.y) -
              Math.hypot(right.x - p.x, right.y - p.y)
          );
        nextHoverId = cityPins[0] ? cityPins[0].m.id : hov;
      }
    }

    const nextSpiderKey = keepSpiderHover
      ? spiderCityKey
      : !spiderPinned && pin && pin.cityCount > 1
        ? pin.cityKey
        : !spiderPinned
          ? null
          : spiderCityKey;

    if (nextHoverId !== hov || nextSpiderKey !== spiderCityKey) {
      spiderCityKey = nextSpiderKey;
      hov = nextHoverId;
      cv.style.cursor = hov ? "pointer" : "grab";
      draw();
    }
  }
});

cv.addEventListener("pointerup", (e) => {
  isDragging = false;
  if (!moved) {
    const p = canvasPoint(e);
    const pin = pinAt(p.x, p.y, spiderCityKey ? 8 : 2);
    if (!pin) {
      if (spiderCityKey && isNearSpiderCluster(p.x, p.y, spiderCityKey, 40)) {
        return;
      }
      if (spiderPinned || spiderCityKey) {
        spiderPinned = false;
        spiderCityKey = null;
        hov = null;
        draw();
      }
      return;
    }

    if (pin.cityCount > 1 && (!spiderPinned || spiderCityKey !== pin.cityKey)) {
      spiderPinned = true;
      spiderCityKey = pin.cityKey;
      hov = pin.m.id;
      draw();
      return;
    }

    spiderPinned = false;
    spiderCityKey = null;
    openPanel(pin.m);
  }
});

cv.addEventListener("pointercancel", () => {
  isDragging = false;
});

cv.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    if (!hintGone) {
      hintGone = true;
      els.hint.classList.add("gone");
    }
    spin = false;
    const zoomFactor = Math.exp(-e.deltaY * 0.0025);
    setZoom(zoomLevel * zoomFactor);
  },
  { passive: false }
);

els.zoomIn?.addEventListener("click", () => {
  spin = false;
  setZoom(zoomLevel * 1.18);
});

els.zoomOut?.addEventListener("click", () => {
  spin = false;
  setZoom(zoomLevel / 1.18);
});

// ---- Info panel -------------------------------------------------------------
els.infoToggle.addEventListener("click", toggleInfo);
els.infoClose.addEventListener("click", closeInfo);
document.addEventListener("pointerdown", (e) => {
  maybeClosePanelFromOutside(e.target);
  maybeCloseInfoFromOutside(e.target);
});
els.panelBody?.addEventListener("scroll", updatePanelNavVisibility, { passive: true });

// ---- Animation loop ---------------------------------------------------------
function loop() {
  if (spin && !pOpen) {
    rotate[0] += 0.05;
    draw();
  }
  requestAnimationFrame(loop);
}

// ---- Boot -------------------------------------------------------------------
let windowLoaded = false;
let worldLoaded = false;

function hideLoaderWhenReady() {
  if (!windowLoaded || !worldLoaded) return;
  if (!els.loader) return;
  els.loader.classList.add("hidden");
}

updatePanelInsets();
applyPanelTheme(moments[0]);
resizeGlobe();
resizeMap();
window.addEventListener("resize", () => {
  updatePanelInsets();
  resizeGlobe();
  updatePanelNavVisibility();
  if (pOpen) drawMiniMap(selected);
});
window.addEventListener("load", () => {
  windowLoaded = true;
  updatePanelInsets();
  hideLoaderWhenReady();
});

loadWorld()
  .catch(() => {
    // Keep the experience usable even if the user is offline; globe renders but without borders/land detail.
    WORLD.ready = false;
  })
  .finally(() => {
    worldLoaded = true;
    draw();
    if (pOpen && selected) drawMiniMap(selected);
    hideLoaderWhenReady();
    loop();
  });
