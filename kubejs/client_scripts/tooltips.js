// ---------- Colors (sampled from Create's tooltip screenshot) ----------
const C = {
    base:          0xc7954b, // summary / behaviour text
    highlight:     0xeeda78, // _highlighted_ words in gold text
    gray:          0xa8a8a8, // gray text
    grayHighlight: 0xfcfcfc, // _highlighted_ words in gray text
    darkGray:      0x545454, // "Hold [", "] for Summary"
    white:         0xfcfcfc  // "Shift" when held
};
const CREATE_WIDTH = 42; // wrap width in characters; tweak to taste

ItemEvents.modifyTooltips(event => {
    const shiftMessage = Text.join([
        Text.of('Hold [').color(C.darkGray),
        Text.of('Shift').color(C.gray),
        Text.of('] for Summary').color(C.darkGray)
    ]);
    const heldShiftMessage = Text.join([
        Text.of('Hold [').color(C.darkGray),
        Text.of('Shift').color(C.white),
        Text.of('] for Summary').color(C.darkGray)
    ]);

    // ---------- Create-style text engine ----------
    // "_Rotates components_ around" -> words, each a list of {t, hl} pieces
    const parseWords = (str) => {
        const words = [[]];
        str.split('_').forEach((seg, i) => {
            const hl = i % 2 === 1;
            seg.split(' ').forEach((part, j) => {
                if (j > 0) words.push([]);
                if (part.length) words[words.length - 1].push({ t: part, hl: hl });
            });
        });
        return words.filter(w => w.length);
    };

    // Word-wraps text (supports \n and _highlights_) into Text lines.
    // colors = { base, hl } so it works for both gold and gray text.
    const createLines = (str, colors, indent) => {
        const lines = [];
        const pad = indent || '';
        str.split('\n').forEach(paragraph => {
            if (paragraph === '') { lines.push(Text.of('')); return; }

            let cur = [], len = 0;
            const flush = () => {
                const line = Text.of(pad).color(colors.base);
                cur.forEach(p => line.append(Text.of(p.t).color(p.hl ? colors.hl : colors.base)));
                lines.push(line);
                cur = []; len = 0;
            };

            parseWords(paragraph).forEach(word => {
                const wl = word.reduce((a, p) => a + p.t.length, 0);
                if (cur.length && len + 1 + wl > CREATE_WIDTH) flush();
                if (cur.length) { cur.push({ t: ' ', hl: false }); len++; }
                word.forEach(p => cur.push(p));
                len += wl;
            });
            if (cur.length) flush();
        });
        return lines;
    };

    const GOLD = { base: C.base, hl: C.highlight };
    const GRAY = { base: C.gray, hl: C.grayHighlight };

    // ---------- Helpers (all use the Create style) ----------

    // The one tooltip helper: Create-style, with optional "When used on ..." sections.
    /*
     info = {
       title:      'Gray line shown above the summary (optional)',
       summary:    'Gold text, supports _highlights_ and \n',
       conditions: [{ condition: 'When used on _Blocks_', behavior: 'Gold, indented text' }],
       notes:      ['Gray text, supports _highlights_ (optional, shown at the end)']
     }
    */
    const addCreateTooltip = (itemFilter, info) => {
        event.modify(itemFilter, { shift: false }, text => {
            text.insert(1, shiftMessage);
        });
        event.modify(itemFilter, { shift: true }, text => {
            let i = 1;
            text.insert(i++, heldShiftMessage);
            text.insert(i++, '');

            if (info.title) createLines(info.title, GRAY).forEach(l => text.insert(i++, l));
            if (info.summary) createLines(info.summary, GOLD).forEach(l => text.insert(i++, l));

            (info.conditions || []).forEach(c => {
                text.insert(i++, '');
                createLines(c.condition, GRAY).forEach(l => text.insert(i++, l));
                if (c.behavior) createLines(c.behavior, GOLD, ' ').forEach(l => text.insert(i++, l));
            });

            if ((info.notes || []).length) {
                text.insert(i++, '');
                info.notes.forEach(n => createLines(n, GRAY).forEach(l => text.insert(i++, l)));
            }
        });
    };

    // ---------- Helpers: every one uses the Create formatting engine ----------
    // All text supports \n, word wrapping and _highlighted_ words.

    // Standard Create tooltip for any item: "Hold [Shift] for Summary", gold text on Shift.
    const addShiftTooltip = (itemFilter, tooltipText) => {
        addCreateTooltip(itemFilter, { summary: tooltipText });
    };

    // Template style: title, then "Applies to" / "Ingredients" (always visible).
    // info = { title, appliesTo, ingredients } - every field supports _highlights_.
    const addTemplateTooltip = (itemFilter, info) => {
        event.modify(itemFilter, text => {
            let i = 1;
            createLines(info.title, GOLD).forEach(l => text.insert(i++, l));
            text.insert(i++, '');
            text.insert(i++, Text.of('Applies to:').color(C.gray));
            createLines(info.appliesTo, GOLD, ' ').forEach(l => text.insert(i++, l));
            if (info.ingredients) {
                text.insert(i++, Text.of('Ingredients:').color(C.gray));
                createLines(info.ingredients, GOLD, ' ').forEach(l => text.insert(i++, l));
            }
        });
    };

    // Replace
    event.modify('parcool:parcool_guide', tooltip => {
        tooltip.removeLine(1);
    })
    addShiftTooltip('parcool:parcool_guide', "Press _[Use]_ to open Guide.\nPress _[Crouch + Use]_ to open Skill Tree.");

    // --- Armor ---
    addShiftTooltip('utopia:crown', 'Whoever owns this _Crown_ rules the Realm');
    addShiftTooltip('utopia:shattering_crown', 'From another time.');
    addShiftTooltip('utopia:used_handcuffs', "It's hard to move your hands.");
    addShiftTooltip('utopia:used_shackles', "It's hard to move in these.");

    // --- Stamps ---
    // addShiftTooltip('utopia:encoder_stamp', 'Used to split material into Minted Coins.');
    // addShiftTooltip('utopia:decoder_stamp', 'Used to turn Minted Coins into material without loss.');
    // addShiftTooltip('utopia:paper_stamp', 'Used to print any denomination Paper Money. Use sparingly!');

    // --- Chemistry ---
    addShiftTooltip('utopia:beaker_oxygen', "It feels completely empty, and doesn't smell.");
    addShiftTooltip('utopia:beaker_hydrogen', "It feels really cold, and doesn't smell.");
    addShiftTooltip('utopia:beaker_nitrogen', "It's almost invisible, but it feels cold to the touch.");
    addShiftTooltip('utopia:beaker_ammonia', "It has a sharp, pungent smell.");
    addShiftTooltip('utopia:beaker_nitric_acid', "Smells awful. I really wouldn't touch this.");
    addShiftTooltip('utopia:beaker_bleach', "Touching it causes soap bubbles to appear on your hand.");
    addShiftTooltip('utopia:beaker_propylene_glycol', "It looks thick and oily. Smells weirdly sweet.");

    // --- Computers ---
    addTemplateTooltip('utopia:circuit_upgrade_template', {
        title: 'Chip Upgrade',
        appliesTo: '_Circuits_'
    });

    addShiftTooltip('utopia:computer_block', "A _Program_ can be selected in the crafting grid.\n\nCan be _Sold_, but otherwise acts as decoration.");
    addShiftTooltip('utopia:computer_block_terminal', "Program: Await input.\n\nCan be _Sold_, but otherwise acts as decoration.");
    addShiftTooltip('utopia:computer_block_coding', "Program: Text Editor.\n\nCan be _Sold_, but otherwise acts as decoration.");
    addShiftTooltip('utopia:computer_block_data', "Program: Crunching numbers.\n\nCan be _Sold_, but otherwise acts as decoration.");
    addShiftTooltip('utopia:computer_block_space', "Program: Decode signals.\n\nCan be _Sold_, but otherwise acts as decoration.");
    addShiftTooltip('utopia:computer_block_badsignal', "Program: Destroy the signal.\n\nCan be _Sold_, but otherwise acts as decoration.");
    addShiftTooltip('utopia:broken_computer', "Destroyed.\n\nCan't be Sold, but otherwise acts as decoration.");

    addShiftTooltip('oreganized:lead_bolt', "A stronger, _crossbow-exclusive_ arrow. Must be held in your _offhand_ in order to be loaded.");


    addShiftTooltip('vc_gliders:copper_upgrade', "Protects gliders from _extreme weather_.\n\nCan be applied at an _Anvil_.");
    addShiftTooltip('vc_gliders:nether_upgrade', "Protects gliders from _extreme heat_.\n\nCan be applied at an _Anvil_.");


    addShiftTooltip('utopia:soul_token', "A piece of your presence in this world. Best to keep this very, very safe.");

    addCreateTooltip('utopia:hammer', {
        summary: 'Allows you to modify the state of _Walls_, _Fences_, _Panes_, _Trapdoors_ and _Lamps_.',
        conditions: [
            {
                condition: 'When used on Blocks',
                behavior: '_Right Click_ to modify. _Crouch + Left Click_ to save state. _Crouch + Right Click_ to apply state.'
            }
        ]
    });
});

