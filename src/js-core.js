'use strict';


// namespace
window.nettools = window.nettools || {};
nettools.jscore = nettools.jscore || {

    
    
// ===== COOKIES =====
    
    /**
     * Create a cookie
     *
     * To create a cookie that expires in 1 year, pass a Date object created this way : var date_exp = new Date(); date_exp.setTime(date_exp.getTime()+(365*24*3600*1000))
     *
     * @param string name 
     * @param string value
     * @param Date expires
     * @param string path
     * @param string domain
     * @param bool secure
     */
    setCookie : function(name, value)
    {
        var argv=arguments;
        var argc=arguments.length;
        var expires=(argc > 2) ? argv[2] : null;
        var path=(argc > 3) ? argv[3] : null;
        var domain=(argc > 4) ? argv[4] : null;
        var secure=(argc > 5) ? Boolean(argv[5]) : false;
        document.cookie=name+"="+encodeURIComponent(value)+
            ((expires===null) ? "" : ("; expires="+expires.toGMTString()))+
            ((path===null) ? "" : ("; path="+path))+
            ((domain===null) ? "" : ("; domain="+domain))+
            ((secure===true) ? "; secure" : "");
    },


    
    /**
     * Get cookie
     * 
     * @param string check_name
     * @return null|string Return cookie value or NULL if not found
     */
    getCookie : function(check_name)
    {
        // first we'll split this cookie up into name/value pairs
        // note: document.cookie only returns name=value, not the other components
        var a_all_cookies = document.cookie.split(';');
        var a_temp_cookie = null;
        var cookie_name = '';
        var cookie_value = null;
        var b_cookie_found = false; // set boolean t/f default f

        for ( var i = 0; i < a_all_cookies.length; i++ )
        {
            // now we'll split apart each name=value pair
            a_temp_cookie = a_all_cookies[i].split('=');

            // and trim left/right whitespace while we're at it
            cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');

            // if the extracted name matches passed check_name
            if ( cookie_name === check_name )
            {
                b_cookie_found = true;
                // we need to handle case where cookie has no value but exists (no = sign, that is):
                if ( a_temp_cookie.length > 1 )
                {
                    //cookie_value = unescape( a_temp_cookie[1].replace(/^\s+|\s+$/g, '') );
                    // supprimer le nom du cookie
                    a_temp_cookie.shift();

                    // dans l'éventualité où la valeur du cookie contient un "=", il faut en tenir compte
                    cookie_value = decodeURIComponent(a_temp_cookie.join('=').replace(/^\s+|\s+$/g, ''));
                }

                // note that in cases where cookie is initialized but no value, null is returned
                return cookie_value;
            }
            a_temp_cookie = null;
            cookie_name = '';
        }
        if ( !b_cookie_found )
            return null;
    },

    

    /**
     * Delete a cookie when called
     *
     * @param string name
     * @param string path
     * @param string domain
     */
    deleteCookie : function(name, path, domain)
    {
        if ( nettools.jscore.getCookie(name) ) 
            document.cookie = name + "=" +
                ( (path) ? ";path=" + path : "") +
                ( (domain) ? ";domain=" + domain : "" ) +
                ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
    },
    
    
 
    
    
    
    
// ==== STRINGS AND OBJECTS ====

    /**
     * Set the first letter to upper case
     * 
     * @param string s
     * @return string
     */
    firstUpperCase : function(s)
    {
        s = String(s);
        if ( s != '' )
            return s.substr(0,1).toUpperCase() + s.substr(1);
        else
            return '';
    },

    

    /**
     * Replace diacritic characters (such as é or à) by their simple equivalent (e or a)
     *
     * @param string str
     * @return string
     */
    removeDiacritics : function(str)
    {
        var defaultDiacriticsRemovalMap = [
            {'base':'A', 'letters':/[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g},
            {'base':'AA','letters':/[\uA732]/g},
            {'base':'AE','letters':/[\u00C6\u01FC\u01E2]/g},
            {'base':'AO','letters':/[\uA734]/g},
            {'base':'AU','letters':/[\uA736]/g},
            {'base':'AV','letters':/[\uA738\uA73A]/g},
            {'base':'AY','letters':/[\uA73C]/g},
            {'base':'B', 'letters':/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
            {'base':'C', 'letters':/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
            {'base':'D', 'letters':/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g},
            {'base':'DZ','letters':/[\u01F1\u01C4]/g},
            {'base':'Dz','letters':/[\u01F2\u01C5]/g},
            {'base':'E', 'letters':/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g},
            {'base':'F', 'letters':/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
            {'base':'G', 'letters':/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g},
            {'base':'H', 'letters':/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g},
            {'base':'I', 'letters':/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g},
            {'base':'J', 'letters':/[\u004A\u24BF\uFF2A\u0134\u0248]/g},
            {'base':'K', 'letters':/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g},
            {'base':'L', 'letters':/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g},
            {'base':'LJ','letters':/[\u01C7]/g},
            {'base':'Lj','letters':/[\u01C8]/g},
            {'base':'M', 'letters':/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
            {'base':'N', 'letters':/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g},
            {'base':'NJ','letters':/[\u01CA]/g},
            {'base':'Nj','letters':/[\u01CB]/g},
            {'base':'O', 'letters':/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g},
            {'base':'OI','letters':/[\u01A2]/g},
            {'base':'OO','letters':/[\uA74E]/g},
            {'base':'OU','letters':/[\u0222]/g},
            {'base':'P', 'letters':/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
            {'base':'Q', 'letters':/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
            {'base':'R', 'letters':/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g},
            {'base':'S', 'letters':/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g},
            {'base':'T', 'letters':/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g},
            {'base':'TZ','letters':/[\uA728]/g},
            {'base':'U', 'letters':/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g},
            {'base':'V', 'letters':/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
            {'base':'VY','letters':/[\uA760]/g},
            {'base':'W', 'letters':/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
            {'base':'X', 'letters':/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
            {'base':'Y', 'letters':/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g},
            {'base':'Z', 'letters':/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g},
            {'base':'a', 'letters':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g},
            {'base':'aa','letters':/[\uA733]/g},
            {'base':'ae','letters':/[\u00E6\u01FD\u01E3]/g},
            {'base':'ao','letters':/[\uA735]/g},
            {'base':'au','letters':/[\uA737]/g},
            {'base':'av','letters':/[\uA739\uA73B]/g},
            {'base':'ay','letters':/[\uA73D]/g},
            {'base':'b', 'letters':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},
            {'base':'c', 'letters':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g},
            {'base':'d', 'letters':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g},
            {'base':'dz','letters':/[\u01F3\u01C6]/g},
            {'base':'e', 'letters':/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g},
            {'base':'f', 'letters':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},
            {'base':'g', 'letters':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g},
            {'base':'h', 'letters':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g},
            {'base':'hv','letters':/[\u0195]/g},
            {'base':'i', 'letters':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g},
            {'base':'j', 'letters':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},
            {'base':'k', 'letters':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g},
            {'base':'l', 'letters':/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g},
            {'base':'lj','letters':/[\u01C9]/g},
            {'base':'m', 'letters':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},
            {'base':'n', 'letters':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g},
            {'base':'nj','letters':/[\u01CC]/g},
            {'base':'o', 'letters':/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g},
            {'base':'oi','letters':/[\u01A3]/g},
            {'base':'ou','letters':/[\u0223]/g},
            {'base':'oo','letters':/[\uA74F]/g},
            {'base':'p','letters':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},
            {'base':'q','letters':/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},
            {'base':'r','letters':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g},
            {'base':'s','letters':/[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g},
            {'base':'t','letters':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g},
            {'base':'tz','letters':/[\uA729]/g},
            {'base':'u','letters':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g},
            {'base':'v','letters':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},
            {'base':'vy','letters':/[\uA761]/g},
            {'base':'w','letters':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},
            {'base':'x','letters':/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},
            {'base':'y','letters':/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g},
            {'base':'z','letters':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g}
        ];

        for(var i=0; i<defaultDiacriticsRemovalMap.length; i++) {
            str = str.replace(defaultDiacriticsRemovalMap[i].letters, defaultDiacriticsRemovalMap[i].base);
        }

        return str;
    },

    

    /**
     * Encode a string that should be passed in URL
     *
     * @param string str
     * @return string
     */
    escape : function(str)
    {
        //return escape(str.replace(/€/g, 'E')).replace(/\+/g, '%2B');
        var str = String(str); // forcer conversion en chaine
        //return encodeURIComponent(str.replace(/€/g, 'E').replace(/\+/g, '%2B'));
        return encodeURIComponent(str);
    },


    
    /**
     * Decode an URL encoded string
     * 
     * @param string str
     * @return string
     */
    unescape : function(str)
    {
        var str = String(str);
        //return decodeURIComponent(str.replace(/%2B/g, '+'));
        return decodeURIComponent(str);
    },
    
    
    
    /**
     * Filter an array and remove null values (null, undefined) or empty values ''
     *
     * @param string[] arr
     * @param bool removeNullValues Defaults to true
     * @param bool removeEmptyValues Defaults to true
     * @return string[]
     */
    arrayFilter : function(arr, removeNullValues, removeEmptyValues)
    {
        if ( removeNullValues == null )
            removeNullValues = true;
        if ( removeEmptyValues == null )
            removeEmptyValues = true;
        
        // if nothing to remove, return argument
        if ( !removeNullValues && !removeEmptyValues )
            return arr;
        
        // detect browser compliance to ecmascript
        if ( Array.prototype.filter )
            return arr.filter(function(x)
                {
                    if ( removeNullValues && (x == null) )
                        return false;
                    if ( removeEmptyValues && (x === '') ) 
                        return false;
                
                    return true;                        
                });
        else
        {
            var ret = [];
            var arrl = arr.length;
            for ( var i = 0 ; i < arrl ; i++ )
            {
                if ( removeNullValues && (arr[i] == null) )
                    continue;
                if ( removeEmptyValues && (arr[i] === '') )
                    continue;

                ret.push(arr[i]);                        
            }
            
            return ret;
        }
    },


    
    /**
     * Assert that a number has a leading zero (useful for hours and minutes formatting)
     * 
     * @param string|int n
     * @return string
     */
    leadingZero : function(n)
    {
        if ( Number(n) < 10 )
            return "0" + n;
        else
            return String(n);
    },


    
    /**
     * Assert that a number has no leading zero (useful for removing 0 in front of hours and minutes formats)
     * 
     * @param string|int n
     * @return int
     */
    trimLeadingZero : function (n)
    {
        var n = String(n);
        if ( n.substr(0,1) === "0" )
            return parseInt(n.substr(1));
        else
            return parseInt(n);
    },


    
    /**
     * Adjust date to midnight
     * 
     * @param Date dt
     * @return Date
     */
    date2Midnight : function(dt)
    {
        dt.setHours(0,0,0,0);
        return dt;
    },


    
    /**
     * Pick a random number between min and max
     * 
     * @param int min
     * @param int max
     * @return int
     */
    random : function(min, max) 
    {
        return Math.floor(min + (1+max-min)*Math.random());
    },


    
    /**
     * Add parameter(s) to a querystring
     * 
     * We return either a string or a litteral object, depending on what type is QS
     * 
     * @param Object|string qs
     * @param string key
     * @param string value
     * @return Object|string
     */
    querystringAppend : function(qs, key, value)
    {
        var q = new nettools.jscore.Querystring(qs);
        q.addParameter(key, value);
        
        if ( typeof qs == 'string' )
            return q.toString();
        else
            return q.getQuerystringObject();
    },


    
    /**
     * Add parameters to an URL
     *
     * If the URL has no querystring, ? will be prepend before appending parameters ; otherwise, & will be inserted before new parameters, at the end of the string
     * 
     * @param string url
     * @param string append
     * @return string
     */
    appendToUrl : function(url, append)
    {
        if ( url.indexOf('?') === -1 )
            return url + "?" + append;
        else
            return url + "&" + append;
    },
    


    /**
     * Replace some unwanted characters to their HTML entities
     * 
     * @param string s
     * @return string
     */
    htmlentities : function(s)
    {
        return s.replace(/&/g, '&amp;')
                .replace(/"/g, '&quote;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/'/g, '&apos;')
                .replace(/\n/g, '<br>');
    },


    
    /**
     * Counting how many times a substring is mentionned in a string
     * 
     * @param string sub
     * @param string s
     * @return int
     */
    count : function(sub, s)
    {
        if ( !sub || !s )
            return 0;
        
            
        var p = s.indexOf(sub);
        var n = 0;

        while ( p !== -1 )
        {
            n++;
            p = s.indexOf(sub, p+1);
        }

        return n;
    },

    

    /**
     * Extract file name with extension from a filepath (folders are trimmed)
     *
     * @param string fname
     * @return string
     */     
    extractFileName : function(fname)
    {
        var ereg = new RegExp('[^/]*\.[a-z0-9]+$', 'i');
        var regs = ereg.exec(fname);
        if ( regs.length )
            return(regs[0]);
        else
            return "";
    },

    

    /**
     * Trim spaces left and right in a string
     *
     * @param string str
     * @return string
     */
    trim : function(str)
    {
        str = String(str);
        if ( typeof str.trim === 'function' )
            return str.trim();
        else
            return netools.jscore.ltrim(nettools.jscore.rtrim(str));
    },



    /**
     * Trim spaces left in a string
     *
     * @param string str
     * @return string
     */
    ltrim : function(str)
    {
        str = String(str);
        var chars = "\\s";
        return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
    },


    
    /**
     * Trim spaces right in a string
     *
     * @param string str
     * @return string
     */
    rtrim : function(str)
    {
        str = String(str);
        var chars = "\\s";
        return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
    },

    

    /** 
     * Create a random value (length may be set)
     * 
     * @param int digits Number of digits of random value ; if omitted, we create a 16 digits value
     * @return int
     */
    randomNumber : function(digits)
    {
        var digits = digits || 16;
        return Math.round(Math.random() * Math.pow(10, digits));
    },


    
    /**
     * Get info about current URL
     * 
     * @return Object Returns an object litteral with path, queryString and url properties
     */
    selfUrl : function()
    {
        return {
                path : document.location.protocol + '//' + document.location.host + document.location.pathname,
                queryString : document.location.search,
                url : document.location.href
            }
    },

    

    /**
     * Create a unique ID (hex value) of len digits
     * 
     * @param int len
     * @return string
     */
    uniqueId : function(len)
    {
        var charSet = 'abcdef0123456789';
        var id = '';
        for (var i = 1; i <= len; i++)
        {
            var randPos = Math.floor(Math.random() * 16);
            id += charSet[randPos];
        }

        return id;
    },

    

    /**
     * Decode a base64-encoded string
     * 
     * If the browser is compliant with window.atob, we use it ; otherwise, we use a polyfill
     *
     * @param string data
     * @return string
     */
    base64_decode : (function()
    {
        // si navigateur moderne, utiliser fonction intégrée
        if ( window['atob'] )
            return window.atob.bind(window);//function(data){return atob(data);}
        else
            // sinon fonction perso, moins optimisée
            return function(data)
                {
                  // http://kevin.vanzonneveld.net
                  // +   original by: Tyler Akins (http://rumkin.com)
                  // +   improved by: Thunder.m
                  // +      input by: Aman Gupta
                  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                  // +   bugfixed by: Onno Marsman
                  // +   bugfixed by: Pellentesque Malesuada
                  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                  // +      input by: Brett Zamir (http://brett-zamir.me)
                  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                  // *     example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
                  // *     returns 1: 'Kevin van Zonneveld'
                  // mozilla has this native
                  // - but breaks in 2.0.0.12!
                  //if (typeof this.window['atob'] == 'function') {
                  //    return atob(data);
                  //}
                  var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
                  var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
                    ac = 0,
                    dec = "",
                    tmp_arr = [];

                  if (!data) {
                    return data;
                  }

                  data += '';

                  do { // unpack four hexets into three octets using index points in b64
                    h1 = b64.indexOf(data.charAt(i++));
                    h2 = b64.indexOf(data.charAt(i++));
                    h3 = b64.indexOf(data.charAt(i++));
                    h4 = b64.indexOf(data.charAt(i++));

                    bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

                    o1 = bits >> 16 & 0xff;
                    o2 = bits >> 8 & 0xff;
                    o3 = bits & 0xff;

                    if (h3 == 64) {
                      tmp_arr[ac++] = String.fromCharCode(o1);
                    } else if (h4 == 64) {
                      tmp_arr[ac++] = String.fromCharCode(o1, o2);
                    } else {
                      tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
                    }
                  } while (i < data.length);

                  dec = tmp_arr.join('');

                  return dec;
                }
    })(),
    

    
    /**
     * Merge two objects litteral
     * 
     * @param Object dest
     * @param Object source
     * @return Object Existing values in DEST are overridden by corresponding values in SOURCE
     */
    mergeObjects : function(dest, source)
    {
        var result = {};

        if ( dest )
            for ( var p in dest )
                result[p] = dest[p];

        if ( source )
            for ( var p in source )
                result[p] = source[p];

        return result;
    },

        
    
    
    
    



// ==== FORMS ====

    /**
     * Get DOM event target
     * 
     * @param Event e
     * @return Node
     */
    getTarget : function(e)
    {
        // déterminer l'évènement et sa cible
        var e = e || window.event;
        var target = e.target || e.srcElement;

        return target;
    },


    
    /**
     * Get info about the selected item from a SELECT input
     *
     * @param HTMLSelectElement sel
     * @return Object Returns an object litteral with text, value, index, self proprerties
     */
    getOption : function(sel)
    {
        if ( sel.selectedIndex >= 0 )
            return {
                'text' : sel.options[sel.selectedIndex].text,
                'id' : sel.options[sel.selectedIndex].value,
                'index' : sel.selectedIndex,
                'self' :sel.options[sel.selectedIndex]
            };
        else
            return false;
    },


    
    /**
     * Get the current checked radio bouton
     *
     * @param HTMLForm f
     * @param string name
     * @return null|HTMLRadioInput
     */
    getCheckedRadioButton : function(f, name)
    {
        var fields = f.elements[name];
        var il = fields.length;

        for ( var i = 0; i < il ; i++ )
            if ( fields[i].checked )
                return fields[i];

        return null;
    },

    

    /**
     * Converting a NodeList of HTML input elements to a querystring (a string where values are url-encoded)
     *  
     * @param NodeList elements
     */ 
    inputs2querystring : function(elements)
    {
        return (new nettools.jscore.Querystring(nettools.jscore.formFieldsToObject(elements))).toString();
    },

    

    /** 
     * Convert a NodeList of input elements to an object litteral
     * 
     * @param NodeList elements
     * @return Object
     */
    formFieldsToObject : function(elements)
    {
        var res = {};
        var elementsl = elements.length;

        for ( var i = 0 ; i < elementsl ; i++ )
        {
            var e = elements[i];
            
            if ( !e.name )
                continue;

            if ( ((e.type === 'radio')||(e.type === 'checkbox')) && !e.checked )
                continue;

            if ( (e.type === 'submit') || (e.type === 'button') || (e.type === 'image') || (e.type === 'cancel') )
                continue;

            res[e.name] = e.value;
        }

        return res;
    },


    

    
    


// ==== DOM / STYLE / EVENTS ====
    
    /**
     * Set an event on a DOM node
     * 
     * @param Node obj
     * @param string ev
     * @param function(Event) cb Callback called for the EV event
     */
    registerEvent : function(obj, ev, cb)
    {
        if ( obj.addEventListener ) 	// FF
            obj.addEventListener(ev, cb, false);
        else 
        if ( obj.attachEvent )		// IE
            obj.attachEvent('on' + ev, cb);
    },


    
    /**
     * Add an event to an event chain 
     *
     * The event chain makes it possible to halt event handling ; with DOM event listener we can only cancel propagation in the DOM tree, but we can't prevent 
     * events from being called to all the handlers registered for a given target/event.
     *
     * @param Node obj
     * @param string eventname
     * @param function(Event) cb
     */
    addEvent : function(obj, eventname, cb)
    {
        // si déjà un comportement défini, le sauvegarder
        if ( typeof obj[eventname] === 'function' )
        {
            var old = obj[eventname];
            obj[eventname] = function(e)
                        {
                            // si pas géré, chainage
                            if ( cb.bind(obj)(e) === true )
                                return old.bind(obj)(e);
                            else
                                return false;
                        };
        }
        else
            obj[eventname] = cb;
    },


    
    /** 
     * Register a user-function to be called at DOM onload event
     * 
     * @param function(Event) cb
     */
    registerOnLoadCallback : function(cb)
    {
        nettools.jscore.registerEvent(window, 'load', cb);
    },

    

    /**
     * Dynamic script loading with loaded event callback
     *
     * @param string src
     * @param function(Event) cb
     */
    loadScript : function(src, cb)
    {
        var head = document.getElementsByTagName('head');
        var script = document.createElement('script');
        script.src = src;
        script.type = 'text/javascript';

        // ff/ie
        script.onreadystatechange = function(e)
            {
                if (script.readyState === 'loaded' || script.readyState === 'complete')
                {
                    if ( cb )
                        cb(e);
                }
            };

        // ff/ie
        script.onload = function(e)
            {
                if ( cb )
                    cb(e);
            }

        head[0].appendChild(script);
    },


    
    /**
     * Stop DOM tree event propagation
     * 
     * @param Event e
     */
    stopPropagation : function(e)
    {
        if (!e) var e = window.event;
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();
    },


    
    /** 
     * Show or hide a DOM node
     * 
     * @param Node|string objname
     * @param null|bool visible If this parameter is omitted, showHide is has a on/off behavior
     * @param string display Display CSS value to set when showing the node (usually 'block', but may also be 'inline-block')
     */
    showHide : function(objname, visible, display)
    {
        if ( typeof objname === "string" )
            var obj = document.getElementById(objname);
        else
            var obj = objname;

        
        // on/off behavior
        if ( (visible === undefined) || (visible === null) )
        {
            if (obj.style.visibility === "hidden" )
            {
                obj.style.visibility = "visible";
                obj.style.display = display ? display : "";
            }
            else
            {
                obj.style.visibility = "hidden";
                obj.style.display = "none";
            }
        }
        else
        {
            if ( visible )
            {
                obj.style.visibility = "visible";
                obj.style.display = display ? display : "";
            }
            else
            {
                obj.style.visibility = "hidden";
                obj.style.display = "none";
            }
        }
    },


    
    /** 
     * Find next item in the DOM tree, ignoring text nodes
     * 
     * @param Node elem
     * @return Node
     */
    nextSibling : function(elem)
    {
        if ( elem.nextSibling )
            if ( elem.nextSibling.nodeType === 3 )
                return nettools.jscore.nextSibling(elem.nextSibling);

        return elem.nextSibling;
    },


    
    /** 
     * Find previous item in the DOM tree, ignoring text nodes
     * 
     * @param Node elem
     * @return Node
     */
    previousSibling : function(elem)
    {
        if ( elem.previousSibling )
            if ( elem.previousSibling.nodeType === 3 )
                return nettools.jscore.previousSibling(elem.previousSibling);

        return elem.previousSibling;
    },



    /**
     * Convert a CSS string of format "name1:value1;name2:value2" to a object litteral (css values with '-' are converted to camelCase)
     *
     * @param string css
     * @return Object
     */
    cssToJs : function (css)
    {
        // extraire déclarations nom:valeur;
        var rg = /([a-z-]+):([^;]+);/g;
        var dcl = {};

        // chercher toutes les déclarations
        var items = rg.exec(css);
        while ( items && (items.length === 3) )
        {
            dcl[nettools.jscore.cssToCamelCase(items[1])] = items[2];
            items = rg.exec(css);
        }

        return dcl;
    },


    
    /**
     * Convert an object litteral to a CSS string (camelCase properties are converted to values with '-' separator ; declarations are separated with '; ')
     * 
     * @param Object styles
     * @return string
     */
    jsToCss : function(styles)
    {
        var ret = [];
        for ( var s in styles )
            ret.push(nettools.jscore.camelCaseToCss(s) + ':' + styles[s]);

        if ( ret.length )	
            return ret.join('; ') + ';';
        else
            return '';
    },


    
    /**
     * Convert a string style name in camelCase to CSS format (eg. fontSize to font-size)
     *
     * @param string jsStyle
     * @return string
     */
    camelCaseToCss : function (jsStyle)
    {
        var rg = /([a-z])([A-Z])/g;
        var items = rg.exec(jsStyle);
        var ret = jsStyle;

        while ( items && (items.length === 3) )
        {
            ret = ret.replace(items[0], items[1] + '-' + items[2].toLowerCase());
            items = rg.exec(jsStyle);
        }	

        return ret;
    },


    
    /** 
     * Convert a CSS formatted declaration to camelCase (eg. aaa-bbb-ccc to aaaBbbCcc)
     * 
     * @param string css
     * @return string
     */
    cssToCamelCase : function(css)
    {
        var rg = /-([a-z])([a-z]+)/g;
        var items = rg.exec(css);
        var ret = css;

        while ( items && (items.length === 3) )
        {
            ret = ret.replace(items[0], items[1].toUpperCase() + items[2]);
            items = rg.exec(css);
        }	

        return ret;
    }
    
}










// ==== STORAGE MANAGER ====
nettools.jscore.StorageManager = {

	/**
     * Read a value from browser localStorage
     * 
     * If no value found, we read a JSON file and store its contents to the localStorage, for further use.
     * If the browser is not compliant with localStorage, we read the JSON file, but we don't do any cache stuff
     *
     * @param string key
     * @param string ressource Path to JSON encoded file used if KEY index is not found in browser localStorage
     * @param string ns String pointing to the JSON value set (eg. 'data.clients') in the JSON file
     * @param function(mixed) cbnext Callback called when ressource loaded from file, with the NS value as parameter
     */
	fetch : function(key, ressource, ns, cbnext)
	{
		// if already stored in browser localStorage or browser not compilant
		function _load()
		{
			nettools.jscore.loadScript(ressource, 
					function()
					{
						var data = eval(ns);
						
						if ( window.localStorage )
							window.localStorage.setItem(key, JSON.stringify(data));
							
						if ( cbnext )
							cbnext(data);
					}
				);
		}



		var data = null;
        
        // not found or browser not compliant
		if ( !window.localStorage || !(data = window.localStorage.getItem(key)) ) 
			_load();
		
        
		// found in localStorage
		else
		{
			try
            {
                data = JSON.parse(data);
            }
            catch(e)
            {
                _load();
                return;
            }
            
            
            if ( data )
            {
                if ( cbnext && (typeof cbnext === 'function') )
                    cbnext(data);
            }
            else
                _load();
		}
	}

};










// ==== REQUESTHELPER ====

nettools.jscore.RequestHelper = (function(){

	// --- PRIVATE DECLARATIONS ---
	
	var _signOn = false;
	var _signCallback = null;
	var _validity = 30;
	var _sign_field = 'sign';
	
	// --- /PRIVATE DECLARATIONS ---
	
    
	return {

		/**
         * Set sign mode on or off
         * 
         * @param bool b
         * @param function(Object) Callback called to identify elements of postData to use in the signature process ; must return {elements:[string1, string2], token:string}
         */
		setSignOn : function(b, cb)
		{
			_signOn = b;
			_signCallback = cb;
		},
		

        
		/**
         * Sign mode accessor
         * 
         * @return bool
         */
		getSignOn : function()
		{
			return _signOn;
		},
		
        
		
        /**
         * Sign a request as a object litteral ; a new field is appended to postData with the signature
         *
         * @param Object postData
         */
        signObject : function(postData)
        {
            if ( typeof _signCallback == 'function' )
            {
                // exécuter le callback sur les infos pour obtenir les valeurs à signer et le token éventuel
                var sdata = _signCallback(postData);

                // créer un paramètre supplémentaire avec cette signature
                postData[_sign_field] = nettools.jscore.RequestHelper.sign(sdata.elements, sdata.token);
            }
        },
        
        

		/** 
         * Sets token validity delay in seconds
         *
         * @param int t
         */
		setValidityDelay : function(t)
		{
			_validity = t;
		},
		
        

		/**
        * Post a request to an URL
        * 
        * @param string url
        * @param string|Object data
        */
		post : function(url, data)
		{
			// creating form
			var form = document.createElement('form');
			form.method = 'post';
			form.action = url;
			form.style.visibility = "hidden";
			form.style.display = "none";
			
			
			// add parameters in hidden fields
			if ( data )
			{
				// if request as a string, converting it to a object litteral
				if ( typeof(data) === 'string' )
					data = (new nettools.jscore.Querystring(data)).getQuerystringObject();
					
				// if sign mode on
				if ( _signOn )
					nettools.jscore.RequestHelper.signObject(data);

				
				// creating hidden fields
				for ( var d in data )
				{
					var e = document.createElement('input');
					e.type = "hidden";
					e.name = d;
					
					if ( typeof(data[d]) === 'boolean' )
						e.value = data[d] ? 1:0;
					else
						e.value = ((data[d]!==undefined) && (data[d]!==null)) ? data[d] : "";
					
					form.appendChild(e);
				}
			}
				
			// submitting form
			document.body.appendChild(form);
			form.submit();
		},
		
        
		
		/** 
         * Sending an XmlHttpRequest
         * 
         * @param string url
         * @param callback function(response)
         * @param string|object postData
         */
		sendXmlHTTPRequest : function(url,callback,postData)
		{
			// conform parameters
			if ( (postData === null) || (postData === undefined) )
				postData = {};


			// if sign mode on
			if ( _signOn )
			{
				// if parameters in a string, converting to an objet litteral
				if ( typeof(postData) === 'string' )
					postData = (new nettools.jscore.Querystring(postData)).getQuerystringObject();

                nettools.jscore.RequestHelper.signObject(postData);
			}


			return nettools.jscore.xmlhttp.sendRequest(url, callback, postData);
		},
		
		
        
		/**
         * Send an XmlHttpRequest and get a Promise
         * 
         * @param string url
         * @param string|Object postData
         * @return Promise
         */
		sendXmlHTTPRequestPromise : function(url,postData)
		{
			if ( (postData === null) || (postData === undefined) )
				postData = {};


			if ( _signOn )
			{
				if ( typeof(postData) === 'string' )
					postData = (new nettools.jscore.Querystring(postData)).getQuerystringObject();

                nettools.jscore.RequestHelper.signObject(postData);
			}


			return nettools.jscore.xmlhttp.sendRequestPromise(url, postData);
		},
        
        
        
		/**
         * Handle error in a Promise ; to use as a callback in .catch promise statements
         *
         * @param Error e
         */
		promiseErrorHandler : function(e)
		{
			if ( e )
			{
				if ( e.message )
					alert(e.message);
				else
					alert(e);
			}
		},
		

        
		/** 
         * Sign an URL 
         * 
         * URL parameters used to sign the request are mentionned in ELEMENTS 
         * 
         * @param string url
         * @param string token
         * @param string[] elements Array of parameter names to use to sign the request
         * @return string Returns the URL parameter with a sign=xxxxx item appended
         */
		signUrl : function(url, token, elements)
		{
			var elementsl = elements.length;
			var msg = [];
			for ( var i = 0 ; i < elementsl ; i++ )
			{
				var regexp = new RegExp('(?:\\?|&)' + elements[i] + '=([^&]+)');
				var regs = regexp.exec(url);
				
				if ( regs )
					msg.push(regs[1]);
			}
			
			return nettools.jscore.appendToUrl(url, 'sign=' + nettools.jscore.RequestHelper.sign(msg, token));
		},


        
		/**
         * Sign an array of elements with a token
         *
         * @param string[] elements
         * @param string token
         * @return string Returns the ELEMENTS array values signed with token and a validity delay
         */
		sign : function(elements, token)
		{
			var elementsl = elements.length;
			var msg = "";
			for ( var i = 0 ; i < elementsl ; i++ )
				msg += elements[i];
			
			
			// Sign elements with token and timestamp of validity delay (encoded in hex)
			var dt = new Date();
			dt = Math.floor(dt.valueOf() / 1000) + _validity;
			return nettools.jscore.hmacSha256(nettools.jscore.base64_decode('Zm9ybVNpZ246') + token + '|' + msg + dt, nettools.jscore.base64_decode('UmVxdWVzdEhlbHBlcjo6Y2hlY2tGb3JtU2lnbg==')) + dt.toString(16);
		},
		

        
		/**
         * Sign a form (all inputs with data-sign attribute set ; the value of the attribute gives the order of message signature)
         * 
         * @param HTMLForm form 
         * @param HTMLInput tokenField Field storing the token
         * @param HTMLInput signField Field to receive the signature
         */
		formSign : function(form, tokenField, signField)
		{
			var elementsl = form.elements.length;
			var elements = [];
			for ( var i = 0 ; i < elementsl ; i++ )
			{
				var e = form.elements[i];
				if ( e.hasAttribute('data-sign') )
					elements.push(e);
			}
			
			
			// sorting array of elements to sign according to the index mentionned in data-sign attribute
			elements.sort(function(a,b)
							{
								return parseInt(a.getAttribute('data-sign')) - parseInt(b.getAttribute('data-sign'));
							}
						);
						
            
			// converting to an array of inputs
			var elementsl = elements.length;
			var arr = [];
			for ( var i = 0 ; i < elementsl ; i++ )
				arr.push(elements[i].value);
			
						
			// sign process
			signField.value = nettools.jscore.RequestHelper.sign(arr, tokenField ? tokenField.value : 'emptyToken');
			return signField.value;
		},
		
		
        
		/** 
         * Converting an object litteral to FormData
         *
         * We handle the special case of null : a null javascript value is sent by FormData as a string 'null' value, 
         * this is not desired, so null values will be converted to empty '' values
         *
         * @param Object obj
         * @param null|FormData fd Already created FormData object or null to create a new one from scratch
         * @return FormData
         */
		object2FormData : function(obj, fd)
		{
			if ( (fd === null) || (fd === undefined) ) 
				fd = new FormData();
				
			// envoi données perso
			for ( var k in obj )
				fd.append(k, ((obj[k] === null)||(obj[k] === undefined)) ? '' : obj[k]);				
				
			return fd;
		}	


	};
})();









// ==== XMLHTTP ====

nettools.jscore.xmlhttp = nettools.jscore.xmlhttp || (function() {

	// --- PRIVATE DECLARATIONS ---
	
	var _XMLHttpFactories = [
		function () {return new XMLHttpRequest()},
		function () {return new ActiveXObject("Msxml2.XMLHTTP")},
		function () {return new ActiveXObject("Msxml3.XMLHTTP")},
		function () {return new ActiveXObject("Microsoft.XMLHTTP")}
	];
	

    
	/**
     * Factory method to create a XmlHttpRequest object
     */
	function _createXMLHTTPObject() {
		var xmlhttp = false;
		for (var i=0 ; i < _XMLHttpFactories.length ; i++) {
			try {
				xmlhttp = _XMLHttpFactories[i]();
				
				// se souvenir de la compatibilité pour le prochain appel en redéfinissant cette fonction
				_createXMLHTTPObject = _XMLHttpFactories[i];
			}
			catch (e) {
				continue;
			}
			break;
		}
		return xmlhttp;
	}
	
    
	
	/**
    * If an error occured, logging details in the javascript console from formatted error page string
    *
    * @param string exception
    * @param string title
    */
	function _logExceptionToConsole(exception, title)
	{
		if ( !console )
			return;
		if ( typeof console.log != 'function' )
			return;
		
		
		// extract title (H1), exception name (H2), exception message (CODE)
		var regexp = new RegExp('<h1>([^<]*)</h1>[\\s]*<h2>([^<]*)</h2>[\\s]*<code>([^<]*)</code>', 'i');
		var regs = regexp.exec(exception);
		
		if ( regs )
		{
			var h1 = regs[1].trim();
			var h2 = regs[2].trim();
			var code = regs[3].trim();
			console.log(h1, " - Exception '" + h2 + "'", " - " + code);
			
			if ( typeof console.table != 'function' )
				return;
			
			
			// extract exception stack trace
			var s = exception.replace(/[\r\n]/g, '')
			var regexp = new RegExp('<tr>(.*?)</tr>', 'gi');
			var regs = null;
			var regstd = null;
			var table = [];
			while ( (regs = regexp.exec(s)) !== null )
			{
				var regexptd = new RegExp('<td>(.*?)</td>', 'gi');
				var regstd = null;
				var cols = [];
				while ( (regstd = regexptd.exec(regs[1])) !== null )
					cols.push(regstd[1]);
				
				if ( cols.length )
				{
					var o = {
						fichier : cols[0].trim(),
						ligne : cols[1].trim(),
						fonction : cols[2].trim()
					};

					table.push(o);
				}
			}
			
			
			if ( table.length )
				console.table(table);
		}
		else
			console.log('Can\'t display details about the exception');
	}

	
    
	/**
     * Display a link to open a new page with exception details
     * 
     * @param string exception
     * @param string title
     */
	function _linkToException(exception, title)
	{
		var a = document.createElement('a');
		a.innerHTML = '[' + new Date().toTimeString() + '] ' + title;
		a.style.outline = 'none';
		a.style.backgroundColor = 'antiquewhite';
		a.style.fontFamily = 'arial';
		a.style.color = 'black';
		a.style.fontSize = '12px';
		a.style.fontWeight = 'bold';
		a.style.padding = '5px'; 
		a.style.marginBottom = '10px';
		a.style.display = 'block';
		a.style.borderBottom = '2px solid firebrick';
		a.href = "javascript:void(0)";
		a.onclick = function()
			{
				var exw = window.open('', "ExceptionWindow" + (Math.floor(Math.random() * 10000000)));
				if ( exw )
				{
					exw.document.write('<!DOCTYPE html><html><body>' + exception + '</body></html>');
					exw.document.close();
				}
				else
					alert("Can't open a popup window to display the exception details");
			};

		if ( document.body.firstChild )
			document.body.insertBefore(a, document.body.firstChild);
		else
			document.body.appendChild(a);
	}

    

	/**
     * Log exception to the javascript console AND display a link a the page top.
     * 
     * We think an exception is not a normal behavior, so we alert immediately, even if no catch() statement has
     * been defined for the Promise rejection
     *
     * @param string exception
     * @param string title
     */
	function _handlePromiseException(exception, title)
	{
		_logExceptionToConsole(exception, title);
		_linkToException(exception, title);
	}
	
	
    
	/**
     * Handle an exception during XmlHtppRequest
     * 
     * We open a popup window ; if not possible, we display a link at the page top ; the exception is always logged in the javascript console
     *
     * @param string exception
     * @param string title
     */
	function _handleException(exception, title)
	{
		_logExceptionToConsole(exception, title);


		// random value is used because Firefox has a bug and thinks the popup is already opened even if a previous window has been closed
		var exw = window.open('', "ExceptionWindow" + (Math.floor(Math.random() * 10000000)));
		if ( exw )
		{
			exw.document.write('<!DOCTYPE html><html><body>' + exception + '</body></html>');
			exw.document.close();
		}

		// if popup blocker, display a link
		else
			_linkToException(exception, title);
	}


	// --- /PRIVATE DECLARATIONS ---


    
	return {
		
		/**
         * Send the request 
         * 
         * @param string url
         * @param function(response) callback
         * @param string|Object postData
         */
		sendRequest : function(url,callback,postData) {
			var req = _createXMLHTTPObject();
			if (!req) return;
			var method = (postData) ? "POST" : "GET";
			req.open(method,url,true);
			
			// set user-agent ; google chrome doesn't allow it so we set a custom header
			req.setRequestHeader('User-Agent','XMLHTTP/1.0');
			req.setRequestHeader('X-App-Frmk-Detect-XMLHTTP','xmlhttp');
			req.setRequestHeader('Accept','application/json');
			
			
			if ( postData )
			{
                // postData is not a string
				if ( typeof(postData) !== 'string' )
					// if browser compliant with FormData
					if ( window.FormData )
					{
						var fd = nettools.jscore.RequestHelper.object2FormData(postData);
						postData = fd;
					}
					else
					{
						// encode object litteral to url-encoded string
						postData = new nettools.jscore.Querystring(postData).toString();
						req.setRequestHeader('Content-type','application/x-www-form-urlencoded');
					}
				
				// request already a string
				else
					req.setRequestHeader('Content-type','application/x-www-form-urlencoded');
			}
			
			req.onreadystatechange = function () {
				if (req.readyState !== 4) return;
				if (req.status !== 200 && req.status !== 304) {
					return;
				}
				
				if ( typeof callback === "object" )
					alert('object.callback not implemented');//callback.callback(req);
				else if ( typeof callback === 'function' )
					callback(req);				
			}
			if (req.readyState === 4) return;
			req.send(postData);
		},
		
		
        
		/**
         * Send a request and return a Promise
         *
         * The Promise will be resolved with the request json response, or rejected if an error occured
         *
         * @param string url
         * @param string|Object postData
         * @return Promise
         */
		sendRequestPromise : function(url, postData)
		{
			return new Promise(function(resolve, reject)
					{
						var cb = function(req)
							{
								// if unreadable response 
								var resp = nettools.jscore.xmlhttp.parseResponse(req);
								if ( resp === null )
                                {
									reject(new Error('Unreadble async request response'));
                                    return;
                                }
									
                                
                                // if answer, but error status 
								if ( !resp.statut )
                                {
									// if an exception has been returned in the payload response, handling it now because if no Promise.catch() statement has
                                    // been defined, we won't never be warned about the exception
									if ( resp.exception )
										try
										{
											_handlePromiseException(resp.exception, resp.message ? resp.message : 'Error during async request (message unavailable)');
										}
										catch(e)
										{
										}
										
									// reject promise
									reject(new Error(resp.message ? resp.message : 'Async request has not return any error message'));
									return;
                                }
									
								
								// if ok, resolving Promise with Json response
								resolve(resp);
							};
						
						// envoyer requête
						nettools.jscore.xmlhttp.sendRequest(url, cb, postData);
					}
				);
		},
		
		
        
		/**
         * Decode response to Json
         *
         * @param string resp
         * @return null|Object Returns an object litteral or NULL if the response is no valid json
         */
		parseResponse : function(resp)
		{
			if ( resp.responseText.substr(0, 1) === "{" )
			{
				try
                {
                    return JSON.parse(resp.responseText);
                }
                catch(e)
                {
                    return null;
                }
			}
			else
				return null;
		},

        

        /**
         * Parse a response and decode it to Json
         *
         * If the json returned response has statut, message, or exception properties, we use them to display error data
         * 
         * @param string resp
         * @return Object Returning an object litteral with the Json response, always containing a statut property
         */
		parseJsonResponse : function(resp)
		{
			if ( resp.responseText.substr(0, 1) === "{" )
			{
                var r = null;
                
                try
                {
				    r = JSON.parse(resp.responseText);
                }
                catch(e)
                {
                    // error JSON.parse
                    alert("Unreadble async response : " + e);
                    return {statut:false};
                }
				
				// statut ko and message
				if ( !r.statut && r.message )
					alert(r.message);
                
                // statut ko and exception
				if ( !r.statut && r.exception )
                    _handleException(r.exception, r.message ? r.message : 'Error during async request (message unavailable)');
					
				return r;
			}
			else
			{
				alert("Unreadble async response");
				return {statut:false};
			}
		}
	};
})();










// ==== OOP STUFF ===
nettools.jscore.oop = nettools.jscore.oop || {

	/**
     * Inherit from a superclass
     *
     * @param Object subclass 
     * @param Object superclass 
     */
	extend : function(subclass, superclass)
	{
		// set the subclass prototype to the superclass prototype
		if (typeof Object.create !== 'function')
		{
			var F = function(){};
			F.prototype = superclass.prototype;
			subclass.prototype = new F();
		}
		
		// if Object.create exists (ecmascript 5, par ex. >= ie9)
		else
			subclass.prototype = Object.create(superclass.prototype);

        
		subclass.prototype.constructor = subclass;
		
		
        // set a reference to superclass prototype
		subclass.parent = superclass.prototype;
        

		// case when we define superclass.prototype with an object litteral {...} ; in that case, superclass.prototype.constructor does not point to superclass
		// but to {...}.prototype.constructor, which is Object.prototype.constructor !!!
		// We had better not set a whole prototype with an object litteral, and define public methods one by one ; 
		// by the way, this correction is only done if we inherit ; if we don't the prototype constructor is wrong
		if ( superclass.prototype.constructor == Object.prototype.constructor )
			superclass.prototype.constructor = superclass;
	},
    
	
	
	/** 
     * Call a method in the superclass
     *
     * @param Object that 
     * @param string method Method name
     * @param Array params Array of method parameters
     * @return null|mixed return value ; if we can't find the superclass, null is returnd
     */
	parentCall : function(that, method, params)
	{
		if ( that.constructor && that.constructor.parent )
		{
			var m = that.constructor.parent[method];
			if ( typeof(m) === 'function' )
				return m.apply(that, params);
			else
				return null;
		}
		else
			return null;
	},
	
	
    
	/** 
     * Call superclass constructor
     *
     * @param Object classname 
     * @param Object that 
     * @param Array params Array of constructor parameters
     */
	parentConstructor : function(classname, that, params)
	{
		classname.parent.constructor.apply(that, params?params:[]);
	}
};











// ==== VALIDATORS ====

nettools.jscore.validator = {};


// useful validator patterns
nettools.jscore.validator.Patterns =
	{
		DATEYY : /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/[0-9]{2}$/,
		DATEYYYY : /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/[0-9]{4}$/,
		DATEYMD : /^[0-9]{4}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])$/,
		CP : /^[0-9]{5}$/,
		TEL : /^0[0-9]{9}$/,
		MOBILE : /^0[67][0-9]{8}$/,
		MAIL : /^[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*@[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*[\.]{1}[a-z]{2,6}$/,
		INT : /^[0-9]+$/,
		BOOL : /^[01]$/,
		FLOAT : /^[0-9]*[0-9]\.[0-9]+$/
	};



/**
 * Realtime validator constructor
 * 
 * @param function(HTMLInput) rtcb User callback that should return true or false if the input value is accepted or not
 */
nettools.jscore.validator.RealTimeValidator = function(rtcb){
		

	// ---- PRIVATE STUFF ----
	var _rtcb = rtcb;
	

	// onchange event handler
	function _inputonchange(e)
	{
		if ( _rtcb )
		{
			var valid = _rtcb(this);
			
			switch ( valid )
			{
				case ( null ) :
					break;	
				case ( false ) :
					this.setAttribute('data-valid', 0);
					break;
				default :
					this.setAttribute('data-valid', 1);
					break;
			}
		}
		
		return true;
	}		

	// ---- /PRIVATE STUFF ----

    

	// ---- PROTECTED MEMBERS ----
	
    /**
     * Register a new input to validate
     *
     * @param HTMLInput input
     */
	this.registerOnChangeEvent = function(input)
	{
		input.onchange = _inputonchange;
	};
	
	
    
	/**
     * Register several inputs to validate with a custom callback
     *
     * @param HTMLInput[] inputs
     * @param function(Event) customcb
     */
	this.registerCustomOnChangeEvents = function(inputs, customcb)
	{
		var __handler = function(e)
		{
			// calling custom handler and set THIS value
			if ( customcb && (typeof customcb === 'function') )
				customcb.call(this, e);
				
			// general case
			_inputonchange.call(this, e);
		};
		
				
		var inputsl = inputs.length;
		for ( var i = 0; i < inputsl ; i++ )
			inputs[i].onchange = __handler;
	};
	
	
        
	/**
     * Force all inputs to validate
     *
     * @param HTMLForm f
     */
	this.update = function(f)
	{
		var elementsl = f.elements.length;
		for ( var i = 0 ; i < elementsl ; i++ )
			_inputonchange.call(f.elements[i]);
	};

	// ---- /PROTECTED MEMBERS ----
};



// ---- PUBLIC MEMBERS ----
nettools.jscore.validator.RealTimeValidator.prototype =
{
	/**
     * Is the form valid ?
     * 
     * @param NodeList elements
     * @return bool
     */
	isValid : function (elements)
	{
		var elementsl = elements.length;
		for ( var i = 0 ; i < elementsl ; i++ )
		{
			if ( Number(elements[i].getAttribute('data-valid')) === '0' )
				return false;
		}
					
		return true;
	},
	

    
	/**
     * Register an input to validate with a custom callback
     * 
     * @param HTMLInput input
     * @param function(Event) customcb
     */
	registerCustomOnChangeEvent : function(input, customcb)
	{
		this.registerCustomOnChangeEvents([input], customcb);
	},
	
	
    
	/**
     * Register several fields to validate
     *
     * @param HTMLInput[] inputs
     */
	registerOnChangeEvents : function(inputs)
	{
		var inputsl = inputs.length;
		for ( var i = 0; i < inputsl ; i++ )
			this.registerOnChangeEvent(inputs[i]);
	}		
};
// ---- /PUBLIC MEMBERS ----
	
	



/**
 * On time validator (by contrast to real-time validator)
 *
 * Params constructor parameter : 
 * {
 *	  required : ['input1', 'input2', ...]
 *	  regexps : {input1:/reg/, input2:/reg/, ...}
 *	  onsubmit : callback(elements=form.elements) return {statut:true/false, message:"", field:input}
 *	  onsubmitpromise = callback(elements[]) { return Promise.resolve({statut:true})  **OR** return Promise.reject({statut:false, message:'error', field:input}) }
 *	  notifier : function({statut:true/false, message:'', field:input})
 *	  root : 'fForm'
 * }
 *
 * @param Object params Object litteral with properties defining the validation process
 * @return Object Returns an object litteral {statut:bool, field:input, message:string}
 */
nettools.jscore.validator.FormValidator = function(params) {
		
	// ---- PRIVATE STUFF ----

	var _required = null;
	var _regexps = null;
	var _onsubmit = null;
	var _onsubmitpromise = null;
	var _notifier = null;
	var _root = null;
	
	// ---- /PRIVATE STUFF ----
	
	
	// ---- CONSTRUCTOR ----
	
	_required = params['required'];
	_regexps = params['regexps'];
	_onsubmit = params['onsubmit'];
	_onsubmitpromise = params['onsubmitpromise'];
	_notifier = params['notifier'];
	_root = params['root'] ? params['root'] : '';

	// ---- /CONSTRUCTOR ----


	// ---- PROTECTED MEMBERS ----
	
	this.setRoot = function(r) { _root = r; };
	this.getRoot = function() { return _root; };
	this.setRequired = function(fields) { _required = fields; };
	this.getRequired = function() { return _required; };
	this.setRegExps = function(regexps) { _regexps = regexps; };
	this.getRegExps = function() { return _regexps; };
	this.setOnSubmit = function(cb) { _onsubmit = cb; };
	this.getOnSubmit = function() { return _onsubmit; };
	this.setOnSubmitPromise = function(cb) { _onsubmitpromise = cb; };
	this.getOnSubmitPromise = function() { return _onsubmitpromise; };
	this.setNotifier = function(n) { _notifier = n; };
	this.getNotifier = function() { return _notifier; };

	// ---- /PROTECTED MEMBERS ----
};


// ---- PUBLIC MEMBERS ----
nettools.jscore.validator.FormValidator.prototype = (function(){

	// ---- PRIVATE STATIC MEMBERS ----

	/**
     * Get a field value
     * 
     * @param HTMLInput field
     * @return string
     */
	function _getValue(field)
	{
		// text field
		if ( (field.type==='text') || (field.type==='email') || (field.type==='date') || (field.type==='number') || (field.type==='textarea') || (field.type==='hidden') || (field.type==='file') )
			return field.value;
		// select
		else if ( field.type === 'select-one' )
			return field.options[field.selectedIndex]?field.options[field.selectedIndex].value:'';
		// radio
		else if ( (field instanceof NodeList) && field[0] && (field[0].type === 'radio') )
		{
			// look for a selected radio
			var fieldl = field.length;
			for ( var i = 0 ; i < fieldl ; i++ )
				if ( field[i].checked )
					return field[i].value;
			
			return '';
		}
		else
			return field.value;
	}
	
	
    
	/** 
     * Alert with a custom error notifier if validation error
     *
     * @param nettools.jscore.validator.FormValidator that
     * @param Object Object litteral returned by isValid
     */
	function _notify(that, st)
	{
		if ( !st.statut )
		{
			var notifier = that.getNotifier();
			if ( notifier && (typeof notifier === 'function') )
				notifier(st);
		}
		
		return st;
	}
	
	// ---- /PRIVATE STATIC MEMBERS ----
    
	
	return {
			
		/**
         * Get a field label (either the NAME parameter or the title attribute, if found)
         *
         * @param HTMLInput field
         * @param string name
         * @return string
         */
		getFieldLabel : function(field, name)
		{
			// if radio field, we have a nodelist !
			if ( (field instanceof NodeList) && field[0] )
				var field = field[0];
			
			return ( field.title != '' ) ? field.title : name;
		},
	
        
	
		/**
         * Validate elements 
         * 
         * @param HTMLInput[] elements
         * @return Object Returns an object litteral {statut:bool, field:input, message:string}
         */
		isValid : function(elements)
		{
			var _required = this.getRequired();
			var _root = this.getRoot();
			var _regexps = this.getRegExps();
			
			
			// validate required fields
			if ( _required && _required.length )
				for ( var i = 0 ; i < _required.length ; i++ )
				{
					var f = _required[i];
					
					if ( f && (_getValue(elements[_root + f]) === "") )
					{
						var fi = elements[_root + f];

						return _notify(this, nettools.jscore.validator.FormValidator.returnStatus(
									false, "Information manquante : '" + this.getFieldLabel(fi, f) + "'", fi));
					}
				}
					
					
			// if we arrive here, required fields are OK ; matching regexps now
			if ( _regexps )
				for ( var r in _regexps )
				{
					var fi = elements[_root + r];
					
					if ( _getValue(fi) !== "" )
						if ( ! _regexps[r].test(_getValue(fi)) )
							return _notify(this, nettools.jscore.validator.FormValidator.returnStatus(
										false, "Format valeur incorrect : '" + this.getFieldLabel(fi, r) + "'", fi));
				}
				
	
			// if we arrive here, required and regexps fields are ok
			// call the custom Promise validation handler (with Promise returning {statut:true/false,message:'', field:input})
			if ( this.getOnSubmitPromise() )
			{
				var p = this.getOnSubmitPromise()(elements);
				var that = this;
				return p.catch(
						function(st)
						{
							// if no error, but validation ko ; otherwise, the error treatment is done later in the Promise chain
							if ( !(st instanceof Error) )
								_notify(that, st);
								
							// returning a rejected Promise
							return Promise.reject(st);
						}
					);
			}

            

			// if we arrive here, required and regexps fields are ok, and we don't want to call a custom Promise validation handler
			if ( this.getOnSubmit() )
			{
				var st = this.getOnSubmit()(elements);
				
				if ( !st.statut )
					return _notify(this, st);
			}
			
			
			// everything Ok
			return nettools.jscore.validator.FormValidator.returnStatus(true);
		}
	};
})();
// ---- /PUBLIC MEMBERS ----


/**
 * Return a validation status
 * 
 * @param bool str
 * @param null|string msg
 * @param null|HTMLInput f
 * @return Object Returns an object litteral {statut:bool, field:input, message:string}
 */
nettools.jscore.validator.FormValidator.returnStatus = function(st, msg, f)
{
	return {statut:st, message:msg, field:f};
}








// ==== STRUCTS ====

nettools.jscore.struct = nettools.jscore.struct || {};


/**
 * Stack
 */
nettools.jscore.struct.Stack = function()
{
	var _stack = [];
	

    /**
     * Push an item in the stack
     * 
     * @param mixed o
     */
	this.push = function(o)
		{
			_stack.push(o);
		};
		
    
    
    /** 
     * Pop an item from the stack
     *
     * @return false|mixed
     */
	this.pop = function()
		{
			if ( _stack.length )
			{
				var o = _stack[_stack.length - 1];
				_stack.length = _stack.length - 1;
				return o;
			}
			else
				return false;
		};
		
    
    
    /** 
     * Test if the stack holds an item
     *
     * @param mixed elem
     * @return bool
     */
	this.contains = function(elem)
		{
			for ( var i = 0 ; i < _stack.length ; i++ )
				if ( _stack[i] === elem )
					return true;
					
			return false;
		};
		
    
    
    /** 
     * Get the stack as a string
     *
     * @param string delimiter
     * @return string
     */
	this.join = function(delimiter)
		{
			return _stack.join(delimiter);
		};
		
    
    
    /**
     * Count items
     *
     * @return int
     */
	this.count = function() { return _stack.length; };
	
};


nettools.jscore.struct.Stack.prototype = 
{
    /**
     * Test if stack is empty
     * 
     * @return bool
     */
	isEmpty : function() { return ! (this.count()); }
};








/**
 * Pool of objects
 * 
 * @param function() cons Constructor to create a new object as needed
 */
nettools.jscore.struct.Pool = function(cons)
{
	var _free = new nettools.jscore.struct.Stack();
	var _used = [];
	var _conscb = cons;
	
	
    /** 
     * Get an item from the pool (new one or used one)
     *
     * @return Object
     */
	this.get = function()
		{
			if ( _free.isEmpty() )
				return _used[_used.length] = _conscb();
			else
				return _used[_used.length] = _free.pop();
		};

    
    
    /**
     * Release an item and replace it the the pool so that it can be reused
     * 
     * @param Object o
     */
	this.release = function(o)
		{
			_free.push(o);
			
			for ( var i=0 ; i < _used.length ; i++ )
				if ( _used[i] === o )
				{
					_used = _used.slice(0, i).concat(_used.slice(i+1));
					break;
				}
				
			return o;
		};
};









// ==== HASH ====
/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(e,m){var p={},j=p.lib={},l=function(){},f=j.Base={extend:function(a){l.prototype=this;var c=new l;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
n=j.WordArray=f.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=m?c:4*a.length},toString:function(a){return(a||h).stringify(this)},concat:function(a){var c=this.words,q=a.words,d=this.sigBytes;a=a.sigBytes;this.clamp();if(d%4)for(var b=0;b<a;b++)c[d+b>>>2]|=(q[b>>>2]>>>24-8*(b%4)&255)<<24-8*((d+b)%4);else if(65535<q.length)for(b=0;b<a;b+=4)c[d+b>>>2]=q[b>>>2];else c.push.apply(c,q);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=e.ceil(c/4)},clone:function(){var a=f.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],b=0;b<a;b+=4)c.push(4294967296*e.random()|0);return new n.init(c,a)}}),b=p.enc={},h=b.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++){var f=c[d>>>2]>>>24-8*(d%4)&255;b.push((f>>>4).toString(16));b.push((f&15).toString(16))}return b.join("")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d+=2)b[d>>>3]|=parseInt(a.substr(d,
2),16)<<24-4*(d%8);return new n.init(b,c/2)}},g=b.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++)b.push(String.fromCharCode(c[d>>>2]>>>24-8*(d%4)&255));return b.join("")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d++)b[d>>>2]|=(a.charCodeAt(d)&255)<<24-8*(d%4);return new n.init(b,c)}},r=b.Utf8={stringify:function(a){try{return decodeURIComponent(escape(g.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return g.parse(unescape(encodeURIComponent(a)))}},
k=j.BufferedBlockAlgorithm=f.extend({reset:function(){this._data=new n.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=r.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,b=c.words,d=c.sigBytes,f=this.blockSize,h=d/(4*f),h=a?e.ceil(h):e.max((h|0)-this._minBufferSize,0);a=h*f;d=e.min(4*a,d);if(a){for(var g=0;g<a;g+=f)this._doProcessBlock(b,g);g=b.splice(0,a);c.sigBytes-=d}return new n.init(g,d)},clone:function(){var a=f.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});j.Hasher=k.extend({cfg:f.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){k.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,b){return(new a.init(b)).finalize(c)}},_createHmacHelper:function(a){return function(b,f){return(new s.HMAC.init(a,
f)).finalize(b)}}});var s=p.algo={};return p}(Math);


// sha1
(function(){var e=CryptoJS,m=e.lib,p=m.WordArray,j=m.Hasher,l=[],m=e.algo.SHA1=j.extend({_doReset:function(){this._hash=new p.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(f,n){for(var b=this._hash.words,h=b[0],g=b[1],e=b[2],k=b[3],j=b[4],a=0;80>a;a++){if(16>a)l[a]=f[n+a]|0;else{var c=l[a-3]^l[a-8]^l[a-14]^l[a-16];l[a]=c<<1|c>>>31}c=(h<<5|h>>>27)+j+l[a];c=20>a?c+((g&e|~g&k)+1518500249):40>a?c+((g^e^k)+1859775393):60>a?c+((g&e|g&k|e&k)-1894007588):c+((g^e^
k)-899497514);j=k;k=e;e=g<<30|g>>>2;g=h;h=c}b[0]=b[0]+h|0;b[1]=b[1]+g|0;b[2]=b[2]+e|0;b[3]=b[3]+k|0;b[4]=b[4]+j|0},_doFinalize:function(){var f=this._data,e=f.words,b=8*this._nDataBytes,h=8*f.sigBytes;e[h>>>5]|=128<<24-h%32;e[(h+64>>>9<<4)+14]=Math.floor(b/4294967296);e[(h+64>>>9<<4)+15]=b;f.sigBytes=4*e.length;this._process();return this._hash},clone:function(){var e=j.clone.call(this);e._hash=this._hash.clone();return e}});e.SHA1=j._createHelper(m);e.HmacSHA1=j._createHmacHelper(m)})();

// hmac
(function(){var h=CryptoJS,s=h.enc.Utf8;h.algo.HMAC=h.lib.Base.extend({init:function(f,g){f=this._hasher=new f.init;"string"==typeof g&&(g=s.parse(g));var h=f.blockSize,m=4*h;g.sigBytes>m&&(g=f.finalize(g));g.clamp();for(var r=this._oKey=g.clone(),l=this._iKey=g.clone(),k=r.words,n=l.words,j=0;j<h;j++)k[j]^=1549556828,n[j]^=909522486;r.sigBytes=l.sigBytes=m;this.reset()},reset:function(){var f=this._hasher;f.reset();f.update(this._iKey)},update:function(f){this._hasher.update(f);return this},finalize:function(f){var g=
this._hasher;f=g.finalize(f);g.reset();return g.finalize(this._oKey.clone().concat(f))}})})();

// SHA256 et HmacSHA256
(function(h){for(var s=CryptoJS,f=s.lib,t=f.WordArray,g=f.Hasher,f=s.algo,j=[],q=[],v=function(a){return 4294967296*(a-(a|0))|0},u=2,k=0;64>k;){var l;a:{l=u;for(var x=h.sqrt(l),w=2;w<=x;w++)if(!(l%w)){l=!1;break a}l=!0}l&&(8>k&&(j[k]=v(h.pow(u,0.5))),q[k]=v(h.pow(u,1/3)),k++);u++}var a=[],f=f.SHA256=g.extend({_doReset:function(){this._hash=new t.init(j.slice(0))},_doProcessBlock:function(c,d){for(var b=this._hash.words,e=b[0],f=b[1],m=b[2],h=b[3],p=b[4],j=b[5],k=b[6],l=b[7],n=0;64>n;n++){if(16>n)a[n]=
c[d+n]|0;else{var r=a[n-15],g=a[n-2];a[n]=((r<<25|r>>>7)^(r<<14|r>>>18)^r>>>3)+a[n-7]+((g<<15|g>>>17)^(g<<13|g>>>19)^g>>>10)+a[n-16]}r=l+((p<<26|p>>>6)^(p<<21|p>>>11)^(p<<7|p>>>25))+(p&j^~p&k)+q[n]+a[n];g=((e<<30|e>>>2)^(e<<19|e>>>13)^(e<<10|e>>>22))+(e&f^e&m^f&m);l=k;k=j;j=p;p=h+r|0;h=m;m=f;f=e;e=r+g|0}b[0]=b[0]+e|0;b[1]=b[1]+f|0;b[2]=b[2]+m|0;b[3]=b[3]+h|0;b[4]=b[4]+p|0;b[5]=b[5]+j|0;b[6]=b[6]+k|0;b[7]=b[7]+l|0},_doFinalize:function(){var a=this._data,d=a.words,b=8*this._nDataBytes,e=8*a.sigBytes;
d[e>>>5]|=128<<24-e%32;d[(e+64>>>9<<4)+14]=h.floor(b/4294967296);d[(e+64>>>9<<4)+15]=b;a.sigBytes=4*d.length;this._process();return this._hash},clone:function(){var a=g.clone.call(this);a._hash=this._hash.clone();return a}});s.SHA256=g._createHelper(f);s.HmacSHA256=g._createHmacHelper(f)})(Math);



/**
 * SHA1 computation
 *
 * @param string str
 * @return string
 */
nettools.jscore.sha1 = function(str)
{
	return CryptoJS.SHA1(str).toString();
};

	

/**
 * SHA256 computation
 *
 * @param string str
 * @return string
 */
nettools.jscore.sha256 = function(str)
{
	return CryptoJS.SHA256(str).toString();
};
		
		
/**
 * HMACSHA256 computation
 *
 * @param string str
 * @param string key
 * @return string
 */
nettools.jscore.hmacSha256 = function(str, key)
{
	return CryptoJS.HmacSHA256(str, key).toString();
};
		






// ==== CRYPTO ====

// AES
(function(){var u=CryptoJS,p=u.lib.WordArray;u.enc.Base64={stringify:function(d){var l=d.words,p=d.sigBytes,t=this._map;d.clamp();d=[];for(var r=0;r<p;r+=3)for(var w=(l[r>>>2]>>>24-8*(r%4)&255)<<16|(l[r+1>>>2]>>>24-8*((r+1)%4)&255)<<8|l[r+2>>>2]>>>24-8*((r+2)%4)&255,v=0;4>v&&r+0.75*v<p;v++)d.push(t.charAt(w>>>6*(3-v)&63));if(l=t.charAt(64))for(;d.length%4;)d.push(l);return d.join("")},parse:function(d){var l=d.length,s=this._map,t=s.charAt(64);t&&(t=d.indexOf(t),-1!=t&&(l=t));for(var t=[],r=0,w=0;w<
l;w++)if(w%4){var v=s.indexOf(d.charAt(w-1))<<2*(w%4),b=s.indexOf(d.charAt(w))>>>6-2*(w%4);t[r>>>2]|=(v|b)<<24-8*(r%4);r++}return p.create(t,r)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
(function(u){function p(b,n,a,c,e,j,k){b=b+(n&a|~n&c)+e+k;return(b<<j|b>>>32-j)+n}function d(b,n,a,c,e,j,k){b=b+(n&c|a&~c)+e+k;return(b<<j|b>>>32-j)+n}function l(b,n,a,c,e,j,k){b=b+(n^a^c)+e+k;return(b<<j|b>>>32-j)+n}function s(b,n,a,c,e,j,k){b=b+(a^(n|~c))+e+k;return(b<<j|b>>>32-j)+n}for(var t=CryptoJS,r=t.lib,w=r.WordArray,v=r.Hasher,r=t.algo,b=[],x=0;64>x;x++)b[x]=4294967296*u.abs(u.sin(x+1))|0;r=r.MD5=v.extend({_doReset:function(){this._hash=new w.init([1732584193,4023233417,2562383102,271733878])},
_doProcessBlock:function(q,n){for(var a=0;16>a;a++){var c=n+a,e=q[c];q[c]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360}var a=this._hash.words,c=q[n+0],e=q[n+1],j=q[n+2],k=q[n+3],z=q[n+4],r=q[n+5],t=q[n+6],w=q[n+7],v=q[n+8],A=q[n+9],B=q[n+10],C=q[n+11],u=q[n+12],D=q[n+13],E=q[n+14],x=q[n+15],f=a[0],m=a[1],g=a[2],h=a[3],f=p(f,m,g,h,c,7,b[0]),h=p(h,f,m,g,e,12,b[1]),g=p(g,h,f,m,j,17,b[2]),m=p(m,g,h,f,k,22,b[3]),f=p(f,m,g,h,z,7,b[4]),h=p(h,f,m,g,r,12,b[5]),g=p(g,h,f,m,t,17,b[6]),m=p(m,g,h,f,w,22,b[7]),
f=p(f,m,g,h,v,7,b[8]),h=p(h,f,m,g,A,12,b[9]),g=p(g,h,f,m,B,17,b[10]),m=p(m,g,h,f,C,22,b[11]),f=p(f,m,g,h,u,7,b[12]),h=p(h,f,m,g,D,12,b[13]),g=p(g,h,f,m,E,17,b[14]),m=p(m,g,h,f,x,22,b[15]),f=d(f,m,g,h,e,5,b[16]),h=d(h,f,m,g,t,9,b[17]),g=d(g,h,f,m,C,14,b[18]),m=d(m,g,h,f,c,20,b[19]),f=d(f,m,g,h,r,5,b[20]),h=d(h,f,m,g,B,9,b[21]),g=d(g,h,f,m,x,14,b[22]),m=d(m,g,h,f,z,20,b[23]),f=d(f,m,g,h,A,5,b[24]),h=d(h,f,m,g,E,9,b[25]),g=d(g,h,f,m,k,14,b[26]),m=d(m,g,h,f,v,20,b[27]),f=d(f,m,g,h,D,5,b[28]),h=d(h,f,
m,g,j,9,b[29]),g=d(g,h,f,m,w,14,b[30]),m=d(m,g,h,f,u,20,b[31]),f=l(f,m,g,h,r,4,b[32]),h=l(h,f,m,g,v,11,b[33]),g=l(g,h,f,m,C,16,b[34]),m=l(m,g,h,f,E,23,b[35]),f=l(f,m,g,h,e,4,b[36]),h=l(h,f,m,g,z,11,b[37]),g=l(g,h,f,m,w,16,b[38]),m=l(m,g,h,f,B,23,b[39]),f=l(f,m,g,h,D,4,b[40]),h=l(h,f,m,g,c,11,b[41]),g=l(g,h,f,m,k,16,b[42]),m=l(m,g,h,f,t,23,b[43]),f=l(f,m,g,h,A,4,b[44]),h=l(h,f,m,g,u,11,b[45]),g=l(g,h,f,m,x,16,b[46]),m=l(m,g,h,f,j,23,b[47]),f=s(f,m,g,h,c,6,b[48]),h=s(h,f,m,g,w,10,b[49]),g=s(g,h,f,m,
E,15,b[50]),m=s(m,g,h,f,r,21,b[51]),f=s(f,m,g,h,u,6,b[52]),h=s(h,f,m,g,k,10,b[53]),g=s(g,h,f,m,B,15,b[54]),m=s(m,g,h,f,e,21,b[55]),f=s(f,m,g,h,v,6,b[56]),h=s(h,f,m,g,x,10,b[57]),g=s(g,h,f,m,t,15,b[58]),m=s(m,g,h,f,D,21,b[59]),f=s(f,m,g,h,z,6,b[60]),h=s(h,f,m,g,C,10,b[61]),g=s(g,h,f,m,j,15,b[62]),m=s(m,g,h,f,A,21,b[63]);a[0]=a[0]+f|0;a[1]=a[1]+m|0;a[2]=a[2]+g|0;a[3]=a[3]+h|0},_doFinalize:function(){var b=this._data,n=b.words,a=8*this._nDataBytes,c=8*b.sigBytes;n[c>>>5]|=128<<24-c%32;var e=u.floor(a/
4294967296);n[(c+64>>>9<<4)+15]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360;n[(c+64>>>9<<4)+14]=(a<<8|a>>>24)&16711935|(a<<24|a>>>8)&4278255360;b.sigBytes=4*(n.length+1);this._process();b=this._hash;n=b.words;for(a=0;4>a;a++)c=n[a],n[a]=(c<<8|c>>>24)&16711935|(c<<24|c>>>8)&4278255360;return b},clone:function(){var b=v.clone.call(this);b._hash=this._hash.clone();return b}});t.MD5=v._createHelper(r);t.HmacMD5=v._createHmacHelper(r)})(Math);
(function(){var u=CryptoJS,p=u.lib,d=p.Base,l=p.WordArray,p=u.algo,s=p.EvpKDF=d.extend({cfg:d.extend({keySize:4,hasher:p.MD5,iterations:1}),init:function(d){this.cfg=this.cfg.extend(d)},compute:function(d,r){for(var p=this.cfg,s=p.hasher.create(),b=l.create(),u=b.words,q=p.keySize,p=p.iterations;u.length<q;){n&&s.update(n);var n=s.update(d).finalize(r);s.reset();for(var a=1;a<p;a++)n=s.finalize(n),s.reset();b.concat(n)}b.sigBytes=4*q;return b}});u.EvpKDF=function(d,l,p){return s.create(p).compute(d,
l)}})();
CryptoJS.lib.Cipher||function(u){var p=CryptoJS,d=p.lib,l=d.Base,s=d.WordArray,t=d.BufferedBlockAlgorithm,r=p.enc.Base64,w=p.algo.EvpKDF,v=d.Cipher=t.extend({cfg:l.extend(),createEncryptor:function(e,a){return this.create(this._ENC_XFORM_MODE,e,a)},createDecryptor:function(e,a){return this.create(this._DEC_XFORM_MODE,e,a)},init:function(e,a,b){this.cfg=this.cfg.extend(b);this._xformMode=e;this._key=a;this.reset()},reset:function(){t.reset.call(this);this._doReset()},process:function(e){this._append(e);return this._process()},
finalize:function(e){e&&this._append(e);return this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(e){return{encrypt:function(b,k,d){return("string"==typeof k?c:a).encrypt(e,b,k,d)},decrypt:function(b,k,d){return("string"==typeof k?c:a).decrypt(e,b,k,d)}}}});d.StreamCipher=v.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var b=p.mode={},x=function(e,a,b){var c=this._iv;c?this._iv=u:c=this._prevBlock;for(var d=0;d<b;d++)e[a+d]^=
c[d]},q=(d.BlockCipherMode=l.extend({createEncryptor:function(e,a){return this.Encryptor.create(e,a)},createDecryptor:function(e,a){return this.Decryptor.create(e,a)},init:function(e,a){this._cipher=e;this._iv=a}})).extend();q.Encryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize;x.call(this,e,a,c);b.encryptBlock(e,a);this._prevBlock=e.slice(a,a+c)}});q.Decryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize,d=e.slice(a,a+c);b.decryptBlock(e,a);x.call(this,
e,a,c);this._prevBlock=d}});b=b.CBC=q;q=(p.pad={}).Pkcs7={pad:function(a,b){for(var c=4*b,c=c-a.sigBytes%c,d=c<<24|c<<16|c<<8|c,l=[],n=0;n<c;n+=4)l.push(d);c=s.create(l,c);a.concat(c)},unpad:function(a){a.sigBytes-=a.words[a.sigBytes-1>>>2]&255}};d.BlockCipher=v.extend({cfg:v.cfg.extend({mode:b,padding:q}),reset:function(){v.reset.call(this);var a=this.cfg,b=a.iv,a=a.mode;if(this._xformMode==this._ENC_XFORM_MODE)var c=a.createEncryptor;else c=a.createDecryptor,this._minBufferSize=1;this._mode=c.call(a,
this,b&&b.words)},_doProcessBlock:function(a,b){this._mode.processBlock(a,b)},_doFinalize:function(){var a=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){a.pad(this._data,this.blockSize);var b=this._process(!0)}else b=this._process(!0),a.unpad(b);return b},blockSize:4});var n=d.CipherParams=l.extend({init:function(a){this.mixIn(a)},toString:function(a){return(a||this.formatter).stringify(this)}}),b=(p.format={}).OpenSSL={stringify:function(a){var b=a.ciphertext;a=a.salt;return(a?s.create([1398893684,
1701076831]).concat(a).concat(b):b).toString(r)},parse:function(a){a=r.parse(a);var b=a.words;if(1398893684==b[0]&&1701076831==b[1]){var c=s.create(b.slice(2,4));b.splice(0,4);a.sigBytes-=16}return n.create({ciphertext:a,salt:c})}},a=d.SerializableCipher=l.extend({cfg:l.extend({format:b}),encrypt:function(a,b,c,d){d=this.cfg.extend(d);var l=a.createEncryptor(c,d);b=l.finalize(b);l=l.cfg;return n.create({ciphertext:b,key:c,iv:l.iv,algorithm:a,mode:l.mode,padding:l.padding,blockSize:a.blockSize,formatter:d.format})},
decrypt:function(a,b,c,d){d=this.cfg.extend(d);b=this._parse(b,d.format);return a.createDecryptor(c,d).finalize(b.ciphertext)},_parse:function(a,b){return"string"==typeof a?b.parse(a,this):a}}),p=(p.kdf={}).OpenSSL={execute:function(a,b,c,d){d||(d=s.random(8));a=w.create({keySize:b+c}).compute(a,d);c=s.create(a.words.slice(b),4*c);a.sigBytes=4*b;return n.create({key:a,iv:c,salt:d})}},c=d.PasswordBasedCipher=a.extend({cfg:a.cfg.extend({kdf:p}),encrypt:function(b,c,d,l){l=this.cfg.extend(l);d=l.kdf.execute(d,
b.keySize,b.ivSize);l.iv=d.iv;b=a.encrypt.call(this,b,c,d.key,l);b.mixIn(d);return b},decrypt:function(b,c,d,l){l=this.cfg.extend(l);c=this._parse(c,l.format);d=l.kdf.execute(d,b.keySize,b.ivSize,c.salt);l.iv=d.iv;return a.decrypt.call(this,b,c,d.key,l)}})}();
(function(){for(var u=CryptoJS,p=u.lib.BlockCipher,d=u.algo,l=[],s=[],t=[],r=[],w=[],v=[],b=[],x=[],q=[],n=[],a=[],c=0;256>c;c++)a[c]=128>c?c<<1:c<<1^283;for(var e=0,j=0,c=0;256>c;c++){var k=j^j<<1^j<<2^j<<3^j<<4,k=k>>>8^k&255^99;l[e]=k;s[k]=e;var z=a[e],F=a[z],G=a[F],y=257*a[k]^16843008*k;t[e]=y<<24|y>>>8;r[e]=y<<16|y>>>16;w[e]=y<<8|y>>>24;v[e]=y;y=16843009*G^65537*F^257*z^16843008*e;b[k]=y<<24|y>>>8;x[k]=y<<16|y>>>16;q[k]=y<<8|y>>>24;n[k]=y;e?(e=z^a[a[a[G^z]]],j^=a[a[j]]):e=j=1}var H=[0,1,2,4,8,
16,32,64,128,27,54],d=d.AES=p.extend({_doReset:function(){for(var a=this._key,c=a.words,d=a.sigBytes/4,a=4*((this._nRounds=d+6)+1),e=this._keySchedule=[],j=0;j<a;j++)if(j<d)e[j]=c[j];else{var k=e[j-1];j%d?6<d&&4==j%d&&(k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255]):(k=k<<8|k>>>24,k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255],k^=H[j/d|0]<<24);e[j]=e[j-d]^k}c=this._invKeySchedule=[];for(d=0;d<a;d++)j=a-d,k=d%4?e[j]:e[j-4],c[d]=4>d||4>=j?k:b[l[k>>>24]]^x[l[k>>>16&255]]^q[l[k>>>
8&255]]^n[l[k&255]]},encryptBlock:function(a,b){this._doCryptBlock(a,b,this._keySchedule,t,r,w,v,l)},decryptBlock:function(a,c){var d=a[c+1];a[c+1]=a[c+3];a[c+3]=d;this._doCryptBlock(a,c,this._invKeySchedule,b,x,q,n,s);d=a[c+1];a[c+1]=a[c+3];a[c+3]=d},_doCryptBlock:function(a,b,c,d,e,j,l,f){for(var m=this._nRounds,g=a[b]^c[0],h=a[b+1]^c[1],k=a[b+2]^c[2],n=a[b+3]^c[3],p=4,r=1;r<m;r++)var q=d[g>>>24]^e[h>>>16&255]^j[k>>>8&255]^l[n&255]^c[p++],s=d[h>>>24]^e[k>>>16&255]^j[n>>>8&255]^l[g&255]^c[p++],t=
d[k>>>24]^e[n>>>16&255]^j[g>>>8&255]^l[h&255]^c[p++],n=d[n>>>24]^e[g>>>16&255]^j[h>>>8&255]^l[k&255]^c[p++],g=q,h=s,k=t;q=(f[g>>>24]<<24|f[h>>>16&255]<<16|f[k>>>8&255]<<8|f[n&255])^c[p++];s=(f[h>>>24]<<24|f[k>>>16&255]<<16|f[n>>>8&255]<<8|f[g&255])^c[p++];t=(f[k>>>24]<<24|f[n>>>16&255]<<16|f[g>>>8&255]<<8|f[h&255])^c[p++];n=(f[n>>>24]<<24|f[g>>>16&255]<<16|f[h>>>8&255]<<8|f[k&255])^c[p++];a[b]=q;a[b+1]=s;a[b+2]=t;a[b+3]=n},keySize:8});u.AES=p._createHelper(d)})();


