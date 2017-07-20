"use strict";

!function() {
    function t(t) {
        L = 1;
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
        e.children("h1").text(t), e.one(H, function() {
            e.removeClass("show_error"), L = 0;
        }), e.addClass("show_error");
    }
    function e() {
        $("body").css("min-height", $(".user_feed")[0].offsetHeight + 210);
    }
    function a(t) {
        return Number(t) > 999 ? Math.floor(t / 100) / 10 + "k" : t;
    }
    function s(e) {
        function a() {
            $.ajax({
                url: Z + "get_user",
                type: "GET",
                data: {
                    k: Y,
                    u: e,
                    event_days: "1"
                },
                success: function(e) {
                    if (!e.length) return t(3), void _.prop("disabled", !1).css("user-select", "").focus();
                    n(e[0]);
                },
                error: function(e) {
                    "timeout" != e.statusText ? (t(4), _.prop("disabled", !1).css("user-select", ""), 
                    j.removeClass("with_key").addClass("without_key"), F.prop("disabled", !1).val("").focus(), 
                    localStorage.removeItem("APIkey"), Y = null) : a();
                },
                timeout: U
            });
        }
        _.blur().prop("disabled", !0).css("user-select", "none"), d.stop().finish().fadeOut(800), 
        a();
    }
    function n(t) {
        console.log(t.username + " — Initial state", t), f.one("load", function() {
            c.addClass("show_user"), history.pushState({
                pushed: !0
            }, "", "?id=" + t.user_id), r(t);
        }), f.attr("src", "https://a.ppy.sh/" + t.user_id), h.attr("href", "https://osu.ppy.sh/u/" + t.user_id), 
        m.attr("href", "https://osu.ppy.sh/u/" + t.user_id), m.text(t.username), k.html(Math.round(t.pp_raw) + "<span>pp</span>"), 
        v.text("#" + (t.pp_rank ? t.pp_rank : "inactive")), w.text(Math.round(100 * t.accuracy) / 100 + "%"), 
        T.find("p:first").text(Math.round(100 * t.accuracy) / 100 + "%"), b.text(t.playcount ? t.playcount : "0"), 
        E.find("p:first").text(t.playcount ? t.playcount : "0"), x.text(t.count_rank_ss ? a(t.count_rank_ss) : 0), 
        I.find("p:first").text(t.count_rank_ss ? a(t.count_rank_ss) : 0), y.text(t.count_rank_s ? a(t.count_rank_s) : 0), 
        A.find("p:first").text(t.count_rank_s ? a(t.count_rank_s) : 0), g.text(t.count_rank_a ? a(t.count_rank_a) : 0), 
        O.find("p:first").text(t.count_rank_a ? a(t.count_rank_a) : 0), C.css("width", (t.level && t.level.replace(/\d+\.?/, "") ? t.level.replace(/\d+\.?/, "0.") : "0") * R), 
        N.text(" " + (t.level ? t.level.replace(/\.\d+/, "") : "0")), P.find("p:first").text(Math.floor(100 * Number(t.level)) / 100);
    }
    function r(t) {
        function s(t) {
            var e = [];
            for (var a in h) t & h[a] && e.push(a);
            return ~e.indexOf("DT") && ~e.indexOf("NC") && e.splice(e.indexOf("DT"), 1), e.length ? e.join(" ") : "Nomod";
        }
        function n() {
            d = !0, $.ajax({
                url: Z + "get_user",
                type: "GET",
                data: {
                    k: Y,
                    u: t.user_id,
                    event_days: "1"
                },
                success: function(t) {
                    var e = [ "count50", "count100", "count300", "country", "events", "ranked_score", "total_score", "user_id", "username", "pp_country_rank" ], s = "0px 0px 4px black, 0px 0px 6px lightgreen, 0px 0px 10px lightgreen", n = "0px 0px 4px black, 0px 0px 6px red, 0px 0px 10px red";
                    t = t[0];
                    for (var r in t) if (-1 === e.indexOf(r) && p[r] !== t[r]) switch (r) {
                      case "playcount":
                        b.text(t.playcount), b.css("text-shadow", s), E.show(), E.find("p:last").text("+ " + (t.playcount - c.playcount));
                        break;

                      case "accuracy":
                        var o = Math.round(100 * c.accuracy) / 100, u = Math.round(100 * t.accuracy) / 100;
                        w.text(u + "%"), o !== u ? (w.css("text-shadow", u > o ? s : n), T.show(), T.find("p:last").text((u > o ? "+ " : "- ") + Math.round(100 * Math.abs(u - o)) / 100 + "%")) : (T.hide(), 
                        w.css("text-shadow", ""));
                        break;

                      case "count_rank_a":
                        g.text(t.count_rank_a ? a(t.count_rank_a) : 0), t.count_rank_a !== c.count_rank_a ? (g.css("text-shadow", Number(t.count_rank_a) > Number(c.count_rank_a) ? s : n), 
                        O.find("p:last").text((Number(t.count_rank_a) > Number(c.count_rank_a) ? "+ " : "- ") + Math.abs(Number(t.count_rank_a) - Number(c.count_rank_a))), 
                        O.show()) : (g.css("text-shadow", ""), O.hide());
                        break;

                      case "count_rank_s":
                        y.text(t.count_rank_s ? a(t.count_rank_s) : 0), t.count_rank_s !== c.count_rank_s ? (y.css("text-shadow", Number(t.count_rank_s) > Number(c.count_rank_s) ? s : n), 
                        A.find("p:last").text((Number(t.count_rank_s) > Number(c.count_rank_s) ? "+ " : "- ") + Math.abs(Number(t.count_rank_s) - Number(c.count_rank_s))), 
                        A.show()) : (y.css("text-shadow", ""), A.hide());
                        break;

                      case "count_rank_ss":
                        x.text(t.count_rank_ss ? a(t.count_rank_ss) : 0), t.count_rank_ss !== c.count_rank_ss ? (x.css("text-shadow", Number(t.count_rank_ss) > Number(c.count_rank_ss) ? s : n), 
                        I.find("p:last").text((Number(t.count_rank_ss) > Number(c.count_rank_ss) ? "+ " : "- ") + Math.abs(Number(t.count_rank_ss) - Number(c.count_rank_ss))), 
                        I.show()) : (x.css("text-shadow", ""), I.hide());
                        break;

                      case "pp_raw":
                        var i = Math.round(t.pp_raw), l = Math.round(c.pp_raw);
                        k.html(i + "<span>pp</span>"), i !== l ? (k.css("text-shadow", i > l ? s : n), M.show(), 
                        M.find("p:nth-of-type(1)").html(l + '<span class="little">pp</span>'), M.find("p:nth-of-type(3)").html((i > l ? "+ " : "- ") + Math.abs(i - l) + '<span class="little">pp</span>')) : (k.css("text-shadow", ""), 
                        M.find("p:nth-of-type(1)").html(""), M.find("p:nth-of-type(3)").html("")), t.pp_raw !== c.pp_raw || t.pp_rank !== c.pp_rank ? M.show() : M.hide();
                        break;

                      case "pp_rank":
                        var _ = Number(t.pp_rank), h = Number(c.pp_rank);
                        v.text("#" + _), _ !== h ? (v.css("text-shadow", _ > h ? n : s), M.show(), M.find("p:nth-of-type(2)").text("#" + (h || "inactive")), 
                        M.find("p:nth-of-type(4)").text((_ < h ? "+ " : "- ") + "#" + Math.abs(_ - h))) : (v.css("text-shadow", ""), 
                        M.find("p:nth-of-type(2)").text(""), M.find("p:nth-of-type(4)").text("")), t.pp_raw !== c.pp_raw || t.pp_rank !== c.pp_rank ? M.show() : M.hide();
                        break;

                      case "level":
                        C.css("width", (t.level && t.level.replace(/\d+\.?/, "") ? t.level.replace(/\d+\.?/, "0.") : "0") * R), 
                        N.text(" " + t.level.replace(/\.\d+/, ""));
                        var f = Math.floor(100 * Number(t.level)) / 100, m = Math.floor(100 * Number(c.level)) / 100;
                        f !== m ? (N.css("text-shadow", f > m ? s : n), P.show(), P.find("p:last").text((f > m ? "+ " : "- ") + Math.floor(100 * Math.abs(f - m)) / 100)) : (N.css("text-shadow", ""), 
                        P.hide());
                        break;

                      default:
                        continue;
                    }
                    d = !1, p = t;
                },
                error: function() {
                    n();
                },
                timeout: Q
            });
        }
        function r(a, s) {
            $.ajax({
                url: Z + "get_scores",
                type: "GET",
                data: {
                    k: Y,
                    b: s.beatmap_id,
                    u: t.user_id,
                    type: "id"
                },
                success: function(t) {
                    var n = "", o = 1;
                    if (t.forEach(function(e) {
                        var a = new Date(e.date) - new Date(s.date);
                        if (a <= W && a >= -W) {
                            if (null === (n = e.pp ? Number(e.pp) : null)) return;
                            t.forEach(function(t) {
                                n < Number(t.pp) && (o = 0);
                            });
                        } else ;
                    }), null === n) return console.warn("PP за поставленный скор ещё не посчитались, делаем ещё один запрос!"), 
                    void setTimeout(function() {
                        r(a, s);
                    }, J);
                    "" === n ? (a.find(".pp").html('<h1 class="hide">nothing</h1>'), a.addClass("nothing_get"), 
                    z || (a.addClass("show").next(".hr").show(), e()), u()) : (a.find(".pp").html("<h1 " + (o ? "" : 'class="hide"') + ">" + Math.round(100 * n) / 100 + "<span>pp</span></h1>"), 
                    o || a.addClass("nothing_get"), z ? o && (a.addClass("show"), $(".plays_feed > .play_record:not(.nothing_get):last").is(a) || a.next(".hr").show(), 
                    e()) : (a.addClass("show").next(".hr").show(), e()), u()), console.log("Скоры из БД: ", t), 
                    console.groupEnd();
                },
                error: function() {
                    r(a, s);
                },
                timeout: X
            });
        }
        function o(t) {
            $.ajax({
                url: Z + "get_beatmaps",
                type: "GET",
                data: {
                    k: Y,
                    b: t.beatmap_id
                },
                success: function(a) {
                    console.log("Информация по карте: ", a), a = a[0];
                    var n = (50 * Number(t.count50) + 100 * Number(t.count100) + 300 * Number(t.count300)) / (300 * (Number(t.countmiss) + Number(t.count50) + Number(t.count100) + Number(t.count300)));
                    D.prepend('\n\t\t\t\t\t<div class="play_record" recordid="' + ++_ + '">\n\t\t\t\t\t\t<a class="mapset_avatar" href="https://osu.ppy.sh/b/' + t.beatmap_id + '?m=0" target="_blank">\n\t\t\t\t\t\t\t<img src="//b.ppy.sh/thumb/' + a.beatmapset_id + 'l.jpg"/>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t  <div class="general_play_information">\n\t\t\t\t\t    <div class="title_row">\n\t\t\t\t\t      <div class="rank_img" style="background-image: url(/assets/img/ranking_letters/' + t.rank + '.png) "></div>\n\t\t\t\t\t      <a class="link_title" href="https://osu.ppy.sh/b/' + t.beatmap_id + '?m=0" target="_blank">\n\t\t\t\t\t        <h1 class="title">' + a.artist + " - " + a.title + '</h1>\n\t\t\t\t\t        <h1 class="difficulty">[' + a.version + ']</h1>\n\t\t\t\t\t       </a>\n\t\t\t\t\t      <div class="starrate">\n\t\t\t\t\t        <h1>' + Math.round(100 * Number(a.difficultyrating)) / 100 + '</h1>\n\t\t\t\t\t        <div class="star"></div>\n\t\t\t\t\t      </div>\n\t\t\t\t\t    </div>\n\t\t\t\t\t    <div class="detail row">\n\t\t\t\t\t    \t<span class="gathered_combo">' + (+t.perfect ? "FC" : t.maxcombo) + '</span><span class="ras">/</span>\n\t\t\t\t\t    \t<span class="total_combo">' + a.max_combo + '</span><span class="def">|</span>\n\t\t\t\t\t    \t<span class="count300">' + t.count300 + '</span><span class="ras">/</span>\n\t\t\t\t\t    \t<span class="count100">' + t.count100 + '</span><span class="ras">/</span>\n\t\t\t\t\t    \t<span class="count50">' + t.count50 + '</span><span class="ras">/</span>\n\t\t\t\t\t    \t<span class="countmiss">' + t.countmiss + '</span><span class="def">|</span>\n\t\t\t\t\t    \t<span class="accuracy">' + Math.round(1e4 * n) / 100 + '%</span>\n\t\t\t\t\t    </div>\n\t\t\t\t\t    <div class="time_row">\n\t\t\t\t\t      <time class="timeago" datetime="' + new Date().toISOString() + '"></time>\n\t\t\t\t\t    </div>\n\t\t\t\t\t  </div>\n\t\t\t\t\t  <div class="pp_and_mods">\n\t\t\t\t\t    <div class="pp">\n\t\t\t\t\t      <h1 class="hide">' + ("F" == t.rank ? "—" : "Loading...") + '</h1>\n\t\t\t\t\t    </div>\n\t\t\t\t\t    <div class="hr"></div>\n\t\t\t\t\t    <div class="mods">\n\t\t\t\t\t      <h1>' + s(t.enabled_mods) + "</h1>\n\t\t\t\t\t    </div>\n\t\t\t\t\t  </div>\n\t\t\t\t\t</div>\n\t\t\t\t");
                    var o = $('.play_record[recordid="' + _ + '"]');
                    o.find("time").timeago(), o.find(".mapset_avatar img").one("load", function() {
                        1 === _ ? ($("#helloBuddy").hide(), G.show()) : ($('<div class="hr" style="display: none;"></div>').insertAfter(o), 
                        z || o.next(".hr").show()), z || (o.addClass("show"), e()), "F" == t.rank || Number(a.approved) > 2 ? (o.find(".pp").html('<h1 class="hide">nothing</h1>'), 
                        o.addClass("nothing_get"), console.groupEnd()) : setTimeout(function() {
                            r(o, t);
                        }, V), u();
                    });
                },
                error: function() {
                    o(t);
                },
                timeout: B
            });
        }
        function i() {
            var e = performance.now();
            $.ajax({
                url: Z + "get_user_recent",
                type: "GET",
                data: {
                    k: Y,
                    u: t.user_id,
                    type: "id",
                    limit: 1
                },
                success: function(t) {
                    (t = t.length ? t[0] : 0) && ($.isEmptyObject(l) && (l = t), l.date !== t.date && (l = t, 
                    console.groupCollapsed("Новый плей (" + l.date + ")"), console.info("Информация по плею: ", l), 
                    o(l), d || setTimeout(n, K))), setTimeout(i, q - performance.now() + e);
                },
                error: function(t) {
                    switch (t.statusText) {
                      case "timeout":
                        i();
                        break;

                      case "error":
                        setTimeout(i, 1e4);
                    }
                },
                timeout: q
            });
        }
        var c = t, p = t, l = {}, _ = 0, d = !1, h = {
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
        i();
    }
    function o(e) {
        $(function() {
            if (_.val(e), null === Y) return t(6), void F.focus();
            s(e);
        });
    }
    function u() {
        0 === $(".plays_feed > .play_record:visible").length ? $("#emptyFilter").addClass("show") : $("#emptyFilter").removeClass("show");
    }
    function i() {
        G.toggleClass("sort_enabled"), (z = !z) ? ($(".plays_feed > .play_record.nothing_get").removeClass("show").next(".hr").hide(), 
        $(".plays_feed > .play_record:not(.nothing_get):last").next(".hr").hide()) : $(".plays_feed > .play_record").addClass("show").next(".hr").show(), 
        u(), e();
    }
    var c, p, l, _, d, h, f, m, k, v, w, b, x, y, g, N, C, M, T, E, I, A, O, P, S, D, j, F, G, H = "webkitAnimationEnd oanimationend msAnimationEnd animationend", z = !1, L = 0, R = 438, U = 3e3, q = 5e3, B = 5e3, X = 5e3, J = 1e3, K = 2e3, Q = 5e3, V = 500, W = 5e3, Y = localStorage.getItem("APIkey"), Z = "https://osu.ppy.sh/api/";
    $(function() {
        c = $(".user_content_wrapper"), j = $(".api_key_wrapper"), F = $(".api_key_wrapper > input"), 
        p = $(".user_profile"), l = $("form.select_user"), _ = $("#input_username"), d = _.siblings("h1"), 
        h = $(".user_profile a.avatar"), f = $(".user_profile a.avatar .avatar_wrapper img"), 
        m = $(".user_profile .user_stuff .username_and_ranking .username a"), k = $(".user_profile .user_stuff .username_and_ranking .ranking h2.pp"), 
        v = $(".user_profile .user_stuff .username_and_ranking .ranking h2.rank"), w = $(".user_profile .user_stuff .detail_row .acc_and_pc .acc h2"), 
        b = $(".user_profile .user_stuff .detail_row .acc_and_pc .pc h2"), x = $(".user_profile .user_stuff .detail_row .count_ranks_row .count_ranks_wrapper .cout_ss > h1"), 
        y = $(".user_profile .user_stuff .detail_row .count_ranks_row .count_ranks_wrapper .cout_s > h1"), 
        g = $(".user_profile .user_stuff .detail_row .count_ranks_row .count_ranks_wrapper .cout_a > h1"), 
        N = $(".user_profile .user_stuff .lvl_row .current_level span"), C = $(".user_profile .user_stuff .lvl_row .lvl_bar_wrapper"), 
        M = $("#details_rank_and_pp"), T = $("#details_accuracy"), E = $("#details_playcount"), 
        I = $("#details_count_ss"), A = $("#details_count_s"), O = $("#details_count_a"), 
        P = $("#details_level"), S = $(".user_feed"), D = $(".user_feed .plays_feed"), G = $(".toggle_fails"), 
        l.submit(function(e) {
            if (e.preventDefault(), !L) {
                if (null === Y) return t(6), void F.focus();
                var a = _.val().trim();
                a.length < 3 ? t(1) : /^[\s\-\]\[\_a-z0-9]+$/i.test(a) ? s(a) : t(2);
            }
        }), F.on("paste", function() {
            $(function() {
                var e = F.val();
                if (40 != e.length || /[^0-9a-z]+/.test(e)) return F.val(""), void t(5);
                j.removeClass("without_key").addClass("with_key"), localStorage.setItem("APIkey", e), 
                Y = e, F.prop("disabled", !0).blur(), _.focus();
            });
        }), G.click(i);
    }), $(window).on("load", function() {
        $(".loading_content").css("display", "none"), $(".overall_wrapper").css("display", "block"), 
        $(".user_content_wrapper").addClass("zoom_in_content_wrapper"), null === Y && $(".api_key_wrapper").addClass("without_key");
        var t = $("#input_username"), e = t.siblings("h1");
        t.focus(), t.focusin(function() {
            e.stop().finish().fadeOut(800);
        }), t.keypress(function() {
            e.fadeOut(800);
        }), t.focusout(function() {
            e.stop().finish().fadeIn(200);
        });
        var a = window.location.href.match(/id=(\d+)/);
        (a = a ? a[1] : 0) && o(a);
    });
}();