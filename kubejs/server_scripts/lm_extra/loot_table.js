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
    event.modifyEntity('jerotesvillage:second_rounder_golem', loot => {
        loot.addPool(pool => {
            pool.addItem('lm_extra:final_metal_ingot').count([3, 5])
        })
    })
})

ServerEvents.chestLootTables(event=>{
    event.modify("twilightforest:stronghold_boss",loot=>{
        loot.addPool(pool=>{
            pool.addItem("twilightforest:knightmetal_block").count(2)
        })
    })
})