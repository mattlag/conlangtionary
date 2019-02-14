import PlaceholderGlyph from '../objects/PlaceholderGlyph.js';
import Character, { letterDescriptions } from '../objects/Character.js';
import { openDialog } from '../dialogs/Dialog.js';
import { nbsp } from '../common.js';

/**
 * Edit or Create New character
 * on the Alphabet page
 */

export function editCharacter(letterID) {
	console.log(`editCharacter dialog passed ${letterID}`);
	if(letterID === 'create_new_letter') {
		letterID = generateNewLetterID();
		conlangtionary.project.alphabet[letterID] = new Character({id: letterID});
		document.getElementById('app').innerHTML = conlangtionary.nav.pages.alphabet.load();
	}

	if(!letterID) return;

	let letter = getLetter(letterID);
	// console.log(letter);
	if(!letter.placeholderGlyph) letter.placeholderGlyph = new PlaceholderGlyph();
	
	let displayCase = conlangtionary.project.settings.hasCases ? 'contents' : 'none';

	openDialog(`
		<h2>${letter.name}</h2>
		<h3>Character ID: ${letter.id}</h3>
		<div class="settingsGrid">
			<label class="name">${nbsp('Name:')}</label>
			<span class="value">
				<input type="text" value="${letter.name}" onchange="updateLetter('${letterID}', 'name', this.value);"/>
			</span>
			<span class="description">${letterDescriptions.name}</span>

			<label class="name">${nbsp('Rank:')}</label>
			<span class="value">
				<input type="text" value="${letter.rank}" onchange="updateLetter('${letterID}', 'rank', this.value);"/>
			</span>
			<span class="description">${letterDescriptions.rank}</span>

			<label class="name">${nbsp('Romanized translation:')}</label>
			<span class="value">
				<input type="text" value="${letter.romanCharacter}" onchange="updateLetter('${letterID}', 'romanCharacter', this.value);"/>
			</span>
			<span class="description">${letterDescriptions.romanCharacter}</span>

			<label class="name">${nbsp('Type:')}</label>
			<span class="value">
				<select onchange="updateLetter('${letterID}', 'type', this.value);">
					<option value="vowel" ${letter.type === 'vowel'? 'selected' : ''}>Vowel</option>
					<option value="consonant" ${letter.type === 'consonant'? 'selected' : ''}>Consonant</option>
					<option value="letter" ${letter.type === 'letter'? 'selected' : ''}>Character</option>
					<option value="numeral" ${letter.type === 'numeral'? 'selected' : ''}>Numeral</option>
					<option value="punctuation" ${letter.type === 'punctuation'? 'selected' : ''}>Punctuation</option>
					<option value="accent" ${letter.type === 'accent'? 'selected' : ''}>Accent</option>
					<option value="symbol" ${letter.type === 'symbol'? 'selected' : ''}>Symbol</option>
					<option value="other" ${letter.type === 'other'? 'selected' : ''}>Other</option>
				</select>
			</span>
			<span class="description">${letterDescriptions.type}</span>

			<label class="name">${nbsp('IPA characters:')}</label>
			<span class="value">
				<input type="text" value="${letter.ipaCharacters}" onchange="updateLetter('${letterID}', 'ipaCharacters', this.value);"/>
			</span>
			<span class="description">${letterDescriptions.ipaCharacters}</span>

			<div class="rowWrapper" style="display:${displayCase} !important;">
				<label class="name">${nbsp('Case:')}</label>
				<span class="value">
					<select onchange="updateLetter('${letterID}', 'caseValue', this.value);">
						<option value="upper" ${letter.caseValue === 'upper'? 'selected' : ''}>Upper Case</option>
						<option value="lower" ${letter.caseValue === 'lower'? 'selected' : ''}>Lower Case</option>
						<option value="na" ${letter.caseValue === 'na'? 'selected' : ''}>Not applicable</option>
					</select>
				</span>
				<span class="description">${letterDescriptions.caseValue}</span>

				<label class="name">${nbsp('Case variant:')}</label>
				<span class="value">
					<input type="text" value="${letter.caseVariant}" onchange="updateLetter('${letterID}', 'caseVariant', this.value);"/>
				</span>
				<span class="description">${letterDescriptions.caseVariant}</span>
			</div>
		</div>
		<br><br>

		<h3>Placeholder glyph</h3>
		<span class="description">
			A very simple representation of this glyph in your conlang.<br>
			You can adjust the height of all placeholder glyphs in Settings.
		</span>
		<br><br>
		<div class="grid">
			<span style="grid-column: 1;" id="edit-placeholderGlyph">
				${letter.placeholderGlyph.makeEditGrid(10, 1, 'black', 'white', letterID)}
			</span>
			<span style="grid-column: 2;">
				<button style="width: 80px; margin-bottom: 6px;" onclick="updateLetterWidth('${letter.id}', true);">width +</button><br>
				<button style="width: 80px; margin-bottom: 6px;" onclick="updateLetterWidth('${letter.id}', false);">width -</button><br>
			</span>
			<span class="description" style="grid-column: 3;">
				Click a square to toggle between black and white.<br>
				Hold down [shift] to hover-paint black.<br>
				Hold down [ctrl] to hover-paint white.
			</span>
		</div>

	`);
};

function generateNewLetterID() {
	let newID = '';
	let suffix = 1;

	while(true) {
		if(suffix < 10) {
			newID = '' + conlangtionary.letterPrefix + '0' + suffix;
			if(!conlangtionary.project.alphabet[newID]) return newID;
		} else {
			newID = '' + conlangtionary.letterPrefix + suffix;
			if(!conlangtionary.project.alphabet[newID]) return newID;
		}

		suffix++;
	}
}

function getLetter(letterID) {
	if(conlangtionary.project.alphabet[letterID]) {
		return conlangtionary.project.alphabet[letterID];
	}

	// console.warn(`Could not find letter with id: ${letterID}`);
	return false;
}

window.updateLetter = function(id, prop, value) {
	let letter = getLetter(id);
	if(letter) {
		letter[prop] = value;
	}

	let gridval = document.getElementById('alphabet-grid-'+id+'-'+prop);
	// console.log(gridval);
	
	if(gridval) {
		gridval.innerHTML = value;
	}
};

window.updateLetterWidth = function(id, increase) {
	let letter = getLetter(id);

	if(increase) letter.placeholderGlyph.increaseWidth();
	else letter.placeholderGlyph.decreaseWidth();

	updatePlaceholderGrids(id, letter);
};

function updatePlaceholderGrids(id, letter) {
	let gridval = document.getElementById('alphabet-grid-'+id+'-placeholderGlyph');
	if(gridval) gridval.innerHTML = letter.placeholderGlyph.makePixelGrid(2, 0);

	let editval = document.getElementById('edit-placeholderGlyph');
	if(editval) editval.innerHTML = letter.placeholderGlyph.makeEditGrid(10, 1, 'black', 'white', id);
}

window.togglePixel = function(id, row, col) {
	// console.log(`window.togglePixel ${id}, ${row}, ${col}`);
	let letter = getLetter(id);
	letter.placeholderGlyph.togglePixelAt(row, col);

	updatePlaceholderGrids(id, letter);
};

window.hoverPixel = function (event, id, row, col) {
	// console.log(`window.togglePixel ${id}, ${row}, ${col}`);
	event = event || window.event;
	let brush;
	
	if(event.shiftKey) brush = 1;
	else if(event.ctrlKey) brush = 0;
	else return;
	
	let letter = getLetter(id);
	letter.placeholderGlyph.setPixelAt(row, col, brush);
	
	updatePlaceholderGrids(id, letter);
};