var CryptoJSAesJson = {
    stringify: function (cipherParams) {
        var j = {ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)};
        if (cipherParams.iv) j.iv = cipherParams.iv.toString();
        if (cipherParams.salt) j.s = cipherParams.salt.toString();
        return JSON.stringify(j);
    },
    parse: function (jsonStr) {
        var j = JSON.parse(jsonStr);
        var cipherParams = CryptoJS.lib.CipherParams.create({ciphertext: CryptoJS.enc.Base64.parse(j.ct)});
        if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv);
        if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s);
        return cipherParams;
    }
}



/** 
 * AES encrypt
 *
 * @param string str
 * @param string key
 * @return string
 */
nettools.jscore.aes_encrypt = function(str, key)
{
	return CryptoJS.AES.encrypt(JSON.stringify(str), key, {format: CryptoJSAesJson}).toString();
};



/**
 * AES decrypt
 *
 * @param string str
 * @param string key
 * @return string
 */
nettools.jscore.aes_decrypt = function(str, key)
{
	return JSON.parse(CryptoJS.AES.decrypt(str, key, {format: CryptoJSAesJson}).toString(CryptoJS.enc.Utf8));
};










// ==== URL ====

/**
 * Querystring management constructor
 *
 * @param Object|string str Querystring to manage, either a string with proper URL-encoding or an object litteral
 */
