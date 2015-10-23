/**
 * Madame Felicia Name Generator
 */

var professions = [
'Surveyor of the Spooky',
	'Clairvoyant of Curs',
	'Commissary of the Undead',
	'Pirate of the Ghostly Seas',
	'Bloody Wastrel',
	'Banshee Stenographer',
	'Swashbuckling Pirate',
	'Phantom Spirit of Nefertiti',
	'Necromancer Scribe',
	'Mortician Embalmer',
	'Spider Breeder',
	'Witch Certifier',
	'Alien Hunter',
	'Ice Lich',
	'Warlock Analrapist',
	'Siren Therapist',
	'Werewolf Matchmaker',
	'Mad Scientist',
	'Ghoul Psychologist',
	'Limbo Explorer',
	'Harpy Charmer',
	'Jolly Rancher',
	'Voodoo Doll Maker',
	'Crypt Keeper',
	'Tombstone Chiseler',
	'Witch Doctor',
	'Tiki Priest',
	'Area 51 Agent',
	'Bounty Hunter',
	'Ghost Detective',
	'(Long Island) Medium',
	'Animal Whisperer',
	'Soul Stealer',
	'Trick or Treater',
	'Goblin Connoisseur',
	'Phantom Collector',
];

var prefices = [
	'The Necrotic',
	'Professor',
	'The Foulest',
	'Dr.'
];	


var firsts = [
	'Medusa',
	'Adamn',
	'Barfolomew',
	'Char Lee',
	'Daedalus',
	'Egregio',
	'Felesha',
	'Grimm',
	'Horus',
	'Insipedro',
	'Jackielantern',
	'Khan',
	'Lysteria',
	'Mongrel',
	'Neckie',
	'Ofeelya',
	'Prints',
	'Quelch',
	'Ratchet',
	'Draculeisha',
	'Melancholia',
	'Hijinx',
	'Shella',
	'Tomb',
	'Urchin',
	'Vex',
	'Wisp',
	'Xcalibro',
	'Yves',
	'Zork',
];	

var middles = [
	'Brain-sucker',
	'Ingenue',
	'Porcine',
	'Horseman',
	'Meleficent',
	'Djinn',
	'Ophelia',
	'Curmudgeo',
	'Rancidia',
	'Furiosa',
];	

var lasts = [
	'Hellweed',
	'Forkinbottom',
	'Bones',
	'Deathbringer',
	'Chupacabra',
	'Deadfield',
	'Littlefinger',
	'Infanteater',
	'Demonseed',
	'Trembleweed',
	'Pyre',
];	

var suffices = [
	'Junior',
	'Senior',
	'III',
	'MCVXIX',
	'Esquire',
	'DMD',
	'LICSW',
];	

var nameParts = [];

function randomentry(parts, list, chance) {
	chance = chance || 1;

	if(chance == 1 || Math.random() * 100 < chance) {
		var idx = parseInt(Math.random() * list.length);

		parts.push(list[idx]);

		return list[idx];
	}
}

randomentry(nameParts, prefices, 25);
randomentry(nameParts, firsts);
randomentry(nameParts, middles, 85);
randomentry(nameParts, lasts);

var name = nameParts.join(' ');
var profession = randomentry([], professions);

$('h1').text(name);
$('h2').text(profession);

var $body = $('body'), $container = $('.container'), measure = $('.measure')[0];

var cw = $container.width(), ch = $container.height();

$(function() {
	var fontSize = 2;

	do {
		$body.css({ 'font-size' : fontSize + 'em' });
		fontSize -= .05;
	} while(fontSize > 0 && (measure.scrollWidth > cw || measure.scrollHeight > ch));

	// Vertically center any leftover
	$(measure).css('padding-top', (ch - measure.clientHeight)/2 + 'px');

	html2canvas($container[0], {
		letterRendering: true,
		onrendered: function(canvas) {
			$.post('http://localhost/name/print.php', {
				image: canvas.toDataURL('image/png')
			});
		}
	});
});

