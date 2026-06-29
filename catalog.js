/* ============================================================================
 * catalog.js — OSRS Planner Key-Items catalogue
 * ----------------------------------------------------------------------------
 * The master list of trackable items, sets, and capability tiles.
 * Loaded by index.html via <script src="catalog.js"></script> BEFORE the main
 * script, so KEY_ITEMS exists when the render code runs.
 *
 * Field reference:
 *   name      display label + default wiki image lookup (must match in-game spelling)
 *   match     substring used for ownership (defaults to name); forgiving so
 *             charged/uncharged and ornament variants register
 *   matchAll  array; OWNED only if ALL present (multi-piece sets / logs)
 *   matchAny  array; OWNED if ANY present (variants); icon follows owned variant
 *   img       wiki image filename override when it differs from `name`
 *   capability true = access/ability tile, never "owned"; status is reqs-only
 *   reqs      () => [ reqStat(...), reqQuest(...), ... ] scored by evaluateActivity
 *   src       how to obtain (tooltip text)
 *
 * Planned (not yet wired): `board` ('main'|'endgame'|'pets') and `access`
 * (Number, 1-10 accessibility sort key). Add per item as we build those tabs.
 * ==========================================================================*/

/* expandSet — generate a multi-piece kit as one curated set tile (big board)
 * plus one section-only tile per piece. Returns an array to spread into KEY_ITEMS.
 *
 *   set:    display name of the whole kit (the big-board tile)
 *   source: activity it groups under (section header)
 *   tags:   category tag(s)
 *   access: sort score (shared by set + pieces)
 *   pieces: array of exact in-game piece names (canonical — from collection log)
 *   img:    optional icon override for the set tile (defaults to first piece)
 *   extra:  optional fields merged onto the SET tile (e.g. reqs, matchAny)
 *
 * The set tile owns via matchAll over the pieces; each piece tile owns via its
 * own name (substring match). Piece tiles are show:'section'; set is show:'board'.
 */
function expandSet({ set, source, tags, access, pieces, img, extra = {} }) {
  const setTile = {
    name: set, source, tags, access, show: 'board',
    img: img || pieces[0],
    matchAll: pieces.slice(),
    src: source,
    ...extra,
  };
  const pieceTiles = pieces.map(p => ({
    name: p, source, tags, access, show: 'section', match: p,
  }));
  return [setTile, ...pieceTiles];
}

