(function() {

	// const script = 'jquery.js';
	const script = 'q.js';


	const data = {
		test: true,
		dupa: 'fiut'
	};
	if (script == 'q.js') {
		Q(document).ready(function() {
			Q.ajax({
				type: 'POST',
				url: 'form.php',
				data,
				dataType: 'json',
				done: function(data) {
					console.log(data);
				},
				fail: function(req, text) {
					console.log('fail', arguments);
				}
			});
		});
	}
	else if (script == 'jquery.js') {
		$(function() {
			// console.log($.ajax().done);
			$.ajax({
				type: 'POST',
				url: 'form.php',
				data,
				dataType: 'json'
			})
			.done(function(data) {
				console.log(data);
			})
			.fail(function() {
				console.log(arguments);
			});
		});
	}
})();
