-- Migration 009: Re-apply Bulgarian translations (fixes 008 which may have targeted wrong slugs)

UPDATE products SET
  name_bg = 'Яке Пеплум с Дантелени Орнаменти и Качулка',
  description_bg = 'Романтична интерпретация на якето с качулка. Изработено в нежно пудрено синьо с деликатна дантела по маншетите и подгъва, стеснена талия с еластично набиране и обемни балонени ръкави. Модел, който свързва ежедневния комфорт с женствената елегантност.'
WHERE slug = 'lace-trimmed-hooded-peplum-jacket';

UPDATE products SET
  name_bg = 'Шерпа Чанта за Рамо',
  description_bg = 'Мека шерпа чанта за рамо в лавандулово-сиво с капак на прегъване и регулируема каишка от канава. Идва със съчетан аксесоар мече.'
WHERE slug = 'sherpa-crossbody-bag';

UPDATE products SET
  name_bg = 'Шерпа Раница със Сърце',
  description_bg = 'Уютна шерпа раница с игриво предно джобче във формата на сърце. Мека текстура тип мече в цвят градинска зеленина с тонални ципове и регулируеми каишки.'
WHERE slug = 'sherpa-heart-backpack';

UPDATE products SET
  name_bg = 'Шерпа Чанта с Верижка',
  description_bg = 'Универсална мини чанта от кремава шерпа с две опции за носене — къси дръжки от канава и верижка с тъмен метален оттенък за кръстосано носене.'
WHERE slug = 'sherpa-chain-bag';

UPDATE products SET
  name_bg = 'Шерпа Мини Тоте',
  description_bg = 'Компактна шерпа тоте чанта в топло тъмнобежово с здрави дръжки от канава и златисти халки.'
WHERE slug = 'sherpa-mini-tote';

UPDATE products SET
  name_bg = 'Шерпа Уикенд Тоте',
  description_bg = 'Просторна тоте чанта за уикенд от кремава шерпа с лента от раирана канава, здрави горни дръжки и регулируема каишка за рамо. Включва подвижен аксесоар мече.'
WHERE slug = 'sherpa-weekender-tote';

UPDATE products SET
  name_bg = 'Шерпа Клъч с Рибена Кост и Верижка',
  description_bg = 'Очарователен компактен клъч, съчетаващ кремава шерпа с тъкан плат на рибена кост и деликатна верижка.'
WHERE slug = 'sherpa-herringbone-chain-clutch';

UPDATE products SET
  name_bg = 'Аксесоар Плюшено Мече',
  description_bg = 'Неустоим ръчно изработен аксесоар мече от плюшена шерпа.'
WHERE slug = 'teddy-bear-bag-charm';

UPDATE products SET
  name_bg = 'Шерпа Раница с Връзки',
  description_bg = 'Игрива раница с връзки от мека розова шерпа с връзки тип въже. Включва съчетан розов аксесоар мече.'
WHERE slug = 'sherpa-drawstring-backpack';
