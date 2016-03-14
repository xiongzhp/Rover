// state variables
var transcript = '';
var listening = false;

var canSpeak = false;
var canListen = false;

// speech synthesis
if ('speechSynthesis' in window) {
	console.log('J.A.R.V.I.S. can speak')

	var canSpeak = true;
	var synthesis = window.speechSynthesis;
}

// speech recognition
if ('webkitSpeechRecognition' in window) {
	console.log('J.A.R.V.I.S. can listen');

	var canListen = true;

	// object for speech interface
	var recognition = new webkitSpeechRecognition();

	// speech recognition automatically ends when the user stops talking
	recognition.continuous = false;

	// do not display intermediate results
	recognition.interimResults = true;

	// set the language to English
	recognition.lang = 'en-US';
	// recognition.lang = 'ko-KR';
	// recognition.lang = 'cmn-Hans-CN';

	// recognition begins
	recognition.onstart = function () {
		// display listening
		console.log('Listening...');
	}

	// during the recognition
	recognition.onresult = function (event) {
		var intermediate = '';
		for (var i = event.resultIndex; i < event.results.length; ++i) {
			if (event.results[i].isFinal) {
				transcript += event.results[i][0].transcript;
			} else {
				intermediate += event.results[i][0].transcript;
			}
		}

		$('#int').text(intermediate);
		$('#final').text(transcript);
	}

	// if unable to recognize
	recognition.onerror = function (event) {
		console.log('ERROR');
	}

	// after listening to the user, print the text
	recognition.onend = function () {
		console.log(transcript);
		$('.button').text('Listen');

		// do something with transcript!

		listening = false;
		speak(transcript);
	}

} else {
	console.log('Please upgrade your browser that supports the Web Speech API');
}

// listen to the command
function listenCommand () {
	// speech synthesis unavailable
	if (!canListen) {
		console.log('Sorry, J.A.R.V.I.S. cannot listen in this environment');
		return;
	}

	// already listening
	if (listening) {
		console.log('Sorry, J.A.R.V.I.S. is already listening');
		recognition.stop();
		return;
	}

	$('.button').text('Listening...');

	transcript = '';
	listening = true;
	recognition.start();
}

// make the browser speak
function speak(text) {
	if (canSpeak && recognition.lang === 'en-US') {
		var phrase = new SpeechSynthesisUtterance(text);
		synthesis.speak(phrase);
	}
}
