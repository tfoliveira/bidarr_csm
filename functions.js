var bidarr = {
	season_day: null,
	countries: null,

	init: function() {

		//Get autoLogin config
		bidarr.options.autoLogin = localStorage[bidarr.login.localStorageVar];
		if (!bidarr.options.autoLogin) {
			localStorage[bidarr.login.localStorageVar] = "0";
			bidarr.options.autoLogin = "0";
		} 

		if (!bidarr.login.isLoginPage()) {
			bidarr.season_day = $("#date-day").find('span').html();

			bidarr.getCountries();

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
		} else {
			if (bidarr.options.autoLogin == "1") {
				bidarr.login.init();
			} else {
				bidarr.login.clearCredentials();
			}
		}
	},

	getCountries: function() {
		if (!bidarr.countries) {
			if (localStorage.bidarrCountries) {
				bidarr.countries = JSON.parse(localStorage.bidarrCountries);
			} else {
				$.ajax({
  					url: 'http://www.cs-manager.com/csm/?p=gameinfo&s=members',
  					async: false,
  					success: function(data) {
  						var countries = [];

  						$("#main #main-content table tbody > tr", $(data)).each(function() {
  							if (!$(this).hasClass("emphasized")) {
  								countries[countries.length] = {
  									flag: $(this).find("td:nth-child(1) img").prop("src").replace("http://www.cs-manager.com/images/flags/", "").replace(".png", ""), 
						            name: $(this).find("td:nth-child(1) img").prop("title") 
  								};
  							}
  						});

  						bidarr.countries = countries;
  						localStorage.bidarrCountries = JSON.stringify(countries);
  					}
				});
			}
		}

		return bidarr.countries;
	},

	createMenu: function() {
		var menu = '<div id="tiago_csmp"><span onclick="javascript:CSM.clan_presentation.toggleSettings(this);" class="toggleSettings">'
				 + '<h3><a class="plus-more">+</a> Bidarr Plugin</h3>'
				 + '</span><form style="display: none;">'

				 + 'Auto Login: <input type="checkbox"' + ((bidarr.options.autoLogin == "1") ? " checked=checked " : " ")
				 + ' onchange="if(this.checked == true) localStorage[\'' + bidarr.login.localStorageVar + '\'] = 1; else localStorage[\'' + bidarr.login.localStorageVar + '\'] = 0;">'

				 + '<br>'

				 + 'S9 Reminder: <input type="checkbox"' + ((bidarr.options.s9 == "1") ? " checked=checked " : " ")
				 + ' onchange="if(this.checked == true) localStorage[\'' + bidarr.bets.s9.localStorageVar + '\'] = 1; else localStorage[\'' + bidarr.bets.s9.localStorageVar + '\'] = 0;">'

				 + '<br>'

				 + 'Simple Bets Reminder: <input type="checkbox"' + ((bidarr.options.bet == "1") ? " checked=checked " : " ")
				 + ' onchange="if(this.checked == true) localStorage[\'' + bidarr.bets.simple.localStorageVar + '\'] = 1; else localStorage[\'' + bidarr.bets.simple.localStorageVar + '\'] = 0;">' 

				 + '</form></div><hr>';

		 return menu;
	},

	options: {
		bet: null,
		s9: null,
		autoLogin: null
	},


	// Auto login feature
	login: {
		localStorageVar: "bidarr_csmp_autoLogin",
		bidarrUsername: "",
		bidarrPassword: "",

		isLoginPage: function() {
			if ($("#login-form").length == 1) {
				return true;
			} else {
				return false;
			}
		},

		init: function() {
			if (bidarr.login.credentialsStored()) {
				bidarr.login.tryLogin();
			}
		},

		tryLogin: function() {
			bidarr.url.toArray(window.location.href);

			var loginStatus = bidarr.url.getVar("loggedout");
			if (loginStatus) {
				bidarr.login.clearCredentials();
				bidarr.login.applyWatchers();
			} else {
				loginStatus = bidarr.url.getVar("status");
				if (loginStatus && (loginStatus == "bad_login" || loginStatus == "javascript")) {
					bidarr.login.clearCredentials();
					bidarr.url.redirectToMain();
				} else {
					$("#login_username").val(bidarr.login.bidarrUsername);
                	$("#login_password").val(bidarr.login.bidarrPassword);
                
                	$("#login-form").find("div#login-buttons").find("button:first-child").trigger("click");
				}
			}
		},

		credentialsStored: function() {
			if (typeof localStorage.bidarrUsername != "undefined" && localStorage.bidarrUsername != "") {
				if (typeof localStorage.bidarrPassword != "undefined" && localStorage.bidarrPassword != "") {
					bidarr.login.bidarrUsername = localStorage.bidarrUsername;
					bidarr.login.bidarrPassword = bidarr.login.decrypt(bidarr_hash, localStorage.bidarrPassword);
					return true;
				}
			} else {
				bidarr.login.applyWatchers();
			}

			return false;
		},

		applyWatchers: function () {
			$("#login_username").on("blur",function() {
				if ($("#login_username").val().length > 0) {
                	localStorage.bidarrUsername = $("#login_username").val();
                }
            });
            $("#login_username").keypress(function(e) {
                if(e.which == 13) {
                	if ($("#login_username").val().length > 0) {
                    	localStorage.bidarrUsername = $("#login_username").val();
                    }

                    if ($("#login_password").val().length > 0) {
                    	localStorage.bidarrPassword = bidarr.login.encrypt(bidarr_hash, $("#login_password").val());
                    }
                }
            });
            
            $("#login_password").on("blur",function() {
        		if ($("#login_password").val().length > 0) {
                	localStorage.bidarrPassword = bidarr.login.encrypt(bidarr_hash, $("#login_password").val());
                }
            });
            $("#login_password").keypress(function(e) {
                if(e.which == 13) {
                	if ($("#login_username").val().length > 0) {
                		localStorage.bidarrUsername = $("#login_username").val();
                	}

                	if ($("#login_password").val().length > 0) {
                    	localStorage.bidarrPassword = bidarr.login.encrypt(bidarr_hash, $("#login_password").val());
                    }
                }
            });
		},

		encrypt: function(hash, password) {
			return sjcl.encrypt(hash, password);
		},

		decrypt: function(hash, data) {
			return sjcl.decrypt(hash, data);
		},

		clearCredentials: function() {
			localStorage.removeItem("bidarrUsername");
			localStorage.removeItem("bidarrPassword");
		}
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
	},

	url: {
		params: {},

		toArray: function(url) {
  			var pairs = url.substring(url.indexOf('?') + 1).split('&');
  			for (var i = 0; i < pairs.length; i++) {
    			var pair = pairs[i].split('=');
    			bidarr.url.params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  			}
		},

		getVar: function(name) {
			if (!$.isEmptyObject(bidarr.url.params) && typeof bidarr.url.params[name] != "undefined") {
				return bidarr.url.params[name];
			} else {
				return null;
			}
		},

		redirectToMain: function() {
			window.location.href = "http://www.cs-manager.com/";
		}
	}
};

bidarr.init();