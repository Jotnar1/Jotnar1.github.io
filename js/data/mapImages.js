// локальные изображения карт battlegrounds работают без внешних cdn

const MAP_BASE = '../img/maps/';



const MAP_FILES = {

    'Alterac Pass': 'alterac-pass.jpg',

    'Battlefield of Eternity': 'battlefield-of-eternity.png',

    "Blackheart's Bay": 'blackhearts-bay.png',

    'Braxis Holdout': 'braxis-holdout.png',

    'Cursed Hollow': 'cursed-hollow.png',

    'Dragon Shire': 'dragon-shire.png',

    'Garden of Terror': 'garden-of-terror.jpg',

    'Hanamura Temple': 'hanamura-temple.png',

    'Infernal Shrines': 'infernal-shrines.jpg',

    'Sky Temple': 'sky-temple.png',

    'Tomb of the Spider Queen': 'tomb-of-the-spider-queen.png',

    'Towers of Doom': 'towers-of-doom.jpg',

    'Volskaya Foundry': 'volskaya-foundry.jpg',

    'Warhead Junction': 'warhead-junction.jpg'

};



export const MAP_IMAGES = Object.fromEntries(

    Object.entries(MAP_FILES).map(([name, file]) => [name, MAP_BASE + file])

);



export const MAP_PLACEHOLDER = '../img/nexus-bg.svg';