nettools.jscore.Querystring = function(str){
    
    // ---- PRIVATE DECL. ----
    
    var _querystring = [];
    
    // ---- /PRIVATE DECL. ----
    
    

    // ---- PROTECTED METHODS & ACCESSORS ----
    
    /**
     * Get the querystring as an object litteral
     *
     * @return Object
     */
    this.getQuerystringObject = function() {return _querystring;}


    
    /**
     * Set the querystring as an object litteral
     *
     * @param Object qs
     */
    this.setQuerystringObject = function(qs) { _querystring = qs; }
    
    // ---- /PROTECTED METHODS & ACCESSORS ----
    
    
    
    // ---- CONSTRUCTOR ----
    
    if ( typeof str == 'string')
        this.setQuerystring(str);
    else
        this.setQuerystringObject(str);
    
    // ---- /CONSTRUCTOR ----
}


// ---- PUBLIC PROTOTYPE METHODS ----

/**
 * Set a querystring in the object
 *
 * @param string qs
 * @return nettools.jscore.Querystring Returns this
 */
nettools.jscore.Querystring.prototype.setQuerystring = function(qs)
{
    var qs = String(qs);
    
    
    if ( !qs )
    {
        this.setQuerystringObject({});
        return this;
    }
    
    
    var qsitems = qs.split('&');
    var qsitemsl = qsitems.length;
    var oqs = {};
    
    for ( var i = 0 ; i < qsitemsl ; i++ )
    {
        var item = qsitems[i].split('=');
        if ( item.length != 2 )
            throw new Error('Malformed querystring, key=value pattern error');
        
        oqs[item[0]] = nettools.jscore.unescape(item[1]);
    }
    
    this.setQuerystringObject(oqs);
    return this;    
}



