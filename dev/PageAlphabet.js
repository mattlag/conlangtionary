import Glyph from './Glyph.js';
import { openDialog } from './main.js';
import { letterDescriptions } from './Letter.js';

export default class PageAlphabet {
	constructor() {
	}

	load() {
		let alphabet = [];
		for(let key in conlangtionary.project.alphabet) {
			if(conlangtionary.project.alphabet.hasOwnProperty(key)) {
				alphabet.push(conlangtionary.project.alphabet[key]);
			}
		}
		
		alphabet.sort(function (a, b) { return a.rank - b.rank; });
		let showCaseVariant = conlangtionary.project.settings.caseVariants ? 'block' : 'none';

		let content = `
		<h1>
			Alphabet
			&nbsp;
			<button class="command">Add Letter</button>
		</h1>
		<div class="grid">
			<div class="gridHeader firstColumn">Name</div>
			<div class="gridHeader">Letter ID</div>
			<div class="gridHeader">Rank</div>
			<div class="gridHeader">Romanized</div>
			<div class="gridHeader">IPA</div>
			<div class="gridHeader" style="display: ${showCaseVariant};">Case Variant</div>
			${
				alphabet.map((letter, index) => `
					<div onclick="editLetter('${letter.id}');" class="rowWrapper">
						<div id="alphabet-grid-${letter.id}-name" style="grid-row: ${index+2};" class="firstColumn">${letter.name}</div>
						<div id="alphabet-grid-${letter.id}-id" style="grid-row: ${index+2};">${letter.id}</div>
						<div id="alphabet-grid-${letter.id}-rank" style="grid-row: ${index+2};">${letter.rank}</div>
						<div id="alphabet-grid-${letter.id}-romanCharacter" style="grid-row: ${index+2};">${letter.romanCharacter}</div>
						<div id="alphabet-grid-${letter.id}-ipaCharacters" style="grid-row: ${index+2};">${letter.ipaCharacters.join(', ')}</div>
						<div id="alphabet-grid-${letter.id}-showCaseVariant" style="grid-row: ${index+2}; display: ${showCaseVariant};">${letter.caseVariant ? letter.caseVariant : ''}</div>
					</div>
				`).join('')
			}
		</div>
		`;
		return content;
	}
}

window.editLetter = function(letterID) {
	let letter = getLetter(letterID);
	let showCaseVariant = conlangtionary.project.settings.caseVariants ? 'block' : 'none';

	openDialog(`
		<h2>${letter.name}</h2>
		<h3>Letter ID: ${letter.id}</h3>
		<div class="settingsGrid">
			<label class="name">Name:</label>
			<span class="value">
				<input type="text" value="${letter.name}" onchange="updateLetter('${letterID}', 'name', this.value);"/>
			</span>
			<span class="description">${letterDescriptions.name}</span>

			<label class="name">Rank:</label>
			<span class="value">
				<input type="text" value="${letter.rank}" onchange="updateLetter('${letterID}', 'rank', this.value);"/>
			</span>
			<span class="description">${letterDescriptions.rank}</span>

			<label class="name">Romanized&nbsp;translation:</label>
			<span class="value">
				<input type="text" value="${letter.romanCharacter}" onchange="updateLetter('${letterID}', 'romanCharacter', this.value);"/>
			</span>
			<span class="description">${letterDescriptions.romanCharacter}</span>

			<label class="name">IPA&nbsp;characters:</label>
			<span class="value">
				<input type="text" value="${letter.ipaCharacters}" onchange="updateLetter('${letterID}', 'ipaCharacters', this.value);"/>
			</span>
			<span class="description">${letterDescriptions.ipaCharacters}</span>

			<div class="rowWrapper" style="display:${showCaseVariant};">
				<label class="name">Case&nbsp;variant:</label>
				<span class="value">
					<input type="text" value="${letter.caseVariant}" onchange="updateLetter('${letterID}', 'caseVariant', this.value);"/>
				</span>
				<span class="description">${letterDescriptions.caseVariant}</span>
			</div>
		</div>
	`);
};

function getLetter(letterID) {
	if(conlangtionary.project.alphabet[letterID]) {
		return conlangtionary.project.alphabet[letterID];
	}

	console.warn(`Could not find letter with id: ${letterID}`);
	return false;
}

window.updateLetter = function(id, prop, value) {
	let letter = getLetter(id);
	if(letter) {
		letter[prop] = value;
	}

	let gridval = document.getElementById('alphabet-grid-'+id+'-'+prop);
	console.log(gridval);
	
	if(gridval) {
		gridval.innerHTML = value;
	}
}