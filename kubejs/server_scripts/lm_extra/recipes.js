ServerEvents.recipes(event =>{
    const incomplete = 'create:incomplete_precision_mechanism'
    const create = event.recipes.create

    // 白丝
    create.sequenced_assembly('lm_extra:white_silk',
        'minecraft:string',
        [
            create.deploying(incomplete,[incomplete,'protection_pixel:reinforcedfiber']),
            create.deploying(incomplete,[incomplete,'biomancy:tough_fibers']),
            create.deploying(incomplete,[incomplete,'biomancy:elastic_fibers']),
            create.deploying(incomplete,[incomplete,'minecraft:white_dye']).keepHeldItem(),
            create.cutting(incomplete,incomplete),
            create.pressing(incomplete,incomplete)
        ]
    )
    .transitionalItem(incomplete)
    .loops(3)

    // 黑丝
    create.sequenced_assembly('lm_extra:black_silk',
        'minecraft:string',
        [
            create.deploying(incomplete,[incomplete,'protection_pixel:reinforcedfiber']),
            create.deploying(incomplete,[incomplete,'biomancy:tough_fibers']),
            create.deploying(incomplete,[incomplete,'biomancy:elastic_fibers']),
            create.deploying(incomplete,[incomplete,'minecraft:black_dye']).keepHeldItem(),
            create.cutting(incomplete,incomplete),
            create.pressing(incomplete,incomplete)
        ]
    )
    .transitionalItem(incomplete)
    .loops(3)


    // 鬼索的狂暴碎片
    create.mechanical_crafting('lm_extra:rage_blade',
        [
            "IBBI",
            "A  A",
            "C  C",
            "IBBI"
        ],
        {
            I:'minecraft:netherite_ingot',
            A:'cataclysm:ignitium_ingot',
            B:'pasterdream:moltengold_ingot',
            C:'kubejs:whetstone'
        }
    )

    // 彩虹宝石
    event.shaped('lm_extra:rainbow_gemstone',[
        ['cataclysm:witherite_ingot','cataclysm:ignitium_ingot','cataclysm:ancient_metal_ingot'],
        ['cataclysm:black_steel_ingot','cataclysm:cursium_ingot','art_of_forging:endsteel_ingot'],
        ['pasterdream:dream_aurorian_steel','','']
    ])
})