/**
 * Get the Querystring object as a string, with proper url encoding
 *
 * @return string
 */
nettools.jscore.Querystring.prototype.toString = function()
{
    var ret = [];
    var qs = this.getQuerystringObject();
    
    for ( var p in qs )
        ret.push(p + '=' + nettools.jscore.escape(qs[p]));
    
    return ret.join('&');
}



/** 
 * Add a new parameter to querystring ; value must not be already encoded
 *
 * @param string key
 * @param string value
 * @return nettools.jscore.Querystring Returns this
 */
nettools.jscore.Querystring.prototype.addParameter = function(key, value)
{
    var q = this.getQuerystringObject();
    q[key] = value;
    
    return this;
}



/** 
 * Removes a parameter from querystring
 *
 * @param string key
 * @return nettools.jscore.Querystring Returns this
 */
nettools.jscore.Querystring.prototype.removeParameter = function(key)
{
    var q = this.getQuerystringObject();
    delete q[key];
    
    return this;
}









/**
 * Url management constructor
 *
 * @param string str
 */
nettools.jscore.Url = function(str){
    
    // ---- PRIVATE DECL. ----
    
    var _resource = null;
    var _querystring = null;
    
    // ---- /PRIVATE DECL. ----
    
    

    // ---- PROTECTED METHODS & ACCESSORS ----
    
    /**
     * Get the resource part (before ?)
     *
     * @return string
     */
    this.getResource = function() {return _resource;}

    
    
    /**
     * Set the resource part (before ?)
     *
     * @param string res
     */
    this.setResource = function(res) {_resource = res;}

    
    
    /**
     * Get the querystring part (after ?), as nettools.jscore.Querystring object
     *
     * @return nettools.jscore.Querystring
     */
    this.getQuerystring = function() {return _querystring;}


    
    /**
     * Set the querystring part (after ?), as nettools.jscore.Querystring object
     *
     * @param nettools.jscore.Querystring qs
     */
    this.setQuerystring = function(qs) { _querystring = qs; }
    
    // ---- /PROTECTED METHODS & ACCESSORS ----
    
    
    
    // ---- CONSTRUCTOR ----
    
    this.setUrl(str);
    
    // ---- /CONSTRUCTOR ----
}


