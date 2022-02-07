let bidarr = {
    version: "142",
    season_day: null,

    init: function() {

        bidarr.url.toArray(window.location.href);

        bidarr.options.staffSearch = localStorage[bidarr.staffSearch.localStorageVar];
        if (!bidarr.options.staffSearch) {
            localStorage[bidarr.staffSearch.localStorageVar] = "0";
            bidarr.options.staffSearch = "0";
        }

        if (bidarr.options.staffSearch === "1" && bidarr.staffSearch.isStaffPage()) {
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

            bidarr.options.s9Analyser = localStorage[bidarr.bets.s9.analyser.localStorageVar];
            if (!bidarr.options.s9Analyser) {
                localStorage[bidarr.bets.s9.analyser.localStorageVar] = "0";
                bidarr.options.s9Analyser = "0";
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
            if (bidarr.url.getVar("p") === "clan_info" && bidarr.url.getVar("s") === "edit") {
                $("#cp-settings").prepend(bidarr.createMenu());
            }

            $("#shortcuts").find('ul').prepend('<li id="tiagop"> &raquo; <a href="/csm/?p=clan_info&amp;s=edit">Bidarr Settings</a></li>');

            bidarr.bets.simple.checkIsDay();
            bidarr.bets.s9.checkIsDay();

            if (bidarr.bets.isBetsPage()) {
                bidarr.bets.s9.analyser.init();
            }

            if (bidarr.options.infiniteScroll && bidarr.infiniteScroll.isTransferListPage()) {
                bidarr.infiniteScroll.applyInfiniteScroll();
            }

            if (bidarr.options.staffSearch === "1") {
                bidarr.staffSearch.putSearchingElement();
            }

            bidarr.pcwsReminder.checkPcws();
        } else {
            if (bidarr.options.autoLogin === "1") {
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
                $("#main").prepend('<span style="display: block; background-color: #F2DEDE; text-align: center; margin-bottom: 10px; width: 100%; border: 1px solid #EED3D7;"><a href="https://www.cs-manager.com/csm/?p=clan_info&s=edit" style="color: #B94A48;">You\'re using a new version of Bidarr CSM Plugin! Check settings to enable any new feature.</a></span>');
            }
        } else {
            localStorage.bidarrVersion = bidarr.version;
        }
    },

    createMenu: function() {
        return '<div id="tiago_csmp"><span onclick="CSM.clan_presentation.toggleSettings(this);" class="toggleSettings">'
            + '<h3><a class="plus-more">+</a> Bidarr Plugin</h3>'
            + '</span><form style="display: none;"><table class="table_trust">'

            + '<tr><td>Auto Login:</td><td><input type="checkbox"' + ((bidarr.options.autoLogin === "1") ? " checked=checked " : " ")
            + ' onchange="if(this.checked === true) localStorage[\'' + bidarr.login.localStorageVar + '\'] = 1; else localStorage[\'' + bidarr.login.localStorageVar + '\'] = 0;"></td></tr>'

            + '<tr><td>Simple Bets Reminder:</td><td><input type="checkbox"' + ((bidarr.options.bet === "1") ? " checked=checked " : " ")
            + ' onchange="if(this.checked === true) localStorage[\'' + bidarr.bets.simple.localStorageVar + '\'] = 1; else localStorage[\'' + bidarr.bets.simple.localStorageVar + '\'] = 0;"></td></tr>'

            + '<tr><td>S9 Reminder:</td><td><input type="checkbox"' + ((bidarr.options.s9 === "1") ? " checked=checked " : " ")
            + ' onchange="if(this.checked === true) localStorage[\'' + bidarr.bets.s9.localStorageVar + '\'] = 1; else localStorage[\'' + bidarr.bets.s9.localStorageVar + '\'] = 0;"></td></tr>'

            + '<tr><td>S9 Analyser:</td><td><input type="checkbox"' + ((bidarr.options.s9Analyser === "1") ? " checked=checked " : " ")
            + ' onchange="if(this.checked === true) localStorage[\'' + bidarr.bets.s9.analyser.localStorageVar + '\'] = 1; else localStorage[\'' + bidarr.bets.s9.analyser.localStorageVar + '\'] = 0;"></td></tr>'

            + '<tr><td>Transfer List Infinite Scroll:</td><td><input type="checkbox"' + ((bidarr.options.infiniteScroll === "1") ? " checked=checked " : " ")
            + ' onchange="if(this.checked === true) localStorage[\'' + bidarr.infiniteScroll.localStorageVar + '\'] = 1; else localStorage[\'' + bidarr.infiniteScroll.localStorageVar + '\'] = 0;"></td></tr>'

            + '<tr><td>Staff Search:</td><td><input type="checkbox"' + ((bidarr.options.staffSearch === "1") ? " checked=checked " : " ")
            + ' onchange="if(this.checked === true) localStorage[\'' + bidarr.staffSearch.localStorageVar + '\'] = 1; else localStorage[\'' + bidarr.staffSearch.localStorageVar + '\'] = 0;"></td></tr>'

            + '<tr><td>Pcw\'s Reminder:</td><td><input type="checkbox"' + ((bidarr.options.pcwsReminder === "1") ? " checked=checked " : " ")
            + ' onchange="if(this.checked === true) localStorage[\'' + bidarr.pcwsReminder.localStorageVar + '\'] = 1; else localStorage[\'' + bidarr.pcwsReminder.localStorageVar + '\'] = 0;"></td></tr>'

            + '</table></form></div><hr>';
    },

    options: {
        bet: null,
        s9: null,
        s9Analyser: null,
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
                        url: 'https://www.cs-manager.com/csm/?p=gameinfo&s=members',
                        async: false,
                        success: function(data) {
                            let countries = [];

                            $("#main #main-content table tbody > tr", $(data)).each(function() {
                                if (!$(this).hasClass("emphasized")) {
                                    countries[countries.length] = {
                                        flag: $(this).find("td:nth-child(1) img").prop("src").replace("https://www.cs-manager.com/images/flags/", "").replace(".png", ""),
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
            return $("#login-form").length === 1;
        },

        init: function() {
            if (bidarr.login.credentialsStored()) {
                bidarr.login.tryLogin();
            }
        },

        tryLogin: function() {
            let loginStatus = bidarr.url.getVar("loggedout");
            if (loginStatus) {
                bidarr.login.clearCredentials();
                bidarr.login.applyWatchers();
            } else {
                loginStatus = bidarr.url.getVar("status");
                if (loginStatus && (loginStatus === "bad_login" || loginStatus === "javascript")) {
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
            if (typeof localStorage.bidarrUsername != "undefined" && localStorage.bidarrUsername !== "") {
                if (typeof localStorage.bidarrPassword != "undefined" && localStorage.bidarrPassword !== "") {
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
            let loginUsernameElm = $("#login_username");
            let loginPasswordElm = $("#login_password");

            loginUsernameElm.on("blur",function() {
                if (loginUsernameElm.val().length > 0) {
                    localStorage.bidarrUsername = $("#login_username").val();
                }
            });

            loginUsernameElm.keypress(function(e) {
                if(e.which === 13) {
                    if (loginUsernameElm.val().length > 0) {
                        localStorage.bidarrUsername = $("#login_username").val();
                    }

                    if (loginUsernameElm.val().length > 0) {
                        localStorage.bidarrPassword = bidarr.login.encrypt(bidarr_hash, $("#login_password").val());
                    }
                }
            });

            loginPasswordElm.on("blur",function() {
                if (loginPasswordElm.val().length > 0) {
                    localStorage.bidarrPassword = bidarr.login.encrypt(bidarr_hash, $("#login_password").val());
                }
            });

            loginPasswordElm.keypress(function(e) {
                if(e.which === 13) {
                    if (loginPasswordElm.val().length > 0) {
                        localStorage.bidarrUsername = $("#login_username").val();
                    }

                    if (loginPasswordElm.val().length > 0) {
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
            alertHtml: '<span style="display: block; background-color: #F2DEDE; text-align: center; margin-bottom: 10px; width: 100%; border: 1px solid #EED3D7;"><a href="https://www.cs-manager.com/csm/?p=community_betting" style="color: #B94A48;">Simple Bet Reminder!</a></span>',
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
                            url: 'https://www.cs-manager.com/csm/?p=community_betting',
                            success: function(data) {
                                let formBet = $('td.close-time', $(data)).length;
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
            alertHtml: '<span style="display: block; background-color: #F2DEDE; color: #B94A48; text-align: center; margin-bottom: 10px; width: 100%; border: 1px solid #EED3D7;"><a href="https://www.cs-manager.com/csm/?p=community_betting" style="color: #B94A48;">S9 Reminder!</a></span>',
            localStorageVar: "bidarrConfigsS9",
            s9AnalyserParam: "bidarr_s9_analyse",
            checkIsDay: function() {
                if (bidarr.options.s9 === "1") {
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
                            url: 'https://www.cs-manager.com/csm/?p=community_betting',
                            success: function(data) {
                                let formS9 = $('#form_super', $(data)).length;
                                if (formS9 > 0) {
                                    $("#main").prepend(bidarr.bets.s9.alertHtml);
                                }
                            }
                        });
                    }
                }
            },
            analyser: {
                localStorageVar: "bidarrConfigsS9Analyser",
                init: function() {
                    if (bidarr.options.s9Analyser === "1") {
                        let urlParams = bidarr.url.toArray(window.location.href);
                        let s9Form = $("form#form_super");

                        if (typeof urlParams[bidarr.bets.s9.s9AnalyserParam] !== "undefined" && urlParams[bidarr.bets.s9.s9AnalyserParam] === "1") {
                            if (s9Form.length > 0) {
                                $("#wrapper").prepend("<div id='bidarrS9Analyser' style='text-shadow: none;font-weight: bold;width:100%;height:50px;opacity:0.8;line-height: 50px;background-color:#333;position:fixed;bottom:0;left:0;text-align:center;color: #FFF;z-index:11111;'>Analysing all s9 games. Please be patient while we finish...</div>");
                                setTimeout(function() {
                                    // We need to put this inside a setTimeout so we are able to insert the loader div
                                    // This needs to happen because the ajax requests are not assynchronous
                                    bidarr.bets.s9.analyser.analyse(s9Form);
                                    window.history.pushState('', '', '/csm/?p=community_betting');
                                    $("#bidarrS9Analyser").remove();
                                }, 50);
                            }
                        } else {
                            s9Form.prepend("<button onclick='window.location.href=\"/csm/?p=community_betting&" + bidarr.bets.s9.s9AnalyserParam + "=1\";return false;'>Analyse</button>");
                        }
                    }
                },
                analyse: function(formToAnalyse) {
                    // We have s9 to analyse
                    formToAnalyse.find("table tbody tr:gt(0):lt(9)").each(function() {
                        $(this).css("border", "1px solid gray");

                        let firstTeamAnchorElm = $(this).find("td.bet-event a:first");
                        let firstTeamAnchorHref = firstTeamAnchorElm.prop("href");

                        let secondTeamAnchorElm = $(this).find("td.bet-event a:last");
                        let secondTeamAnchorHref = secondTeamAnchorElm.prop("href");

                        let teamOneData = bidarr.bets.s9.analyser.getTeamData(firstTeamAnchorHref);
                        let teamTwoData = bidarr.bets.s9.analyser.getTeamData(secondTeamAnchorHref);

                        teamOneData.teamName = firstTeamAnchorElm.text().trim().replace(/\s\s+/g, ' ');
                        teamTwoData.teamName = secondTeamAnchorElm.text().trim().replace(/\s\s+/g, ' ');

                        let firstTeamUrlParams = bidarr.url.toArray(firstTeamAnchorHref);
                        teamOneData.id = firstTeamUrlParams.c;

                        let secondTeamUrlParams = bidarr.url.toArray(secondTeamAnchorHref);
                        teamTwoData.id = secondTeamUrlParams.c;

                        let leagueAnchorElmHref = $(this).find("td.bet-league a").prop("href");
                        let leagueData = bidarr.bets.s9.analyser.getLeagueData(leagueAnchorElmHref, teamOneData.id, teamTwoData.id);

                        teamOneData.league = leagueData.teamOne;
                        teamTwoData.league = leagueData.teamTwo;

                        let prepareTeamData = function (teamData) {
                            return "<b>Team:</b> " + teamData.teamName
                                + "<br><b>Manager:</b> " + teamData.managerName
                                + "<br><b>Rank:</b> " + teamData.rank + " "
                                + "<br><b style='float: left; margin-right: 5px;'>Activity:</b> " + "<img src='/images/activity_" + teamData.activity + ".gif'>"
                                + "<br>" + teamData.lastGamesMessage
                                + "<br><br>"
                                + "<table style='width: 350px;'>"
                                + "<tr></tr>"
                                + "<tr><td style='width: 50px;'>Pos</td><td style='width: 50px;'>W</td><td style='width: 50px;'>D</td><td style='width: 50px;'>L</td>"
                                + "<td style='width: 50px;'>RW</td><td style='width: 50px;'>RL</td><td style='width: 50px;'>+/-</td><td style='width: 50px;'>P</td></tr>"
                                + "<tr><td>" + teamData.league.pos + "</td><td>" + teamData.league.won + "</td><td>" + teamData.league.draw + "</td><td>"
                                + teamData.league.lost + "</td><td>" + teamData.league.rw + "</td><td>" + teamData.league.rl
                                + "</td><td>" + teamData.league.rd + "</td><td>" + teamData.league.points + "</td></tr>"
                                + "</table>";
                        };

                        let htmlToInsert = "<tr style='border: 1px solid gray;'><td colspan='6' style='text-align: left;'>"
                            + prepareTeamData(teamOneData)
                            + "<hr>"
                            + prepareTeamData(teamTwoData)
                            + "<br>"
                            + "</td></tr>";

                        $(this).after(htmlToInsert);
                    });
                },
                getTeamData: function(url) {
                    let response = {};
                    $.ajax({
                        url: url,
                        async: false,
                        success: function(data) {
                            response.rank = $("ul.cp-top-info li:nth(2):not(strong)", $(data)).text().replace("Rank:", " ").trim().replace(/\s\s+/g, ' ');
                            response.activity = parseInt($("ul.cp-top-info li:nth(4) img", $(data)).prop("src").replace("https://www.cs-manager.com/images/activity_", "").replace(".gif", ""));
                            response.lastGamesMessage = $("ul.cp-top-info li a.openLastLeagueGamesDialog", $(data)).text().trim().replace(/\s\s+/g, ' ');
                            response.managerName = $("section#main-content div#wrapper h1 span:nth(0)", $(data)).text().trim().replace(/\s\s+/g, ' ');
                        }
                    });

                    return response;
                },

                getLeagueData: function(url, teamOneId, teamTwoId) {
                    let response = {
                        teamOne: {},
                        teamTwo: {}
                    };

                    $.ajax({
                        url: url,
                        async: false,
                        success: function(data) {
                            let teamOneData = $("table#league-table span.spantag_clan_name_" + teamOneId, $(data)).parents('tr');

                            response.teamOne.pos = teamOneData.find("td:nth(0)").text();
                            response.teamOne.won = teamOneData.find("td:nth(3)").text();
                            response.teamOne.draw = teamOneData.find("td:nth(4)").text();
                            response.teamOne.lost = teamOneData.find("td:nth(5)").text();
                            response.teamOne.rw = teamOneData.find("td:nth(6)").text();
                            response.teamOne.rl = teamOneData.find("td:nth(7)").text();
                            response.teamOne.rd = teamOneData.find("td:nth(8)").text();
                            response.teamOne.points = teamOneData.find("td:nth(9)").text();

                            let teamTwoData = $("table#league-table span.spantag_clan_name_" + teamTwoId, $(data)).parents('tr');

                            response.teamTwo.pos = teamTwoData.find("td:nth(0)").text();
                            response.teamTwo.won = teamTwoData.find("td:nth(3)").text();
                            response.teamTwo.draw = teamTwoData.find("td:nth(4)").text();
                            response.teamTwo.lost = teamTwoData.find("td:nth(5)").text();
                            response.teamTwo.rw = teamTwoData.find("td:nth(6)").text();
                            response.teamTwo.rl = teamTwoData.find("td:nth(7)").text();
                            response.teamTwo.rd = teamTwoData.find("td:nth(8)").text();
                            response.teamTwo.points = teamTwoData.find("td:nth(9)").text();
                        }
                    });

                    return response;
                }
            }
        },

        isBetsPage: function() {
            return bidarr.url.getVar("p") === "community_betting";
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
            if (bidarr.options.infiniteScroll === "1" && bidarr.infiniteScroll.isTransferListPage()) {

                $("#wrapper").prepend("<div id='bidarrInfiniteScrollLoading' style='text-shadow: none;font-weight: bold;width:100%;height:50px;opacity:0.8;line-height: 50px;background-color:#333;position:fixed;bottom:0;left:0;text-align:center;color: #FFF;z-index:11111;'>Loading players, please wait...</div>");

                //Apply infinite scroll to the page
                bidarr.infiniteScroll.players = [];
                $("article.player").each(function() {
                    let index = bidarr.infiniteScroll.players.length;
                    bidarr.infiniteScroll.players[index] = {
                        "dom": $(this),
                        "skills": {}
                    }

                    let skill = 1;
                    $(this).find("div.stats div.skills ul.skills-bar li").each(function() {
                        if (skill < 11) {
                            let urlPairs = bidarr.url.toArray($(this).find("div.visual img").attr("src"), true);
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

                let pages = [];
                $("#date-nav li").each(function() {
                    if ($(this).find("a").length > 0) {
                        pages[pages.length] = $(this).find("a").prop("href");
                    }
                });

                //The initial page will always be loaded at the beginning
                bidarr.infiniteScroll.loadedPages = 1;

                let loadPage = function(page) {
                    $.ajax({
                        url: pages[bidarr.infiniteScroll.loadedPages - 1],
                        success: function(data) {
                            bidarr.infiniteScroll.loadedPages++;

                            let j = 0;
                            $("article.player", $(data)).each(function() {
                                let index = ((page - 1) * bidarr.infiniteScroll.qtyPerPage) + j;
                                j++;

                                bidarr.infiniteScroll.players[index] = {
                                    "dom": $(this),
                                    "skills": {}
                                }

                                $("#date-nav").before($(this));

                                let skill = 1;
                                $(this).find("div.stats div.skills ul.skills-bar li").each(function() {
                                    if (skill < 11) {
                                        let urlPairs = bidarr.url.toArray($(this).find("div.visual img").attr("src"), true);
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

        isTransferListPage: function () {
            return bidarr.url.getVar("p") === "office_transfer" && (bidarr.url.getVar("s") === "list" || (bidarr.url.getVar("s") === "search" && bidarr.url.getVar("a") === "search") || !bidarr.url.getVar("s")) && !bidarr.url.getVar("start") || bidarr.url.getVar("start") === "0";
        }
    },

    staffSearch: {
        localStorageVar: "bidarrStaffSearch",
        defaultAttemptsQuantity: "500",
        localStorageSearchingVar: "bidarrSearching",
        localStorageSearchingLimitVar: "bidarrSearchingLimit",
        localStorageSearchingMomentVar: "bidarrSearchingMoment",

        isStaffPage: function() {
            return bidarr.url.getVar("p") === "office_staff" && (bidarr.url.getVar("s") === "manage" || bidarr.url.getVar("s") === "hire");
        },

        isSearchingEnabled: function() {
            return localStorage[bidarr.staffSearch.localStorageSearchingVar] === "1";
        },

        insideSearchingLimit: function() {
            if (typeof localStorage[bidarr.staffSearch.localStorageSearchingLimitVar] == "undefined") {
                localStorage[bidarr.staffSearch.localStorageSearchingLimitVar] = bidarr.staffSearch.defaultAttemptsQuantity;
            }

            return parseInt(localStorage[bidarr.staffSearch.localStorageSearchingMomentVar]) < parseInt(localStorage[bidarr.staffSearch.localStorageSearchingLimitVar]);
        },

        trySearch: function() {
            if (typeof localStorage.bidarrStaffSearchFound != "undefined") {
                $("#wrapper").prepend("<span style='display: block; background-color: #eeffee; color: #009900; text-align: center; margin-bottom: 10px; width: 100%; border: 1px solid #009900;'>Your staff was found. Hurry up to hire him!!</span>");
                localStorage.removeItem("bidarrStaffSearchFound");

                let found = false;
                $("#staff-list .staff-entry").each(function() {
                    let nation;
                    if (localStorage.bidarrStaffSearchNationality !== "bidarr") {
                        nation = ($(this).find("ul > li:nth-child(4) > img").prop("src") === "https://www.cs-manager.com/images/flag_" + localStorage.bidarrStaffSearchNationality + ".png");
                    } else {
                        nation = true;
                    }

                    let quality = ($(this).find("ul > li:nth-child(6) > img").prop("src") === "https://www.cs-manager.com/images/activity_" + localStorage.bidarrStaffSearchS1 + ".gif");
                    let quantity = ($(this).find("ul > li:nth-child(7) > img").prop("src") === "https://www.cs-manager.com/images/activity_" + localStorage.bidarrStaffSearchS2 + ".gif");
                    let knowledge = ($(this).find("ul > li:nth-child(8) > img").prop("src") === "https://www.cs-manager.com/images/activity_" + localStorage.bidarrStaffSearchS3 + ".gif");

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

                let found = false;

                $.ajax({
                    url: window.location.href,
                    async: true,
                    success: function(data) {
                        $("#staff-list .staff-entry", $(data)).each(function() {
                            let nation;
                            if (localStorage.bidarrStaffSearchNationality !== "bidarr") {
                                nation = ($(this).find("ul > li:nth-child(4) > img").prop("src") === "https://www.cs-manager.com/images/flag_" + localStorage.bidarrStaffSearchNationality + ".png");
                            } else {
                                nation = true;
                            }

                            let quality = ($(this).find("ul > li:nth-child(6) > img").prop("src") === "https://www.cs-manager.com/images/activity_" + localStorage.bidarrStaffSearchS1 + ".gif");
                            let quantity = ($(this).find("ul > li:nth-child(7) > img").prop("src") === "https://www.cs-manager.com/images/activity_" + localStorage.bidarrStaffSearchS2 + ".gif");
                            let knowledge = ($(this).find("ul > li:nth-child(8) > img").prop("src") === "https://www.cs-manager.com/images/activity_" + localStorage.bidarrStaffSearchS3 + ".gif");

                            if (nation && quality && quantity && knowledge) {
                                found = true;
                            }
                        });

                        if (!found) {
                            let aux = parseInt(localStorage[bidarr.staffSearch.localStorageSearchingMomentVar]) + 1;
                            localStorage[bidarr.staffSearch.localStorageSearchingMomentVar] = aux + "";

                            if (bidarr.staffSearch.insideSearchingLimit()) {
                                $("#bidarrAttempt").html(localStorage[bidarr.staffSearch.localStorageSearchingMomentVar]);
                                let request = this;

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

                let html = "<table class='table_trust' style='display: none;'><tbody><tr>"
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

                let bidarrStaffSearchElm = $("#bidarrStaffSearch");
                bidarrStaffSearchElm.html(html);
                bidarrStaffSearchElm.prepend("<button onclick='$(\"#bidarrStaffSearch table\").toggle();'>Toggle Filters</button><br><br>")
            }
        }
    },

    pcwsReminder: {
        localStorageVar: "bidarrPcwsReminder",
        playedUrl: "https://www.cs-manager.com/csm/?p=game_games&s=played",
        upcomingUrl: "https://www.cs-manager.com/csm/?p=game_games&s=upcoming",
        today: 0,
        todayDateString: "",
        tomorrow: 0,
        tomorrowDateString: "",

        isPcwsReminderEnabled: function() {
            return localStorage[bidarr.pcwsReminder.localStorageVar] === "1";
        },

        checkPcws: function() {
            if (bidarr.pcwsReminder.isPcwsReminderEnabled()) {
                let todayDate = new Date();
                bidarr.pcwsReminder.todayDateString = todayDate.getFullYear() + "-"
                    + ((todayDate.getMonth() + 1) < 10 ? "0" + (todayDate.getMonth() + 1) : (todayDate.getMonth() + 1)) + "-"
                    + ((todayDate.getDate()) < 10 ? "0" + (todayDate.getDate()) : (todayDate.getDate()));

                let tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
                bidarr.pcwsReminder.tomorrowDateString = tomorrowDate.getFullYear() + "-"
                    + ((tomorrowDate.getMonth() + 1) < 10 ? "0" + (tomorrowDate.getMonth() + 1) : (tomorrowDate.getMonth() + 1)) + "-"
                    + ((tomorrowDate.getDate()) < 10 ? "0" + (tomorrowDate.getDate()) : (tomorrowDate.getDate()));

                $.ajax({
                    url: bidarr.pcwsReminder.playedUrl,
                    success: function(data) {

                        $("li.pcw", $(data)).find("div.match > div").each(function() {
                            if ($(this).html().trim().substr(0, 10) === bidarr.pcwsReminder.todayDateString) {
                                bidarr.pcwsReminder.today++;
                            }
                        });

                        $.ajax({
                            url: bidarr.pcwsReminder.upcomingUrl,
                            success: function(data) {

                                $("li.pcw", $(data)).find("div.match > div").each(function() {
                                    if ($(this).html().trim().substr(0, 10) === bidarr.pcwsReminder.todayDateString) {
                                        bidarr.pcwsReminder.today++;
                                    } else if ($(this).html().trim().substr(0, 10) === bidarr.pcwsReminder.tomorrowDateString) {
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
            let show = false;
            let message = "You have a few pcw's missing for today/tomorrow!<br>";
            if (bidarr.pcwsReminder.today < 2 || bidarr.pcwsReminder.tomorrow < 2) {
                show = true;
            }

            if (show) {
                message += "Today: " + (2 - bidarr.pcwsReminder.today) + " | Tomorrow: " + (2 - bidarr.pcwsReminder.tomorrow);

                $("#main").prepend('<span style="display: block; background-color: #F2DEDE; text-align: center; margin-bottom: 10px; width: 100%; border: 1px solid #EED3D7;">' + message + '</span>');
            }
        }
    },

    powerRanking: {
        init: function() {
            let currentSeason;
        }
    },

    url: {
        params: {},

        toArray: function(url, noCache) {
            let urlPairs = {};
            let pairs = url.substring(url.indexOf('?') + 1).split('&');
            for (let i = 0; i < pairs.length; i++) {
                let pair = pairs[i].split('=');

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
            window.location.href = "https://www.cs-manager.com/";
        }
    }
};

bidarr.init();
