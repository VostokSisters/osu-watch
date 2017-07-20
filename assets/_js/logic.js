(() => {
"use strict";
var 
	animationEnd = 'webkitAnimationEnd oanimationend msAnimationEnd animationend',

	$user_content_wrapper,
	
	$user_profile,
	$form_select_user,
	$input_username,
	$input_username_h1,
	
	$user_profile_avatar,
	$user_profile_avatar_img,
	$user_profile_username,
	$user_profile_ranking_pp,
	$user_profile_ranking_rank,
	$user_profile_acc,
	$user_profile_pc,
	$user_profile_ranking_SS_count,
	$user_profile_ranking_S_count,
	$user_profile_ranking_A_count,
	$user_profile_lvl_current_level,
	$user_profile_lvl_row_wrapper,
	$user_profile_details_rank_and_pp,
	$user_profile_details_accuracy,
	$user_profile_details_playcount,
	$user_profile_details_count_ss,
	$user_profile_details_count_s,
	$user_profile_details_count_a,
	$user_profile_details_level,

	$user_feed,
	$plays_feed,
	
	$api_key_wrapper,
	$api_key_wrapper_input,

	$toggler,
	isTogglerSorted = false,
	
	holdUpInput = 0,
	mainWidth = 438,

	timeoutForRequestWhenWeTryToGetUserProfile = 3000,
	timeoutForRequestWhenWeTryToGetUserRecentPlay = 5000,
	timeoutForRequestWhenWeTryToGetBeatmapInformation = 5000,
	timeoutForRequestWhenWeTryToGetPPForRecentScore = 5000,
	timeForNewRequestForPPByRecentScore = 1000,
	timeForUpdateProfileAfterNewRecentScore = 2000,
	timeoutForUpdateProfileAfterNewRecentScore = 5000,
	timeoutForGettingPpBecausePpyHaveShittyServers = 500,

	scoreDateRangeError = 5000, // in ms
	
	APIkey = localStorage.getItem('APIkey'), 
	APIuri = "https://osu.ppy.sh/api/";
	// currentState = history.state;

function showError (errorMsg) { // Показываем ошибку
	holdUpInput = 1;
	var $error_cloud = $('.error_cloud');
	switch (errorMsg) {
		case 1:
			errorMsg = 'Username is too short';
			break;
		case 2:
			errorMsg = 'Incorrect username';
			break;
		case 3:
			errorMsg = 'User not found :(';
			break;
		case 4:
			errorMsg = 'API key is not valid';
			break;
		case 5:
			errorMsg = 'This is not a API key =S';
			break;
		case 6:
			errorMsg = 'API key is required';
			break;
	}
	$error_cloud.children('h1').text(errorMsg);
	$error_cloud.one(animationEnd, () => {
		$error_cloud.removeClass('show_error');
		holdUpInput = 0;
	});
	$error_cloud.addClass('show_error');
} // showError

function scrollControl () {
	$('body').css('min-height', $('.user_feed')[0].offsetHeight + 210);
}

function countRanking (number) {
	return Number(number) > 999 ? (Math.floor(number / 100) / 10)  + 'k': number;
}

function checkUsername (username) {
	function sendRequest () {
		$.ajax({
			url: APIuri + "get_user",
			type: "GET",
			data: {k: APIkey, u: username, event_days: '1'}, 
			success: function (res) {
				if (!res.length){
					showError(3);
					$input_username.prop('disabled', false).css('user-select', '').focus();
					return;
				}
				showUser(res[0]);
			},
			error: function(jqXHR) {
				if (jqXHR.statusText == 'timeout') {
					sendRequest();
					return;
				}
				// Если API ключ не валидный, показываем ошибку и просим ввести ключ заного
				showError(4);
				$input_username.prop('disabled', false).css('user-select', '');
				$api_key_wrapper.removeClass('with_key').addClass('without_key');
				$api_key_wrapper_input.prop('disabled', false).val('').focus();
				localStorage.removeItem('APIkey');
				APIkey = null;
				return;
			},
			timeout: timeoutForRequestWhenWeTryToGetUserProfile
		});
	}

	$input_username.blur().prop('disabled', true).css('user-select', 'none');
	$input_username_h1.stop().finish().fadeOut(800);
	sendRequest();
}

function showUser (user) { // Показываем поцана
	console.log(user.username + " — Initial state", user);

	$user_profile_avatar_img.one('load', function() {
		// Запускаем гуся (анимашку)
		$user_content_wrapper.addClass('show_user');
		history.pushState({pushed: true}, "", "?id=" + user.user_id);
		startWatch(user);
	});

	$user_profile_avatar_img.attr('src', 'https://a.ppy.sh/' + user.user_id);
	$user_profile_avatar.attr('href', 'https://osu.ppy.sh/u/' + user.user_id);
	$user_profile_username.attr('href', 'https://osu.ppy.sh/u/' + user.user_id);
	$user_profile_username.text(user.username);
	$user_profile_ranking_pp.html(Math.round(user.pp_raw) + '<span>pp</span>');
	$user_profile_ranking_rank.text('#' + (user.pp_rank ? user.pp_rank  : 'inactive'));
	$user_profile_acc.text((Math.round(user.accuracy * 100) / 100) + '%');
		$user_profile_details_accuracy.find('p:first').text((Math.round(user.accuracy * 100) / 100) + '%');
	$user_profile_pc.text(user.playcount ? user.playcount : '0');
		$user_profile_details_playcount.find('p:first').text(user.playcount ? user.playcount : '0');
	$user_profile_ranking_SS_count.text(user.count_rank_ss ? countRanking(user.count_rank_ss) : 0);
		$user_profile_details_count_ss.find('p:first').text(user.count_rank_ss ? countRanking(user.count_rank_ss) : 0);
	$user_profile_ranking_S_count.text(user.count_rank_s ? countRanking(user.count_rank_s) : 0);
		$user_profile_details_count_s.find('p:first').text(user.count_rank_s ? countRanking(user.count_rank_s) : 0);
	$user_profile_ranking_A_count.text(user.count_rank_a ? countRanking(user.count_rank_a) : 0);
		$user_profile_details_count_a.find('p:first').text(user.count_rank_a ? countRanking(user.count_rank_a) : 0);
	$user_profile_lvl_row_wrapper.css('width', (user.level && user.level.replace(/\d+\.?/,'') ? user.level.replace(/\d+\.?/,'0.') : '0') * mainWidth);
	$user_profile_lvl_current_level.text(" " + (user.level ? user.level.replace(/\.\d+/, '') : '0'));
		$user_profile_details_level.find('p:first').text(Math.floor(Number(user.level) * 100) / 100 );
} // Показываем поцана

function startWatch (user) {
	var 
		userInitalState = user,
		latestProfileState = user,
		userRecentestScore = {},
		countOfAddedRecords = 0,
		isUpdatingProfileNow = false,

		allmods =
		{
			Nomod		: 0,
			NF			: 1,
			ES			: 2,
			HD			: 8,
			HR			: 16,
			SD			: 32,
			DT			: 64,
			RX			: 128,
			HT			: 256,
			NC			: 512, // Only set along with DoubleTime. i.e: NC only gives 576
			FL			: 1024,
			AO			: 2048,
			SO			: 4096,
			AP			: 8192,	// Autopilot?
			PF			: 16384 // Only set along with SuddenDeath. i.e: PF only gives 16416  
		};

	function getMods (scoreMods) {
		let namesOfScoreMods = [];
		for (var mod in allmods)
			if  (scoreMods & allmods[mod]) namesOfScoreMods.push(mod);

		if (~namesOfScoreMods.indexOf('DT') && ~namesOfScoreMods.indexOf('NC'))
			namesOfScoreMods.splice(namesOfScoreMods.indexOf('DT'), 1);

		return namesOfScoreMods.length ? namesOfScoreMods.join(" ") : "Nomod";
	}

	function updateProfile () {
		isUpdatingProfileNow = true;
		$.ajax({
			url: APIuri + "get_user",
			type: "GET",
			data: {k: APIkey, u: user.user_id, event_days: '1'},
			success: function(xhrUserProfile) {
				let skippedProperties = ['count50', 'count100', 'count300', 'country', 'events', 'ranked_score', 'total_score', 'user_id', 'username', 'pp_country_rank'];
				let colorUp = "0px 0px 4px black, 0px 0px 6px lightgreen, 0px 0px 10px lightgreen";
				let colorDown = "0px 0px 4px black, 0px 0px 6px red, 0px 0px 10px red";
				xhrUserProfile = xhrUserProfile[0];

				for (let property in xhrUserProfile) {
					if (skippedProperties.indexOf(property) !== -1) continue;
					if (latestProfileState[property] !== xhrUserProfile[property]) {
						switch (property) {
							case 'playcount' :
								$user_profile_pc.text(xhrUserProfile.playcount);
								$user_profile_pc.css('text-shadow', colorUp);
								$user_profile_details_playcount.show(); 
								$user_profile_details_playcount.find('p:last').text('+ ' + (xhrUserProfile.playcount - userInitalState.playcount));
								break;
							case 'accuracy' :
								let initalAcc = Math.round(userInitalState.accuracy * 100) / 100;
								let currentAcc = Math.round(xhrUserProfile.accuracy * 100) / 100;
								$user_profile_acc.text(currentAcc + '%');
								if (initalAcc !== currentAcc) {
									$user_profile_acc.css('text-shadow', currentAcc > initalAcc ? colorUp : colorDown);
									$user_profile_details_accuracy.show();
									$user_profile_details_accuracy.find('p:last').text((currentAcc > initalAcc ? '+ ' : '- ') + (Math.round(Math.abs(currentAcc - initalAcc) * 100) / 100) + '%');
								}
								else {
									$user_profile_details_accuracy.hide();
									$user_profile_acc.css('text-shadow', '');
								}
								break;
							case 'count_rank_a' :
								$user_profile_ranking_A_count.text(xhrUserProfile.count_rank_a ? countRanking(xhrUserProfile.count_rank_a) : 0);
								if (xhrUserProfile.count_rank_a !== userInitalState.count_rank_a) {
									$user_profile_ranking_A_count.css('text-shadow', Number(xhrUserProfile.count_rank_a) > Number(userInitalState.count_rank_a) ? colorUp : colorDown);
									$user_profile_details_count_a.find('p:last').text((Number(xhrUserProfile.count_rank_a) > Number(userInitalState.count_rank_a) ? '+ ' : '- ') + Math.abs(Number(xhrUserProfile.count_rank_a) - Number(userInitalState.count_rank_a)));
									$user_profile_details_count_a.show();
								}
								else {
									$user_profile_ranking_A_count.css('text-shadow', '');
									$user_profile_details_count_a.hide();
								}
								break;
							case 'count_rank_s' :
								$user_profile_ranking_S_count.text(xhrUserProfile.count_rank_s ? countRanking(xhrUserProfile.count_rank_s) : 0);
								if (xhrUserProfile.count_rank_s !== userInitalState.count_rank_s) {
									$user_profile_ranking_S_count.css('text-shadow', Number(xhrUserProfile.count_rank_s) > Number(userInitalState.count_rank_s) ? colorUp : colorDown);
									$user_profile_details_count_s.find('p:last').text((Number(xhrUserProfile.count_rank_s) > Number(userInitalState.count_rank_s) ? '+ ' : '- ') + Math.abs(Number(xhrUserProfile.count_rank_s) - Number(userInitalState.count_rank_s)));
									$user_profile_details_count_s.show();
								}
								else {
									$user_profile_ranking_S_count.css('text-shadow', '');
									$user_profile_details_count_s.hide();
								}
								break;
							case 'count_rank_ss' :
								$user_profile_ranking_SS_count.text(xhrUserProfile.count_rank_ss ? countRanking(xhrUserProfile.count_rank_ss) : 0);
								if (xhrUserProfile.count_rank_ss !== userInitalState.count_rank_ss) {
									$user_profile_ranking_SS_count.css('text-shadow', Number(xhrUserProfile.count_rank_ss) > Number(userInitalState.count_rank_ss) ? colorUp : colorDown);
									$user_profile_details_count_ss.find('p:last').text((Number(xhrUserProfile.count_rank_ss) > Number(userInitalState.count_rank_ss) ? '+ ' : '- ') + Math.abs(Number(xhrUserProfile.count_rank_ss) - Number(userInitalState.count_rank_ss)));
									$user_profile_details_count_ss.show();
								}
								else {
									$user_profile_ranking_SS_count.css('text-shadow', '');
									$user_profile_details_count_ss.hide();
								}
								break;
							case 'pp_raw' :
								let ppCurrent = Math.round(xhrUserProfile.pp_raw);
								let ppInital =  Math.round(userInitalState.pp_raw);
								$user_profile_ranking_pp.html(ppCurrent + '<span>pp</span>');
								if (ppCurrent !== ppInital) {
									$user_profile_ranking_pp.css('text-shadow', ppCurrent > ppInital ? colorUp : colorDown);
									$user_profile_details_rank_and_pp.show();
									$user_profile_details_rank_and_pp.find('p:nth-of-type(1)').html(ppInital + '<span class="little">pp</span>');
									$user_profile_details_rank_and_pp.find('p:nth-of-type(3)').html((ppCurrent > ppInital ? '+ ' : '- ') + Math.abs(ppCurrent - ppInital) + '<span class="little">pp</span>');
								}
								else {
									$user_profile_ranking_pp.css('text-shadow', '');
									$user_profile_details_rank_and_pp.find('p:nth-of-type(1)').html('');
									$user_profile_details_rank_and_pp.find('p:nth-of-type(3)').html('');
								}
								if (xhrUserProfile.pp_raw !== userInitalState.pp_raw || xhrUserProfile.pp_rank !== userInitalState.pp_rank)
									$user_profile_details_rank_and_pp.show();
								else
									$user_profile_details_rank_and_pp.hide();
								break;
							case 'pp_rank' :
								let pp_rank_current = Number(xhrUserProfile.pp_rank);
								let pp_rank_inital  = Number(userInitalState.pp_rank);
								$user_profile_ranking_rank.text('#' + pp_rank_current);
								if (pp_rank_current !== pp_rank_inital) {
									$user_profile_ranking_rank.css('text-shadow', pp_rank_current > pp_rank_inital ? colorDown : colorUp);
									$user_profile_details_rank_and_pp.show();
									$user_profile_details_rank_and_pp.find('p:nth-of-type(2)').text('#' + (pp_rank_inital ? pp_rank_inital  : 'inactive'));
									$user_profile_details_rank_and_pp.find('p:nth-of-type(4)').text((pp_rank_current < pp_rank_inital ? '+ ' : '- ') + '#' + Math.abs(pp_rank_current - pp_rank_inital));
								}
								else {
									$user_profile_ranking_rank.css('text-shadow', '');
									$user_profile_details_rank_and_pp.find('p:nth-of-type(2)').text('');
									$user_profile_details_rank_and_pp.find('p:nth-of-type(4)').text('');
								}
								if (xhrUserProfile.pp_raw !== userInitalState.pp_raw || xhrUserProfile.pp_rank !== userInitalState.pp_rank)
									$user_profile_details_rank_and_pp.show();
								else
									$user_profile_details_rank_and_pp.hide();
								break;
							case 'level' :
								$user_profile_lvl_row_wrapper.css('width', (xhrUserProfile.level && xhrUserProfile.level.replace(/\d+\.?/,'') ? xhrUserProfile.level.replace(/\d+\.?/,'0.') : '0') * mainWidth);
								$user_profile_lvl_current_level.text(" " + xhrUserProfile.level.replace(/\.\d+/, ''));
								let currentLvl = Math.floor(Number(xhrUserProfile.level) * 100) / 100;
								let initalLvl  = Math.floor(Number(userInitalState.level) * 100) / 100;
								if (currentLvl !== initalLvl) {
									$user_profile_lvl_current_level.css('text-shadow', currentLvl > initalLvl ? colorUp : colorDown);
									$user_profile_details_level.show();
									$user_profile_details_level.find('p:last').text((currentLvl > initalLvl ? '+ ' : '- ') + (Math.floor(Math.abs(currentLvl - initalLvl) * 100) / 100));
								}
								else {
									$user_profile_lvl_current_level.css('text-shadow', '');
									$user_profile_details_level.hide();
								}
								break;
							default :
								continue;
						}
					}

				} // сравниваем все свойства
				isUpdatingProfileNow = false;
				latestProfileState = xhrUserProfile;
			},
			error: function() {
				updateProfile();
			},
			timeout: timeoutForUpdateProfileAfterNewRecentScore
		});
	}

	function getPP ($addedScore, recentScoreData) {
		$.ajax({
			url: APIuri + "get_scores",
			type: "GET",
			data: {k: APIkey, b: recentScoreData.beatmap_id, u: user.user_id, type: "id"},
			success: function(xhrScoresData) {
				var submitScorePp = '';
				var fMaxScore = 1;
				xhrScoresData.forEach(function(score) {
					let scoreDateError = new Date(score.date) - new Date(recentScoreData.date);
					if ((scoreDateError <= scoreDateRangeError) && (scoreDateError >= -scoreDateRangeError)) {
						submitScorePp = score.pp ? Number(score.pp) : null;
						if (submitScorePp === null) 
							return;
						xhrScoresData.forEach(function(score) {
							if (submitScorePp < Number(score.pp)) {
								fMaxScore = 0;
								return;
							} 
						});
						return;
					}
				});

				if (submitScorePp === null) {
					console.warn("PP за поставленный скор ещё не посчитались, делаем ещё один запрос!");
					setTimeout(() => {getPP($addedScore, recentScoreData);} , timeForNewRequestForPPByRecentScore);
					return;
				} else if (submitScorePp === '') {
					$addedScore.find('.pp').html(`<h1 class="hide">nothing</h1>`);
					$addedScore.addClass('nothing_get');
					if (!isTogglerSorted) {
						$addedScore.addClass('show').next('.hr').show();
						scrollControl();
					}
					isFilterResultEmpty();
				}
				else {
					$addedScore.find('.pp').html(`<h1 ${fMaxScore ? '' : 'class="hide"'}>${Math.round(submitScorePp * 100) / 100}<span>pp</span></h1>`);
					if (!fMaxScore)
						$addedScore.addClass('nothing_get');
					if (isTogglerSorted) {
						if (fMaxScore) {
							$addedScore.addClass('show');
							if (!$('.plays_feed > .play_record:not(.nothing_get):last').is($addedScore)) 
								$addedScore.next('.hr').show();
							scrollControl();
						}
					} else {
						$addedScore.addClass('show').next('.hr').show();
						scrollControl();
					}
					isFilterResultEmpty();
				}

				console.log("Скоры из БД: ", xhrScoresData);
				console.groupEnd();
			},
			error: function() {
				getPP($addedScore, recentScoreData);
			},
			timeout: timeoutForRequestWhenWeTryToGetPPForRecentScore
		});
	}

	function addNewScore (recentScoreData) {
		$.ajax({
			url: APIuri + "get_beatmaps",
			type: "GET",
			data: {k: APIkey, b: recentScoreData.beatmap_id},
			success: function (xhrBeatmapData) {
				console.log("Информация по карте: ", xhrBeatmapData);
				xhrBeatmapData = xhrBeatmapData[0];

				let accuracy = (Number(recentScoreData.count50) * 50 + Number(recentScoreData.count100) * 100 + Number(recentScoreData.count300) * 300) / ((Number(recentScoreData.countmiss) + Number(recentScoreData.count50) + Number(recentScoreData.count100) + Number(recentScoreData.count300)) * 300);

				$plays_feed.prepend(`
					<div class="play_record" recordid="${++countOfAddedRecords}">
						<a class="mapset_avatar" href="https://osu.ppy.sh/b/${recentScoreData.beatmap_id}?m=0" target="_blank">
							<img src="//b.ppy.sh/thumb/${xhrBeatmapData.beatmapset_id}l.jpg"/>
						</a>
					  <div class="general_play_information">
					    <div class="title_row">
					      <div class="rank_img" style="background-image: url(/assets/img/ranking_letters/${recentScoreData.rank}.png) "></div>
					      <a class="link_title" href="https://osu.ppy.sh/b/${recentScoreData.beatmap_id}?m=0" target="_blank">
					        <h1 class="title">${xhrBeatmapData.artist} - ${xhrBeatmapData.title}</h1>
					        <h1 class="difficulty">[${xhrBeatmapData.version}]</h1>
					       </a>
					      <div class="starrate">
					        <h1>${Math.round(Number(xhrBeatmapData.difficultyrating) * 100) / 100}</h1>
					        <div class="star"></div>
					      </div>
					    </div>
					    <div class="detail row">
					    	<span class="gathered_combo">${+recentScoreData.perfect ? "FC" : recentScoreData.maxcombo}</span><span class="ras">/</span>
					    	<span class="total_combo">${xhrBeatmapData.max_combo}</span><span class="def">|</span>
					    	<span class="count300">${recentScoreData.count300}</span><span class="ras">/</span>
					    	<span class="count100">${recentScoreData.count100}</span><span class="ras">/</span>
					    	<span class="count50">${recentScoreData.count50}</span><span class="ras">/</span>
					    	<span class="countmiss">${recentScoreData.countmiss}</span><span class="def">|</span>
					    	<span class="accuracy">${Math.round(accuracy * 10000) / 100}%</span>
					    </div>
					    <div class="time_row">
					      <time class="timeago" datetime="${new Date().toISOString()}"></time>
					    </div>
					  </div>
					  <div class="pp_and_mods">
					    <div class="pp">
					      <h1 class="hide">${recentScoreData.rank == "F" ? '—' : 'Loading...'}</h1>
					    </div>
					    <div class="hr"></div>
					    <div class="mods">
					      <h1>${getMods(recentScoreData.enabled_mods)}</h1>
					    </div>
					  </div>
					</div>
				`);

				let $addedScore = $(`.play_record[recordid="${countOfAddedRecords}"]`);
				$addedScore.find('time').timeago();
				$addedScore.find('.mapset_avatar img').one('load', function() {
					if (countOfAddedRecords === 1) {
						$('#helloBuddy').hide();
						$toggler.show();
					}
					else {
						$('<div class="hr" style="display: none;"></div>').insertAfter($addedScore);
						if (!isTogglerSorted)
							$addedScore.next('.hr').show();
					}
					
					if (!isTogglerSorted) {
						$addedScore.addClass('show');
						scrollControl();
					}

					if (recentScoreData.rank == "F" || Number(xhrBeatmapData.approved) > 2) {
						$addedScore.find('.pp').html(`<h1 class="hide">nothing</h1>`);
						$addedScore.addClass('nothing_get');
						console.groupEnd();
					}
					else
						setTimeout(() => {getPP($addedScore, recentScoreData);}, timeoutForGettingPpBecausePpyHaveShittyServers);

					isFilterResultEmpty();

				}); // загружена аватарка карты

			},
			error: function() { //jqXHR
				addNewScore(recentScoreData);
			}, 
			timeout: timeoutForRequestWhenWeTryToGetBeatmapInformation
		});
	}

	function getUserRecent () {
		let startRequestTime = performance.now();
		$.ajax({
			url: APIuri + "get_user_recent",
			type: "GET",
			data: {k: APIkey, u: user.user_id, type: "id", limit: 1},
			success: function (xhrRecentScore) {
				xhrRecentScore = xhrRecentScore.length ? xhrRecentScore[0] : 0;

				if (xhrRecentScore) {

					if ($.isEmptyObject(userRecentestScore))
						userRecentestScore = xhrRecentScore;

					if (userRecentestScore.date !== xhrRecentScore.date) {
						userRecentestScore = xhrRecentScore;
						console.groupCollapsed('Новый плей (' + userRecentestScore.date + ')');
						console.info("Информация по плею: ", userRecentestScore);
						addNewScore(userRecentestScore);
						if (!isUpdatingProfileNow) 
							setTimeout(updateProfile, timeForUpdateProfileAfterNewRecentScore);
					}
				}

				setTimeout(getUserRecent, timeoutForRequestWhenWeTryToGetUserRecentPlay - performance.now() + startRequestTime);
			},
			error: function(jqXHR) {
				switch (jqXHR.statusText){
					case 'timeout':
						getUserRecent();
						break;
					case 'error':
						setTimeout(getUserRecent, 10000);
						break;
				}
			}, 
			timeout: timeoutForRequestWhenWeTryToGetUserRecentPlay
		});
	} // getUserRecent

	getUserRecent();

} // startWatch

function setupUser(userId) {
	$(function() {
		$input_username.val(userId);
		if (APIkey === null) {
			showError(6);
			$api_key_wrapper_input.focus();
			return;
		}
		checkUsername(userId);
	});
}


function isFilterResultEmpty() {
	if ($('.plays_feed > .play_record:visible').length === 0)
		$('#emptyFilter').addClass('show');
	else
		$('#emptyFilter').removeClass('show');
}

function toggleFails () {
	$toggler.toggleClass('sort_enabled');
	isTogglerSorted = !isTogglerSorted;

	if (isTogglerSorted) {
		$('.plays_feed > .play_record.nothing_get').removeClass('show').next('.hr').hide();
		$('.plays_feed > .play_record:not(.nothing_get):last').next('.hr').hide();
	} else {
		$('.plays_feed > .play_record').addClass('show').next('.hr').show();
	}

	isFilterResultEmpty();

	scrollControl();
}


$(function() {

	$user_content_wrapper = $('.user_content_wrapper');

	$api_key_wrapper = $('.api_key_wrapper');
	$api_key_wrapper_input = $('.api_key_wrapper > input');

	$user_profile = $('.user_profile');

	$form_select_user = $('form.select_user');
	$input_username = $('#input_username');
	$input_username_h1 = $input_username.siblings('h1');

	$user_profile_avatar = $('.user_profile a.avatar');
	$user_profile_avatar_img = $('.user_profile a.avatar .avatar_wrapper img');
	$user_profile_username = $('.user_profile .user_stuff .username_and_ranking .username a');
	$user_profile_ranking_pp = $('.user_profile .user_stuff .username_and_ranking .ranking h2.pp');
	$user_profile_ranking_rank = $('.user_profile .user_stuff .username_and_ranking .ranking h2.rank');
	$user_profile_acc = $('.user_profile .user_stuff .detail_row .acc_and_pc .acc h2');
	$user_profile_pc = $('.user_profile .user_stuff .detail_row .acc_and_pc .pc h2');
	$user_profile_ranking_SS_count = $('.user_profile .user_stuff .detail_row .count_ranks_row .count_ranks_wrapper .cout_ss > h1');
	$user_profile_ranking_S_count = $('.user_profile .user_stuff .detail_row .count_ranks_row .count_ranks_wrapper .cout_s > h1');
	$user_profile_ranking_A_count = $('.user_profile .user_stuff .detail_row .count_ranks_row .count_ranks_wrapper .cout_a > h1');
	$user_profile_lvl_current_level = $('.user_profile .user_stuff .lvl_row .current_level span');
	$user_profile_lvl_row_wrapper = $('.user_profile .user_stuff .lvl_row .lvl_bar_wrapper');
	$user_profile_details_rank_and_pp = $('#details_rank_and_pp');
	$user_profile_details_accuracy 		= $('#details_accuracy');
	$user_profile_details_playcount		= $('#details_playcount');
	$user_profile_details_count_ss 		= $('#details_count_ss');
	$user_profile_details_count_s 		= $('#details_count_s');
	$user_profile_details_count_a 		= $('#details_count_a');
	$user_profile_details_level 			= $('#details_level');

	$user_feed = $('.user_feed');
	$plays_feed = $('.user_feed .plays_feed');

	$toggler = $('.toggle_fails');

	$form_select_user.submit(function(event) { // Сабмит на форме 
    event.preventDefault();
		if (holdUpInput) return;
		if (APIkey === null) {
			showError(6);
			$api_key_wrapper_input.focus();
			return;
		}
		let inputVal = $input_username.val().trim();
		if (inputVal.length < 3) {
			showError (1);
			return;
		}
		if (!(/^[\s\-\]\[\_a-z0-9]+$/i.test(inputVal))) {
			showError (2);
			return;
		}
		checkUsername(inputVal);
		return;
	}); // Сабмит на форме

	$api_key_wrapper_input.on('paste', () => { // Паста в поле ввода API key
		$(function() {
			let mayBeKey = $api_key_wrapper_input.val();
			if ((mayBeKey.length != 40) || (/[^0-9a-z]+/.test(mayBeKey))) {
				$api_key_wrapper_input.val('');
				showError(5);
				return;
			}
			$api_key_wrapper.removeClass('without_key').addClass('with_key');
			localStorage.setItem('APIkey', mayBeKey);
			APIkey = mayBeKey;
			$api_key_wrapper_input.prop('disabled', true).blur();
			$input_username.focus();
		});
	}); // Паста в поле ввода API key 

	$toggler.click(toggleFails);

});

$(window).on('load', function () {
	// if (currentState ? currentState.pushed : false) history.pushState("", "", "/");

	$('.loading_content').css('display', 'none');
	$('.overall_wrapper').css('display', 'block');
	$('.user_content_wrapper').addClass('zoom_in_content_wrapper');

	if (APIkey === null)
		$('.api_key_wrapper').addClass('without_key');

	// Обработчики на анимацию по фокусу для input_username
	let
		$input_username = $('#input_username'),
		$input_username_h1 = $input_username.siblings('h1');

	$input_username.focus();

	$input_username.focusin(function() {
		$input_username_h1.stop().finish().fadeOut(800);
	});
	$input_username.keypress(function() {
		$input_username_h1.fadeOut(800);
	});
	$input_username.focusout(function() {
		$input_username_h1.stop().finish().fadeIn(200);
	});

	// Если был уже в url id чувака, типа перешел по закладке или по ссылке,
	// то делаем пресет его профиля
	let userId = window.location.href.match(/id=(\d+)/);
	userId = userId ? userId[1] : 0;
	if (userId) setupUser(userId);
});


})(); // EOF