// ---- PUBLIC PROTOTYPE METHODS ----

/**
 * Set an Url in the object
 *
 * @param string u
 * @return nettools.jscore.Url Returns this
 */
nettools.jscore.Url.prototype.setUrl = function(u)
{
    var u = String(u);
    
    
    if ( !u )
    {
        this.setResource(null);
        this.setQuerystring(new nettools.jscore.Querystring(''));
        return this;
    }
    
    
    // if no querystring
    if ( u.indexOf('?') == -1 )
    {
        this.setResource(u);
        this.setQuerystring(new nettools.jscore.Querystring(''));
        return this;
    }
    
    
    // if querystring present, extract string after ?
    var p = u.indexOf('?');
    var qs = u.substr(p+1);
    
    
    this.setResource(u.substr(0, p));  
    this.setQuerystring(new nettools.jscore.Querystring(qs));
    return this;    
}



/**
 * Get the Url object as a string, with proper url encoding
 *
 * @return string
 */
nettools.jscore.Url.prototype.toString = function()
{
    var qs = this.getQuerystring().toString();

    if ( !qs )
        return this.getResource();
    else
        return this.getResource() + '?' + qs;
}



/** 
 * Add a new parameter to querystring ; value must not be already encoded
 *
 * @param string key
 * @param string value
 * @return nettools.jscore.Url Returns this
 */
