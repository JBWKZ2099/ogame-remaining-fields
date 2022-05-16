// ==UserScript==
// @name            OGame Redesign: Remaining Fields
// @namespace       available_fields
// @description     Displays the remaining fields in your planet/moon, added also shortcuts update from OGame 6.1.5
// @license         MIT
// @match           *://*.ogame.gameforge.com/game/*
// @author          Capt Katana (updated By JBWKZ2099)
// @version         2.0.6
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
        "<h1>"+lang.title_tooltip+"</h1> <div class='splitLine'></div> <center> <table class='fleetinfo' cellpadding='0' cellspacing='0'> <tbody> <tr> <th colspan='1'>"+lang.planet+"</th>",
        "</td></tr></tbody></table></center> </div>"
        ];


    /*Main Operation*/
    $(".smallplanet").each( function(index) {
        var planet_fields = (($(this).html()).split("km (")[1]).split(")<BR>")[0];
        var pf_available, pf_available_two;

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

        var str_color;
        /*Cadena para cambiar color*/
        if( pf_available > 9 ) {
            str_color = '<font style="color: lime;font-size: 10px">';
        } else {
            if( pf_available == 0 ) {
                str_color = '<font style="color: red; font-size:10px">';
            } else {
                str_color = '<font style="color: red; font-size:10px">0';
            }
        }


        var pf_available_str = '<font style="font-size:11px">[</font>'+ str_color + pf_available + '</font>'+'<font style="font-size:11px">/</font><font style="font-size:10px">'+pf_available_two+'</font><font style="font-size:11px">]</font>';
        var id_planet = ($(this).html().split("cp=")[1]).split('"')[0];
        var coord = ( ( $(this).html().split("[")[1] ).split("]")[0] ).split(":");


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

            var str_color;
            /*Cadena para cambiar color*/
            if( mf_available > 9 ) {
                str_color = '<font style="color: lime;font-size: 10px">';
            } else {
                if( mf_available == 0 )
                    str_color = '<font style="color: red; font-size:10px">';
                else
                    str_color = '<font style="color: red; font-size:10px">0';
            }

            var mf_available_str = '<font style="font-size:11px">[</font>'+ str_color + mf_available + '</font>'+'<font style="font-size:11px">/</font><font style="font-size:10px">'+mf_available_two+'</font><font style="font-size:11px">]</font>';
            var id_moon = ( ($(this).html().split("moonlink")[1]).split("cp=")[1] ).split('&quot;')[0];
            var coord = ( ( ( $(this).html().split("moonlink")[1] ).split("[")[1] ).split("]")[0] ).split(":");

            /*Muestra los campos disponibles en un Tooltip*/
            $(this).addClass("htmlTooltip tooltipRight tooltipClose");
            $(this).attr("title", attr_txt[0] + attr_txt[2] + "<th style='text-align:right;'>"+lang.moon+"</th></tr> <tr> <td colspan='1'>" + pf_available_str + "</td> <td colspan='2' style='text-align:right;'>" + mf_available_str + "</td></tr> <tr><td> <a href='" + shortcuts[0] + id_planet + "'>"+lang.overview+"</a> </td><td class='value'><a href='" + shortcuts[1] + id_moon + "'>"+lang.resources+"</a></td></tr><tr><td><a href='" + shortcuts[9] + id_planet + "'>[+]</a><a href='" + shortcuts[1] + id_planet + "'>"+lang.resources+"</a> </td><td class='value'><a href='" + shortcuts[2] + id_moon + "'>"+lang.facilities+"</a></td></tr><tr><td> <a href='" + shortcuts[2] + id_planet + "'>"+lang.facilities+"</a> </td><td class='value'><a href='" + shortcuts[2] + id_moon + "&opengate=1'>"+lang.jumpgate+"</a></td></tr><tr><td> <a href='" + shortcuts[3] + id_planet + "'>"+lang.research+"</a> </td><td class='value'><a href='" + shortcuts[5] + id_moon + "'>"+lang.defence+"</a></td></tr><tr><td> <a href='" + shortcuts[4] + id_planet + "'>"+lang.shipyard+"</a> </td><td class='value'><a href='" + shortcuts[6] + id_moon + "'>"+lang.fleet+"</a></td></tr><tr><td> <a href='" + shortcuts[5] + id_planet + "'>"+lang.defence+"</a> </td><td class='value'><a href='" + shortcuts[7] + id_moon + "&galaxy=" + coord[0] + "&system=" + coord[1] + "&position=" + coord[2] + "'>"+lang.galaxy+"</a></td></tr><tr> <td> <a href='" + shortcuts[6] + id_planet + "'>"+lang.fleet+"</a></td></tr><tr> <td> <a href='" + shortcuts[7] + id_planet + "&galaxy=" + coord[0] + "&system=" + coord[1] + "&position=" + coord[2] + "'>"+lang.galaxy+"</a>" + attr_txt[3]);
        } else {
            /*Muestra los campos disponibles en un Tooltip*/
            $(this).addClass("htmlTooltip tooltipRight tooltipClose");
            $(this).attr("title", attr_txt[1] + attr_txt[2] + "<td colspan='2'>" + pf_available_str + attr_txt[3] + "<center><a href='" + shortcuts[0] + id_planet + "'>"+lang.overview+"</a> <br><a href='" + shortcuts[9] + id_planet + "'>[+]</a><a href='" + shortcuts[1] + id_planet + "'>"+lang.resources+"</a> <br><a href='" + shortcuts[2] + id_planet + "'>"+lang.facilities+"</a> <br><a href='" + shortcuts[3] + id_planet + "'>"+lang.research+"</a> <br><a href='" + shortcuts[4] + id_planet + "'>"+lang.shipyard+"</a> <br><a href='" + shortcuts[5] + id_planet + "'>"+lang.defence+"</a> <br><a href='" + shortcuts[6] + id_planet + "'>"+lang.fleet+"</a> <br><a href='" + shortcuts[7] + id_planet + "&galaxy=" + coord[0] + "&system=" + coord[1] + "&position=" + coord[2] + "'>"+lang.galaxy+"</a>  <br></center>");
        }

    } );

/* !SCRIPT */
})();