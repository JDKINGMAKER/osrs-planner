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
  { name: 'Barrows gloves', access: 4.5,       src: 'Recipe for Disaster',
    hard: () => [ reqOther('Recipe for Disaster complete', hasQuest('Recipe for Disaster')) ] },
  { name: 'Quest point cape', access: 6.5,     src: 'All quests complete', match: 'Quest point cape',
    hard: () => [ reqOther('All quests complete', hasQuestCape()) ] },
  { name: 'Rune pouch', access: 5,           src: 'Slayer / LMS / Wintertodt', match: 'Rune pouch' },
  { name: 'Divine rune pouch', access: 7.5,    src: 'Upgrade Rune pouch w/ Thread of Elidinis (ToA), 75 Craft', match: 'Divine rune pouch',
    hard: () => [ reqOther('ToA capability (Into the Tombs)', hasToACapability()), reqOther('Rune pouch owned', hasItem('Rune pouch')) ],
    soft: () => [ reqStatBoostable('Crafting', 75, 'crafting_pie') ] },
  { name: "Ava's accumulator", access: 2.5,    src: 'Animal Magnetism',
    hard: () => [ reqOther('Quest: Animal Magnetism', hasQuest('Animal Magnetism')) ] },
  { name: "Ava's assembler", access: 6.5,      src: 'Vorkath head + accumulator (needs DS2)',
    hard: () => [ reqOther("Ava's accumulator owned", hasItem("Ava's accumulator")), reqOther('Quest: Dragon Slayer II', hasQuest('Dragon Slayer II')) ] },
  { name: 'Berserker ring (i)', access: 6,   src: 'Dagannoth Rex (Waterbirth) + imbue', match: 'erserker ring (i)',
    hard: () => [ reqOther('Quest: The Fremennik Trials (Waterbirth access)', hasQuest('The Fremennik Trials')) ] },
  { name: 'Salve amulet(ei)', access: 6,     src: 'Haunted Mine + Tarn diary + imbue', match: 'Salve amulet(ei)',
    hard: () => [ reqOther('Quest: Haunted Mine', hasQuest('Haunted Mine')), reqOther('Miniquest: Lair of Tarn Razorlor', hasQuest('Lair of Tarn Razorlor')) ] },
  { name: 'Amulet of glory', access: 1.5,      src: 'Craft (80 Craft/68 Mag) or hunt (83 Hunter)', match: 'mulet of glory',
    hard: () => [ reqAny('Craft (80 Craft+68 Mag) or hunt (83 Hunter)', [
      [ reqStat('Crafting', 80), reqStat('Magic', 68) ],
      reqStat('Hunter', 83)
    ]) ] },
  { name: 'Elite void (set)', access: 7.5,     src: 'Pest Control + Hard Western diary', img: 'Elite void top',
    matchAll: ['Elite void top', 'Elite void robe', 'Void knight gloves', 'Void melee helm'],
    reqs: () => [
      reqOther('Base Void top owned', hasItem('Void knight top')),
      reqOther('Base Void robe owned', hasItem('Void knight robe')),
      reqOther('Hard Western Provinces diary', hasDiary('Western Provinces', 'hard')),
      reqStat('Defence', 42), reqStat('Ranged', 42), reqStat('Magic', 42)
    ] },
  { name: 'Toxic blowpipe', access: 6.5,       src: 'Zulrah', img: 'Toxic blowpipe', match: 'blowpipe',
    hard: () => [
      reqOther('Quest: Regicide (Zulrah access)', hasQuest('Regicide')),
      reqAny('80+ Ranged or 75+ Magic', [ reqStat('Ranged', 80), reqStat('Magic', 75) ]),
    ],
    soft: () => [
      reqAnyItem('Zulrah weapon (Twinflame staff or Bowfa)', ['Twinflame staff','Bow of faerdhinen']),
    ] },
  { name: 'Bow of faerdhinen', access: 8,    src: 'Corrupted Gauntlet (seed)', img: 'Bow of faerdhinen (c)', match: 'aerdhinen',
    hard: () => [ reqOther('Quest: Song of the Elves (Gauntlet access)', hasQuest('Song of the Elves')) ] },
  { name: 'Rune crossbow', access: 2.5,        src: 'Fletch (69 Fletching) / drops', match: 'Rune crossbow',
    hard: () => [ reqStat('Fletching', 69) ] },
  { name: 'Dragon scimitar', access: 2,      src: 'Monkey Madness I',
    reqs: () => [ reqStat('Attack', 60), reqOther('Quest: Monkey Madness I', hasQuest('Monkey Madness I')) ] },
  { name: 'Dragon defender', access: 4,      src: "Warriors' Guild",
    reqs: () => [ reqStat('Attack', 60), reqStat('Defence', 60), reqOther("Warriors' Guild access (combined 130+)", (getLevel('Attack') + getLevel('Strength')) >= 130) ] },
  { name: 'Abyssal whip', access: 5.5,         src: 'Abyssal demons (85 Slayer)' },
  { name: 'Arkan blade', access: 5,          src: 'The Final Dawn (quest)' },
  { name: 'Zombie axe', access: 5,           src: 'Armoured zombies (broken axe)' },
  { name: 'Warped sceptre', access: 4.5,       src: 'Warped creatures (56 Slayer)', match: 'Warped sceptre' },
  { name: 'Dragon boots', access: 4,         src: 'Spiritual mages' },
  { name: 'Trident of the seas', access: 5,  src: 'Cave krakens / Kraken boss', match: 'rident of the seas' },
  { name: 'Dragon axe', access: 4.5,           src: 'Dagannoth Kings / WC guild', matchAny: ['Dragon axe', 'Dragon felling axe'] },
  // matchAny: owned if ANY variant is held. Note hasItem() is already substring-based,
  // so "(or)"/"(upgraded)" suffixes are caught by the base name — but listing them
  // makes the intent explicit and survives any future change to match logic.
  { name: 'Dragon pickaxe', access: 6.5,       src: "Calvar'ion (~1/358)", matchAny: ['Dragon pickaxe', 'Dragon pickaxe (or)', 'Dragon pickaxe (upgraded)'] },
  // Collection-log completion, NOT a single bank item — see note. Detected only if
  // every Perilous Moons unique is currently in the bank/equipment (a weak proxy).
  { name: 'Moons of Peril (log)', access: 6, src: 'Perilous Moons — full collection log', img: 'Dual macuahuitl',
    matchAll: ['Blood moon helm','Blood moon chestplate','Blood moon tassets','Blue moon helm','Blue moon chestplate','Blue moon tassets','Eclipse moon helm','Eclipse moon chestplate','Eclipse moon tassets','Dual macuahuitl','Blue moon spear','Eclipse atlatl'] },

  // ════════ WAVE 1 — COMBAT GEAR ════════
  { name: 'Amulet of fury', access: 6,       src: 'Onyx + 90 Craft', match: 'mulet of fury' },
  { name: 'Occult necklace', access: 5.5,      src: 'Smoke devils', match: 'Occult necklace' },
  { name: 'Amulet of rancour', access: 9,    src: 'Combine torture + components', match: 'mulet of rancour' },
  { name: 'Primordial boots', access: 7,     src: 'Cerberus (primordial crystal)', match: 'Primordial boots' },
  { name: 'Bandos godsword', access: 7,      src: 'GWD — Bandos', match: 'Bandos godsword' },
  { name: 'Zamorakian hasta', access: 7,     src: 'GWD — Zamorak spear, reforge', match: 'Zamorakian hasta' },
  { name: 'Dragon warhammer', access: 5.5,     src: 'Lizardman shamans' },
  { name: 'Dragon hunter lance', access: 7.5,  src: 'Vorkath (hydra claw path)', match: 'Dragon hunter lance' },
  { name: 'Noxious halberd', access: 8.5,      src: "Araxxor (noxious components)", match: 'Noxious halberd' },
  { name: 'Dragon dagger', access: 2,        src: 'Lost City', img: 'Dragon dagger', matchAny: ['Dragon dagger(p++)','Dragon dagger'] },
  { name: 'Bone dagger', access: 3,          src: 'The General (Chaos Tunnels)', img: 'Bone dagger', matchAny: ['Bone dagger(p++)','Bone dagger'] },
  { name: 'Twinflame staff', access: 6,      src: 'Royal Titans' },
  { name: 'Emberlight', access: 8,           src: 'Tormented Demons (synapse + Arclight)', match: 'Emberlight' },
  { name: 'Scorching bow', access: 8,        src: 'Tormented Demons (synapse + magic longbow)', match: 'Scorching bow' },
  { name: 'Purging staff', access: 8,        src: 'Tormented Demons (synapse + battlestaff)', match: 'Purging staff' },
  { name: "Hunters' sunlight crossbow", access: 7.5, src: 'Sunlight cbow (Hunter Guild)', match: 'unlight crossbow' },
  { name: 'Dorgeshuun crossbow', access: 2.5,  src: 'Death to the Dorgeshuun', match: 'Dorgeshuun crossbow' },
  { name: 'Helm of neitiznot', access: 3.5,    src: 'The Fremennik Isles', match: 'elm of neitiznot' },
  { name: 'Fighter torso', access: 4,        src: 'Barbarian Assault', match: 'Fighter torso' },
  { name: 'Obsidian cape', access: 3,        src: 'TzHaar (tokkul)', match: 'Obsidian cape' },
  { name: 'Infernal cape', access: 9,        src: 'The Inferno', match: 'Infernal cape' },
  { name: 'Slayer helmet', access: 5.5,        src: 'Slayer (combine masks)', img: 'Slayer helmet', matchAny: ['Slayer helmet (i)','Slayer helmet'] },

  // ── combat armour SETS (matchAll; icon = head/iconic piece) ──
  { name: 'Ancestral robes', access: 8.5,      src: 'Chambers of Xeric', img: 'Ancestral hat',
    matchAll: ['Ancestral hat','Ancestral robe top','Ancestral robe bottom'] },
  { name: 'Virtus robes', access: 8.5,         src: "Desert Treasure II bosses", img: 'Virtus mask',
    matchAll: ['Virtus mask','Virtus robe top','Virtus robe bottom'] },
  { name: 'Bloodbark armour', access: 6,     src: 'Runecraft (blood runes / Vyrewatch)', img: 'Bloodbark helm',
    matchAll: ['Bloodbark helm','Bloodbark body','Bloodbark legs'] },

  // ════════ WAVE 2 — SKILLING OUTFITS (sets; icon follows owned variant or head) ════════
  { name: 'Graceful outfit', access: 3,      src: 'Agility (Marks of Grace)', img: 'Graceful hood',
    matchAll: ['Graceful hood','Graceful top','Graceful legs','Graceful gloves','Graceful boots','Graceful cape'] },
  { name: 'Rogue equipment', access: 3,      src: "Rogues' Den", img: 'Rogue mask',
    matchAll: ['Rogue mask','Rogue top','Rogue trousers','Rogue gloves','Rogue boots'] },
  { name: 'Anglers outfit', access: 4.5,       src: 'Fishing Trawler / Tempoross upgrade', img: 'Angler hat',
    matchAny: ['Spirit angler top','Angler top','Spirit angler hat','Angler hat'],
    matchAll: ['Angler hat','Angler top','Angler waders','Angler boots'] },
  { name: 'Prospector kit', access: 4,       src: 'Motherlode Mine (nuggets)', img: 'Prospector helmet',
    matchAll: ['Prospector helmet','Prospector jacket','Prospector legs','Prospector boots'] },
  { name: "Smiths uniform", access: 5,       src: 'Giants Foundry', img: 'Smiths tunic',
    matchAll: ['Smiths tunic','Smiths trousers','Smiths boots','Smiths gloves','Smiths hat'] },
  { name: "Carpenter's outfit", access: 4.5,   src: 'Mahogany Homes', img: "Carpenter's helmet",
    matchAll: ["Carpenter's helmet","Carpenter's shirt","Carpenter's trousers","Carpenter's boots"] },
  { name: 'Raiments of the Eye', access: 6.5,  src: 'Guardians of the Rift', img: 'Hat of the eye',
    matchAll: ['Hat of the eye','Robe top of the eye','Robe bottoms of the eye','Boots of the eye'] },
  { name: "Farmers outfit", access: 4.5,       src: 'Tithe Farm', img: "Farmer's strawhat",
    matchAll: ["Farmer's strawhat",'Farmers jacket','Farmers boro trousers','Farmers boots'] },
  { name: 'Guild hunter outfit', access: 5,  src: 'Hunter Guild (Quetzal)', img: 'Guild hunter headwear',
    matchAll: ['Guild hunter headwear','Guild hunter top','Guild hunter legs','Guild hunter boots'] },
  { name: 'Lumberjack outfit', access: 5,    src: 'Forestry / Temple Trekking', img: 'Lumberjack hat',
    matchAny: ['Forestry hat','Lumberjack hat','Forestry top','Lumberjack top'],
    matchAll: ['Lumberjack hat','Lumberjack top','Lumberjack legs','Lumberjack boots'] },
  { name: "Zealots robes", access: 5,        src: 'Shades of Mort\'ton', img: "Zealot's helm",
    matchAll: ["Zealot's helm","Zealot's robe top","Zealot's robe bottom","Zealot's boots"] },

  // ════════ WAVE 3 — QoL / UTILITY ════════
  { name: 'Ardougne cloak', access: 4.5,       src: 'Ardougne Diary', img: 'Ardougne cloak 4', match: 'Ardougne cloak' },
  { name: 'Varrock armour', access: 4,       src: 'Varrock Diary', img: 'Varrock armour 3', match: 'Varrock armour' },
  { name: 'Tackle box', access: 4.5,           src: 'Tempoross', match: 'Tackle box' },
  { name: 'Fish barrel', access: 4.5,          src: 'Tempoross', img: 'Fish barrel', matchAny: ['Fish sack barrel','Fish barrel'] },
  { name: 'Coal bag', access: 4,             src: 'Motherlode Mine / Prospector', match: 'Coal bag' },
  { name: 'Gem bag', access: 4,              src: 'Motherlode Mine', match: 'Gem bag' },
  { name: 'Plank sack', access: 4,           src: 'Mahogany Homes', match: 'Plank sack' },
  { name: "Amy's saw", access: 4,            src: 'Mahogany Homes', match: "Amy's saw" },
  { name: 'Imcando hammer', access: 6.5,       src: 'Perilous Moons (locked off)', match: 'Imcando hammer' },
  { name: 'Colossal pouch', access: 6.5,       src: 'Guardians of the Rift (stitch 4 pouches)', img: 'Colossal pouch', match: 'Colossal pouch' },
  { name: 'Ring of endurance', access: 7,    src: 'Hallowed Sepulchre', match: 'Ring of endurance' },
  { name: 'Cooking gauntlets', access: 2,    src: 'Family Crest', img: 'Cooking gauntlets', matchAny: ['Cooking gauntlets','Gauntlets of cooking'] },
  { name: 'Magic secateurs', access: 2.5,      src: 'Fairytale I', match: 'Magic secateurs' },
  { name: 'Herb sack', access: 4,            src: 'Slayer Masters / Soul Wars', img: 'Herb sack', matchAny: ['Silklined herb sack','Herb sack'] },
  { name: 'Seed box', access: 4,             src: 'Tithe Farm / Trekking', match: 'Seed box' },
  { name: 'Bottomless compost bucket', access: 4.5, src: 'Tithe Farm', match: 'Bottomless compost bucket' },
  { name: 'Fletching knife', access: 3,      src: "Forestry", match: 'Fletching knife' },
  { name: 'Bow string spool', access: 3,     src: 'Forestry', img: 'Bow string spool', match: 'tring spool' },
  { name: 'Reagent pouch', access: 4.5,        src: 'Mastering Mixology', match: 'Reagent pouch' },
  { name: 'Prescription goggles', access: 5, src: 'Mastering Mixology', img: 'Prescription goggles (focused)', match: 'Prescription goggles' },
  { name: 'Celestial ring', access: 6.5,       src: 'Volcanic Mine', img: 'Celestial ring', matchAny: ['Celestial signet','Celestial ring (uncharged)','Celestial ring'] },
  { name: 'Expert mining gloves', access: 5.5, src: 'Mining Guild (unidentified minerals)', match: 'Expert mining gloves' },
  { name: 'Log basket', access: 3,           src: 'Forestry', img: 'Log basket', matchAny: ['Forestry basket','Log basket'] },
  { name: 'Amulet of bounty', access: 4,     src: 'Tithe Farm', match: 'Amulet of bounty' },
  { name: 'Horn of plenty', access: 5,       src: 'Forestry (anima bark)', match: 'Horn of plenty' },

  // ════════ WAVE 4 — CAPABILITY TILES (access/ability, never "owned") ════════
  // status comes purely from reqs; capability:true keeps them out of the owned count
  { name: 'Ornate rejuvenation pool', access: 6.5, src: 'POH — 90 Con + 87 Herb', capability: true,
    img: 'Ornate rejuvenation pool icon',
    reqs: () => [ reqStatBoostable('Construction', 90, 'construction_saw_tea'), reqStatBoostable('Herblore', 87, 'crafting_pie') ] },
  { name: 'Bones to Peaches', access: 3.5,     src: 'MTA (Telekinetic + points)', capability: true, img: 'Peach',
    reqs: () => [ reqStat('Magic', 60) ] },
  { name: 'Saradomin brew', access: 4,       src: '81 Herblore (toadflax + crushed nest)', capability: true, img: 'Saradomin brew(4)',
    reqs: () => [ reqStat('Herblore', 81) ] },
  { name: 'Super combat potion', access: 6,  src: '90 Herblore', capability: true, img: 'Super combat potion(4)',
    reqs: () => [ reqStat('Herblore', 90) ] },
  { name: 'Super restore', access: 3.5,        src: '63 Herblore', capability: true, img: 'Super restore(4)',
    reqs: () => [ reqStat('Herblore', 63) ] },
  { name: 'Prayer potion', access: 2,        src: '38 Herblore', capability: true, img: 'Prayer potion(4)',
    reqs: () => [ reqStat('Herblore', 38) ] },
  { name: 'Stamina potion', access: 4.5,       src: '77 Herblore', capability: true, img: 'Stamina potion(4)',
    reqs: () => [ reqStat('Herblore', 77) ] },

  // ════════ WAVE 4b — SKILLCAPES (QoL-important only) ════════
  { name: 'Crafting cape', access: 7.5,        src: '99 Crafting', img: 'Crafting cape',
    matchAny: ['Crafting cape(t)','Crafting cape'], reqs: () => [ reqStat('Crafting', 99) ] },
  { name: 'Construction cape', access: 7.5,    src: '99 Construction', img: 'Construct. cape',
    matchAny: ['Construct. cape(t)','Construct. cape','Construction cape(t)','Construction cape'], reqs: () => [ reqStat('Construction', 99) ] },

  // ════════ MISC CAPES ════════
  { name: 'Max cape', access: 10,             src: 'All 99s', match: 'Max cape',
    reqs: () => [ reqOther('All skills 99', Object.values(state.character?.stats||{}).every(s => s.real_level >= 99)) ] },
];
