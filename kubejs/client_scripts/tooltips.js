ItemEvents.modifyTooltips(event => {
    // The message displayed when Shift is not held
    const shiftMessage = Text.join([
        Text.of('Hold [').darkGray(),
        Text.of('Shift').gray(),
        Text.of('] for Summary').darkGray()
    ]);
    const heldShiftMessage = Text.join([
        Text.of('Hold [').darkGray(),
        Text.of('Shift').white(),
        Text.of('] for Summary').darkGray()
    ]);

    // 1. Helper function for LONG descriptions (requires Shift)
    const addShiftTooltip = (itemFilter, tooltipText) => {
        // Triggered only when Shift is NOT held
        event.modify(itemFilter, { shift: false }, text => {
            text.insert(1, shiftMessage);
        });

        // Triggered only when Shift IS held
        event.modify(itemFilter, { shift: true }, text => {
            text.insert(1, heldShiftMessage);
            text.insert(2, '')
            text.insert(3, Text.of(tooltipText).color(0xc7954b));
        });
    };

    // 2. Helper function for SHORT descriptions (always visible)
    const addNormalTooltip = (itemFilter, tooltipText) => {
        event.modify(itemFilter, text => {
            text.insert(1, Text.of(tooltipText).gray());
        });
    };

    const addTemplateTooltip = (itemFilter, info) => {
        event.modify(itemFilter, text => {
            text.insert(1, Text.of(info.title).gray());
            text.insert(2, "");
            text.insert(3, Text.of('Applies to:').gray());
            text.insert(4, Text.of(' ' + info.appliesTo).blue());
            text.insert(5, Text.of('Ingredients:').gray());
            text.insert(6, Text.of(' ' + info.ingredients).blue());
        });
    };

    // Replace
    event.modify('parcool:parcool_guide', tooltip => {
        tooltip.removeLine(1);
    })
    addShiftTooltip('parcool:parcool_guide', "Press [Use] to open Guide.\nPress [Crouch + Use] to open Skill Tree.");

    // --- Armor ---
    addNormalTooltip('utopia:crown', 'Whoever owns this Crown rules the Realm');
    addNormalTooltip('utopia:shattering_crown', 'From another time.');
    addNormalTooltip('utopia:used_handcuffs', "It's hard to move your hands.");
    addNormalTooltip('utopia:used_shackles', "It's hard to move in these.");

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
    event.modify('utopia:circuit_upgrade_template', text => {
        text.insert(1, Text.of('Chip Upgrade').gray());
        text.insert(2, "");
        text.insert(3, Text.of('Applies to:').gray());
        text.insert(4, Text.of(' Circuits').blue());
    })

    addShiftTooltip('utopia:computer_block', "A Program can be selected in the crafting grid.\n\nCan be Sold, but otherwise acts as decoration.");
    addShiftTooltip('utopia:computer_block_terminal', "Program: Await input.\n\nCan be Sold, but otherwise acts as decoration.");
    addShiftTooltip('utopia:computer_block_coding', "Program: Text Editor.\n\nCan be Sold, but otherwise acts as decoration.");
    addShiftTooltip('utopia:computer_block_data', "Program: Crunching numbers.\n\nCan be Sold, but otherwise acts as decoration.");
    addShiftTooltip('utopia:computer_block_space', "Program: Decode signals.\n\nCan be Sold, but otherwise acts as decoration.");
    addShiftTooltip('utopia:computer_block_badsignal', "Program: Destroy the signal.\n\nCan be Sold, but otherwise acts as decoration.");
    addShiftTooltip('utopia:broken_computer', "Destroyed.\n\nCan't be Sold, but otherwise acts as decoration.");

    addShiftTooltip('oreganized:lead_bolt', "A stronger, crossbow-exclusive arrow. Must be held in your offhand in order to be loaded.");


    addShiftTooltip('vc_gliders:copper_upgrade', "Protects gliders from extreme weather.\n\nCan be applied at an Anvil.");
    addShiftTooltip('vc_gliders:nether_upgrade', "Protects gliders from extreme heat.\n\nCan be applied at an Anvil.");


    addShiftTooltip('utopia:soul_token', "A piece of you. Best to keep this very, very safe.");
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

    event.add(Text.gray('Destination - ').append(
        name ? Text.gold(name) : Text.darkGray('Unknown')
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

    if (worth.each) event.add(Text.gray('Worth ' + worth.each + (worth.post || '') + ' each'))

    event.add(Text.gold(
        'Stack Total: ' + (worth.pre || '') + formatAmount(item.count * worth.n / worth.d) + (worth.post || '')
    ))
})