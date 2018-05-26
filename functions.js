var bidarr = {
	version: "123",
	season_day: null,

	init: function() {

		bidarr.url.toArray(window.location.href);

		bidarr.options.staffSearch = localStorage[bidarr.staffSearch.localStorageVar];
		if (!bidarr.options.staffSearch) {
			localStorage[bidarr.staffSearch.localStorageVar] = "0";
			bidarr.options.staffSearch = "0";
		}

		if (bidarr.options.staffSearch == "1" && bidarr.staffSearch.isStaffPage()) {
			bidarr.staffSearch.trySearch();
		}

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

            bidarr.options.pcwsReminder = localStorage[bidarr.pcwsReminder.localStorageVar];
            if (!bidarr.options.pcwsReminder) {
                localStorage[bidarr.pcwsReminder.localStorageVar] = "0";
                bidarr.options.pcwsReminder = "0";
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

			if (bidarr.options.staffSearch == "1") {
				bidarr.staffSearch.putSearchingElement();
			}

            bidarr.pcwsReminder.checkPcws();
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
				$("#main").prepend('<span style="display: block; background-color: #F2DEDE; text-align: center; margin-bottom: 10px; width: 100%; border: 1px solid #EED3D7;"><a href="http://www.cs-manager.com/csm/?p=clan_info&s=edit" style="color: #B94A48;">You\'re using a new version of Bidarr CSM Plugin! Check settings to enable any new feature.</a></span>');
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

				 + '<tr><td>Staff Search:</td><td><input type="checkbox"' + ((bidarr.options.staffSearch == "1") ? " checked=checked " : " ")
				 + ' onchange="if(this.checked == true) localStorage[\'' + bidarr.staffSearch.localStorageVar + '\'] = 1; else localStorage[\'' + bidarr.staffSearch.localStorageVar + '\'] = 0;"></td></tr>'

                 + '<tr><td>Pcw\'s Reminder:</td><td><input type="checkbox"' + ((bidarr.options.pcwsReminder == "1") ? " checked=checked " : " ")
				 + ' onchange="if(this.checked == true) localStorage[\'' + bidarr.pcwsReminder.localStorageVar + '\'] = 1; else localStorage[\'' + bidarr.pcwsReminder.localStorageVar + '\'] = 0;"></td></tr>'

				 + '</table></form></div><hr>';

		 return menu;
	},

	options: {
		bet: null,
		s9: null,
		autoLogin: null,
		infiniteScroll: null,
		staffSearch: null,
        pcwsReminder: null
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

	staffSearch: {
		localStorageVar: "bidarrStaffSearch",
		defaultAttemptsQuantity: "500",
		localStorageSearchingVar: "bidarrSearching",
		localStorageSearchingLimitVar: "bidarrSearchingLimit",
		localStorageSearchingMomentVar: "bidarrSearchingMoment",

		isStaffPage: function() {
			if (bidarr.url.getVar("p") == "office_staff" && (bidarr.url.getVar("s") == "manage" || bidarr.url.getVar("s") == "hire")) {
				return true;
			} else {
				return false;
			}
		},

		isSearchingEnabled: function() {
			if (localStorage[bidarr.staffSearch.localStorageSearchingVar] == "1") {
				return true;
			} else {
				return false;
			}
		},

		insideSearchingLimit: function() {
			if (typeof localStorage[bidarr.staffSearch.localStorageSearchingLimitVar] == "undefined") {
				localStorage[bidarr.staffSearch.localStorageSearchingLimitVar] = bidarr.staffSearch.defaultAttemptsQuantity;
			}

			if (parseInt(localStorage[bidarr.staffSearch.localStorageSearchingMomentVar]) < parseInt(localStorage[bidarr.staffSearch.localStorageSearchingLimitVar])) {
				return true;
			} else {
				return false;
			}
		},

		trySearch: function() {
			if (typeof localStorage.bidarrStaffSearchFound != "undefined") {
				$("#wrapper").prepend("<span style='display: block; background-color: #eeffee; color: #009900; text-align: center; margin-bottom: 10px; width: 100%; border: 1px solid #009900;'>Your staff was found. Hurry up to hire him!!</span>");
				localStorage.removeItem("bidarrStaffSearchFound");

				var found = false;
				$("#staff-list .staff-entry").each(function() {
					if (localStorage.bidarrStaffSearchNationality != "bidarr") {
						var nation = ($(this).find("ul > li:nth-child(4) > img").prop("src") == "http://www.cs-manager.com/images/flag_" + localStorage.bidarrStaffSearchNationality + ".png");
					} else {
						var nation = true;
					}
	    			var quality = ($(this).find("ul > li:nth-child(6) > img").prop("src") == "http://www.cs-manager.com/images/activity_" + localStorage.bidarrStaffSearchS1 + ".gif");
	    			var quantity = ($(this).find("ul > li:nth-child(7) > img").prop("src") == "http://www.cs-manager.com/images/activity_" + localStorage.bidarrStaffSearchS2 + ".gif");
	    			var knowledge = ($(this).find("ul > li:nth-child(8) > img").prop("src") == "http://www.cs-manager.com/images/activity_" + localStorage.bidarrStaffSearchS3 + ".gif");

	    			if (nation && quality && quantity && knowledge) {
        				$(this).css("border", "1px solid green");
	    			}
	    		});

	    		bidarr.staffSearch.removeParamsToStopSearching();

			} else if (bidarr.staffSearch.isStaffPage() && bidarr.staffSearch.isSearchingEnabled() && bidarr.staffSearch.insideSearchingLimit()) {

				$("#wrapper").prepend("<div id='bidarrSearchingAttempts' style='text-shadow: none;font-weight: bold;width:100%;height:50px;opacity:0.8;line-height: 50px;background-color:#333;position:fixed;bottom:0;left:0;text-align:center;color: #FFF;z-index:11111;'>Searching for staff, please wait... Attempt <span id='bidarrAttempt'>1</span> of " + localStorage[bidarr.staffSearch.localStorageSearchingLimitVar] + "</div>");

				$(window).on("beforeunload", function() {
					localStorage.removeItem("bidarrSearching");
				});

				var found = false;

				$.ajax({
  					url: window.location.href,
  					async: true,
  					success: function(data) {
  						$("#staff-list .staff-entry", $(data)).each(function() {
  							if (localStorage.bidarrStaffSearchNationality != "bidarr") {
  								var nation = ($(this).find("ul > li:nth-child(4) > img").prop("src") == "http://www.cs-manager.com/images/flag_" + localStorage.bidarrStaffSearchNationality + ".png");
  							} else {
  								var nation = true;
  							}
			    			var quality = ($(this).find("ul > li:nth-child(6) > img").prop("src") == "http://www.cs-manager.com/images/activity_" + localStorage.bidarrStaffSearchS1 + ".gif");
			    			var quantity = ($(this).find("ul > li:nth-child(7) > img").prop("src") == "http://www.cs-manager.com/images/activity_" + localStorage.bidarrStaffSearchS2 + ".gif");
			    			var knowledge = ($(this).find("ul > li:nth-child(8) > img").prop("src") == "http://www.cs-manager.com/images/activity_" + localStorage.bidarrStaffSearchS3 + ".gif");

			    			if (nation && quality && quantity && knowledge) {
			        			found = true;
			    			}
			    		});

			    		if (!found) {
							var aux = parseInt(localStorage[bidarr.staffSearch.localStorageSearchingMomentVar]) + 1;
							localStorage[bidarr.staffSearch.localStorageSearchingMomentVar] = aux + "";

							if (bidarr.staffSearch.insideSearchingLimit()) {
								$("#bidarrAttempt").html(localStorage[bidarr.staffSearch.localStorageSearchingMomentVar]);
		    					var request = this;

		    					setTimeout(function(){
		    						$.ajax(request);
		    					}, 2000);
							} else {
								//Stop search as we didn't found anything...
								bidarr.staffSearch.removeParamsToStopSearching();
								$("#bidarrSearchingAttempts").remove();
								$("#wrapper").prepend("<span style='display: block; background-color: #F2DEDE; color: #B94A48; text-align: center; margin-bottom: 10px; width: 100%; border: 1px solid #EED3D7;'>Unable to find your desired staff within the max number attempts! Try again later... :(</span>");
							}
						} else {
							//Staff was found!
							localStorage.bidarrStaffSearchFound = "1";
							window.location.reload();
						}
  					}
				});
			} else {
				bidarr.staffSearch.removeParamsToStopSearching();
			}
		},

		removeParamsToStopSearching: function() {
			localStorage.removeItem("bidarrStaffSearchNationality");
			localStorage.removeItem("bidarrStaffSearchS1");
			localStorage.removeItem("bidarrStaffSearchS2");
			localStorage.removeItem("bidarrStaffSearchS3");

			localStorage.removeItem(bidarr.staffSearch.localStorageSearchingMomentVar);
			localStorage.removeItem(bidarr.staffSearch.localStorageSearchingVar);
		},

		putSearchingElement: function() {
			if (bidarr.staffSearch.isStaffPage()) {
				$("#wrapper").prepend("<div id='bidarrStaffSearch'></div>");

				var html = "<table class='table_trust' style='display: none;'><tbody><tr>"
						+ "<td>Nationality:</td><td style='text-align: right;'><select id='bidarrStaffSearchNationality'>"
							+ "<option value='bidarr'>Any</option>"
							+ "<option value='ar'>Argentina</option>"
							+ "<option value='at'>Austria</option>"
							+ "<option value='be'>Belgium</option>"
							+ "<option value='br'>Brazil</option>"
							+ "<option value='cc'>CSM Country</option>"
							+ "<option value='dk'>Denmark</option>"
							+ "<option value='ee'>Estonia</option>"
							+ "<option value='fi'>Finland</option>"
							+ "<option value='fr'>France</option>"
							+ "<option value='de'>Germany</option>"
							+ "<option value='gr'>Greece</option>"
							+ "<option value='il'>Israel</option>"
							+ "<option value='lv'>Latvia</option>"
							+ "<option value='no'>Norway</option>"
							+ "<option value='pl'>Poland</option>"
							+ "<option value='pt'>Portugal</option>"
							+ "<option value='ro'>Romania</option>"
							+ "<option value='ru'>Russia</option>"
							+ "<option value='es'>Spain</option>"
							+ "<option value='se'>Sweden</option>"
							+ "<option value='ch'>Switzerland</option>"
							+ "<option value='uk'>UK</option>"
							+ "<option value='us'>USA</option>"
							+ "<option value='nl'>the Netherlands</option>"
						+ "</select></td></tr><tr>"
						+ "<td>Skill 1:</td><td style='text-align: right;'><select id='bidarrStaffSearchS1'>"
							+ "<option value='1'>1</option>"
							+ "<option value='2'>2</option>"
							+ "<option value='3'>3</option>"
							+ "<option value='4'>4</option>"
							+ "<option value='5' SELECTED>5</option>"
						+ "</select></td></tr><tr>"

						+ "<td>Skill 2:</td><td style='text-align: right;'><select id='bidarrStaffSearchS2'>"
							+ "<option value='1'>1</option>"
							+ "<option value='2'>2</option>"
							+ "<option value='3'>3</option>"
							+ "<option value='4'>4</option>"
							+ "<option value='5' SELECTED>5</option>"
						+ "</select></td></tr><tr>"

						+ "<td>Skill 3:</td><td style='text-align: right;'><select id='bidarrStaffSearchS3'>"
							+ "<option value='1'>1</option>"
							+ "<option value='2'>2</option>"
							+ "<option value='3'>3</option>"
							+ "<option value='4'>4</option>"
							+ "<option value='5' SELECTED>5</option>"
						+ "</select></td></tr><tr>"

						+ "<td></td><td style='text-align: right;'><button onclick='localStorage.bidarrStaffSearchNationality=$(\"#bidarrStaffSearchNationality\").val();"
							+ "localStorage.bidarrStaffSearchS1=$(\"#bidarrStaffSearchS1\").val();"
							+ "localStorage.bidarrStaffSearchS2=$(\"#bidarrStaffSearchS2\").val();"
							+ "localStorage.bidarrStaffSearchS3=$(\"#bidarrStaffSearchS3\").val();"
							+ "localStorage." + bidarr.staffSearch.localStorageSearchingMomentVar + "=\"1\";"
							+ "localStorage." + bidarr.staffSearch.localStorageSearchingVar + "=\"1\";"
							+ "window.location.reload();"
						+ "'>Search</button></td></tr></tbody></table>";

				$("#bidarrStaffSearch").html(html);
				$("#bidarrStaffSearch").prepend("<button onclick='$(\"#bidarrStaffSearch table\").toggle();'>Toggle Filters</button><br><br>")
			}
		}
	},

    pcwsReminder: {
        localStorageVar: "bidarrPcwsReminder",
        playedUrl: "http://www.cs-manager.com/csm/?p=game_games&s=played",
        upcomingUrl: "http://www.cs-manager.com/csm/?p=game_games&s=upcoming",
        today: 0,
        todayDateString: "",
        tomorrow: 0,
        tomorrowDateString: "",

        isPcwsReminderEnabled: function() {
            if (localStorage[bidarr.pcwsReminder.localStorageVar] == "1") {
				return true;
			} else {
				return false;
			}
        },

        checkPcws: function() {
            if (bidarr.pcwsReminder.isPcwsReminderEnabled()) {
                var todayDate = new Date();
                bidarr.pcwsReminder.todayDateString = todayDate.getFullYear() + "-"
                                + ((todayDate.getMonth() + 1) < 10 ? "0" + (todayDate.getMonth() + 1) : (todayDate.getMonth() + 1)) + "-"
                                + ((todayDate.getDate()) < 10 ? "0" + (todayDate.getDate()) : (todayDate.getDate()));

                var tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
                bidarr.pcwsReminder.tomorrowDateString = tomorrowDate.getFullYear() + "-"
                                + ((tomorrowDate.getMonth() + 1) < 10 ? "0" + (tomorrowDate.getMonth() + 1) : (tomorrowDate.getMonth() + 1)) + "-"
                                + ((tomorrowDate.getDate()) < 10 ? "0" + (tomorrowDate.getDate()) : (tomorrowDate.getDate()));

                $.ajax({
                    url: bidarr.pcwsReminder.playedUrl,
                    success: function(data) {

                        $("li.pcw", $(data)).find("div.match > div").each(function() {
                            if ($(this).html().trim().substr(0, 10) == bidarr.pcwsReminder.todayDateString) {
                                bidarr.pcwsReminder.today++;
                            }
                        });

                        $.ajax({
                            url: bidarr.pcwsReminder.upcomingUrl,
                            success: function(data) {

                                $("li.pcw", $(data)).find("div.match > div").each(function() {
                                    if ($(this).html().trim().substr(0, 10) == bidarr.pcwsReminder.todayDateString) {
                                        bidarr.pcwsReminder.today++;
                                    } else if ($(this).html().trim().substr(0, 10) == bidarr.pcwsReminder.tomorrowDateString) {
                                        bidarr.pcwsReminder.tomorrow++;
                                    }
                                });


                                bidarr.pcwsReminder.insertAlertsHtml();
                            }
                        });
                    }
                });
            }
        },

        insertAlertsHtml: function() {
            var show = false;
            var message = "You have a few pcw's missing for today/tomorrow!<br>";
            if (bidarr.pcwsReminder.today < 2 || bidarr.pcwsReminder.tomorrow < 2) {
                show = true;
            }

            if (show) {
                message += "Today: " + (2 - bidarr.pcwsReminder.today) + " | Tomorrow: " + (2 - bidarr.pcwsReminder.tomorrow);

                $("#main").prepend('<span style="display: block; background-color: #F2DEDE; text-align: center; margin-bottom: 10px; width: 100%; border: 1px solid #EED3D7;">' + message + '</span>');
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