ItemEvents.modifyTooltips(event => {
    event.modify('utopia:recall_potion', tooltip => {
        tooltip.dynamic('recall_potion_destination')
    })
})

ItemEvents.dynamicTooltips('recall_potion_destination', event => {
    const data = event.item.customData
    const npc = event.item.save(Client.level.registryAccess()).getCompound('components').getCompound('easy_npc:custom_data')
    const name = data && data.contains('name') ? data.getString('name') : npc.getString('name')

    event.add(Text.of('Destination - ').color(C.base).append(
        Text.of(name ? name : 'Unknown').color(C.highlight)
    ))
})


const WORTHABLES = {
    // Coins
    'utopia:coin_scrap':              { n: 1, d: 8,  post: ' Debris',   each: '1/8' },
    'utopia:coin_scrap_fractional':   { n: 1, d: 16, post: ' Debris',   each: '1/16' },
    'utopia:coin_diamond':            { n: 1, d: 8,  post: ' Diamond',  each: '1/8' },
    'utopia:coin_diamond_fractional': { n: 1, d: 16, post: ' Diamond',  each: '1/16' },
    'utopia:coin_iron':               { n: 1, d: 2,  post: ' Iron',     each: '1/2' },
    'utopia:coin_iron_fractional':    { n: 1, d: 4,  post: ' Iron',     each: '1/4' },

    // Bills
    'utopia:1_dollar_bill':   { n: 1,   d: 1, pre: '$' },
    'utopia:5_dollar_bill':   { n: 5,   d: 1, pre: '$' },
    'utopia:20_dollar_bill':  { n: 20,  d: 1, pre: '$' },
    'utopia:100_dollar_bill': { n: 100, d: 1, pre: '$' },
    'utopia:500_dollar_bill': { n: 500, d: 1, pre: '$' },

    // Capitalism blocks
    'utopia:block_of_hyper_capitalism':    { n: 12500, d: 1, pre: '$ ' },
    'utopia:block_of_extreme_capitalism':  { n: 2500,  d: 1, pre: '$ ' },
    'utopia:block_of_high_capitalism':     { n: 500,   d: 1, pre: '$ ' },
    'utopia:block_of_moderate_capitalism': { n: 125,   d: 1, pre: '$ ' },
    'utopia:block_of_capitalism':          { n: 25,    d: 1, pre: '$ ' }
}

function formatAmount(n) {
    const [whole, fraction] = String(Math.round(n * 1000) / 1000).split('.')
    return whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (fraction ? '.' + fraction : '')
}

// Attach the dynamic handler to every worthable
ItemEvents.modifyTooltips(event => {
    Object.keys(WORTHABLES).forEach(id => {
        event.modify(id, tooltip => {
            tooltip.dynamic('utopia_worthable')
        })
    })
})

ItemEvents.dynamicTooltips('utopia_worthable', event => {
    const { item } = event
    const worth = WORTHABLES[String(item.id)]
    if (!worth) return

    if (worth.each) event.add(Text.of('Worth ' + worth.each + (worth.post || '') + ' each').color(C.base))

    event.add(Text.of('Stack Total: ').color(C.base).append(
        Text.of((worth.pre || '') + formatAmount(item.count * worth.n / worth.d) + (worth.post || '')).color(C.highlight)
    ))
})