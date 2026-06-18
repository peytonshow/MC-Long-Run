// This MUST go in kubejs/startup_scripts/
// To see changes, you must close and restart the Minecraft client entirely!

StartupEvents.modifyCreativeTab('minecraft:tools_and_utilities', event => {
    event.addAfter('minecraft:stone_hoe', [
        'minecraft:copper_hoe',
        'minecraft:copper_axe',
        'minecraft:copper_pickaxe',
        'minecraft:copper_shovel'

    ])
})

StartupEvents.modifyCreativeTab('minecraft:combat', event => {
    event.addAfter('minecraft:stone_sword', [
        'minecraft:copper_sword'
    ])
    event.addAfter('minecraft:stone_axe',[
        'minecraft:copper_axe'
    ])
})


StartupEvents.modifyCreativeTab('kubejs:kubejs', event => {
	event.remove(['utopia:incomplete_netherite_boots','utopia:incomplete_netherite_leggings', 'utopia:incomplete_netherite_chestplate', 'utopia:incomplete_netherite_helmet'])
})