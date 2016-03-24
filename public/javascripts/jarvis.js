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
		$('#listen').text('Listening...');
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
		$('.button').text('ERROR');
	}

	// after listening to the user, print the text
	recognition.onend = function () {
		console.log(transcript);

		$('#listen').text('Listen');

		var data = { 'query' : transcript }

		$.ajax({
			url: '/api/v1/intent',
			method: 'POST',
			data: data,
			success: processInfo,
			error: function () {
				console.log('J.A.R.V.I.S. API ERROR');
			}
		});

		listening = false;
		// speak(transcript);
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

	transcript = '';
	listening = true;
	recognition.start();
}

// make the browser speak
function speak (text) {
	if (canSpeak && recognition.lang === 'en-US') {
		var phrase = new SpeechSynthesisUtterance(text);
		synthesis.speak(phrase);
	}
}

function processInfo (response) {
	var intent = response.intent;
	var entities = response.entities;

	switch(intent) {
		case 'door':
			operateDoor(entities);
			break;
		case 'temperature':
			changeTemp(entities);
			break;
	}

	console.log(JSON.stringify(response))
}

function operateDoor (entities) {
	if (entities) {
		var state = entities['on_off'];
	}

	if (state) {
		var value = state[0].value;
	
		if (value === 'on') {
			$('.door').css('background-color', '#fff');
			$('.door').css('color', '#000');
			speak('Opening the door');
		} else {
			$('.door').css('background-color', '#000');
			$('.door').css('color', '#fff');
			speak('Closing the door');
		}
	}
}

function changeTemp (entities) {
	if (entities) {
		var state = entities['temperature'];
	}

	if (state) {
		var value = state[0].value;
		console.log(value);
		$('#temp').text(value);
		speak('Changing the temperature to ' + value + ' degrees');
	}
}
