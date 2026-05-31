ItemEvents.modifyTooltips(event => {
    event.modify("create_permits:ironpermit", text => {
        text.insert(1, Text.of('This holder is a cerified Lawyer').gray())
        text.insert(2, Text.of('recognized by the King.').gray())
    })
    event.modify("create_permits:gold_permit", text => {
        text.insert(1, Text.of('The holder of this permit').gray())
        text.insert(2, Text.of('may produce Firearms and Bombs.').gray())
    })
    event.modify("create_permits:diamondpermit", text => {
        text.insert(1, Text.of('This person, by order of the King can').gray())
        text.insert(2, Text.of('produce anything regardless of legality.').gray())
    })
})
