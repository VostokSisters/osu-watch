"use strict";

!function() {
    function t(t) {
        D = 1;
        var e = $(".error_cloud");
        switch (t) {
          case 1:
            t = "Username is too short";
            break;

          case 2:
            t = "Incorrect username";
            break;

          case 3:
            t = "User not found :(";
            break;

          case 4:
            t = "API key is not valid";
            break;

          case 5:
            t = "This is not a API key =S";
            break;

          case 6:
            t = "API key is required";
        }
        e.children("h1").text(t), e.one(P, function() {
            e.removeClass("show_error"), D = 0;
        }), e.addClass("show_error");
    }
    function e() {
        $("body").css("min-height", $(".user_feed")[0].offsetHeight + 210);
    }
    function s(t) {
        return Number(t) > 999 ? Math.floor(t / 100) / 10 + "k" : t;
    }
    function a(e) {
        function s() {
            $.ajax({
                url: B + "get_user",
                type: "GET",
                data: {
                    k: q,
                    u: e,
                    event_days: "1"
                },
                success: function(e) {
                    if (!e.length) return t(3), void d.prop("disabled", !1).css("user-select", "").focus();
                    n(e[0]);
                },
                error: function(e) {
                    "timeout" != e.statusText ? (t(4), d.prop("disabled", !1).css("user-select", ""), 
                    I.removeClass("with_key").addClass("without_key"), A.prop("disabled", !1).val("").focus(), 
                    localStorage.removeItem("APIkey"), q = null) : s();
                },
                timeout: F
            });
        }
        d.blur().prop("disabled", !0).css("user-select", "none"), _.stop().finish().fadeOut(800), 
        s();
    }
    function n(t) {
        console.log(t.username + " — Initial state", t), f.one("load", function() {
            i.addClass("show_user"), history.pushState({
                pushed: !0
            }, "", "?id=" + t.user_id), r(t);
        }), f.attr("src", "https://a.ppy.sh/" + t.user_id), h.attr("href", "https://osu.ppy.sh/u/" + t.user_id), 
        m.attr("href", "https://osu.ppy.sh/u/" + t.user_id), m.text(t.username), k.html(Math.round(t.pp_raw) + "<span>pp</span>"), 
        v.text("#" + (t.pp_rank ? t.pp_rank : "inactive")), w.text(Math.round(100 * t.accuracy) / 100 + "%"), 
        g.text(t.playcount ? t.playcount : "0"), b.text(t.count_rank_ss ? s(t.count_rank_ss) : 0), 
        y.text(t.count_rank_s ? s(t.count_rank_s) : 0), x.text(t.count_rank_a ? s(t.count_rank_a) : 0), 
        C.css("width", (t.level && t.level.replace(/\d+\.?/, "") ? t.level.replace(/\d+\.?/, "") : "0").match(/\d{0,2}/)[0] * j / 100), 
        N.text(" " + (t.level ? t.level.replace(/\.\d+/, "") : "0"));
    }
    function r(t) {
        function a(t) {
            var e = [];
            for (var s in h) t & h[s] && e.push(s);
            return ~e.indexOf("DT") && ~e.indexOf("NC") && e.splice(e.indexOf("DT"), 1), e.length ? e.join(" ") : "Nomod";
        }
        function n() {
            _ = !0, $.ajax({
                url: B + "get_user",
                type: "GET",
                data: {
                    k: q,
                    u: t.user_id,
                    event_days: "1"
                },
                success: function(t) {
                    var e = [ "count50", "count100", "count300", "country", "events", "ranked_score", "total_score", "user_id", "username" ], a = "0px 0px 4px black, 0px 0px 6px lightgreen, 0px 0px 10px lightgreen", n = "0px 0px 4px black, 0px 0px 6px red, 0px 0px 10px red";
                    t = t[0];
                    for (var r in t) if (-1 === e.indexOf(r) && l[r] !== t[r]) switch (r) {
                      case "playcount":
                        console.log("playcount изменился!"), g.text(t.playcount), g.css("text-shadow", a);
                        break;

                      case "accuracy":
                        console.log("accuracy изменился!"), w.text(Math.round(100 * t.accuracy) / 100 + "%"), 
                        t.accuracy !== i.accuracy ? w.css("text-shadow", Number(t.accuracy) > Number(i.accuracy) ? a : n) : w.css("text-shadow", "");
                        break;

                      case "count_rank_a":
                        console.log("count_rank_a изменился!"), x.text(t.count_rank_a ? s(t.count_rank_a) : 0), 
                        t.count_rank_a !== i.count_rank_a ? x.css("text-shadow", Number(t.count_rank_a) > Number(i.count_rank_a) ? a : n) : x.css("text-shadow", "");
                        break;

                      case "count_rank_s":
                        console.log("count_rank_s изменился!"), y.text(t.count_rank_s ? s(t.count_rank_s) : 0), 
                        t.count_rank_s !== i.count_rank_s ? y.css("text-shadow", Number(t.count_rank_s) > Number(i.count_rank_s) ? a : n) : y.css("text-shadow", "");
                        break;

                      case "count_rank_ss":
                        console.log("count_rank_ss изменился!"), b.text(t.count_rank_ss ? s(t.count_rank_ss) : 0), 
                        t.count_rank_ss !== i.count_rank_ss ? b.css("text-shadow", Number(t.count_rank_ss) > Number(i.count_rank_ss) ? a : n) : b.css("text-shadow", "");
                        break;

                      case "pp_raw":
                        console.log("pp_raw изменился!"), k.html(Math.round(t.pp_raw) + "<span>pp</span>"), 
                        t.pp_raw !== i.pp_raw ? k.css("text-shadow", Number(t.pp_raw) > Number(i.pp_raw) ? a : n) : k.css("text-shadow", "");
                        break;

                      case "pp_rank":
                        console.log("pp_rank изменился!"), v.text("#" + t.pp_rank), t.pp_rank !== i.pp_rank ? v.css("text-shadow", Number(t.pp_rank) > Number(i.pp_rank) ? n : a) : v.css("text-shadow", "");
                        break;

                      case "level":
                        console.log("level изменился!"), C.css("width", (t.level && t.level.replace(/\d+\.?/, "") ? t.level.replace(/\d+\.?/, "") : "0").match(/\d{0,2}/)[0] * j / 100), 
                        N.text(" " + t.level.replace(/\.\d+/, "")), t.level !== i.level ? N.css("text-shadow", Number(t.level) > Number(i.level) ? a : n) : N.css("text-shadow", "");
                        break;

                      default:
                        console.log("свойство пропущено: ", r);
                        continue;
                    }
                    _ = !1, l = t;
                },
                error: function(t) {
                    "timeout" != t.statusText || n();
                },
                timeout: R
            });
        }
        function r(s, a) {
            $.ajax({
                url: B + "get_scores",
                type: "GET",
                data: {
                    k: q,
                    b: a.beatmap_id,
                    u: t.user_id,
                    type: "id"
                },
                success: function(t) {
                    var n = "", o = 1;
                    if (t.forEach(function(e) {
                        var s = new Date(e.date) - new Date(a.date);
                        if (s <= U && s >= -U) {
                            if (null === (n = e.pp ? Number(e.pp) : null)) return;
                            t.forEach(function(t) {
                                n < Number(t.pp) && (o = 0);
                            });
                        } else ;
                    }), null === n) return console.warn("PP за поставленный скор ещё не посчитались, делаем ещё один запрос!"), 
                    void setTimeout(function() {
                        r(s, a);
                    }, z);
                    "" === n ? (s.find(".pp").html('<h1 class="hide">nothing</h1>'), s.addClass("nothing_get"), 
                    S || (s.addClass("show").next(".hr").show(), e()), c()) : (s.find(".pp").html("<h1 " + (o ? "" : 'class="hide"') + ">" + Math.round(100 * n) / 100 + "<span>pp</span></h1>"), 
                    o || s.addClass("nothing_get"), S ? o && (s.addClass("show"), $(".plays_feed > .play_record:not(.nothing_get):last").is(s) || s.next(".hr").show(), 
                    e()) : (s.addClass("show").next(".hr").show(), e()), c()), console.log("Скоры из БД: ", t), 
                    console.groupEnd();
                },
                error: function() {
                    r(s, a);
                },
                timeout: H
            });
        }
        function o(t) {
            $.ajax({
                url: B + "get_beatmaps",
                type: "GET",
                data: {
                    k: q,
                    b: t.beatmap_id
                },
                success: function(s) {
                    console.log("Информация по карте: ", s), s = s[0];
                    var n = (50 * Number(t.count50) + 100 * Number(t.count100) + 300 * Number(t.count300)) / (300 * (Number(t.countmiss) + Number(t.count50) + Number(t.count100) + Number(t.count300)));
                    E.prepend('\n\t\t\t\t\t<div class="play_record" recordid="' + ++d + '">\n\t\t\t\t\t\t<a class="mapset_avatar" href="https://osu.ppy.sh/b/' + t.beatmap_id + '?m=0" target="_blank">\n\t\t\t\t\t\t\t<img src="//b.ppy.sh/thumb/' + s.beatmapset_id + 'l.jpg"/>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t  <div class="general_play_information">\n\t\t\t\t\t    <div class="title_row">\n\t\t\t\t\t      <div class="rank_img" style="background-image: url(/assets/img/ranking_letters/' + t.rank + '.png) "></div>\n\t\t\t\t\t      <a class="link_title" href="https://osu.ppy.sh/b/' + t.beatmap_id + '?m=0" target="_blank">\n\t\t\t\t\t        <h1 class="title">' + s.artist + " - " + s.title + '</h1>\n\t\t\t\t\t        <h1 class="difficulty">[' + s.version + ']</h1>\n\t\t\t\t\t       </a>\n\t\t\t\t\t      <div class="starrate">\n\t\t\t\t\t        <h1>' + Math.round(100 * Number(s.difficultyrating)) / 100 + '</h1>\n\t\t\t\t\t        <div class="star"></div>\n\t\t\t\t\t      </div>\n\t\t\t\t\t    </div>\n\t\t\t\t\t    <div class="detail row">\n\t\t\t\t\t    \t<span class="gathered_combo">' + (+t.perfect ? "FC" : t.maxcombo) + '</span><span class="ras">/</span>\n\t\t\t\t\t    \t<span class="total_combo">' + s.max_combo + '</span><span class="def">|</span>\n\t\t\t\t\t    \t<span class="count300">' + t.count300 + '</span><span class="ras">/</span>\n\t\t\t\t\t    \t<span class="count100">' + t.count100 + '</span><span class="ras">/</span>\n\t\t\t\t\t    \t<span class="count50">' + t.count50 + '</span><span class="ras">/</span>\n\t\t\t\t\t    \t<span class="countmiss">' + t.countmiss + '</span><span class="def">|</span>\n\t\t\t\t\t    \t<span class="accuracy">' + Math.round(1e4 * n) / 100 + '%</span>\n\t\t\t\t\t    </div>\n\t\t\t\t\t    <div class="time_row">\n\t\t\t\t\t      <time class="timeago" datetime="' + new Date().toISOString() + '"></time>\n\t\t\t\t\t    </div>\n\t\t\t\t\t  </div>\n\t\t\t\t\t  <div class="pp_and_mods">\n\t\t\t\t\t    <div class="pp">\n\t\t\t\t\t      <h1 class="hide">' + ("F" == t.rank ? "—" : "Loading...") + '</h1>\n\t\t\t\t\t    </div>\n\t\t\t\t\t    <div class="hr"></div>\n\t\t\t\t\t    <div class="mods">\n\t\t\t\t\t      <h1>' + a(t.enabled_mods) + "</h1>\n\t\t\t\t\t    </div>\n\t\t\t\t\t  </div>\n\t\t\t\t\t</div>\n\t\t\t\t");
                    var o = $('.play_record[recordid="' + d + '"]');
                    o.find("time").timeago(), o.find(".mapset_avatar img").one("load", function() {
                        1 === d ? ($("#helloBuddy").hide(), O.show()) : ($('<div class="hr" style="display: none;"></div>').insertAfter(o), 
                        S || o.next(".hr").show()), S || (o.addClass("show"), e()), "F" == t.rank || Number(s.approved) > 2 ? (o.find(".pp").html('<h1 class="hide">nothing</h1>'), 
                        o.addClass("nothing_get"), console.groupEnd()) : r(o, t), c();
                    });
                },
                error: function() {
                    o(t);
                },
                timeout: G
            });
        }
        function u() {
            var e = performance.now();
            $.ajax({
                url: B + "get_user_recent",
                type: "GET",
                data: {
                    k: q,
                    u: t.user_id,
                    type: "id",
                    limit: 1
                },
                success: function(t) {
                    (t = t.length ? t[0] : 0) && ($.isEmptyObject(p) && (p = t), p.date !== t.date && (p = t, 
                    console.groupCollapsed("Новый плей (" + p.date + ")"), console.info("Информация по плею: ", p), 
                    o(p), _ || setTimeout(n, L))), setTimeout(u, M - performance.now() + e);
                },
                error: function(t) {
                    switch (t.statusText) {
                      case "timeout":
                        u();
                        break;

                      case "error":
                        setTimeout(u, 1e4);
                    }
                },
                timeout: M
            });
        }
        var i = t, l = t, p = {}, d = 0, _ = !1, h = {
            Nomod: 0,
            NF: 1,
            ES: 2,
            HD: 8,
            HR: 16,
            SD: 32,
            DT: 64,
            RX: 128,
            HT: 256,
            NC: 512,
            FL: 1024,
            AO: 2048,
            SO: 4096,
            AP: 8192,
            PF: 16384
        };
        u();
    }
    function o(e) {
        $(function() {
            if (d.val(e), null === q) return t(6), void A.focus();
            a(e);
        });
    }
    function c() {
        0 === $(".plays_feed > .play_record:visible").length ? $("#emptyFilter").addClass("show") : $("#emptyFilter").removeClass("show");
    }
    function u() {
        O.toggleClass("sort_enabled"), (S = !S) ? ($(".plays_feed > .play_record.nothing_get").removeClass("show").next(".hr").hide(), 
        $(".plays_feed > .play_record:not(.nothing_get):last").next(".hr").hide()) : $(".plays_feed > .play_record").addClass("show").next(".hr").show(), 
        c(), e();
    }
    var i, l, p, d, _, h, f, m, k, v, w, g, b, y, x, N, C, T, E, I, A, O, P = "webkitAnimationEnd oanimationend msAnimationEnd animationend", S = !1, D = 0, j = 438, F = 3e3, M = 5e3, G = 5e3, H = 5e3, z = 1e3, L = 5e3, R = 5e3, U = 5e3, q = localStorage.getItem("APIkey"), B = "https://osu.ppy.sh/api/";
    $(function() {
        i = $(".user_content_wrapper"), I = $(".api_key_wrapper"), A = $(".api_key_wrapper > input"), 
        l = $(".user_profile"), p = $("form.select_user"), d = $("#input_username"), _ = d.siblings("h1"), 
        h = $(".user_profile a.avatar"), f = $(".user_profile a.avatar .avatar_wrapper img"), 
        m = $(".user_profile .user_stuff .username_and_ranking .username a"), k = $(".user_profile .user_stuff .username_and_ranking .ranking h2.pp"), 
        v = $(".user_profile .user_stuff .username_and_ranking .ranking h2.rank"), w = $(".user_profile .user_stuff .detail_row .acc_and_pc .acc h2"), 
        g = $(".user_profile .user_stuff .detail_row .acc_and_pc .pc h2"), b = $(".user_profile .user_stuff .detail_row .count_ranks_row .count_ranks_wrapper .cout_ss h1"), 
        y = $(".user_profile .user_stuff .detail_row .count_ranks_row .count_ranks_wrapper .cout_s h1"), 
        x = $(".user_profile .user_stuff .detail_row .count_ranks_row .count_ranks_wrapper .cout_a h1"), 
        N = $(".user_profile .user_stuff .lvl_row .current_level span"), C = $(".user_profile .user_stuff .lvl_row .lvl_bar_wrapper"), 
        T = $(".user_feed"), E = $(".user_feed .plays_feed"), O = $(".toggle_fails"), p.submit(function(e) {
            if (e.preventDefault(), !D) {
                if (null === q) return t(6), void A.focus();
                var s = d.val().trim();
                s.length < 3 ? t(1) : /^[\s\-\]\[\_a-z0-9]+$/i.test(s) ? a(s) : t(2);
            }
        }), A.on("paste", function() {
            $(function() {
                var e = A.val();
                if (40 != e.length || /[^0-9a-z]+/.test(e)) return A.val(""), void t(5);
                I.removeClass("without_key").addClass("with_key"), localStorage.setItem("APIkey", e), 
                q = e, A.prop("disabled", !0).blur(), d.focus();
            });
        }), O.click(u);
    }), $(window).on("load", function() {
        $(".loading_content").css("display", "none"), $(".overall_wrapper").css("display", "block"), 
        $(".user_content_wrapper").addClass("zoom_in_content_wrapper"), null === q && $(".api_key_wrapper").addClass("without_key");
        var t = $("#input_username"), e = t.siblings("h1");
        t.focus(), t.focusin(function() {
            e.stop().finish().fadeOut(800);
        }), t.keypress(function() {
            e.fadeOut(800);
        }), t.focusout(function() {
            e.stop().finish().fadeIn(200);
        });
        var s = window.location.href.match(/id=(\d+)/);
        (s = s ? s[1] : 0) && o(s);
    });
}();