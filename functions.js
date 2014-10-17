var bidarr = {
	season_day: null,

	init: function() {
		bidarr.season_day = $("#date-day").find('span').html();

		//Get simple bets configs
		bidarr.options.bet = localStorage[bidarr.bets.simple.localStorageVar];
		if (!bidarr.options.bet) {
			localStorage[bidarr.bets.simple.localStorageVar] = "0";
			bidarr.options.bet = "0";
		} 

		//Get s9 bets configs
		bidarr.options.s9 = localStorage[bidarr.bets.s9.localStorageVar];
		if (!bidarr.options.s9) {
			localStorage[bidarr.bets.s9.localStorageVar] = "0";
			bidarr.options.s9 = "0";
		} 

		//Prepare DOM elements
		if (document.URL.match(/http:\/\/www\.cs-manager\.com\/csm\/\?p=clan_info&s=edit/)) {
			$("#cp-settings").prepend(bidarr.createMenu());
		}

		$("#shortcuts").find('ul').prepend('<li id="tiagop"> &raquo; <a href="/csm/?p=clan_info&amp;s=edit">Bidarr Settings</a></li>');
	},

	createMenu: function() {
		var menu = '<div id="tiago_csmp"><span onclick="javascript:CSM.clan_presentation.toggleSettings(this);" class="toggleSettings">'
				 + '<h3><a class="plus-more">+</a> Bidarr Plugin</h3>'
				 + '</span><form style="display: none;">'

				 + 'S9 Reminder: <input type="checkbox"' + ((bidarr.options.s9 == "1") ? " checked=checked " : " ")
				 + ' onchange="if(this.checked == true) localStorage[\'' + bidarr.bets.s9.localStorageVar + '\'] = 1; else localStorage[\'' + bidarr.bets.s9.localStorageVar + '\'] = 0;">'

				 + '<br>Simple Bets Reminder: <input type="checkbox"' + ((bidarr.options.bet == "1") ? " checked=checked " : " ")
				 + ' onchange="if(this.checked == true) localStorage[\'' + bidarr.bets.simple.localStorageVar + '\'] = 1; else localStorage[\'' + bidarr.bets.simple.localStorageVar + '\'] = 0;">' 

				 + '</form></div><hr>';

		 return menu;
	},

	options: {
		bet: null,
		s9: null
	},

	//Bets reminder module
	bets: {
		simple: {
			isDay: false,
			alertHtml: '<span style="display: block; background-color: #F2DEDE; text-align: center; margin-bottom: 10px; width: 100%; border: 1px solid #EED3D7;"><a href="http://www.cs-manager.com/csm/?p=community_betting" style="color: #B94A48;">Simple Bet Reminder!</a></span>',
			localStorageVar: "bidarr_csmp_bet",
			checkIsDay: function() {
				if (bidarr.options.bet) {
					switch (season_day) {
						case '1' :
						case '2' :
						case '6' :
						case '7' :
						case '13':
						case '14':
						case '20':
						case '21':
						case '27':
						case '28':
						case '34':
						case '35':
						case '41':
						case '42':
						case '45':
						case '46':
						case '47':
						case '48':
						case '49':
						case '50':
							bidarr.bets.simple.isDay = true;
							break;
					}



					if (bidarr.bets.simple.isDay) {
						//check with ajax if s9 is done
						$.ajax({
		  					url: 'http://www.cs-manager.com/csm/?p=community_betting',
		  					success: function(data) {
		    					var formBet = $('td.close-time', $(data)).length;
								if (formBet > 0) {
									$("#main").prepend(bidarr.bets.simple.alertHtml);
								}
		  					}
						});
					}
				}
			}
		},

		s9: {
			isDay: false,
			alertHtml: '<span style="display: block; background-color: #F2DEDE; color: #B94A48; text-align: center; margin-bottom: 10px; width: 100%; border: 1px solid #EED3D7;"><a href="http://www.cs-manager.com/csm/?p=community_betting" style="color: #B94A48;">S9 Reminder!</a></span>',
			localStorageVar: "bidarr_csmp_s9",
			checkIsDay: function() {
				if (bidarr.options.s9 == "1") {
					switch (bidarr.season_day) {
						case '3':
						case '4' :
						case '11':
						case '10': 
						case '18':
						case '19': 
						case '24': 
						case '25':
						case '31': 
						case '32':
						case '38':
						case '39':
							bidarr.bets.s9.isDay = true;
							break;
					}

					if (bidarr.bets.s9.isDay) {
						//check with ajax if s9 is done
						$.ajax({
		  					url: 'http://www.cs-manager.com/csm/?p=community_betting',
		  					success: function(data) {
		    					var formS9 = $('#form_super', $(data)).length;
								if (formS9 > 0) {
									$("#main").prepend(bidarr.bets.s9.alertHtml);
								}
		  					}
						});
					}
				}
			}
		}
	}
};

bidarr.init();