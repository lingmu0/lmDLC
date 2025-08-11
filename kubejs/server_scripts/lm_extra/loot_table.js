ServerEvents.entityLootTables(event =>{
    event.modifyEntity('minecraft:cat', loot => {
        loot.addPool(pool => {
            pool.addItem('lm_extra:maodie_breathe_out')
        })
    })
    event.modifyEntity('minecraft:horse', loot => {
        loot.addPool(pool => {
            pool.addItem('lm_extra:manbo').weight(10)
            pool.addEmpty(90)
        })
    })
    event.modifyEntity('minecraft:wandering_trader', loot => {
        loot.addPool(pool => {
            pool.addItem('lm_extra:gambling').weight(5)
            pool.addEmpty(95)
        })
    })
})