nettools.jscore.Url.prototype.addParameter = function(key, value)
{
    this.getQuerystring().addParameter(key, value);
    return this;
}



/** 
 * Removes a parameter from querystring
 *
 * @param string key
 * @return nettools.jscore.Url Returns this
 */
nettools.jscore.Url.prototype.removeParameter = function(key)
{
    this.getQuerystring().removeParameter(key);
    return this;
}










// ==== SIZE ====
	
/** 
 * Size object constructor : handle sizes (arithmetics) and preserve unit
 *
 * @param int|string s Size ; if no unit given, we assume it's 'px'
 */
nettools.jscore.Size = function(s)
{
    if ( s == null )
    {
        this.size = null;
        this.unit = null;
        return;
    }


    var regs = null;
    if ( regs = (s).toString().match(/^([0-9]+)([a-z]+)$/) )
    {
        this.size = parseInt(regs[1]);
        this.unit = String(regs[2]);
    }
    else
    {
        this.size = parseInt(s);
        this.unit = 'px';
    }
}



/** 
 * Does the size exists (not null) ?
 *
 * @return bool
 */
nettools.jscore.Size.prototype.isNull = function()
{
    return (this.size == null);
}



/** 
 * Is size positive ?
 *
 * @return bool 
 */
nettools.jscore.Size.prototype.isPositive = function()
{
    return (this.size >= 0 );
}



