ItemEvents.modifyTooltips(event => {
    // The message displayed when Shift is not held
    const  shiftMessage = Text.join([
        Text.of('Hold [').darkGray(),
        Text.of('Shift').gray(),
        Text.of('] for Summary').darkGray()
    ]);
    const  heldShiftMessage = Text.join([
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

    event.modify('parcool:parcool_guide', tooltip => {
        tooltip.removeLine(1);
        tooltip.removeLine(1);
    })
    addShiftTooltip('parcool:parcool_guide', "Press [Use] to open Guide.\nPress [Crouch + Use] to open Skill Tree."); 

    // --- Armor ---
    addNormalTooltip('utopia:crown', 'Whoever owns this Crown rules the Realm'); 
    addNormalTooltip('utopia:shattering_crown', 'From another time.'); 
    addNormalTooltip('utopia:used_handcuffs', "It's hard to move your hands."); 
    addNormalTooltip('utopia:used_shackles', "It's hard to move in these."); 

    // --- Stamps ---
    addShiftTooltip('utopia:encoder_stamp', 'Used to split material into Minted Coins.'); 
    addShiftTooltip('utopia:decoder_stamp', 'Used to turn Minted Coins into material without loss.'); 
    addShiftTooltip('utopia:paper_stamp', 'Used to print any denomination Paper Money. Use sparingly!'); 

    // --- Chemistry ---
    addShiftTooltip('utopia:beaker_oxygen', "It feels completely empty, and doesn't smell."); 
    addShiftTooltip('utopia:beaker_hydrogen', "It feels really cold, and doesn't smell."); 
    addShiftTooltip('utopia:beaker_nitrogen', "It's almost invisible, but it feels cold to the touch."); 
    addShiftTooltip('utopia:beaker_ammonia', "It has a sharp, pungent smell."); 
    addShiftTooltip('utopia:beaker_nitric_acid', "Smells awful. I really wouldn't touch this."); 
    addShiftTooltip('utopia:beaker_bleach', "Touching it causes soap bubbles to appear on your hand."); 
    addShiftTooltip('utopia:beaker_propylene_glycol', "It looks thick and oily. Smells weirdly sweet."); 

    addShiftTooltip('oreganized:lead_bolt', "A stronger crossbow-exclusive arrow. Must be held in your offhand in order to be loaded."); 

    // --- FIAT Bills (Grouped) ---
    addShiftTooltip([
        'utopia:1_dollar_bill',
        'utopia:5_dollar_bill',
        'utopia:20_dollar_bill',
        'utopia:100_dollar_bill',
        'utopia:500_dollar_bill'
    ], 'See exchange rates using /Treasury exchange'); 

    // --- Coins ---
    addShiftTooltip('utopia:coin_netherite', 'Worth 1/8 Netherite Scrap each if Decoded.');
    addShiftTooltip('utopia:coin_netherite_fractional', 'Worth 1/16 Netherite Scrap each if Decoded.');
    addShiftTooltip('utopia:coin_diamond', 'Worth 1/8 Diamond each if Decoded.');
    addShiftTooltip('utopia:coin_diamond_fractional', 'Worth 1/16 Diamond each if Decoded.');
    addShiftTooltip('utopia:coin_iron', 'Worth 1/8 Iron each if Decoded.');
    addShiftTooltip('utopia:coin_iron_fractional', 'Worth 1/16 Iron each if Decoded.');

    // --- Blocks ---
    addNormalTooltip('utopia:block_of_hyper_capitalism', 'Worth R$D 12,500');
    addNormalTooltip('utopia:block_of_extreme_capitalism', 'Worth R$D 2,500');
    addNormalTooltip('utopia:block_of_high_capitalism', 'Worth R$D 500');
    addNormalTooltip('utopia:block_of_moderate_capitalism', 'Worth R$D 125');
    addNormalTooltip('utopia:block_of_capitalism', 'Worth R$D 25');
});