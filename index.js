/* global document */

const minCharacterLength = 4;

// http://stackoverflow.com/questions/39776819/function-to-normalize-any-number-from-0-1
function normalize(min, max) {
	const delta = max - min;

	return value => {
		return Number.parseFloat(((value - min) / delta).toFixed(2));
	};
}

function cleanText(text) {
	return text.replace(/[^A-Za-z]/g, ' ').trim();
}

function extractWords(text) {
	return text.split(' ')
		.filter(string => string.length >= minCharacterLength)
		.map(word => word.toLowerCase())
		.sort();
}

function getWordFrequency(words) {
	return words.reduce((map, current) => {
		const frequency = map.get(current) ? map.get(current) + 1 : 1;
		return map.set(current, frequency);
	}, new Map());
}

function getNormalisedWordFrequency(wordFrequenciesMap) {
	const wordFrequencies = [...wordFrequenciesMap];
	const frequencyData = wordFrequencies.map(([, frequency]) => frequency);
	const maxFrequency = Math.max(...frequencyData);

	return wordFrequencies.reduce((map, [word, frequency]) => {
		const normalizedFrequency = frequency > 1 ? normalize(0, maxFrequency)(frequency) : 0;
		return map.set(word, normalizedFrequency);
	}, new Map());
}

function createTagCloudTemplate(wordFrequencies) {
	const container = [...wordFrequencies].reduce((map, [word, frequency]) => {
		const wordItem = document.createElement('li');
		wordItem.textContent = word;
		wordItem.style.color = `rgba(0, 48, 225, ${frequency + 0.2})`;
		wordItem.style.fontSize = `${1 + (frequency * 2)}em`;

		map.append(wordItem);
		return map;
	}, document.createElement('ul'));

	container.classList.add('bookmarklet-tag-cloud');
	return container;
}

function getTagCloudStyles() {
	const tagCloudStyles = `
		.bookmarklet-tag-cloud {
			list-style-type: none !important;
			display: flex;
			flex-wrap: wrap;
			font-size: 20px;
			background: white;
			position: fixed;
			top: 0;
			left: 0;
			width: 80vw;
			max-height: 70vh;
			overflow: scroll;
			margin: 30px;
			padding: 20px;
			z-index: 99;
			box-shadow: 0 0 8px 6px rgba(88, 84, 84, 0.59);
			font-family: Verdana;
		}

		.bookmarklet-tag-cloud li {
			margin: 2px 8px;
			list-style-type: none !important;
			align-self: center;
			font-size: 0.9em;
		}
	`;

	const style = document.createElement('style');
	style.type = 'text/css';
	style.append(document.createTextNode(tagCloudStyles));
	return style;
}

function init() {
	const text = cleanText(document.body.textContent);
	const words = extractWords(text);
	const wordFrequency = getWordFrequency(words);
	const normalisedWordFrequency = getNormalisedWordFrequency(wordFrequency);
	const template = createTagCloudTemplate(normalisedWordFrequency);
	const styles = getTagCloudStyles();

	document.body.append(styles);
	document.body.append(template);
}

init();
