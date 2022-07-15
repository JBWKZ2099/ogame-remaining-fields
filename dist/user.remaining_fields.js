// ==UserScript==
// @name            OGame Redesign: Remaining Fields
// @namespace       available_fields
// @description     Displays the remaining fields in your planet/moon
// @license         MIT
// @match           *://*.ogame.gameforge.com/game/*
// @author          Capt Katana (updated By JBWKZ2099)
// @version         2.1
// @homepageURL     https://github.com/JBWKZ2099/ogame-remaining-fields
// @updateURL       https://raw.githubusercontent.com/JBWKZ2099/ogame-remaining-fields/master/dist/meta.remaining_fields.js
// @downloadURL     https://raw.githubusercontent.com/JBWKZ2099/ogame-remaining-fields/master/dist/user.remaining_fields.js
// @supportURL      https://github.com/JBWKZ2099/ogame-remaining-fields/issues
// @grant           none
// ==/UserScript==

(function () {
/* START CRIPT */

    // https://*.ogame.*/game/index.php?*
    var lang_server = ( ( (document.location.href).split("//")[1] ).split(".ogame")[0] ).split("-")[1];
    var uni = ( ( (document.location.href).split("//")[1] ).split(".ogame")[0] ).split("-")[0];
    var url = ".ogame.gameforge.com/game/index.php?page=ingame&component=";
    var url2 = ".ogame.gameforge.com/game/index.php?page=";

    var pages = [
        "overview",//0
        "supplies",//1
        "facilities",//2
        "research",//3
        "shipyard",//4
        "defenses",//5
        "fleetdispatch",//6
        "galaxy",//7
        "opengate",//8
        "resourceSettings" //9
    ];

    var lang = Array();


    if( lang_server == "mx" ) {
        lang = {
            overview: "Resumen",
            resources: "Recursos",
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
    } else if( lang_server == "es" ) {
        lang = {
            overview: "Resumen",
            resources: "Recursos",
            research: "Investigación",
            facilities: "Instalaciones",
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
        "https://"+uni+"-"+lang_server+url+pages[0]+"&cp=",
        "https://"+uni+"-"+lang_server+url+pages[1]+"&cp=",
        "https://"+uni+"-"+lang_server+url+pages[2]+"&cp=",
        "https://"+uni+"-"+lang_server+url+pages[3]+"&cp=",
        "https://"+uni+"-"+lang_server+url+pages[4]+"&cp=",
        "https://"+uni+"-"+lang_server+url+pages[5]+"&cp=",
        "https://"+uni+"-"+lang_server+url+pages[6]+"&cp=",
        "https://"+uni+"-"+lang_server+url+pages[7]+"&cp=",
        "https://"+uni+"-"+lang_server+url+pages[8]+"&cp=",
        "https://"+uni+"-"+lang_server+url2+pages[9]+"&cp="
    ];
    //alert(shortcuts[0]);

    var attr_txt = [
        "<div class='htmlTooltip' style='width: 170px;'>",
        "<div class='htmlTooltip' style='width: 150px;'>",
        `<h1>${lang.title_tooltip}</h1> <div class='splitLine'></div> <center> <table class='fleetinfo' cellpadding='0' cellspacing='0'> <tbody> %construction_var% <tr> <th colspan='1'> <p class='planet-name'>%planet_name%</p> </th>`,
        "</td></tr></tbody></table></center> </div>"
    ];


    /*Main Operation*/
    $(".smallplanet").each( function(i, el) {
        var planet_fields = (($(this).html()).split("km (")[1]).split(")<BR>")[0];
        var pf_available, pf_available_two;
        var planet_info = [];

        planet_info[0] = $(el).find(".planet-koords").text();
        planet_info[1] = $(el).find(".planet-name").text();

        if( $(el).find(".moonlink").length>0 ) {
            var moon = $(el).find(".moonlink").attr("title").split("<b>")[1].split(" [")[0];
            planet_info[2] = moon;
        }

        /*encontrar 'span' en la cadena de texto cuando no hay campos disponibles en el planeta*/
        if( planet_fields.indexOf("span") == 1 ) {
            var pf_one, pf_two;
            pf_one = (planet_fields.split("overmark' >")[1]).split("</span")[0];
            pf_two = planet_fields.split("</span>/")[1];

            pf_available = pf_one - pf_two;
            pf_available_two = pf_two;
        } else {
            pf_available = planet_fields.split("/")[1].split(")")[0] - planet_fields.split("/")[0];
            pf_available_two = planet_fields.split("/")[1].split(")")[0];
        }

        var percent = parseFloat( (pf_available/pf_available_two)*100 );
        var percent_round = Math.round(percent*100)/100;

        var str_color;
        /*Cadena para cambiar color*/
        if( percent_round<=100 && percent_round>=51 ) {
            str_color = '<font style="color: lime;font-size: 10px">'+(parseInt(pf_available)<10 || parseInt(pf_available)==0 ? 0 : "");
        } else if( percent_round<=50 && percent_round>10 ) {
            str_color = '<font style="color: #ffa700;font-size: 10px">'+(parseInt(pf_available)<10 || parseInt(pf_available)==0 ? 0 : "");
        } else {
            str_color = '<font style="color: red; font-size:10px">'+(parseInt(pf_available)<10 || parseInt(pf_available)==0 ? 0 : "");
        }


        var pf_available_str = '<font style="font-size:11px">[</font>'+ str_color + pf_available + '</font>'+'<font style="font-size:11px">/</font><font style="font-size:10px">'+pf_available_two+'</font><font style="font-size:11px">]</font>';
        var id_planet = ($(this).html().split("cp=")[1]).split('"')[0];
        var coord = ( ( $(this).html().split("[")[1] ).split("]")[0] ).split(":");
        var html_construction = "";


        /*Comprueba si existe luna"></a>*/
        if( $(this).find("a.moonlink").length ) {
            var moon_fields = (($(this).html()).split("km (")[2].split(")<br/>"))[0];
            var mf_available, mf_available_two;

            /*encontrar 'span' en la cadena de texto cuando no hay campos disponibles en la luna*/
            if( moon_fields.indexOf("span") == 1 ) {
                var mf_one, mf_two;
                mf_one = (moon_fields.split("overmark' >")[1]).split("</span")[0];
                mf_two = moon_fields.split("</span>/")[1];

                mf_available = mf_one - mf_two;
                mf_available_two = mf_two;
                //alert(mf_available_two);
            } else {
                mf_available = moon_fields.split("/")[1] - moon_fields.split("/")[0];
                mf_available_two = moon_fields.split("/")[1]
                //alert(mf_available);
            }

            /* traffic lights colors according to % of remaining fields */

            percent = 0;
            percent_round = 0;
            percent = parseFloat( (mf_available/mf_available_two)*100 );
            percent_round = Math.round(percent*100)/100;

            str_color = "";
            /*change color according to %*/
            if( percent_round<=100 && percent_round>=51 ) {
                str_color = '<font style="color: lime;font-size: 10px">'+(parseInt(mf_available)<10 || parseInt(mf_available)==0 ? 0 : "");
            } else if( percent_round<=50 && percent_round>10 ) {
                str_color = '<font style="color: #ffa700;font-size: 10px">'+(parseInt(mf_available)<10 || parseInt(mf_available)==0 ? 0 : "");
            } else {
                str_color = '<font style="color: red; font-size:10px">'+(parseInt(mf_available)<10 || parseInt(mf_available)==0 ? 0 : "");
            }

            var mf_available_str = '<font style="font-size:11px">[</font>'+ str_color + mf_available + '</font>'+'<font style="font-size:11px">/</font><font style="font-size:10px">'+mf_available_two+'</font><font style="font-size:11px">]</font>';
            var id_moon = ( ($(this).html().split("moonlink")[1]).split("cp=")[1] ).split('&quot;')[0];
            coord = ( ( ( $(this).html().split("moonlink")[1] ).split("[")[1] ).split("]")[0] ).split(":");
            var has_jumpgate = "";

            /* check if moon has jumpgate */
            if( $(this).find("a.moonlink").attr("data-jumpgatelevel")!="0" ) {
                has_jumpgate = `
                    <td class='value'>
                        <a href='${shortcuts[2] + id_moon}&opengate=1'>${lang.jumpgate}</a>
                    </td>
                `;
            } else {
                has_jumpgate = `
                    <td class='value'>
                        <span style="opacity:0.55;">${lang.jumpgate}</span>
                    </td>
                `;
            }

            var html_title = `
                ${attr_txt[0]}${attr_txt[2]}
                <span id="ncs-config" class="ncs-config">
                    <img src="https://gf3.geo.gfsrv.net/cdne7/1f57d944fff38ee51d49c027f574ef.gif" width="16" height="16">
                </span>
                <th style='text-align:right;'>%moon_name%</th></tr>
                <tr>
                    <td colspan='1'>${pf_available_str}</td>
                    <td colspan='2' style='text-align:right;'>${mf_available_str}</td>
                </tr>
                <tr>
                    <td>
                        <a href='${shortcuts[0] + id_planet}'>${lang.overview}</a>
                    </td>
                    <td class='value'>
                        <a href='${shortcuts[1] + id_moon}'>${lang.resources}</a>
                    </td>
                </tr>
                <tr>
                    <td>
                        <a href='${shortcuts[9] + id_planet}'>[+]</a>
                        <a href='${shortcuts[1] + id_planet}'>${lang.resources}</a>
                    </td>
                    <td class='value'>
                        <a href='${shortcuts[2] + id_moon}'>${lang.facilities}</a>
                    </td>
                </tr>
                <tr>
                    <td>
                        <a href='${shortcuts[2] + id_planet}'>${lang.facilities}</a>
                    </td>
                    ${has_jumpgate}
                </tr>
                <tr>
                    <td>
                        <a href='${shortcuts[3] + id_planet}'>${lang.research}</a>
                    </td>
                    <td class='value'>
                        <a href='${shortcuts[5] + id_moon}'>${lang.defence}</a>
                    </td>
                </tr>
                <tr>
                    <td>
                        <a href='${shortcuts[4] + id_planet}'>${lang.shipyard}</a>
                    </td>
                    <td class='value'>
                        <a href='${shortcuts[6] + id_moon}'>${lang.fleet}</a>
                    </td>
                </tr>
                <tr>
                    <td>
                        <a href='${shortcuts[5] + id_planet}'>${lang.defence}</a>
                    </td>
                    <td class='value'>
                        <a href='${shortcuts[7] + id_moon}&galaxy=${coord[0]}&system=${coord[1]}&position=${coord[2]}'>${lang.galaxy}</a>
                    </td>
                </tr>
                <tr>
                    <td>
                        <a href='${shortcuts[6] + id_planet}'>${lang.fleet}</a>
                    </td>
                </tr>
                <tr>
                    <td>
                        <a href='${shortcuts[7] + id_planet}&galaxy=${coord[0]}&system=${coord[1]}&position=${coord[2]}'>${lang.galaxy}</a>${attr_txt[3]}
            `;

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
            $(this).addClass("htmlTooltip tooltipRight tooltipClose");
            $(this).find(".moonlink").attr("title", html_title);
        } else {
            html_title = "";
            html_title = `
                ${attr_txt[1]}
                ${attr_txt[2]}
                <td colspan='2'>${pf_available_str}${attr_txt[3]}
                    <center>`;

            html_title += `
                        <a href='${shortcuts[0]}${id_planet}'>${lang.overview}</a> <br>
                        <a href='${shortcuts[9]}${id_planet}'>[+]</a><a href='${shortcuts[1]}${id_planet}'>${lang.resources}</a> <br>
                        <a href='${shortcuts[2]}${id_planet}'>${lang.facilities}</a> <br>
                        <a href='${shortcuts[3]}${id_planet}'>${lang.research}</a> <br>
                        <a href='${shortcuts[4]}${id_planet}'>${lang.shipyard}</a> <br>
                        <a href='${shortcuts[5]}${id_planet}'>${lang.defence}</a> <br>
                        <a href='${shortcuts[6]}${id_planet}'>${lang.fleet}</a> <br>
                        <a href='${shortcuts[7]}${id_planet}&galaxy=${coord[0]}&system=${coord[1]}&position=${coord[2]}'>${lang.galaxy}</a> <br>
                    </center>`;

            if( $(this).find(".constructionIcon").length>0 ) {
                html_construction += `<p style='font-size:9px;'><span class="icon12px icon_wrench"></span> ${$(this).find(".constructionIcon").attr("title")}</p>`;
            }

            html_title = html_title.replace("%construction_var%", html_construction);

            html_title = html_title.replace("%planet_name%", planet_info[1]);
            /*Muestra los campos disponibles en un Tooltip*/
            $(this).addClass("htmlTooltip tooltipRight tooltipClose");
        }

        $(this).attr("title", html_title);
        $(this).find(".planetlink").attr("title", html_title);
    });

/* !SCRIPT */
})();