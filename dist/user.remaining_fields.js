// ==UserScript==
// @name            OGame Redesign: Remaining Fields
// @namespace       available_fields
// @description     Displays the remaining fields in your planet/moon
// @license         MIT
// @match           *://*.ogame.gameforge.com/game/*
// @author          Capt Katana (updated By JBWKZ2099)
// @version         2.6
// @homepageURL     https://github.com/JBWKZ2099/ogame-remaining-fields
// @updateURL       https://raw.githubusercontent.com/JBWKZ2099/ogame-remaining-fields/master/dist/meta.remaining_fields.js
// @downloadURL     https://raw.githubusercontent.com/JBWKZ2099/ogame-remaining-fields/master/dist/user.remaining_fields.js
// @supportURL      https://github.com/JBWKZ2099/ogame-remaining-fields/issues
// @grant           none
// ==/UserScript==

(function () {
/* START CRIPT */

    var global_lf_checker = localStorage.getItem("lifeforms");

    if( typeof global_lf_checker==="undefined" || global_lf_checker==null ) {
        var lifeforms_checker = {};
        lifeforms_checker["lifeforms"] = false;

        if( $("#lifeform").length>0 )
            lifeforms_checker["lifeforms"] = true;

        localStorage.setItem("lifeforms", JSON.stringify(lifeforms_checker));
    }

    global_lf_checker = JSON.parse(localStorage.getItem("lifeforms")).lifeforms;

    // https://*.ogame.*/game/index.php?*
    var theHref = window.location.href,
        lang_server = /s(\d+)-(\w+)/.exec(theHref)[2],
        uni = `s${/s(\d+)-(\w+)/.exec(theHref)[1]}`,
        url = ".ogame.gameforge.com/game/index.php?page=ingame&component=",
        url2 = ".ogame.gameforge.com/game/index.php?page=",
        pages = [
            "overview", // 0
            "supplies", // 1
            "lfbuildings", // 2
            "facilities", // 3
            "research", // 4
            "shipyard", // 5
            "defenses", // 6
            "fleetdispatch", // 7
            "galaxy", // 8
            "opengate", // 9
            "resourcesettings" // 10
        ],
        lang = [];


    if( lang_server=="mx" || lang_server=="es" ) {
        lang = {
            overview: "Resumen",
            resources: "Recursos",
            lifeforms: "Formas de vida",
            research: "Investigación",
            facilities: "Estación",
            shipyard: "Hangar",
            defence: "Defensa",
            fleet: "Flota",
            galaxy: "Galaxia",
            jumpgate: "Salto Cuántico",
            title_tooltip: "Campos Restantes",
            planet: "Planeta",
            moon: "Luna"
        };
    } else if( lang_server == "en" ) {
        lang = {
            overview: "Overview",
            resources: "Resources",
            lifeforms: "Life forms",
            research: "Research",
            facilities: "Facilities",
            shipyard: "Shipyard",
            defence: "Defence",
            fleet: "Fleet",
            galaxy: "Galaxy",
            jumpgate: "Jump gate",
            title_tooltip: "Remaining Fields",
            planet: "Planet",
            moon: "Moon"
        };
    } else if( lang_server == "de" ) {
        lang = {
            overview: "Übersicht",
            resources: "Versorgung",
            lifeforms: "Lebensformen",
            research: "Forschung",
            facilities: "Anlagen",
            shipyard: "Schiffswerft",
            defence: "Verteidigung",
            fleet: "Flotte",
            galaxy: "Galaxie",
            jumpgate: "Sprungtor",
            title_tooltip: "Verbleibende Felder",
            planet: "Planeten",
            moon: "Mond"
        };
    }

    var shortcuts = [
        `https://${uni}-${lang_server+url+pages[0]}&cp=`,
        `https://${uni}-${lang_server+url+pages[1]}&cp=`,
        `https://${uni}-${lang_server+url+pages[2]}&cp=`,
        `https://${uni}-${lang_server+url+pages[3]}&cp=`,
        `https://${uni}-${lang_server+url+pages[4]}&cp=`,
        `https://${uni}-${lang_server+url+pages[5]}&cp=`,
        `https://${uni}-${lang_server+url+pages[6]}&cp=`,
        `https://${uni}-${lang_server+url+pages[7]}&cp=`,
        `https://${uni}-${lang_server+url+pages[8]}&cp=`,
        `https://${uni}-${lang_server+url+pages[9]}&cp=`,
        `https://${uni}-${lang_server+url+pages[10]}&cp=` /*Se actuaiza a la url para que se adapte a la versión 9 del juego (page=ingame&component=resourcesettings)*/
    ];
    //alert(shortcuts[0]);

    var attr_txt = [
            `<div class='htmlTooltip' style='${( ogameInfinityChecker() ? "" : "width: 200px;" )}'>`,
            `<div class='htmlTooltip' style='${( ogameInfinityChecker() ? "" : "width: 150px;" )}'>`,
            `<h1>${lang.title_tooltip}</h1> <div class='splitLine'></div> <center> <table class="remaining-fields" cellpadding='0' cellspacing='0'> <tbody> %construction_var% <tr> <th colspan='1'> <p class='planet-name'>%planet_name%</p> </th>`,
            "</td></tr></tbody></table></center> </div>"
        ],
        tbl_css = `
            <style>
                table.remaining-fields .rf-moon-link { text-align: right; }
                table.remaining-fields { min-width: 130px; }
                table.remaining-fields td,
                table.remaining-fields th { text-align:left; }
                table.remaining-fields th { font-weight:700; color:#848484; }
                .planet-info, .moon-info { color: #848484; }
                table.remaining-fields tr td,
                table.remaining-fields tr th { padding: 2px 5px; }
            </style>
        `;

    $("html head").append(tbl_css);

    /*Main Operation*/
    $(".smallplanet").each( function(i, el) {
        var planet_fields = $(this).find(".planetlink").attr("title").replace("</span>", "").replace("<span class='overmark' >","").replace("<span class='overmark'>",""),
            pf_used = parseInt(/\(([^)]+)\)/.exec( $(this).html() )[1].split("/")[0]),
            pf_all = parseInt(/\(([^)]+)\)/.exec( $(this).html() )[1].split("/")[1]),
            pf_available = pf_all - pf_used,
            planet_info = [],
            plinfo = $.parseHTML($(this).find(".planetlink").attr("title")),
            planet_size = (plinfo[2].textContent).split(" (")[0],
            planet_temp = plinfo[4].textContent,
            moon;


        planet_info[0] = $(el).find(".planet-koords").text();
        planet_info[1] = $(el).find(".planet-name").text();

        if( $(el).find(".moonlink").length>0 ) {
            moon = $(el).find(".moonlink").attr("title").split("<b>")[1].split(" [")[0];
            planet_info[2] = moon;
        }

        var percent = parseFloat( (pf_used/pf_all)*100 ),
            percent_round = Math.round(percent*100)/100,
            html_font = "",
            color = "",
            pf_val = (parseInt(pf_available)<10 || parseInt(pf_available)==0 ? 0 : "");

        if( percent_round<=100 && percent_round>=91 )
            color = "red"; /* red */

        if( percent_round<=90 && percent_round>=81 )
            color = "#FF4900";

        if( percent_round<=80 && percent_round>=71 )
            color = "#FF8D00";

        if( percent_round<=70 && percent_round>=61 )
            color = "#FFC400";

        if( percent_round<=60 && percent_round>=51 )
            color = "#FFFC00";

        if( percent_round<=50 && percent_round>=41 )
            color = "#C9FF00";

        if( percent_round<=40 && percent_round>=31 )
            color = "#95FF00";

        if( percent_round<=30 && percent_round>=21 )
            color = "#6BFF00";

        if( percent_round<=20 && percent_round>=11 )
            color = "#40FF00";

        if( percent_round<=10 && percent_round>=0 )
            color = "lime"; /* Green */


        str_color = `<font style="color: ${color}; font-size:10px">${pf_val}`;


        var pf_available_str = '<font style="font-size:11px">[</font>'+ str_color + pf_available + '</font>'+'<font style="font-size:11px">/</font><font style="font-size:10px">'+pf_all+'</font><font style="font-size:11px">]</font>',
            id_planet = $(this).attr("id").split("-")[1],
            coord = ( /\[([^)]+)\]/.exec( $(this).html() )[1] ).split(":"),
            html_construction = "";


        /*Comprueba si existe luna"></a>*/
        if( $(this).find("a.moonlink").length ) {
            var moon_fields = $(this).find("a.moonlink").attr("title").replace("</span>", "").replace("<span class='overmark' >","").replace("<span class='overmark'>",""),
                mf_used = parseInt( /\(([^)]+)\)/.exec( moon_fields )[1].split("/")[0] ),
                mf_all = parseInt( /\(([^)]+)\)/.exec( moon_fields )[1].split("/")[1] ),
                mf_available = mf_all - mf_used,
                moon_size = ($( $.parseHTML($(this).find("a.moonlink").attr("title")) )[2].textContent).split("(",)[0].replace(" ", ""); /*Get the Moon Size*/

            /* traffic lights colors according to % of remaining fields */
            percent = 0;
            percent_round = 0;
            percent = parseFloat( (mf_used/mf_all)*100 );
            percent_round = Math.round(percent*100)/100;
            str_color = "";
            color = "red";
            // mf_available = (parseInt(mf_available)<10 || parseInt(mf_available)==0 ? 0 : "");

            if( percent_round<=100 && percent_round>=91 )
                color = "red"; /* red */

            if( percent_round<=90 && percent_round>=81 )
                color = "#FF4900";

            if( percent_round<=80 && percent_round>=71 )
                color = "#FF8D00";

            if( percent_round<=70 && percent_round>=61 )
                color = "#FFC400";

            if( percent_round<=60 && percent_round>=51 )
                color = "#FFFC00";

            if( percent_round<=50 && percent_round>=41 )
                color = "#C9FF00";

            if( percent_round<=40 && percent_round>=31 )
                color = "#95FF00";

            if( percent_round<=30 && percent_round>=21 )
                color = "#6BFF00";

            if( percent_round<=20 && percent_round>=11 )
                color = "#40FF00";

            if( percent_round<=10 && percent_round>=0 )
                color = "lime"; /* Green */

            str_color = `<font style="color: ${color};font-size: 10px">${mf_available}`;

            var mf_available_str = `
                <font style="font-size:11px">[</font>${str_color}</font><font style="font-size:11px">/</font><font style="font-size:10px">${mf_all}</font><font style="font-size:11px">]</font>`,
                id_moon = ( ($(this).html().split("moonlink")[1]).split("cp=")[1] ).split('&quot;')[0];

            coord = ( ( ( $(this).html().split("moonlink")[1] ).split("[")[1] ).split("]")[0] ).split(":");
            var has_jumpgate = "";

            /* check if moon has jumpgate */
            has_jumpgate = `
                <td class='value rf-moon-link'>
                    <a href='${shortcuts[3] + id_moon}&opengate=1'>${lang.jumpgate}</a>
                </td>
            `;

            if( !($(this).find("a.moonlink").attr("data-jumpgatelevel")!="0") ) {
                has_jumpgate = `
                    <td class='value rf-moon-link'>
                        <span style="opacity:0.55;">${lang.jumpgate}</span>
                    </td>
                `;
            }

            if( !global_lf_checker ) {
                var html_title = `
                    ${attr_txt[0]}${attr_txt[2]}
                    <span id="ncs-config" class="ncs-config" style="display: none !important;">
                        <img src="https://gf3.geo.gfsrv.net/cdne7/1f57d944fff38ee51d49c027f574ef.gif" width="16" height="16">
                    </span>
                    <th style='text-align:right;'>%moon_name%</th></tr>

                    <tr>
                        <td>
                            <p class="planet-info">${planet_size}</p>
                        </td>
                        <td class="rf-moon-link">
                            <p class="planet-info">${moon_size}</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p class="planet-info">${planet_temp}</p>
                        </td>
                        <td></td>
                    </tr>

                    <tr>
                        <td colspan='1'>${pf_available_str}</td>
                        <td colspan='2' style='text-align:right;'>${mf_available_str}</td>
                    </tr>
                    <tr>
                        <td>
                            <a href='${shortcuts[0] + id_planet}'>${lang.overview}</a>
                        </td>
                        <td class='value rf-moon-link'>
                            <a href='${shortcuts[1] + id_moon}'>${lang.resources}</a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href='${shortcuts[10] + id_planet}'>[+]</a>
                            <a href='${shortcuts[1] + id_planet}'>${lang.resources}</a>
                        </td>
                        <td class='value rf-moon-link'>
                            <a href='${shortcuts[3] + id_moon}'>${lang.facilities}</a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href='${shortcuts[3] + id_planet}'>${lang.facilities}</a>
                        </td>
                        ${has_jumpgate}
                    </tr>
                    <tr>
                        <td>
                            <a href='${shortcuts[4] + id_planet}'>${lang.research}</a>
                        </td>
                        <td class='value rf-moon-link'>
                            <a href='${shortcuts[6] + id_moon}'>${lang.defence}</a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href='${shortcuts[5] + id_planet}'>${lang.shipyard}</a>
                        </td>
                        <td class='value rf-moon-link'>
                            <a href='${shortcuts[7] + id_moon}'>${lang.fleet}</a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href='${shortcuts[6] + id_planet}'>${lang.defence}</a>
                        </td>
                        <td class='value rf-moon-link'>
                            <a href='${shortcuts[8] + id_moon}&galaxy=${coord[0]}&system=${coord[1]}&position=${coord[2]}'>${lang.galaxy}</a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href='${shortcuts[7] + id_planet}'>${lang.fleet}</a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href='${shortcuts[8] + id_planet}&galaxy=${coord[0]}&system=${coord[1]}&position=${coord[2]}'>${lang.galaxy}</a>${attr_txt[3]}
                `;
            } else {
                var html_title = `
                    ${attr_txt[0]}${attr_txt[2]}
                    <span id="ncs-config" class="ncs-config" style="display: none !important;">
                        <img src="https://gf3.geo.gfsrv.net/cdne7/1f57d944fff38ee51d49c027f574ef.gif" width="16" height="16">
                    </span>
                    <th style='text-align:right;'>%moon_name%</th></tr>

                    <tr>
                        <td>
                            <p class="planet-info">${planet_size}</p>
                        </td>
                        <td class="rf-moon-link">
                            <p class="planet-info">${moon_size}</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p class="planet-info">${planet_temp}</p>
                        </td>
                        <td></td>
                    </tr>

                    <tr>
                        <td colspan='1'>${pf_available_str}</td>
                        <td colspan='2' style='text-align:right;'>${mf_available_str}</td>
                    </tr>
                    <tr>
                        <td>
                            <a href='${shortcuts[0] + id_planet}'>${lang.overview}</a>
                        </td>
                        <td class='value rf-moon-link'>
                            <a href='${shortcuts[1] + id_moon}'>${lang.resources}</a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href='${shortcuts[9] + id_planet}'>[+]</a>
                            <a href='${shortcuts[1] + id_planet}'>${lang.resources}</a>
                        </td>
                        <td class='value rf-moon-link'>
                            <a href='${shortcuts[3] + id_moon}'>${lang.facilities}</a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href='${shortcuts[2] + id_planet}'>${lang.lifeforms}</a>
                        </td>
                        ${has_jumpgate}
                    </tr>
                    <tr>
                        <td>
                            <a href='${shortcuts[4] + id_planet}'>${lang.facilities}</a>
                        </td>
                        <td class='value rf-moon-link'>
                            <a href='${shortcuts[5] + id_moon}'>${lang.defence}</a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href='${shortcuts[5] + id_planet}'>${lang.research}</a>
                        </td>
                        <td class='value rf-moon-link'>
                            <a href='${shortcuts[6] + id_moon}'>${lang.fleet}</a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href='${shortcuts[6] + id_planet}'>${lang.shipyard}</a>
                        </td>
                        <td class='value rf-moon-link'>
                            <a href='${shortcuts[7] + id_moon}&galaxy=${coord[0]}&system=${coord[1]}&position=${coord[2]}'>${lang.galaxy}</a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href='${shortcuts[7] + id_planet}'>${lang.defence}</a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href='${shortcuts[8] + id_planet}'>${lang.fleet}</a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href='${shortcuts[9] + id_planet}&galaxy=${coord[0]}&system=${coord[1]}&position=${coord[2]}'>${lang.galaxy}</a>

                    ${attr_txt[3]}
                `;
            }

            if( $(this).find(".constructionIcon:not(.moon)").length>0 ) {
                construction = $(this).find(".constructionIcon:not(.moon)").attr("title");
                html_construction += `
                    <td colspan='1' style='font-size:9px;text-align:left;'> <span class="icon12px icon_wrench"></span> ${construction} </td>
                `;
            } else {
                html_construction += `
                    <td colspan='1'></td>
                `;
            }

            if( $(this).find(".constructionIcon.moon").length>0 ) {
                construction = $(this).find(".constructionIcon.moon").attr("title");
                html_construction += `
                    <td colspan='2' style='font-size:9px;text-align:right;'> <span class="icon12px icon_wrench"></span> ${construction} </td>
                `;
            } else {
                html_construction += `
                    <td colspan='2'></td>
                `;
            }

            html_title = html_title.replace("%construction_var%", html_construction);

            html_title = html_title.replace("%planet_name%", planet_info[1]).replace("%moon_name%", planet_info[2]);

            /*Muestra los campos disponibles en un Tooltip*/
            if( ogameInfinityChecker()===false )
                $(this).addClass("htmlTooltip tooltipRight tooltipClose");

            $(this).find(".moonlink").attr("title", html_title);
        } else {
            html_title = "";
            html_title = `
                ${attr_txt[1]}
                ${attr_txt[2]}
                <td colspan='2'>${pf_available_str}${attr_txt[3]}
                    <center>
                        <p class="planet-info">${planet_size}</p>
                        <p class="planet-info">${planet_temp}</p>`;

            html_title += `
                        <a href='${shortcuts[0]}${id_planet}'>${lang.overview}</a> <br>
                        <a href='${shortcuts[10]}${id_planet}'>[+]</a>
                        <a href='${shortcuts[1]}${id_planet}'>${lang.resources}</a> <br>`;

            if( global_lf_checker ) {
                html_title += `
                        <a href='${shortcuts[2]}${id_planet}'>${lang.lifeforms}</a> <br>
                `;
            }

            html_title += `
                        <a href='${shortcuts[3]}${id_planet}'>${lang.facilities}</a> <br>
                        <a href='${shortcuts[4]}${id_planet}'>${lang.research}</a> <br>
                        <a href='${shortcuts[5]}${id_planet}'>${lang.shipyard}</a> <br>
                        <a href='${shortcuts[6]}${id_planet}'>${lang.defence}</a> <br>
                        <a href='${shortcuts[7]}${id_planet}'>${lang.fleet}</a> <br>
                        <a href='${shortcuts[8]}${id_planet}&galaxy=${coord[0]}&system=${coord[1]}&position=${coord[2]}'>${lang.galaxy}</a> <br>
                    </center>`;

            if( $(this).find(".constructionIcon").length>0 ) {
                html_construction += `<p style='font-size:9px;'><span class="icon12px icon_wrench"></span> ${$(this).find(".constructionIcon").attr("title")}</p>`;
            }

            html_title = html_title.replace("%construction_var%", html_construction);

            html_title = html_title.replace("%planet_name%", planet_info[1]);
            /*Muestra los campos disponibles en un Tooltip*/
            $(this).addClass("htmlTooltip tooltipRight tooltipClose");
        }

        if( ogameInfinityChecker()===false )
            $(this).attr("title", html_title);

        $(this).find(".planetlink").attr("title", html_title);
    });

    function ogameInfinityChecker() {
        var ogk = false;

        if( JSON.parse(localStorage.getItem("ogk-data"))!=null )
            ogk = true;

        return ogk;
    }

/* !SCRIPT */
})();