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
            create.deploying(incomplete,[incomplete,'minecraft:white_dye']),
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
            create.deploying(incomplete,[incomplete,'minecraft:black_dye']),
            create.cutting(incomplete,incomplete),
            create.pressing(incomplete,incomplete)
        ]
    )
    .transitionalItem(incomplete)
    .loops(3)

    // 珠光护手
    create.sequenced_assembly('lm_extra:pearlescent_hand_protection',
        'create:brass_hand',
        [
            create.deploying(incomplete,[incomplete,'refinedstorage:64k_storage_part']),
            create.deploying(incomplete,[incomplete,'functionalstorage:netherite_upgrade']),
            create.deploying(incomplete,[incomplete,'quark:blue_corundum_cluster']),
            create.deploying(incomplete,[incomplete,'minecraft:echo_shard']),
            create.cutting(incomplete,incomplete),
            create.pressing(incomplete,incomplete)
        ]
    )
    .transitionalItem(incomplete)
    .loops(3)

    create.mixing('lm_extra:color_ingot',[
        Fluid.of({fluid: 'create:tea', amount: 1000}),
        Fluid.of({fluid: 'netherexp:ectoplasm', amount: 1000}),
        Fluid.of({fluid: 'biofactory:nutrients_fluid', amount: 1000}),
        'refinedstorage:quartz_enriched_iron'
    ]).superheated()

    create.compacting('lm_extra:staff_of_homa',[
        Fluid.of({fluid: 'minecraft:lava', amount: 1000}),
        Fluid.of({fluid: 'netherexp:ectoplasm', amount: 1000}),
        'cataclysm:netherite_effigy',
        'minecraft:blaze_rod',
        'jerotesvillage:piglin_golden_fire',
        'lm_extra:polearm_billet'
    ]).superheated()

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

    // 荣耀
    create.mechanical_crafting('lm_extra:glory',
        [
            "CCCCC",
            "CIIIC",
            "CIAIC",
            "CIIIC",
            "CCCCC"
        ],
        {
            I:'jerotesvillage:villager_metal_ingot',
            A:'jerotesvillage:certificate_of_honor_for_hero_of_the_village',
            C:'easy_villagers:villager'
        }
    )

    // 彩虹宝石
    event.shaped('lm_extra:rainbow_gemstone',[
        ['cataclysm:witherite_ingot','cataclysm:ignitium_ingot','cataclysm:ancient_metal_ingot'],
        ['cataclysm:black_steel_ingot','cataclysm:cursium_ingot','art_of_forging:endsteel_ingot'],
        ['pasterdream:dream_aurorian_steel','','']
    ])

    // 神圣之剑
    event.shaped('2x lm_extra:sacred_sword',[
        ['cataclysm:the_incinerator','pasterdream:dyedream_sword_0','cataclysm:soul_render'],
        ['pasterdream:iceshadow_hammer','pasterdream:white_sword','pasterdream:shadow_sword'],
        ['pasterdream:true_tide_sword', 'pasterdream:truest_moltengold_wand','pasterdream:truest_moltengold_sword']
    ])

    // 主宰
    event.shaped('lm_extra:dominate',[
        ['','cataclysm:lava_power_cell','born_in_chaos_v1:dark_metal_ingot'],
        ['','born_in_chaos_v1:diamond_termite_shard','art_of_forging:forged_steel_ingot'],
        ['cataclysm:essence_of_the_storm', '','']
    ])

    // 自然之心
    event.shaped('lm_extra:nature_heart',[
        ['cataclysm:amethyst_crab_shell','cataclysm:amethyst_crab_shell','cataclysm:amethyst_crab_shell'],
        ['','pasterdream:nature_belt',''],
        ['', 'legendary_monsters:nature_crystal','']
    ])

    // 狂妄
    event.shaped('lm_extra:wildly_arrogant',[
        ['','born_in_chaos_v1:dark_upgrade',''],
        ['born_in_chaos_v1:armor_plate_from_dark_metal','born_in_chaos_v1:seedof_chaos','born_in_chaos_v1:armor_plate_from_dark_metal'],
        ['', 'faded_conquest_2:abyssal_device','']
    ])
})