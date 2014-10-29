var bidarr = {
	version: "113",
	season_day: null,

	init: function() {

		bidarr.url.toArray(window.location.href);

		//Get autoLogin config
		bidarr.options.autoLogin = localStorage[bidarr.login.localStorageVar];
		if (!bidarr.options.autoLogin) {
			localStorage[bidarr.login.localStorageVar] = "0";
			bidarr.options.autoLogin = "0";
		} 

		if (!bidarr.login.isLoginPage()) {

			bidarr.checkVersion();

			bidarr.season_day = $("#date-day").find('span').html();

			bidarr.countries.getCountries();

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

			bidarr.options.infiniteScroll = localStorage[bidarr.infiniteScroll.localStorageVar];
			if (!bidarr.options.infiniteScroll) {
				localStorage[bidarr.infiniteScroll.localStorageVar] = "0";
				bidarr.options.infiniteScroll = "0";
			} 

			//Prepare DOM elements
			if (bidarr.url.getVar("p") == "clan_info" && bidarr.url.getVar("s") == "edit") {
				$("#cp-settings").prepend(bidarr.createMenu());
			}

			$("#shortcuts").find('ul').prepend('<li id="tiagop"> &raquo; <a href="/csm/?p=clan_info&amp;s=edit">Bidarr Settings</a></li>');

			bidarr.bets.simple.checkIsDay();
			bidarr.bets.s9.checkIsDay();

			if (bidarr.options.infiniteScroll && bidarr.infiniteScroll.isTransferListPage()) {
				bidarr.infiniteScroll.applyInfiniteScroll();
			}
		} else {
			if (bidarr.options.autoLogin == "1") {
				bidarr.login.init();
			} else {
				bidarr.login.clearCredentials();
			}
		}
	},

	checkVersion: function() {
		if (localStorage.bidarrVersion) {
			if (localStorage.bidarrVersion < bidarr.version) {
				localStorage.bidarrVersion = bidarr.version;
				$("#main").prepend('<span style="display: block; background-color: #F2DEDE; text-align: center; margin-bottom: 10px; width: 100%; border: 1px solid #EED3D7;"><a href="http://www.cs-manager.com/csm/?p=clan_info&s=edit" style="color: #B94A48;">You\'re using Bidarr CSM Plugin new version! Check settings to enable any new feature.</a></span>');
			}
		} else {
			localStorage.bidarrVersion = bidarr.version;
		}
	},

	createMenu: function() {
		var menu = '<div id="tiago_csmp"><span onclick="javascript:CSM.clan_presentation.toggleSettings(this);" class="toggleSettings">'
				 + '<h3><a class="plus-more">+</a> Bidarr Plugin</h3>'
				 + '</span><form style="display: none;"><table class="table_trust">'

				 + '<tr><td>Auto Login:</td><td><input type="checkbox"' + ((bidarr.options.autoLogin == "1") ? " checked=checked " : " ")
				 + ' onchange="if(this.checked == true) localStorage[\'' + bidarr.login.localStorageVar + '\'] = 1; else localStorage[\'' + bidarr.login.localStorageVar + '\'] = 0;"></td></tr>'

				 + '<tr><td>S9 Reminder:</td><td><input type="checkbox"' + ((bidarr.options.s9 == "1") ? " checked=checked " : " ")
				 + ' onchange="if(this.checked == true) localStorage[\'' + bidarr.bets.s9.localStorageVar + '\'] = 1; else localStorage[\'' + bidarr.bets.s9.localStorageVar + '\'] = 0;"></td></tr>'

				 + '<tr><td>Simple Bets Reminder:</td><td><input type="checkbox"' + ((bidarr.options.bet == "1") ? " checked=checked " : " ")
				 + ' onchange="if(this.checked == true) localStorage[\'' + bidarr.bets.simple.localStorageVar + '\'] = 1; else localStorage[\'' + bidarr.bets.simple.localStorageVar + '\'] = 0;"></td></tr>' 

				 + '<tr><td>Transfer List Infinite Scroll:</td><td><input type="checkbox"' + ((bidarr.options.infiniteScroll == "1") ? " checked=checked " : " ")
				 + ' onchange="if(this.checked == true) localStorage[\'' + bidarr.infiniteScroll.localStorageVar + '\'] = 1; else localStorage[\'' + bidarr.infiniteScroll.localStorageVar + '\'] = 0;"></td></tr>' 

				 + '</table></form></div><hr>';

		 return menu;
	},

	options: {
		bet: null,
		s9: null,
		autoLogin: null,
		infiniteScroll: null
	},


	countries: {
		data: null,
		localStorageVar: "bidarrCountries",
		getCountries: function() {
			if (!bidarr.countries.data) {
				if (localStorage[bidarr.countries.localStorageVar]) {
					bidarr.countries.data = JSON.parse(localStorage[bidarr.countries.localStorageVar]);
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

	  						bidarr.countries.data = countries;
	  						localStorage[bidarr.countries.localStorageVar] = JSON.stringify(countries);
	  					}
					});
				}
			}
		}
	},

	// Auto login feature
	login: {
		localStorageVar: "bidarrConfigsAutoLogin",
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
			isDay: true,
			alertHtml: '<span style="display: block; background-color: #F2DEDE; text-align: center; margin-bottom: 10px; width: 100%; border: 1px solid #EED3D7;"><a href="http://www.cs-manager.com/csm/?p=community_betting" style="color: #B94A48;">Simple Bet Reminder!</a></span>',
			localStorageVar: "bidarrConfigsBet",
			checkIsDay: function() {
				if (bidarr.options.bet) {
					switch (bidarr.season_day) {
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
							bidarr.bets.simple.isDay = false;
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
			localStorageVar: "bidarrConfigsS9",
			checkIsDay: function() {
				if (bidarr.options.s9 == "1") {
					switch (bidarr.season_day) {
						case '3':
						case '4' :
						case '10':
						case '11': 
						case '17':
						case '18': 
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

	infiniteScroll: {
		loadedPages: 0,
		qtyPerPage: 8,
		localStorageVar: "bidarrInfiniteScroll",
		players: [],

		skills: {
			1: "Aim",
			2: "Teamplay",
			3: "Handling",
			4: "Playing IQ",
			5: "Quickness",
			6: "Determination",
			7: "Awareness",
			8: "Creativity",
			9: "Patience",
			10: "Calmness"
		},

		applyInfiniteScroll: function() {
			if (bidarr.options.infiniteScroll == "1" && bidarr.infiniteScroll.isTransferListPage()) {

				$("#wrapper").prepend("<div id='bidarrInfiniteScrollLoading' style='text-shadow: none;font-weight: bold;width:100%;height:50px;opacity:0.8;line-height: 50px;background-color:#333;position:fixed;bottom:0;left:0;text-align:center;color: #FFF;z-index:11111;'>Loading players, please wait...</div>");

				//Apply infinite scroll to the page
				bidarr.infiniteScroll.players = [];
				$("article.player").each(function() {
					var index = bidarr.infiniteScroll.players.length;
					bidarr.infiniteScroll.players[index] = {
						"dom": $(this),
						"skills": {}
					}

					var skill = 1;
					$(this).find("div.stats div.skills ul.skills-bar li").each(function() {
						if (skill < 11) {
							var urlPairs = bidarr.url.toArray($(this).find("div.visual img").attr("src"), true);
							bidarr.infiniteScroll.players[index].skills[skill] = {
								value: urlPairs.skill,
								limit: urlPairs.limit
							}
						}

						skill++;
					});
				});

				//Confirm the default players length
				bidarr.infiniteScroll.qtyPerPage = bidarr.infiniteScroll.players.length;

				var pages = [];
				$("#date-nav li").each(function() {
					var value;

					if ($(this).find("a").length > 0) {
						pages[pages.length] = $(this).find("a").prop("href");
					}
				});

				//The initial page will always be loaded at the beginning
				bidarr.infiniteScroll.loadedPages = 1;

				var loadPage = function(page) {
					$.ajax({
						url: pages[bidarr.infiniteScroll.loadedPages - 1],
						success: function(data) {
							bidarr.infiniteScroll.loadedPages++;

							var j = 0;
							$("article.player", $(data)).each(function() {
								var index = ((page - 1) * bidarr.infiniteScroll.qtyPerPage) + j;
								j++;
								
								bidarr.infiniteScroll.players[index] = {
									"dom": $(this),
									"skills": {}
								}

								$("#date-nav").before($(this));

								var skill = 1;
								$(this).find("div.stats div.skills ul.skills-bar li").each(function() {
									if (skill < 11) {
    									var urlPairs = bidarr.url.toArray($(this).find("div.visual img").attr("src"), true);
    									bidarr.infiniteScroll.players[index].skills[skill] = {
    										value: urlPairs.skill,
    										limit: urlPairs.limit
    									}
        							}

    								skill++;
								});
							});

							if (bidarr.infiniteScroll.loadedPages < pages.length) {
								loadPage(page + 1);
							} else {
								$("#date-nav").remove();
								$("#bidarrInfiniteScrollLoading").remove();

								//console.log(bidarr.infiniteScroll.players);
							}
						}
					});
				}

				if (pages.length > 0) {
					loadPage(2);
				} else {
					$("#date-nav").remove();
					$("#bidarrInfiniteScrollLoading").remove();
				}
			}
		},

		isTransferListPage: function() {
			if (bidarr.url.getVar("p") == "office_transfer" && (bidarr.url.getVar("s") == "list" || (bidarr.url.getVar("s") == "search" && bidarr.url.getVar("a") == "search") || !bidarr.url.getVar("s")) && !bidarr.url.getVar("start") || bidarr.url.getVar("start") == "0") {
				return true;
			} else {
				return false;
			}
		}
	},

	url: {
		params: {},

		toArray: function(url, noCache) {
			var urlPairs = {};
  			var pairs = url.substring(url.indexOf('?') + 1).split('&');
  			for (var i = 0; i < pairs.length; i++) {
    			var pair = pairs[i].split('=');

    			urlPairs[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    			if (typeof noCache == "undefined" || !noCache) {
    				bidarr.url.params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    			}
  			}

  			return urlPairs;
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