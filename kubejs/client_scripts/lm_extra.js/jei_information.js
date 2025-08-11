JEIEvents.information(event =>{
    event.addItem('lm_extra:white_silk',Text.black("（皮革材料）提高1点攻速"))
    event.addItem('lm_extra:black_silk',Text.black("（皮革材料）提供25%的120%伤害暴击"))
    event.addItem('lm_extra:maodie_breathe_out',Text.black('（头颅材料）攻击时哈气，每次伤害会造成额外1点虚空伤害，单次普攻造成额外伤害次数不高于攻速*2（向上取整）'))
    event.addItem('lm_extra:rage_blade',Text.black("（镶嵌材料）每次攻击给予1级急迫效果，最高5级；当玩家攻速大于5时，普通攻击（即PLAYER_ATTACK类型伤害）无视无敌帧"))
    event.addItem('lm_extra:rainbow_gemstone',Text.black("(灾变之心强化)普攻时每2.5攻速额外造成伤害分别为1的雷伤、火伤、冰伤、毒伤、法伤、摔落伤害"))
    event.addItem('lm_extra:glory',Text.black("在背包时每击杀一只怪物，积累一点荣耀值，右键查看当前荣耀值，潜行右键释放，对周围造成等同于荣耀值的普攻伤害"))
    
    event.addItem('lm_extra:nature_heart', Text.black("(饰品) 唯一生效，站在草方块上获得20%减伤与30%增伤"));
    event.addItem('lm_extra:pearlescent_hand_protection', Text.black("(镶嵌材料) 使所有伤害都能触发暴击"));
    event.addItem('lm_extra:sacred_sword', Text.black("(剑刃材料) 使暴击率每超过100%的部分可多次触发额外暴击"));
    event.addItem('lm_extra:manbo', Text.black("(头颅材料) 普攻时触发曼波效果，强运等级+1（提升10%幸运），最高不超过当前暴击率×5"));
    event.addItem('lm_extra:dominate', Text.black("(灾变之心强化) 根据最大生命值与临时生命值提供增伤，超过20点的部分每点提升4%伤害"));
    event.addItem('lm_extra:gambling', Text.black("(镶嵌材料) 攻击时40%几率造成50%伤害，60%几率造成4倍伤害"));
    event.addItem('lm_extra:wildly_arrogant', Text.black("(镶嵌材料) 对满血生物造成10倍伤害"));
    event.addItem('lm_extra:polearm_billet', Text.black("杀死灾变怪物有5%的概率掉落"));


    event.addItem('lm_extra:staff_of_homa', Text.black({ "translate": "information.lm_extra.staff_of_homa" }));
    event.addItem('tetra:staff_of_homa', Text.black({ "translate": "information.lm_extra.staff_of_homa" }));

})