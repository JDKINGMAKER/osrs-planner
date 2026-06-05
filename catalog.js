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
  { name: 'Divine rune pouch', tags: ['Raids Loot'], access: 7.5,    src: 'Upgrade Rune pouch w/ Thread of Elidinis (ToA), 75 Craft', match: 'Divine rune pouch',
    hard: () => [ reqOther('ToA capability (Into the Tombs)', hasToACapability()), reqOther('Rune pouch owned', hasItem('Rune pouch')) ],
    soft: () => [ reqStatBoostable('Crafting', 75, 'crafting_pie') ] },
  { name: "Ava's accumulator", tags: ['Boss Drops', 'Quest Rewards'], access: 2.5,    src: 'Animal Magnetism',
    hard: () => [ reqOther('Quest: Animal Magnetism', hasQuest('Animal Magnetism')) ] },
  { name: "Ava's assembler", tags: ['Boss Drops', 'Quest Rewards'], access: 6.5,      src: 'Vorkath head + accumulator (needs DS2)',
    hard: () => [ reqOther("Ava's accumulator owned", hasItem("Ava's accumulator")), reqOther('Quest: Dragon Slayer II', hasQuest('Dragon Slayer II')) ] },
  { name: 'Berserker ring (i)', tags: ['Boss Drops'], access: 6,   src: 'Dagannoth Rex (Waterbirth) + imbue', match: 'erserker ring (i)',
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
  { name: 'Elite void (set)', tags: ['Diary Rewards', 'Skilling & Minigames'], access: 7.5,     src: 'Pest Control + Hard Western diary', img: 'Elite void top',
    matchAll: ['Elite void top', 'Elite void robe', 'Void knight gloves', 'Void melee helm'],
    reqs: () => [
      reqOther('Base Void top owned', hasItem('Void knight top')),
      reqOther('Base Void robe owned', hasItem('Void knight robe')),
      reqOther('Hard Western Provinces diary', hasDiary('Western Provinces', 'hard')),
      reqStat('Defence', 42), reqStat('Ranged', 42), reqStat('Magic', 42)
    ] },
  { name: 'Toxic blowpipe', tags: ['Boss Drops'], access: 6.5,       src: 'Zulrah', img: 'Toxic blowpipe', match: 'blowpipe',
    hard: () => [
      reqOther('Quest: Regicide (Zulrah access)', hasQuest('Regicide')),
      reqAny('80+ Ranged or 75+ Magic', [ reqStat('Ranged', 80), reqStat('Magic', 75) ]),
    ],
    soft: () => [
      reqAnyItem('Zulrah weapon (Twinflame staff or Bowfa)', ['Twinflame staff','Bow of faerdhinen']),
    ] },
  { name: 'Bow of faerdhinen', tags: ['Boss Drops'], access: 8,    src: 'Corrupted Gauntlet (seed)', img: 'Bow of faerdhinen (c)', match: 'aerdhinen',
    hard: () => [ reqOther('Quest: Song of the Elves (Gauntlet access)', hasQuest('Song of the Elves')) ] },
  { name: 'Rune crossbow', access: 2.5,        src: 'Fletch (69 Fletching) / drops', match: 'Rune crossbow',
    hard: () => [ reqStat('Fletching', 69) ] },
  { name: 'Dragon scimitar', tags: ['Quest Rewards'], access: 2,      src: 'Monkey Madness I',
    reqs: () => [ reqStat('Attack', 60), reqOther('Quest: Monkey Madness I', hasQuest('Monkey Madness I')) ] },
  { name: 'Dragon defender', tags: ['Skilling & Minigames'], access: 4,      src: "Warriors' Guild",
    reqs: () => [ reqStat('Attack', 60), reqStat('Defence', 60), reqOther("Warriors' Guild access (combined 130+)", (getLevel('Attack') + getLevel('Strength')) >= 130) ] },
  { name: 'Abyssal whip', tags: ['Slayer Unlocks'], access: 5.5,         src: 'Abyssal demons (85 Slayer)',
    hard: () => [ reqStat('Slayer', 85) ] },
  { name: 'Arkan blade', tags: ['Quest Rewards'], access: 5,          src: 'The Final Dawn (quest)' },
  { name: 'Zombie axe', tags: ['Quest Rewards'], access: 5,           src: 'Armoured zombies (broken axe)' },
  { name: 'Warped sceptre', tags: ['Slayer Unlocks'], access: 4.5,       src: 'Warped creatures (56 Slayer + Path of Glouphrie)', match: 'Warped sceptre',
    hard: () => [ reqStat('Slayer', 56), reqOther('Quest: The Path of Glouphrie', hasQuest('The Path of Glouphrie')) ] },
  { name: 'Dragon boots', tags: ['Slayer Unlocks'], access: 4,         src: 'Spiritual mages (83 Slayer)', match: 'Dragon boots',
    // Exclude the cosmetic kit, which contains the substring "Dragon boots".
    matchNot: ['ornament kit'],
    hard: () => [ reqStat('Slayer', 83) ] },
  { name: 'Trident of the seas', tags: ['Slayer Unlocks'], access: 5,  src: 'Cave krakens (87 Slayer)', match: 'rident of the seas',
    hard: () => [ reqStat('Slayer', 87) ] },
  { name: 'Dragon axe', tags: ['Skilling & Minigames', 'Boss Drops'], access: 4.5,           src: 'Dagannoth Kings / WC guild', matchAny: ['Dragon axe', 'Dragon felling axe'] },
  // matchAny: owned if ANY variant is held. Note hasItem() is already substring-based,
  // so "(or)"/"(upgraded)" suffixes are caught by the base name — but listing them
  // makes the intent explicit and survives any future change to match logic.
  { name: 'Dragon pickaxe', tags: ['Boss Drops', 'Skilling & Minigames'], access: 6.5,       src: "Calvar'ion (~1/358)", matchAny: ['Dragon pickaxe', 'Dragon pickaxe (or)', 'Dragon pickaxe (upgraded)'] },
  // Collection-log completion, NOT a single bank item — see note. Detected only if
  // every Perilous Moons unique is currently in the bank/equipment (a weak proxy).
  { name: 'Moons of Peril (log)', tags: ['Boss Drops'], access: 6, src: 'Perilous Moons — full collection log', img: 'Dual macuahuitl',
    matchAll: ['Blood moon helm','Blood moon chestplate','Blood moon tassets','Blue moon helm','Blue moon chestplate','Blue moon tassets','Eclipse moon helm','Eclipse moon chestplate','Eclipse moon tassets','Dual macuahuitl','Blue moon spear','Eclipse atlatl'] },

  // ════════ WAVE 1 — COMBAT GEAR ════════
  { name: 'Amulet of fury', access: 6,       src: 'Onyx + 90 Craft', match: 'mulet of fury' },
  { name: 'Occult necklace', tags: ['Slayer Unlocks'], access: 5.5,      src: 'Smoke devils (93 Slayer)', match: 'Occult necklace',
    hard: () => [ reqStat('Slayer', 93) ] },
  { name: 'Amulet of rancour', tags: ['Slayer Unlocks'], access: 9,    src: 'Araxxor components (92 Slayer)', match: 'mulet of rancour',
    hard: () => [ reqStat('Slayer', 92) ] },
  { name: 'Primordial boots', tags: ['Slayer Unlocks'], access: 7,     src: 'Cerberus (91 Slayer)', match: 'Primordial boots',
    hard: () => [ reqStat('Slayer', 91) ] },
  { name: 'Bandos godsword', tags: ['Boss Drops'], access: 7,      src: 'GWD — Bandos', match: 'Bandos godsword' },
  { name: 'Zamorakian hasta', tags: ['Boss Drops'], access: 7,     src: 'GWD — Zamorak spear, reforge', match: 'Zamorakian hasta' },
  { name: 'Dragon warhammer', tags: ['Slayer Unlocks'], access: 5.5,     src: 'Lizardman shamans' },
  { name: 'Dragon hunter lance', tags: ['Quest Rewards'], access: 7.5,  src: 'Vorkath (hydra claw path)', match: 'Dragon hunter lance' },
  { name: 'Noxious halberd', tags: ['Slayer Unlocks'], access: 8.5,      src: 'Araxxor (92 Slayer)', match: 'Noxious halberd',
    hard: () => [ reqStat('Slayer', 92) ] },
  { name: 'Dragon dagger', access: 2,        src: 'Lost City', img: 'Dragon dagger', matchAny: ['Dragon dagger(p++)','Dragon dagger'] },
  { name: 'Bone dagger', tags: ['Quest Rewards'], access: 3,          src: 'The General (Chaos Tunnels)', img: 'Bone dagger', matchAny: ['Bone dagger(p++)','Bone dagger'] },
  { name: 'Twinflame staff', tags: ['Boss Drops'], access: 6,      src: 'Royal Titans' },
  { name: 'Emberlight', tags: ['Boss Drops', 'Quest Rewards'], access: 8,           src: 'Tormented Demons (synapse + Arclight)', match: 'Emberlight' },
  { name: 'Scorching bow', tags: ['Boss Drops', 'Quest Rewards'], access: 8,        src: 'Tormented Demons (synapse + magic longbow)', match: 'Scorching bow' },
  { name: 'Purging staff', tags: ['Boss Drops', 'Quest Rewards'], access: 8,        src: 'Tormented Demons (synapse + battlestaff)', match: 'Purging staff' },
  { name: "Hunters' sunlight crossbow", access: 7.5, src: 'Sunlight cbow (Hunter Guild)', match: 'unlight crossbow' },
  { name: 'Dorgeshuun crossbow', tags: ['Quest Rewards'], access: 2.5,  src: 'Death to the Dorgeshuun', match: 'Dorgeshuun crossbow' },
  { name: 'Helm of neitiznot', tags: ['Quest Rewards'], access: 3.5,    src: 'The Fremennik Isles', match: 'elm of neitiznot' },
  { name: 'Fighter torso', tags: ['Skilling & Minigames'], access: 4,        src: 'Barbarian Assault', match: 'Fighter torso' },
  { name: 'Infernal cape', access: 9,        src: 'The Inferno', match: 'Infernal cape' },
  { name: 'Slayer helmet', tags: ['Slayer Unlocks'], access: 5.5,        src: 'Slayer (combine masks)', img: 'Slayer helmet', matchAny: ['Slayer helmet (i)','Slayer helmet'] },

  // ── combat armour SETS (matchAll; icon = head/iconic piece) ──
  { name: 'Ancestral robes', tags: ['Raids Loot'], access: 8.5,      src: 'Chambers of Xeric', img: 'Ancestral hat',
    matchAll: ['Ancestral hat','Ancestral robe top','Ancestral robe bottom'] },
  { name: 'Virtus robes', tags: ['Boss Drops'], access: 8.5,         src: "Desert Treasure II bosses", img: 'Virtus mask',
    matchAll: ['Virtus mask','Virtus robe top','Virtus robe bottom'] },
  { name: 'Bloodbark armour', tags: ['Skilling & Minigames'], access: 6,     src: 'Runecraft (blood runes / Vyrewatch)', img: 'Bloodbark helm',
    matchAll: ['Bloodbark helm','Bloodbark body','Bloodbark legs'] },

  // ════════ WAVE 2 — SKILLING OUTFITS (sets; icon follows owned variant or head) ════════
  { name: 'Graceful outfit', access: 3,      src: 'Agility (Marks of Grace)', img: 'Graceful hood',
    matchAll: ['Graceful hood','Graceful top','Graceful legs','Graceful gloves','Graceful boots','Graceful cape'] },
  { name: 'Rogue equipment', tags: ['Skilling & Minigames'], access: 3,      src: "Rogues' Den", img: 'Rogue mask',
    matchAll: ['Rogue mask','Rogue top','Rogue trousers','Rogue gloves','Rogue boots'] },
  { name: 'Anglers outfit', tags: ['Skilling & Minigames'], access: 4.5,       src: 'Fishing Trawler (base) / Tempoross (spirit upgrade)', img: 'Angler hat',
    // Icon prefers spirit pieces when owned (listed first). Head slot is "headband"
    // for spirit, "hat" for base — note the different name.
    matchAny: ['Spirit angler headband','Spirit angler top','Angler hat','Angler top'],
    // Each slot satisfied by base OR spirit variant.
    matchAll: [
      ['Spirit angler headband','Angler hat'],
      ['Spirit angler top','Angler top'],
      ['Spirit angler waders','Angler waders'],
      ['Spirit angler boots','Angler boots'],
    ] },
  { name: 'Prospector kit', tags: ['Skilling & Minigames'], access: 4,       src: 'Motherlode Mine (nuggets)', img: 'Prospector helmet',
    matchAll: ['Prospector helmet','Prospector jacket','Prospector legs','Prospector boots'] },
  { name: "Smiths uniform", tags: ['Skilling & Minigames'], access: 5,       src: 'Giants Foundry', img: 'Smiths tunic',
    matchAll: ['Smiths tunic','Smiths trousers','Smiths boots','Smiths gloves','Smiths hat'] },
  { name: "Carpenter's outfit", tags: ['Skilling & Minigames'], access: 4.5,   src: 'Mahogany Homes', img: "Carpenter's helmet",
    matchAll: ["Carpenter's helmet","Carpenter's shirt","Carpenter's trousers","Carpenter's boots"] },
  { name: 'Raiments of the Eye', tags: ['Skilling & Minigames'], access: 6.5,  src: 'Guardians of the Rift', img: 'Hat of the eye',
    matchAll: ['Hat of the eye','Robe top of the eye','Robe bottoms of the eye','Boots of the eye'] },
  { name: "Farmers outfit", tags: ['Skilling & Minigames'], access: 4.5,       src: 'Tithe Farm', img: "Farmer's strawhat",
    matchAll: ["Farmer's strawhat",'Farmers jacket','Farmers boro trousers','Farmers boots'] },
  { name: 'Guild hunter outfit', tags: ['Skilling & Minigames'], access: 5,  src: 'Hunter Guild (Quetzal)', img: 'Guild hunter headwear',
    matchAll: ['Guild hunter headwear','Guild hunter top','Guild hunter legs','Guild hunter boots'] },
  { name: 'Lumberjack outfit', tags: ['Skilling & Minigames'], access: 5,    src: 'Forestry / Temple Trekking', img: 'Lumberjack hat',
    matchAny: ['Forestry hat','Lumberjack hat','Forestry top','Lumberjack top'],
    matchAll: ['Lumberjack hat','Lumberjack top','Lumberjack legs','Lumberjack boots'] },
  { name: "Zealots robes", tags: ['Skilling & Minigames'], access: 5,        src: 'Shades of Mort\'ton', img: "Zealot's helm",
    matchAll: ["Zealot's helm","Zealot's robe top","Zealot's robe bottom","Zealot's boots"] },

  // ════════ WAVE 3 — QoL / UTILITY ════════
  { name: 'Ardougne cloak', tags: ['Diary Rewards'], access: 4.5,       src: 'Ardougne Diary', match: 'Ardougne cloak',
    // Icon follows the highest tier owned (listed best-first).
    matchAny: ['Ardougne cloak 4','Ardougne cloak 3','Ardougne cloak 2','Ardougne cloak 1'] },
  { name: 'Varrock armour', tags: ['Diary Rewards'], access: 4,       src: 'Varrock Diary', match: 'Varrock armour',
    // Icon follows the highest tier owned (listed best-first).
    matchAny: ['Varrock armour 4','Varrock armour 3','Varrock armour 2','Varrock armour 1'] },
  { name: 'Tackle box', tags: ['Skilling & Minigames'], access: 4.5,           src: 'Tempoross', match: 'Tackle box' },
  { name: 'Fish barrel', tags: ['Skilling & Minigames'], access: 4.5,          src: 'Tempoross', img: 'Fish barrel', matchAny: ['Fish sack barrel','Fish barrel'] },
  { name: 'Coal bag', tags: ['Skilling & Minigames'], access: 4,             src: 'Motherlode Mine / Prospector', match: 'Coal bag' },
  { name: 'Gem bag', tags: ['Skilling & Minigames'], access: 4,              src: 'Motherlode Mine', match: 'Gem bag' },
  { name: 'Plank sack', tags: ['Skilling & Minigames'], access: 4,           src: 'Mahogany Homes', match: 'Plank sack' },
  { name: "Amy's saw", tags: ['Skilling & Minigames'], access: 4,            src: 'Mahogany Homes', match: "Amy's saw" },
  { name: 'Imcando hammer', tags: ['Skilling & Minigames'], access: 6.5,       src: 'Perilous Moons (locked off)', match: 'Imcando hammer' },
  { name: 'Colossal pouch', tags: ['Skilling & Minigames'], access: 6.5,       src: 'Guardians of the Rift (stitch 4 pouches)', img: 'Colossal pouch', match: 'Colossal pouch' },
  { name: 'Ring of endurance', tags: ['Skilling & Minigames'], access: 7,    src: 'Hallowed Sepulchre', match: 'Ring of endurance' },
  { name: 'Cooking gauntlets', tags: ['Quest Rewards'], access: 2,    src: 'Family Crest', img: 'Cooking gauntlets', matchAny: ['Cooking gauntlets','Gauntlets of cooking'] },
  { name: 'Magic secateurs', tags: ['Quest Rewards'], access: 2.5,      src: 'Fairytale I', match: 'Magic secateurs' },
  { name: 'Herb sack', tags: ['Skilling & Minigames'], access: 4,            src: 'Slayer Masters / Soul Wars', img: 'Herb sack', matchAny: ['Silklined herb sack','Herb sack'] },
  { name: 'Seed box', tags: ['Skilling & Minigames'], access: 4,             src: 'Tithe Farm / Trekking', match: 'Seed box' },
  { name: 'Bottomless compost bucket', tags: ['Boss Drops', 'Skilling & Minigames'], access: 4.5, src: 'Tithe Farm', match: 'Bottomless compost bucket' },
  { name: 'Fletching knife', tags: ['Skilling & Minigames'], access: 3,      src: "Forestry", match: 'Fletching knife' },
  { name: 'Bow string spool', tags: ['Skilling & Minigames'], access: 3,     src: 'Forestry', img: 'Bow string spool', match: 'tring spool' },
  { name: 'Reagent pouch', tags: ['Skilling & Minigames'], access: 4.5,        src: 'Mastering Mixology', match: 'Reagent pouch' },
  { name: 'Prescription goggles', tags: ['Skilling & Minigames'], access: 5, src: 'Mastering Mixology', img: 'Prescription goggles (focused)', match: 'Prescription goggles' },
  { name: 'Celestial ring', tags: ['Skilling & Minigames'], access: 6.5,       src: 'Volcanic Mine', img: 'Celestial ring', matchAny: ['Celestial signet','Celestial ring (uncharged)','Celestial ring'] },
  { name: 'Expert mining gloves', tags: ['Skilling & Minigames'], access: 5.5, src: 'Mining Guild (unidentified minerals)', match: 'Expert mining gloves' },
  { name: 'Log basket', tags: ['Skilling & Minigames'], access: 3,           src: 'Forestry', img: 'Log basket', matchAny: ['Forestry basket','Log basket'] },
  { name: 'Horn of plenty', tags: ['Slayer Unlocks'], access: 5,       src: 'Gryphons, Great Conch (51 Slayer + 45 Sailing + Troubled Tortugans)', match: 'Horn of plenty',
    hard: () => [ reqStat('Slayer', 51), reqStat('Sailing', 45), reqOther('Quest: Troubled Tortugans', hasQuest('Troubled Tortugans')) ] },

  // ════════ WAVE 4 — CAPABILITY TILES (access/ability, never "owned") ════════
  // status comes purely from reqs; capability:true keeps them out of the owned count
  { name: 'Ornate rejuvenation pool', access: 6.5, src: 'POH — 90 Con + 87 Herb', capability: true,
    img: 'Ornate rejuvenation pool icon',
    reqs: () => [ reqStatBoostable('Construction', 90, 'construction_saw_tea'), reqStatBoostable('Herblore', 87, 'crafting_pie') ] },
  { name: 'Bones to Peaches', tags: ['Skilling & Minigames'], access: 3.5,     src: 'MTA (Telekinetic + points)', img: 'Peach',
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
