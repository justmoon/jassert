var jAssert = (function ()
{
	var ready = false;
	var container = null;
	var currentSuite = null;
	
	var stats = {
		testsSucceeded: 0,
		testsFailed: 0,
		testsTotal: 0,
		suitesSucceded: 0,
		suitesFailed: 0,
		suitesTotal: 0
	};
	
	function runWhenReady(argObj)
	{
		var proxy = function ()
		{
			ready = true;
			argObj.callee.apply(self, argObj);
		};
		jQuery(proxy);
	};
	
	var self;
	return self = 
	/** @lends Tester */
	{
		setup: function ()
		{
			// We're ready to roll
			ready = true;
			
			// Load CSS
			var myUrl = $('head').find('script[src$=jassert.min.js],script[src$=jassert.js]').attr('src');
			if (!myUrl) {
				((console && console.error) ? console.error : alert) ('Couldn\'t find script tag that includes jAssert. URL must end with jassert.js or jassert.min.js');
			} else {
				myUrl = myUrl.substr(0, myUrl.length-2) + 'css';
				$('head').append('<link rel="stylesheet" href="'+myUrl+'" type="text/css" />');
			}
		},
		
		setContainer: function (c)
		{
			container = $(c);
			container.addClass('jAssert');
		},
		
		runSuite: function (name, testFunction)
		{
			if (!ready) runWhenReady(arguments);
			if (!container) self.setContainer(document.body);
		
			currentSuite = $('<div class="suite"></div>');
			var head = $('<h1></h1>').appendTo(currentSuite);
			$('<span></span>').addClass('title').text(name).appendTo(head);
			$('<div class="tests"></div>').appendTo(currentSuite);
			
			var previousTotal = stats.testsTotal;
			var previousSucceeded = stats.testsSucceeded;
			
			// Run suite
			testFunction.apply(this, []);
			
			var suiteTestsTotal = stats.testsTotal - previousTotal;
			var suiteTestsSucceeded = stats.testsSucceeded - previousSucceeded;
			
			// Print out suite result
			var suiteResultEl = $('<span class="suiteResult"></span>');
			if (suiteTestsTotal == suiteTestsSucceeded) {
				stats.suitesSucceeded++;
				currentSuite.addClass('success');
				suiteResultEl.text(" "+suiteTestsSucceeded+"/"+suiteTestsTotal);
			} else {
				stats.suitesFailed++;
				currentSuite.addClass('error');
				suiteResultEl.text(" FAIL "+suiteTestsSucceeded+"/"+suiteTestsTotal);
			}
			suiteResultEl.appendTo(head);
			
			stats.suitesTotal;
			$(container).append(currentSuite);
			currentSuite = null;
		},
		
		runTest: function (name, expectedResult, f, args)
		{
			if (!ready) runWhenReady(arguments);
			if (!container) self.setContainer(document.body);
			
			var targetEl = (currentSuite) ? currentSuite.find('.tests') : container;
			
			var testEl = $('<div class="test"></div>');
			$('<span class="name"></span>').text(name).appendTo(testEl);
			
			try {
				var result = ("function" == typeof f) ? f.apply(null, args) : f;
				
				if (result != expectedResult) {
					throw new Error('Wrong result. Expected: '+expectedResult+' Actual: '+result);
				} else {
					$('<span class="result success"></span>').text(' OK').appendTo(testEl);
					stats.testsSucceeded++;
				}
			} catch(e) {
				$('<span class="result error"></span>').text(' '+e.toString()).appendTo(testEl);
				stats.testsFailed++;
			}
			
			stats.testsTotal++;
			targetEl.append(testEl);
		},
		report: function ()
		{
			
		}
	};
})();

jQuery(jAssert.setup);
