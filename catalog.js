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
  { name: 'Fire cape',            src: 'TzHaar Fight Cave' },
  { name: 'Barrows gloves',       src: 'Recipe for Disaster' },
  { name: 'Quest point cape',     src: 'All quests complete', match: 'Quest point cape' },
  { name: 'Rune pouch',           src: 'Slayer / LMS / Wintertodt', match: 'Rune pouch' },
  { name: 'Divine rune pouch',    src: 'Upgrade Rune pouch w/ Thread of Elidinis (ToA), 75 Craft', match: 'Divine rune pouch',
    reqs: () => [ reqStatBoostable('Crafting', 75, 'crafting_pie'), reqOther('Rune pouch owned', hasItem('Rune pouch')), reqOther('ToA access (Beneath Cursed Sands)', hasQuest('Beneath Cursed Sands')) ] },
  { name: "Ava's accumulator",    src: 'Animal Magnetism' },
  { name: "Ava's assembler",      src: 'Vorkath head + accumulator' },
  { name: 'Berserker ring (i)',   src: 'Dagannoth Rex + imbue', match: 'erserker ring (i)' },
  { name: 'Salve amulet(ei)',     src: 'Haunted Mine + Tarn diary + imbue', match: 'Salve amulet(ei)' },
  { name: 'Amulet of glory',      src: 'Edgeville lvl-3 / Heroes Quest', match: 'mulet of glory' },
  { name: 'Elite void (set)',     src: 'Pest Control + Hard Western diary', img: 'Elite void top',
    matchAll: ['Elite void top', 'Elite void robe', 'Void knight gloves', 'Void melee helm'],
    reqs: () => [
      reqOther('Base Void top owned', hasItem('Void knight top')),
      reqOther('Base Void robe owned', hasItem('Void knight robe')),
      reqOther('Hard Western Provinces diary', hasDiary('Western Provinces', 'hard')),
      reqStat('Defence', 42), reqStat('Ranged', 42), reqStat('Magic', 42)
    ] },
  { name: 'Toxic blowpipe',       src: 'Zulrah', img: 'Toxic blowpipe', match: 'blowpipe' },
  { name: 'Bow of faerdhinen',    src: 'Corrupted Gauntlet (seed)', img: 'Bow of faerdhinen (c)', match: 'aerdhinen' },
  { name: 'Rune crossbow',        src: 'Fletch / Armadyl crossbow path', match: 'Rune crossbow' },
  { name: 'Dragon scimitar',      src: 'Monkey Madness I',
    reqs: () => [ reqStat('Attack', 60), reqOther('Quest: Monkey Madness I', hasQuest('Monkey Madness I')) ] },
  { name: 'Dragon defender',      src: "Warriors' Guild",
    reqs: () => [ reqStat('Attack', 60), reqStat('Defence', 60), reqOther("Warriors' Guild access (combined 130+)", (getLevel('Attack') + getLevel('Strength')) >= 130) ] },
  { name: 'Abyssal whip',         src: 'Abyssal demons (85 Slayer)' },
  { name: 'Arkan blade',          src: 'The Final Dawn (quest)' },
  { name: 'Zombie axe',           src: 'Armoured zombies (broken axe)' },
  { name: 'Warped sceptre',       src: 'Warped creatures (56 Slayer)', match: 'Warped sceptre' },
  { name: 'Dragon boots',         src: 'Spiritual mages' },
  { name: 'Trident of the seas',  src: 'Cave krakens / Kraken boss', match: 'rident of the seas' },
  { name: 'Dragon axe',           src: 'Dagannoth Kings / WC guild', matchAny: ['Dragon axe', 'Dragon felling axe'] },
  // matchAny: owned if ANY variant is held. Note hasItem() is already substring-based,
  // so "(or)"/"(upgraded)" suffixes are caught by the base name — but listing them
  // makes the intent explicit and survives any future change to match logic.
  { name: 'Dragon pickaxe',       src: "Calvar'ion (~1/358)", matchAny: ['Dragon pickaxe', 'Dragon pickaxe (or)', 'Dragon pickaxe (upgraded)'] },
  // Collection-log completion, NOT a single bank item — see note. Detected only if
  // every Perilous Moons unique is currently in the bank/equipment (a weak proxy).
  { name: 'Moons of Peril (log)', src: 'Perilous Moons — full collection log', img: 'Dual macuahuitl',
    matchAll: ['Blood moon helm','Blood moon chestplate','Blood moon tassets','Blue moon helm','Blue moon chestplate','Blue moon tassets','Eclipse moon helm','Eclipse moon chestplate','Eclipse moon tassets','Dual macuahuitl','Blue moon spear','Eclipse atlatl'] },

  // ════════ WAVE 1 — COMBAT GEAR ════════
  { name: 'Amulet of fury',       src: 'Onyx + 90 Craft', match: 'mulet of fury' },
  { name: 'Occult necklace',      src: 'Smoke devils', match: 'Occult necklace' },
  { name: 'Amulet of rancour',    src: 'Combine torture + components', match: 'mulet of rancour' },
  { name: 'Primordial boots',     src: 'Cerberus (primordial crystal)', match: 'Primordial boots' },
  { name: 'Bandos godsword',      src: 'GWD — Bandos', match: 'Bandos godsword' },
  { name: 'Zamorakian hasta',     src: 'GWD — Zamorak spear, reforge', match: 'Zamorakian hasta' },
  { name: 'Dragon warhammer',     src: 'Lizardman shamans' },
  { name: 'Dragon hunter lance',  src: 'Vorkath (hydra claw path)', match: 'Dragon hunter lance' },
  { name: 'Noxious halberd',      src: "Araxxor (noxious components)", match: 'Noxious halberd' },
  { name: 'Dragon dagger',        src: 'Lost City', img: 'Dragon dagger', matchAny: ['Dragon dagger(p++)','Dragon dagger'] },
  { name: 'Bone dagger',          src: 'The General (Chaos Tunnels)', img: 'Bone dagger', matchAny: ['Bone dagger(p++)','Bone dagger'] },
  { name: 'Twinflame staff',      src: 'Royal Titans' },
  { name: 'Emberlight',           src: 'Tormented Demons (synapse + Arclight)', match: 'Emberlight' },
  { name: 'Scorching bow',        src: 'Tormented Demons (synapse + magic longbow)', match: 'Scorching bow' },
  { name: 'Purging staff',        src: 'Tormented Demons (synapse + battlestaff)', match: 'Purging staff' },
  { name: "Hunters' sunlight crossbow", src: 'Sunlight cbow (Hunter Guild)', match: 'unlight crossbow' },
  { name: 'Dorgeshuun crossbow',  src: 'Death to the Dorgeshuun', match: 'Dorgeshuun crossbow' },
  { name: 'Helm of neitiznot',    src: 'The Fremennik Isles', match: 'elm of neitiznot' },
  { name: 'Fighter torso',        src: 'Barbarian Assault', match: 'Fighter torso' },
  { name: 'Obsidian cape',        src: 'TzHaar (tokkul)', match: 'Obsidian cape' },
  { name: 'Infernal cape',        src: 'The Inferno', match: 'Infernal cape' },
  { name: 'Slayer helmet',        src: 'Slayer (combine masks)', img: 'Slayer helmet', matchAny: ['Slayer helmet (i)','Slayer helmet'] },

  // ── combat armour SETS (matchAll; icon = head/iconic piece) ──
  { name: 'Ancestral robes',      src: 'Chambers of Xeric', img: 'Ancestral hat',
    matchAll: ['Ancestral hat','Ancestral robe top','Ancestral robe bottom'] },
  { name: 'Virtus robes',         src: "Desert Treasure II bosses", img: 'Virtus mask',
    matchAll: ['Virtus mask','Virtus robe top','Virtus robe bottom'] },
  { name: 'Bloodbark armour',     src: 'Runecraft (blood runes / Vyrewatch)', img: 'Bloodbark helm',
    matchAll: ['Bloodbark helm','Bloodbark body','Bloodbark legs'] },

  // ════════ WAVE 2 — SKILLING OUTFITS (sets; icon follows owned variant or head) ════════
  { name: 'Graceful outfit',      src: 'Agility (Marks of Grace)', img: 'Graceful hood',
    matchAll: ['Graceful hood','Graceful top','Graceful legs','Graceful gloves','Graceful boots','Graceful cape'] },
  { name: 'Rogue equipment',      src: "Rogues' Den", img: 'Rogue mask',
    matchAll: ['Rogue mask','Rogue top','Rogue trousers','Rogue gloves','Rogue boots'] },
  { name: 'Anglers outfit',       src: 'Fishing Trawler / Tempoross upgrade', img: 'Angler hat',
    matchAny: ['Spirit angler top','Angler top','Spirit angler hat','Angler hat'],
    matchAll: ['Angler hat','Angler top','Angler waders','Angler boots'] },
  { name: 'Prospector kit',       src: 'Motherlode Mine (nuggets)', img: 'Prospector helmet',
    matchAll: ['Prospector helmet','Prospector jacket','Prospector legs','Prospector boots'] },
  { name: "Smiths uniform",       src: 'Giants Foundry', img: 'Smiths tunic',
    matchAll: ['Smiths tunic','Smiths trousers','Smiths boots','Smiths gloves','Smiths hat'] },
  { name: "Carpenter's outfit",   src: 'Mahogany Homes', img: "Carpenter's helmet",
    matchAll: ["Carpenter's helmet","Carpenter's shirt","Carpenter's trousers","Carpenter's boots"] },
  { name: 'Raiments of the Eye',  src: 'Guardians of the Rift', img: 'Hat of the eye',
    matchAll: ['Hat of the eye','Robe top of the eye','Robe bottoms of the eye','Boots of the eye'] },
  { name: "Farmers outfit",       src: 'Tithe Farm', img: "Farmer's strawhat",
    matchAll: ["Farmer's strawhat",'Farmers jacket','Farmers boro trousers','Farmers boots'] },
  { name: 'Guild hunter outfit',  src: 'Hunter Guild (Quetzal)', img: 'Guild hunter headwear',
    matchAll: ['Guild hunter headwear','Guild hunter top','Guild hunter legs','Guild hunter boots'] },
  { name: 'Lumberjack outfit',    src: 'Forestry / Temple Trekking', img: 'Lumberjack hat',
    matchAny: ['Forestry hat','Lumberjack hat','Forestry top','Lumberjack top'],
    matchAll: ['Lumberjack hat','Lumberjack top','Lumberjack legs','Lumberjack boots'] },
  { name: "Zealots robes",        src: 'Shades of Mort\'ton', img: "Zealot's helm",
    matchAll: ["Zealot's helm","Zealot's robe top","Zealot's robe bottom","Zealot's boots"] },

  // ════════ WAVE 3 — QoL / UTILITY ════════
  { name: 'Ardougne cloak',       src: 'Ardougne Diary', img: 'Ardougne cloak 4', match: 'Ardougne cloak' },
  { name: 'Varrock armour',       src: 'Varrock Diary', img: 'Varrock armour 3', match: 'Varrock armour' },
  { name: 'Tackle box',           src: 'Tempoross', match: 'Tackle box' },
  { name: 'Fish barrel',          src: 'Tempoross', img: 'Fish barrel', matchAny: ['Fish sack barrel','Fish barrel'] },
  { name: 'Coal bag',             src: 'Motherlode Mine / Prospector', match: 'Coal bag' },
  { name: 'Gem bag',              src: 'Motherlode Mine', match: 'Gem bag' },
  { name: 'Plank sack',           src: 'Mahogany Homes', match: 'Plank sack' },
  { name: "Amy's saw",            src: 'Mahogany Homes', match: "Amy's saw" },
  { name: 'Imcando hammer',       src: 'Perilous Moons (locked off)', match: 'Imcando hammer' },
  { name: 'Colossal pouch',       src: 'Guardians of the Rift (stitch 4 pouches)', img: 'Colossal pouch', match: 'Colossal pouch' },
  { name: 'Ring of endurance',    src: 'Hallowed Sepulchre', match: 'Ring of endurance' },
  { name: 'Cooking gauntlets',    src: 'Family Crest', img: 'Cooking gauntlets', matchAny: ['Cooking gauntlets','Gauntlets of cooking'] },
  { name: 'Magic secateurs',      src: 'Fairytale I', match: 'Magic secateurs' },
  { name: 'Herb sack',            src: 'Slayer Masters / Soul Wars', img: 'Herb sack', matchAny: ['Silklined herb sack','Herb sack'] },
  { name: 'Seed box',             src: 'Tithe Farm / Trekking', match: 'Seed box' },
  { name: 'Bottomless compost bucket', src: 'Tithe Farm', match: 'Bottomless compost bucket' },
  { name: 'Fletching knife',      src: "Forestry", match: 'Fletching knife' },
  { name: 'Bow string spool',     src: 'Forestry', img: 'Bow string spool', match: 'tring spool' },
  { name: 'Reagent pouch',        src: 'Mastering Mixology', match: 'Reagent pouch' },
  { name: 'Prescription goggles', src: 'Mastering Mixology', img: 'Prescription goggles (focused)', match: 'Prescription goggles' },
  { name: 'Celestial ring',       src: 'Volcanic Mine', img: 'Celestial ring', matchAny: ['Celestial signet','Celestial ring (uncharged)','Celestial ring'] },
  { name: 'Expert mining gloves', src: 'Mining Guild (unidentified minerals)', match: 'Expert mining gloves' },
  { name: 'Log basket',           src: 'Forestry', img: 'Log basket', matchAny: ['Forestry basket','Log basket'] },
  { name: 'Amulet of bounty',     src: 'Tithe Farm', match: 'Amulet of bounty' },
  { name: 'Horn of plenty',       src: 'Forestry (anima bark)', match: 'Horn of plenty' },

  // ════════ WAVE 4 — CAPABILITY TILES (access/ability, never "owned") ════════
  // status comes purely from reqs; capability:true keeps them out of the owned count
  { name: 'Ornate rejuvenation pool', src: 'POH — 90 Con + 87 Herb', capability: true,
    img: 'Ornate rejuvenation pool icon',
    reqs: () => [ reqStatBoostable('Construction', 90, 'construction_saw_tea'), reqStatBoostable('Herblore', 87, 'crafting_pie') ] },
  { name: 'Bones to Peaches',     src: 'MTA (Telekinetic + points)', capability: true, img: 'Peach',
    reqs: () => [ reqStat('Magic', 60) ] },
  { name: 'Saradomin brew',       src: '81 Herblore (toadflax + crushed nest)', capability: true, img: 'Saradomin brew(4)',
    reqs: () => [ reqStat('Herblore', 81) ] },
  { name: 'Super combat potion',  src: '90 Herblore', capability: true, img: 'Super combat potion(4)',
    reqs: () => [ reqStat('Herblore', 90) ] },
  { name: 'Super restore',        src: '63 Herblore', capability: true, img: 'Super restore(4)',
    reqs: () => [ reqStat('Herblore', 63) ] },
  { name: 'Prayer potion',        src: '38 Herblore', capability: true, img: 'Prayer potion(4)',
    reqs: () => [ reqStat('Herblore', 38) ] },
  { name: 'Stamina potion',       src: '77 Herblore', capability: true, img: 'Stamina potion(4)',
    reqs: () => [ reqStat('Herblore', 77) ] },

  // ════════ WAVE 4b — SKILLCAPES (QoL-important only) ════════
  { name: 'Crafting cape',        src: '99 Crafting', img: 'Crafting cape',
    matchAny: ['Crafting cape(t)','Crafting cape'], reqs: () => [ reqStat('Crafting', 99) ] },
  { name: 'Construction cape',    src: '99 Construction', img: 'Construct. cape',
    matchAny: ['Construct. cape(t)','Construct. cape','Construction cape(t)','Construction cape'], reqs: () => [ reqStat('Construction', 99) ] },

  // ════════ MISC CAPES ════════
  { name: 'Max cape',             src: 'All 99s', match: 'Max cape',
    reqs: () => [ reqOther('All skills 99', Object.values(state.character?.stats||{}).every(s => s.real_level >= 99)) ] },
];
