ServerEvents.entityLootTables(event =>{
    event.modifyEntity('minecraft:cat', loot => {
        loot.addPool(pool => {
            pool.addItem('lm_extra:maodie_breathe_out')
        })
    })
})