/** 
 * Is size negative ?
 *
 * @return bool 
 */
nettools.jscore.Size.prototype.isNegative = function()
{
    return (this.size < 0 );
}



/**
 * Negate the size sign (eg. 5px becomes -5px)
 *
 * @return Size Returns a new Size object
 */
nettools.jscore.Size.prototype.negate = function()
{
    if ( this.isNull() )
        return new nettools.jscore.Size(null);
    
    return new nettools.jscore.Size((-this.size) + this.unit);
}



/**
 * Get the absolute value of size (eg. -5px becomes 5px ; 5px stays 5px)
 *
 * @return Size Returns a new Size object
 */
nettools.jscore.Size.prototype.abs = function()
{
    if ( this.isNull() )
        return new nettools.jscore.Size(null);
    
    return new nettools.jscore.Size(Math.abs(this.size) + this.unit);
}



/**
 * Convert the Size object to a string (size with unit appended)
 *
 * @return string
 */
nettools.jscore.Size.prototype.toString = function()
{
    if ( this.isNull() )
        return '';
    
    return this.size + this.unit;
}



/**
 * Add a value to a Size object
 * 
 * @param int value 
 * @return Size Returns a new Size object where its size property has been incremented with value parameter
 */
nettools.jscore.Size.prototype.add = function(value)
{
    if ( this.isNull() )
        return new nettools.jscore.Size(null);
    
    return new nettools.jscore.Size(this.size + Number(value) + this.unit);
}



/**
 * Subtract a value from a Size object
 * 
 * @param int value 
 * @return Size Returns a new Size object where its size property has been decremented with value parameter
 */
nettools.jscore.Size.prototype.subtract = function(value)
{
    if ( this.isNull() )
        return new nettools.jscore.Size(null);
    
    return new nettools.jscore.Size(this.size - Number(value) + this.unit);
}




