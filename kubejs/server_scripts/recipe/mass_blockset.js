ServerEvents.recipes(event => {
  const sets = global.BLOCKSETS || []
 
  sets.forEach(set => {
    const base = set.block
 
    if (set.stairs) {
      event.shaped(Item.of(set.stairs, 4), ['A  ', 'AA ', 'AAA'], { A: base })
      event.stonecutting(Item.of(set.stairs, 1), base)
    }
 
    if (set.slab) {
      event.shaped(Item.of(set.slab, 6), ['AAA'], { A: base })
      event.stonecutting(Item.of(set.slab, 2), base)
    }
 
    if (set.wall) {
      event.shaped(Item.of(set.wall, 6), ['AAA', 'AAA'], { A: base })
      event.stonecutting(Item.of(set.wall, 1), base)
    }
  })
})
 