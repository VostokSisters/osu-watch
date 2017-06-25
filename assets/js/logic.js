"use strict";!function(){function t(t){D=1;var e=$(".error_cloud");switch(t){case 1:t="Username is too short";break;case 2:t="Incorrect username";break;case 3:t="User not found :(";break;case 4:t="API key is not valid";break;case 5:t="This is not a API key =S";break;case 6:t="API key is required"}e.children("h1").text(t),e.one(P,function(){e.removeClass("show_error"),D=0}),e.addClass("show_error")}function e(){$("body").css("min-height",$(".user_feed")[0].offsetHeight+210)}function s(t){return t>999?Math.floor(t/100)/10+"k":t}function a(e){function s(){$.ajax({url:R+"get_user",type:"GET",data:{k:L,u:e,event_days:"1"},success:function(e){if(!e.length)return t(3),void p.prop("disabled",!1).css("user-select","").focus();n(e[0])},error:function(e){"timeout"!=e.statusText?(t(4),p.prop("disabled",!1).css("user-select",""),A.removeClass("with_key").addClass("without_key"),E.prop("disabled",!1).val("").focus(),localStorage.removeItem("APIkey"),L=null):s()},timeout:j})}p.blur().prop("disabled",!0).css("user-select","none"),_.stop().finish().fadeOut(800),s()}function n(t){console.log(t.username+" — Initial state",t),h.one("load",function(){l.addClass("show_user"),history.pushState({pushed:!0},"","?id="+t.user_id),r(t)}),h.attr("src","https://a.ppy.sh/"+t.user_id),f.attr("href","https://osu.ppy.sh/u/"+t.user_id),m.attr("href","https://osu.ppy.sh/u/"+t.user_id),m.text(t.username),v.html(Math.round(t.pp_raw)+"<span>pp</span>"),g.text("#"+(t.pp_rank?t.pp_rank:"inactive")),w.text(Math.round(100*t.accuracy)/100+"%"),y.text(t.playcount?t.playcount:"0"),k.text(t.count_rank_ss?s(t.count_rank_ss):0),b.text(t.count_rank_s?s(t.count_rank_s):0),x.text(t.count_rank_a?s(t.count_rank_a):0),N.css("width",(t.level&&t.level.replace(/\d+\.?/,"")?t.level.replace(/\d+\.?/,""):"0").match(/\d{0,2}/)[0]*F/100),C.text(" "+(t.level?t.level.replace(/\.\d+/,""):"0"))}function r(t){function s(t){var e=[];for(var s in l)t&l[s]&&e.push(s);return~e.indexOf("DT")&&~e.indexOf("NC")&&e.splice(e.indexOf("DT"),1),e.length?e.join(" "):"Nomod"}function a(s,n){$.ajax({url:R+"get_scores",type:"GET",data:{k:L,b:n.beatmap_id,u:t.user_id,type:"id"},success:function(t){console.log("Скоры из БД: ",t);var r="",o=1;if(t.forEach(function(e){var s=new Date(e.date)-new Date(n.date);if(s<=z&&s>=-z){if(null===(r=e.pp?Number(e.pp):null))return;t.forEach(function(t){r<Number(t.pp)&&(o=0)})}else;}),null===r)return console.warn("PP за поставленный скор ещё не посчитались, делаем ещё один запрос!"),void a(s,n);""===r?(s.find(".pp").html('<h1 class="hide">nothing</h1>'),s.addClass("nothing_get"),S||(s.addClass("show").next(".hr").show(),e()),i()):(s.find(".pp").html("<h1 "+(o?"":'class="hide"')+">"+Math.round(100*r)/100+"<span>pp</span></h1>"),o||s.addClass("nothing_get"),S?o&&(s.addClass("show"),$(".plays_feed > .play_record:not(.nothing_get):last").is(s)||s.next(".hr").show(),e()):(s.addClass("show").next(".hr").show(),e()),i())},error:function(){a(s,n)},timeout:H})}function n(t){$.ajax({url:R+"get_beatmaps",type:"GET",data:{k:L,b:t.beatmap_id},success:function(n){console.log("Информация по карте: ",n),n=n[0];var r=(50*Number(t.count50)+100*Number(t.count100)+300*Number(t.count300))/(300*(Number(t.countmiss)+Number(t.count50)+Number(t.count100)+Number(t.count300)));T.prepend('\n\t\t\t\t\t<div class="play_record" recordid="'+ ++u+'">\n\t\t\t\t\t\t<a class="mapset_avatar" href="https://osu.ppy.sh/b/'+t.beatmap_id+'?m=0" target="_blank">\n\t\t\t\t\t\t\t<img src="//b.ppy.sh/thumb/'+n.beatmapset_id+'l.jpg"/>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t  <div class="general_play_information">\n\t\t\t\t\t    <div class="title_row">\n\t\t\t\t\t      <div class="rank_img" style="background-image: url(/assets/img/ranking_letters/'+t.rank+'.png) "></div>\n\t\t\t\t\t      <a class="link_title" href="https://osu.ppy.sh/b/'+t.beatmap_id+'?m=0" target="_blank">\n\t\t\t\t\t        <h1 class="title">'+n.artist+" - "+n.title+'</h1>\n\t\t\t\t\t        <h1 class="difficulty">['+n.version+']</h1>\n\t\t\t\t\t       </a>\n\t\t\t\t\t      <div class="starrate">\n\t\t\t\t\t        <h1>'+Math.round(100*Number(n.difficultyrating))/100+'</h1>\n\t\t\t\t\t        <div class="star"></div>\n\t\t\t\t\t      </div>\n\t\t\t\t\t    </div>\n\t\t\t\t\t    <div class="detail row">\n\t\t\t\t\t    \t<span class="gathered_combo">'+(+t.perfect?"FC":t.maxcombo)+'</span><span class="ras">/</span>\n\t\t\t\t\t    \t<span class="total_combo">'+n.max_combo+'</span><span class="def">|</span>\n\t\t\t\t\t    \t<span class="count300">'+t.count300+'</span><span class="ras">/</span>\n\t\t\t\t\t    \t<span class="count100">'+t.count100+'</span><span class="ras">/</span>\n\t\t\t\t\t    \t<span class="count50">'+t.count50+'</span><span class="ras">/</span>\n\t\t\t\t\t    \t<span class="countmiss">'+t.countmiss+'</span><span class="def">|</span>\n\t\t\t\t\t    \t<span class="accuracy">'+Math.round(1e4*r)/100+'%</span>\n\t\t\t\t\t    </div>\n\t\t\t\t\t    <div class="time_row">\n\t\t\t\t\t      <time class="timeago" datetime="'+(new Date).toISOString()+'"></time>\n\t\t\t\t\t    </div>\n\t\t\t\t\t  </div>\n\t\t\t\t\t  <div class="pp_and_mods">\n\t\t\t\t\t    <div class="pp">\n\t\t\t\t\t      <h1 class="hide">'+("F"==t.rank?"—":"Loading...")+'</h1>\n\t\t\t\t\t    </div>\n\t\t\t\t\t    <div class="hr"></div>\n\t\t\t\t\t    <div class="mods">\n\t\t\t\t\t      <h1>'+s(t.enabled_mods)+"</h1>\n\t\t\t\t\t    </div>\n\t\t\t\t\t  </div>\n\t\t\t\t\t</div>\n\t\t\t\t");var o=$('.play_record[recordid="'+u+'"]');o.find("time").timeago(),o.find(".mapset_avatar img").one("load",function(){1===u?($("#helloBuddy").hide(),O.show()):($('<div class="hr" style="display: none;"></div>').insertAfter(o),S||o.next(".hr").show()),S||(o.addClass("show"),e()),"F"==t.rank||Number(n.approved)>2?(o.find(".pp").html('<h1 class="hide">nothing</h1>'),o.addClass("nothing_get")):a(o,t),i()})},error:function(){n(t)},timeout:G})}function r(){var e=performance.now();$.ajax({url:R+"get_user_recent",type:"GET",data:{k:L,u:t.user_id,type:"id",limit:1},success:function(t){(t=t.length?t[0]:0)&&($.isEmptyObject(o)&&(o=t),o.date!==t.date&&(o=t,console.log("Новый скор: ",o),n(o))),setTimeout(r,M-performance.now()+e)},error:function(t){switch(t.statusText){case"timeout":r();break;case"error":setTimeout(r,1e4)}},timeout:M})}var o={},u=0,l={Nomod:0,NF:1,ES:2,HD:8,HR:16,SD:32,DT:64,RX:128,HT:256,NC:512,FL:1024,AO:2048,SO:4096,AP:8192,PF:16384};r()}function o(e){$(function(){if(p.val(e),null===L)return t(6),void E.focus();a(e)})}function i(){0===$(".plays_feed > .play_record:visible").length?$("#emptyFilter").addClass("show"):$("#emptyFilter").removeClass("show")}function u(){O.toggleClass("sort_enabled"),(S=!S)?($(".plays_feed > .play_record.nothing_get").removeClass("show").next(".hr").hide(),$(".plays_feed > .play_record:not(.nothing_get):last").next(".hr").hide()):$(".plays_feed > .play_record").addClass("show").next(".hr").show(),i(),e()}var l,c,d,p,_,f,h,m,v,g,w,y,k,b,x,C,N,I,T,A,E,O,P="webkitAnimationEnd oanimationend msAnimationEnd animationend",S=!1,D=0,F=438,j=1e4,M=5e3,G=5e3,H=5e3,z=5e3,L=localStorage.getItem("APIkey"),R="https://osu.ppy.sh/api/";$(function(){l=$(".user_content_wrapper"),A=$(".api_key_wrapper"),E=$(".api_key_wrapper > input"),c=$(".user_profile"),d=$("form.select_user"),p=$("#input_username"),_=p.siblings("h1"),f=$(".user_profile a.avatar"),h=$(".user_profile a.avatar .avatar_wrapper img"),m=$(".user_profile .user_stuff .username_and_ranking .username a"),v=$(".user_profile .user_stuff .username_and_ranking .ranking h2.pp"),g=$(".user_profile .user_stuff .username_and_ranking .ranking h2.rank"),w=$(".user_profile .user_stuff .detail_row .acc_and_pc .acc h2"),y=$(".user_profile .user_stuff .detail_row .acc_and_pc .pc h2"),k=$(".user_profile .user_stuff .detail_row .count_ranks_row .count_ranks_wrapper .cout_ss h1"),b=$(".user_profile .user_stuff .detail_row .count_ranks_row .count_ranks_wrapper .cout_s h1"),x=$(".user_profile .user_stuff .detail_row .count_ranks_row .count_ranks_wrapper .cout_a h1"),C=$(".user_profile .user_stuff .lvl_row .current_level span"),N=$(".user_profile .user_stuff .lvl_row .lvl_bar_wrapper"),I=$(".user_feed"),T=$(".user_feed .plays_feed"),O=$(".toggle_fails"),d.submit(function(e){if(e.preventDefault(),!D){if(null===L)return t(6),void E.focus();var s=p.val().trim();s.length<3?t(1):/^[\s\-\]\[\_a-z0-9]+$/i.test(s)?a(s):t(2)}}),E.on("paste",function(){$(function(){var e=E.val();if(40!=e.length||/[^0-9a-z]+/.test(e))return E.val(""),void t(5);A.removeClass("without_key").addClass("with_key"),localStorage.setItem("APIkey",e),L=e,E.prop("disabled",!0).blur(),p.focus()})}),O.click(u)}),$(window).on("load",function(){$(".loading_content").css("display","none"),$(".overall_wrapper").css("display","block"),$(".user_content_wrapper").addClass("zoom_in_content_wrapper"),null===L&&$(".api_key_wrapper").addClass("without_key");var t=$("#input_username"),e=t.siblings("h1");t.focus(),t.focusin(function(){e.stop().finish().fadeOut(800)}),t.keypress(function(){e.fadeOut(800)}),t.focusout(function(){e.stop().finish().fadeIn(200)});var s=window.location.href.match(/id=(\d+)/);s=s?s[1]:0,console.log(s),s&&o(s)})}();