const KEY_ITEMS = [
  { name: 'Fire cape', access: 5.5,            src: 'TzHaar Fight Cave',
    // No real entry gate (hard always passes). soft = realistic readiness for an early iron.
    soft: () => [
      reqStat('Ranged', 70),
      reqStat('Prayer', 43),
      reqAnyItem('Potion source (prayer/super restore)', ['Prayer potion','Super restore']),
      reqAnyItem('Ranged wpn (RCB/crystal/sunlight cbow/Karil cbow)', ['Rune crossbow','Crystal bow','sunlight crossbow',"Karil's crossbow"]),
    ] },
  { name: 'Barrows gloves', tags: ['Quest Rewards'], access: 4.5,       src: 'Recipe for Disaster',
    hard: () => [ reqOther('Recipe for Disaster complete', hasQuest('Recipe for Disaster')) ] },
  { name: 'Quest point cape', tags: ['Quest Rewards'], access: 6.5,     src: 'All quests complete', match: 'Quest point cape',
    hard: () => [ reqOther('All quests complete', hasQuestCape()) ] },
  { name: 'Rune pouch', tags: ['Skilling & Minigames'], access: 5,           src: 'Slayer / LMS / Wintertodt', match: 'Rune pouch' },
  { name: 'Divine rune pouch', source: 'Tombs of Amascut', tags: ['Raids Loot'], access: 7.5,    src: 'Upgrade Rune pouch w/ Thread of Elidinis (ToA), 75 Craft', match: 'Divine rune pouch',
    hard: () => [ reqOther('ToA capability (Into the Tombs)', hasToACapability()), reqOther('Rune pouch owned', hasItem('Rune pouch')) ],
    soft: () => [ reqStatBoostable('Crafting', 75, 'crafting_pie') ] },
  { name: "Ava's accumulator", tags: ['Boss Drops', 'Quest Rewards'], access: 2.5,    src: 'Animal Magnetism',
    hard: () => [ reqOther('Quest: Animal Magnetism', hasQuest('Animal Magnetism')) ] },
  { name: "Ava's assembler", source: 'Vorkath', tags: ['Boss Drops', 'Quest Rewards'], access: 6.5,      src: 'Vorkath head + accumulator (needs DS2)',
    hard: () => [ reqOther("Ava's accumulator owned", hasItem("Ava's accumulator")), reqOther('Quest: Dragon Slayer II', hasQuest('Dragon Slayer II')) ] },
  { name: 'Berserker ring (i)', source: 'Dagannoth Kings', tags: ['Boss Drops'], access: 6,   src: 'Dagannoth Rex (Waterbirth) + imbue', match: 'erserker ring (i)',
    hard: () => [ reqOther('Quest: The Fremennik Trials (Waterbirth access)', hasQuest('The Fremennik Trials')) ] },
  { name: 'Salve amulet(ei)', tags: ['Quest Rewards'], access: 6,     src: 'Haunted Mine + Tarn diary + imbue', match: 'Salve amulet(ei)',
    hard: () => [ reqOther('Quest: Haunted Mine', hasQuest('Haunted Mine')), reqOther('Miniquest: Lair of Tarn Razorlor', hasQuest('Lair of Tarn Razorlor')) ] },
  { name: 'Amulet of glory', access: 1.5,      src: 'Craft (80 Craft/68 Mag), dragon impling (83 Hunt), or crystal impling (80 Hunt + SOTE)', match: 'mulet of glory',
    // Icon prefers the eternal glory if owned (listed first); otherwise regular glory.
    // `match` still governs ownership broadly (catches (t), charge states, etc.).
    matchAny: ['Amulet of eternal glory', 'Amulet of glory'],
    hard: () => [ reqAny('Craft / dragon impling / crystal impling', [
      [ reqStat('Crafting', 80), reqStat('Magic', 68) ],
      reqStat('Hunter', 83),
      [ reqStat('Hunter', 80), reqOther('Quest: Song of the Elves', hasQuest('Song of the Elves')) ]
    ]) ] },
  ...expandSet({ set: 'Elite void (set)', source: 'Pest Control', tags: ['Diary Rewards', 'Skilling & Minigames'], access: 7.5, img: 'Elite void top',
    pieces: ['Elite void top','Elite void robe','Void knight gloves','Void melee helm','Void mage helm','Void ranger helm'],
    extra: {
      // Set "owned" needs the core 4 (top/robe/gloves + one helm); pieces list above
      // shows all helms in the section. Keep the curated matchAll + reqs.
      matchAll: ['Elite void top','Elite void robe','Void knight gloves','Void melee helm'],
      reqs: () => [
        reqOther('Base Void top owned', hasItem('Void knight top')),
        reqOther('Base Void robe owned', hasItem('Void knight robe')),
        reqOther('Hard Western Provinces diary', hasDiary('Western Provinces', 'hard')),
        reqStat('Defence', 42), reqStat('Ranged', 42), reqStat('Magic', 42)
      ],
    } }),
  { name: 'Toxic blowpipe', source: 'Zulrah', tags: ['Boss Drops'], access: 6.5,       src: 'Zulrah', img: 'Toxic blowpipe', match: 'blowpipe',
    hard: () => [
      reqOther('Quest: Regicide (Zulrah access)', hasQuest('Regicide')),
      reqAny('80+ Ranged or 75+ Magic', [ reqStat('Ranged', 80), reqStat('Magic', 75) ]),
    ],
    soft: () => [
      reqAnyItem('Zulrah weapon (Twinflame staff or Bowfa)', ['Twinflame staff','Bow of faerdhinen']),
    ] },
  { name: 'Bow of faerdhinen', source: 'Corrupted Gauntlet', tags: ['Boss Drops'], access: 8,    src: 'Corrupted Gauntlet (seed)', img: 'Bow of faerdhinen (c)', match: 'aerdhinen',
    hard: () => [ reqOther('Quest: Song of the Elves (Gauntlet access)', hasQuest('Song of the Elves')) ] },
  { name: 'Rune crossbow', access: 2.5,        src: 'Fletch (69 Fletching) / drops', match: 'Rune crossbow',
    hard: () => [ reqStat('Fletching', 69) ] },
  { name: 'Dragon scimitar', tags: ['Quest Rewards'], access: 2,      src: 'Monkey Madness I',
    reqs: () => [ reqStat('Attack', 60), reqOther('Quest: Monkey Madness I', hasQuest('Monkey Madness I')) ] },
  { name: 'Dragon defender', source: 'Warriors\' Guild', tags: ['Skilling & Minigames'], access: 4,      src: "Warriors' Guild",
    reqs: () => [ reqStat('Attack', 60), reqStat('Defence', 60), reqOther("Warriors' Guild access (combined 130+)", (getLevel('Attack') + getLevel('Strength')) >= 130) ] },
  { name: 'Abyssal whip', source: 'Abyssal demons', tags: ['Slayer Unlocks'], access: 5.5,         src: 'Abyssal demons (85 Slayer)',
    hard: () => [ reqStat('Slayer', 85) ] },
  { name: 'Arkan blade', tags: ['Quest Rewards'], access: 5,          src: 'The Final Dawn (quest)' },
  { name: 'Zombie axe', tags: ['Quest Rewards'], access: 5,           src: 'Armoured zombies (broken axe)' },
  { name: 'Warped sceptre', source: 'Warped creatures', tags: ['Slayer Unlocks'], access: 4.5,       src: 'Warped creatures (56 Slayer + Path of Glouphrie)', match: 'Warped sceptre',
    hard: () => [ reqStat('Slayer', 56), reqOther('Quest: The Path of Glouphrie', hasQuest('The Path of Glouphrie')) ] },
  { name: 'Dragon boots', source: 'Spiritual mages', tags: ['Slayer Unlocks'], access: 4,         src: 'Spiritual mages (83 Slayer)', match: 'Dragon boots',
    // Exclude the cosmetic kit, which contains the substring "Dragon boots".
    matchNot: ['ornament kit'],
    hard: () => [ reqStat('Slayer', 83) ] },
  { name: 'Trident of the seas', source: 'Cave krakens', tags: ['Slayer Unlocks'], access: 5,  src: 'Cave krakens (87 Slayer)', match: 'rident of the seas',
    hard: () => [ reqStat('Slayer', 87) ] },
  { name: 'Dragon axe', source: 'Dagannoth Kings', tags: ['Skilling & Minigames', 'Boss Drops'], access: 4.5,           src: 'Dagannoth Kings / WC guild', matchAny: ['Dragon axe', 'Dragon felling axe'] },
  // matchAny: owned if ANY variant is held. Note hasItem() is already substring-based,
  // so "(or)"/"(upgraded)" suffixes are caught by the base name — but listing them
  // makes the intent explicit and survives any future change to match logic.
  { name: 'Dragon pickaxe', source: 'Calvar\'ion', tags: ['Boss Drops', 'Skilling & Minigames'], access: 6.5,       src: "Calvar'ion (~1/358)", matchAny: ['Dragon pickaxe', 'Dragon pickaxe (or)', 'Dragon pickaxe (upgraded)'] },
  // Collection-log completion, NOT a single bank item — see note. Detected only if
  // every Perilous Moons unique is currently in the bank/equipment (a weak proxy).
  { name: 'Moons of Peril (log)', source: 'Perilous Moons', tags: ['Boss Drops'], access: 6, src: 'Perilous Moons — full collection log', img: 'Dual macuahuitl',
    matchAll: ['Blood moon helm','Blood moon chestplate','Blood moon tassets','Blue moon helm','Blue moon chestplate','Blue moon tassets','Eclipse moon helm','Eclipse moon chestplate','Eclipse moon tassets','Dual macuahuitl','Blue moon spear','Eclipse atlatl'] },

  // ════════ WAVE 1 — COMBAT GEAR ════════
  { name: 'Amulet of fury', access: 6,       src: 'Onyx + 90 Craft', match: 'mulet of fury' },
  { name: 'Occult necklace', source: 'Smoke devils', tags: ['Slayer Unlocks'], access: 5.5,      src: 'Smoke devils (93 Slayer)', match: 'Occult necklace',
    hard: () => [ reqStat('Slayer', 93) ] },
  { name: 'Amulet of rancour', source: 'Araxxor', tags: ['Slayer Unlocks'], access: 9,    src: 'Araxxor components (92 Slayer)', match: 'mulet of rancour',
    hard: () => [ reqStat('Slayer', 92) ] },
  { name: 'Primordial boots', source: 'Cerberus', tags: ['Slayer Unlocks'], access: 7,     src: 'Cerberus (91 Slayer)', match: 'Primordial boots',
    hard: () => [ reqStat('Slayer', 91) ] },
  { name: 'Bandos godsword', source: 'God Wars: Bandos', tags: ['Boss Drops'], access: 7,      src: 'GWD — Bandos', match: 'Bandos godsword' },
  { name: 'Zamorakian hasta', source: 'God Wars: Zamorak', tags: ['Boss Drops'], access: 7,     src: 'GWD — Zamorak spear, reforge', match: 'Zamorakian hasta' },
  { name: 'Dragon warhammer', source: 'Lizardman shamans', tags: ['Slayer Unlocks'], access: 5.5,     src: 'Lizardman shamans' },
  { name: 'Dragon hunter lance', tags: ['Quest Rewards'], access: 7.5,  src: 'Vorkath (hydra claw path)', match: 'Dragon hunter lance' },
  { name: 'Noxious halberd', source: 'Araxxor', tags: ['Slayer Unlocks'], access: 8.5,      src: 'Araxxor (92 Slayer)', match: 'Noxious halberd',
    hard: () => [ reqStat('Slayer', 92) ] },
  { name: 'Dragon dagger', access: 2,        src: 'Lost City', img: 'Dragon dagger', matchAny: ['Dragon dagger(p++)','Dragon dagger'] },
  { name: 'Bone dagger', tags: ['Quest Rewards'], access: 3,          src: 'The General (Chaos Tunnels)', img: 'Bone dagger', matchAny: ['Bone dagger(p++)','Bone dagger'] },
  { name: 'Twinflame staff', source: 'Royal Titans', tags: ['Boss Drops'], access: 6,      src: 'Royal Titans' },
  { name: 'Emberlight', source: 'Tormented Demons', tags: ['Boss Drops', 'Quest Rewards'], access: 8,           src: 'Tormented Demons (synapse + Arclight)', match: 'Emberlight' },
  { name: 'Scorching bow', source: 'Tormented Demons', tags: ['Boss Drops', 'Quest Rewards'], access: 8,        src: 'Tormented Demons (synapse + magic longbow)', match: 'Scorching bow' },
  { name: 'Purging staff', source: 'Tormented Demons', tags: ['Boss Drops', 'Quest Rewards'], access: 8,        src: 'Tormented Demons (synapse + battlestaff)', match: 'Purging staff' },
  { name: "Hunters' sunlight crossbow", access: 7.5, src: 'Sunlight cbow (Hunter Guild)', match: 'unlight crossbow' },
  { name: 'Dorgeshuun crossbow', tags: ['Quest Rewards'], access: 2.5,  src: 'Death to the Dorgeshuun', match: 'Dorgeshuun crossbow' },
  { name: 'Helm of neitiznot', tags: ['Quest Rewards'], access: 3.5,    src: 'The Fremennik Isles', match: 'elm of neitiznot' },
  { name: 'Fighter torso', source: 'Barbarian Assault', tags: ['Skilling & Minigames'], access: 4,        src: 'Barbarian Assault', match: 'Fighter torso' },
  { name: 'Infernal cape', access: 9,        src: 'The Inferno', match: 'Infernal cape' },
  { name: 'Slayer helmet', tags: ['Slayer Unlocks'], access: 5.5,        src: 'Slayer (combine masks)', img: 'Slayer helmet', matchAny: ['Slayer helmet (i)','Slayer helmet'] },

  // ── combat armour SETS ──
  ...expandSet({ set: 'Ancestral robes', source: 'Chambers of Xeric', tags: ['Raids Loot'], access: 8.5, img: 'Ancestral hat',
    pieces: ['Ancestral hat','Ancestral robe top','Ancestral robe bottom'] }),
  ...expandSet({ set: 'Virtus robes', source: 'Desert Treasure II', tags: ['Boss Drops'], access: 8.5, img: 'Virtus mask',
    pieces: ['Virtus mask','Virtus robe top','Virtus robe bottom'] }),
  ...expandSet({ set: 'Bloodbark armour', source: 'Blood altar (Runecraft)', tags: ['Skilling & Minigames'], access: 6, img: 'Bloodbark helm',
    pieces: ['Bloodbark helm','Bloodbark body','Bloodbark legs'] }),

  // ════════ WAVE 2 — SKILLING OUTFITS (sets; icon follows owned variant or head) ════════
  ...expandSet({ set: 'Graceful outfit', source: 'Agility', tags: ['Skilling & Minigames'], access: 3, img: 'Graceful hood',
    pieces: ['Graceful hood','Graceful top','Graceful legs','Graceful gloves','Graceful boots','Graceful cape'] }),
  ...expandSet({ set: 'Rogue equipment', source: "Rogues' Den", tags: ['Skilling & Minigames'], access: 3, img: 'Rogue mask',
    pieces: ['Rogue mask','Rogue top','Rogue trousers','Rogue gloves','Rogue boots'] }),
  ...expandSet({ set: 'Anglers outfit', source: 'Tempoross', tags: ['Skilling & Minigames'], access: 4.5, img: 'Angler hat',
    // Section pieces use the SPIRIT names (the upgrade you actually chase); set
    // tile owns via per-slot base-OR-spirit and icon follows the spirit variant.
    pieces: ['Spirit angler headband','Spirit angler top','Spirit angler waders','Spirit angler boots'],
    extra: {
      matchAny: ['Spirit angler headband','Spirit angler top','Angler hat','Angler top'],
      matchAll: [
        ['Spirit angler headband','Angler hat'],
        ['Spirit angler top','Angler top'],
        ['Spirit angler waders','Angler waders'],
        ['Spirit angler boots','Angler boots'],
      ],
    } }),
  ...expandSet({ set: 'Prospector kit', source: 'Motherlode Mine', tags: ['Skilling & Minigames'], access: 4, img: 'Prospector helmet',
    pieces: ['Prospector helmet','Prospector jacket','Prospector legs','Prospector boots'] }),
  ...expandSet({ set: 'Smiths uniform', source: "Giants' Foundry", tags: ['Skilling & Minigames'], access: 5, img: 'Smiths tunic',
    pieces: ['Smiths tunic','Smiths trousers','Smiths boots','Smiths gloves','Smiths hat'] }),
  ...expandSet({ set: "Carpenter's outfit", source: 'Mahogany Homes', tags: ['Skilling & Minigames'], access: 4.5, img: "Carpenter's helmet",
    pieces: ["Carpenter's helmet","Carpenter's shirt","Carpenter's trousers","Carpenter's boots"] }),
  ...expandSet({ set: 'Raiments of the Eye', source: 'Guardians of the Rift', tags: ['Skilling & Minigames'], access: 6.5, img: 'Hat of the eye',
    pieces: ['Hat of the eye','Robe top of the eye','Robe bottoms of the eye','Boots of the eye'] }),
  ...expandSet({ set: "Farmers outfit", source: 'Tithe Farm', tags: ['Skilling & Minigames'], access: 4.5, img: "Farmer's strawhat",
    pieces: ["Farmer's strawhat",'Farmers jacket','Farmers boro trousers','Farmers boots'] }),
  ...expandSet({ set: 'Guild hunter outfit', source: 'Hunter Guild', tags: ['Skilling & Minigames'], access: 5, img: 'Guild hunter headwear',
    pieces: ['Guild hunter headwear','Guild hunter top','Guild hunter legs','Guild hunter boots'] }),
  ...expandSet({ set: 'Lumberjack outfit', source: 'Forestry', tags: ['Skilling & Minigames'], access: 5, img: 'Lumberjack hat',
    pieces: ['Lumberjack hat','Lumberjack top','Lumberjack legs','Lumberjack boots'],
    extra: {
      matchAny: ['Forestry hat','Lumberjack hat','Forestry top','Lumberjack top'],
      matchAll: [
        ['Lumberjack hat','Forestry hat'],
        ['Lumberjack top','Forestry top'],
        ['Lumberjack legs','Forestry legs'],
        ['Lumberjack boots','Forestry boots'],
      ],
    } }),
  ...expandSet({ set: "Zealots robes", source: "Shades of Mort'ton", tags: ['Skilling & Minigames'], access: 5, img: "Zealot's helm",
    pieces: ["Zealot's helm","Zealot's robe top","Zealot's robe bottom","Zealot's boots"] }),

  // ════════ WAVE 3 — QoL / UTILITY ════════
  { name: 'Ardougne cloak', tags: ['Diary Rewards'], access: 4.5,       src: 'Ardougne Diary', match: 'Ardougne cloak',
    // Icon follows the highest tier owned (listed best-first).
    matchAny: ['Ardougne cloak 4','Ardougne cloak 3','Ardougne cloak 2','Ardougne cloak 1'] },
  { name: 'Varrock armour', tags: ['Diary Rewards'], access: 4,       src: 'Varrock Diary', match: 'Varrock armour',
    // Icon follows the highest tier owned (listed best-first).
    matchAny: ['Varrock armour 4','Varrock armour 3','Varrock armour 2','Varrock armour 1'] },
  { name: 'Tackle box', source: 'Tempoross', tags: ['Skilling & Minigames'], access: 4.5,           src: 'Tempoross', match: 'Tackle box' },
  { name: 'Fish barrel', source: 'Tempoross', tags: ['Skilling & Minigames'], access: 4.5,          src: 'Tempoross', img: 'Fish barrel', matchAny: ['Fish sack barrel','Fish barrel'] },
  { name: 'Coal bag', source: 'Motherlode Mine', tags: ['Skilling & Minigames'], access: 4,             src: 'Motherlode Mine / Prospector', match: 'Coal bag' },
  { name: 'Gem bag', source: 'Motherlode Mine', tags: ['Skilling & Minigames'], access: 4,              src: 'Motherlode Mine', match: 'Gem bag' },
  { name: 'Plank sack', source: 'Mahogany Homes', tags: ['Skilling & Minigames'], access: 4,           src: 'Mahogany Homes', match: 'Plank sack' },
  { name: "Amy's saw", source: 'Mahogany Homes', tags: ['Skilling & Minigames'], access: 4,            src: 'Mahogany Homes', match: "Amy's saw" },
  { name: 'Imcando hammer', tags: ['Skilling & Minigames'], access: 6.5,       src: 'Perilous Moons (locked off)', match: 'Imcando hammer' },
  { name: 'Colossal pouch', source: 'Guardians of the Rift', tags: ['Skilling & Minigames'], access: 6.5,       src: 'Guardians of the Rift (stitch 4 pouches)', img: 'Colossal pouch', match: 'Colossal pouch' },
  { name: 'Ring of endurance', source: 'Hallowed Sepulchre', tags: ['Skilling & Minigames'], access: 7,    src: 'Hallowed Sepulchre', match: 'Ring of endurance' },
  { name: 'Cooking gauntlets', tags: ['Quest Rewards'], access: 2,    src: 'Family Crest', img: 'Cooking gauntlets', matchAny: ['Cooking gauntlets','Gauntlets of cooking'] },
  { name: 'Magic secateurs', tags: ['Quest Rewards'], access: 2.5,      src: 'Fairytale I', match: 'Magic secateurs' },
  { name: 'Herb sack', tags: ['Skilling & Minigames'], access: 4,            src: 'Slayer Masters / Soul Wars', img: 'Herb sack', matchAny: ['Silklined herb sack','Herb sack'] },
  { name: 'Seed box', source: 'Tithe Farm', tags: ['Skilling & Minigames'], access: 4,             src: 'Tithe Farm / Trekking', match: 'Seed box' },
  { name: 'Bottomless compost bucket', source: 'Hespori', tags: ['Boss Drops', 'Skilling & Minigames'], access: 4.5, src: 'Tithe Farm', match: 'Bottomless compost bucket' },
  { name: 'Fletching knife', source: 'Forestry', tags: ['Skilling & Minigames'], access: 3,      src: "Forestry", match: 'Fletching knife' },
  { name: 'Bow string spool', source: 'Forestry', tags: ['Skilling & Minigames'], access: 3,     src: 'Forestry', img: 'Bow string spool', match: 'tring spool' },
  { name: 'Reagent pouch', source: 'Mastering Mixology', tags: ['Skilling & Minigames'], access: 4.5,        src: 'Mastering Mixology', match: 'Reagent pouch' },
  { name: 'Prescription goggles', source: 'Mastering Mixology', tags: ['Skilling & Minigames'], access: 5, src: 'Mastering Mixology', img: 'Prescription goggles (focused)', match: 'Prescription goggles' },
  { name: 'Celestial ring', source: 'Volcanic Mine', tags: ['Skilling & Minigames'], access: 6.5,       src: 'Volcanic Mine', img: 'Celestial ring', matchAny: ['Celestial signet','Celestial ring (uncharged)','Celestial ring'] },
  { name: 'Expert mining gloves', source: 'Mining Guild', tags: ['Skilling & Minigames'], access: 5.5, src: 'Mining Guild (unidentified minerals)', match: 'Expert mining gloves' },
  { name: 'Log basket', source: 'Forestry', tags: ['Skilling & Minigames'], access: 3,           src: 'Forestry', img: 'Log basket', matchAny: ['Forestry basket','Log basket'] },
  { name: 'Horn of plenty', source: 'Gryphons', tags: ['Slayer Unlocks'], access: 5,       src: 'Gryphons, Great Conch (51 Slayer + 45 Sailing + Troubled Tortugans)', match: 'Horn of plenty',
    hard: () => [ reqStat('Slayer', 51), reqStat('Sailing', 45), reqOther('Quest: Troubled Tortugans', hasQuest('Troubled Tortugans')) ] },

  // ════════ WAVE 4 — CAPABILITY TILES (access/ability, never "owned") ════════
  // status comes purely from reqs; capability:true keeps them out of the owned count
  { name: 'Ornate rejuvenation pool', access: 6.5, src: 'POH — 90 Con + 87 Herb', capability: true,
    img: 'Ornate rejuvenation pool icon',
    reqs: () => [ reqStatBoostable('Construction', 90, 'construction_saw_tea'), reqStatBoostable('Herblore', 87, 'crafting_pie') ] },
  { name: 'Bones to Peaches', source: 'Magic Training Arena', tags: ['Skilling & Minigames'], access: 3.5,     src: 'MTA (Telekinetic + points)', img: 'Peach',
    // Not a bankable item — ownership comes from the collection log (ever-unlocked).
    // Soft = the level to use it (gold "able to get" before the log confirms it).
    clogItem: 'Bones to peaches',
    soft: () => [ reqStat('Magic', 60) ] },
  { name: 'Saradomin brew', tags: ['Consumables'], access: 4,       src: '81 Herblore — or held from drops', img: 'Saradomin brew(4)', match: 'Saradomin brew',
    soft: () => [ reqStatBoostable('Herblore', 81, 'botanical_pie') ] },
  { name: 'Super combat potion', tags: ['Consumables'], access: 6,  src: '90 Herblore — or held from drops', img: 'Super combat potion(4)', match: 'Super combat potion',
    soft: () => [ reqStatBoostable('Herblore', 90, 'botanical_pie') ] },
  { name: 'Super restore', tags: ['Consumables'], access: 3.5,        src: '63 Herblore — or held from drops', img: 'Super restore(4)', match: 'Super restore',
    soft: () => [ reqStatBoostable('Herblore', 63, 'botanical_pie') ] },
  { name: 'Prayer potion', tags: ['Consumables'], access: 2,        src: '38 Herblore — or held from drops', img: 'Prayer potion(4)', match: 'Prayer potion',
    soft: () => [ reqStatBoostable('Herblore', 38, 'botanical_pie') ] },
  { name: 'Stamina potion', tags: ['Consumables'], access: 4.5,       src: '77 Herblore — or held from drops', img: 'Stamina potion(4)', match: 'Stamina potion',
    soft: () => [ reqStatBoostable('Herblore', 77, 'botanical_pie') ] },

  // ════════ WAVE 4b — SKILLCAPES (QoL-important only) ════════
  { name: 'Crafting cape', access: 7.5,        src: '99 Crafting', img: 'Crafting cape',
    matchAny: ['Crafting cape(t)','Crafting cape'], reqs: () => [ reqStat('Crafting', 99) ] },
  { name: 'Construction cape', access: 7.5,    src: '99 Construction', img: 'Construct. cape',
    matchAny: ['Construct. cape(t)','Construct. cape','Construction cape(t)','Construction cape'], reqs: () => [ reqStat('Construction', 99) ] },

  // ════════ MISC CAPES ════════
  { name: 'Max cape', access: 10,             src: 'All 99s', match: 'Max cape',
    reqs: () => [ reqOther('All skills 99', Object.values(state.character?.stats||{}).every(s => s.real_level >= 99)) ] },
];
