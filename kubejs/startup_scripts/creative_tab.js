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
	event.remove('utopia:incomplete_netherite_boots','utopia:incomplete_netherite_leggings', 'utopia:incomplete_netherite_chestplate', 'utopia:incomplete_netherite_helmet')
})

StartupEvents.modifyCreativeTab('minecraft:food_and_drinks', event => {
    event.addAfter('minecraft:cooked_beef',['utopia:seasoned_cooked_beef'])
    event.addAfter('minecraft:cooked_porkchop',['utopia:seasoned_cooked_porkchop'])
    event.addAfter('minecraft:cooked_chicken',['utopia:seasoned_cooked_chicken'])
    event.addAfter('minecraft:cooked_mutton',['utopia:seasoned_cooked_mutton'])
    event.addAfter('minecraft:cooked_rabbit',['utopia:seasoned_cooked_rabbit'])

    event.addAfter('utopia:seasoned_cooked_rabbit',['naturalist:bushmeat'])
    event.addAfter('naturalist:bushmeat',['naturalist:cooked_bushmeat'])
    event.addAfter('naturalist:cooked_bushmeat',['utopia:seasoned_cooked_bushmeat'])
})

