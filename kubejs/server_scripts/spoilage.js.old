const SPOIL_MS = 3 * 24 * 60 * 60 * 1000 // 3 real days
const STAMP_GRANULARITY_MS = 60 * 1000   // round down to the minute so fresh items still stack
const IGNORE_TAG = 'utopia:spoil_ignore'

const SPOILED_FOOD = {
  nutrition: 0,
  saturation: 0,
  can_always_eat: true,
  eat_seconds: 1.6,
  effects: [
    { effect: { id: 'minecraft:hunger', duration: 600, amplifier: 1 }, probability: 1.0 },
    { effect: { id: 'minecraft:poison', duration: 100, amplifier: 0 }, probability: 0.5 }
  ]
}

function isTracked(stack) {
  return !stack.empty && stack.has('minecraft:food') && !stack.hasTag(IGNORE_TAG)
}

function getTag(stack) {
  const cd = stack.get('minecraft:custom_data')
  return cd ? cd.copyTag() : NBT.compoundTag()
}

// Spoiled food for this stack, keeping whatever it turns into when eaten (e.g. stew -> bowl)
function spoiledFoodFor(stack) {
  const converts = stack.get('minecraft:food').usingConvertsTo()
  if (!converts.isPresent()) return SPOILED_FOOD
  return Object.assign({}, SPOILED_FOOD, { using_converts_to: { id: converts.get().id } })
}

// Writes a creation date into an already-fetched tag and saves it to the stack
function applyStamp(stack, tag) {
  const now = Date.now()
  tag.putLong('created_at', now - (now % STAMP_GRANULARITY_MS))
  stack.set('minecraft:custom_data', tag)
}

// Assign a creation date if the stack doesn't have one
function stamp(stack) {
  if (!isTracked(stack)) return
  const tag = getTag(stack)
  if (!tag.contains('created_at')) applyStamp(stack, tag)
}

// Stamp at creation
ItemEvents.crafted(event => stamp(event.item))
ItemEvents.smelted(event => stamp(event.item))

// Check only when the player tries to eat
ItemEvents.rightClicked(event => {
  if (event.level.clientSide) return
  const stack = event.item
  if (!isTracked(stack)) return

  const tag = getTag(stack)
  if (tag.getBoolean('spoiled')) return

  // Food that never got a date (chest loot, commands, etc.) starts its clock now
  if (!tag.contains('created_at')) {
    applyStamp(stack, tag)
    return
  }

  if (Date.now() - tag.getLong('created_at') > SPOIL_MS) {
    // Build the spoiled food before touching the stack, while the original component is still readable
    const spoiledFood = spoiledFoodFor(stack)
    tag.putBoolean('spoiled', true)
    stack.set('minecraft:custom_data', tag)
    stack.set('minecraft:food', spoiledFood)
  }
})