# net-tools/js-core

## Core Javascript functions

This packages contains a single file, `js-core.js`, and also a translation file to French (default messages in the library are in English). 



## Setup instructions ##

To install net-tools/js-core package, just require it through composer and insert a script tag in the `HEAD` section :
```
<script src="/path_to_vendor/net-tools/js-core/src/js-core.js.min"></script>
```



## Reference ##

Full reference would be too long. 

However, here is a simple list of functions provided :

- cookies management (nettools.jscore.set/get/deleteCookie),
- strings management (uppercase some letters, replace diacritics characters, escape characters for URL, trim spaces, generate random numbers),
- querystring and URL management (through some nettools.jscore.* functions, but also through two special objects dedicated to URL management : nettools.jscore.Querystring and nettools.jscore.Url),
- form inputs management (get an object litteral whose properties are set with input fields, or a querystring from input fields),
- requests management (send POST or XmlHttp requests from querystring or litteral objects whose property and values are translated to querystring parameters and values),
- oriented object programming (inheritance),
- form validators (in real-time or at form submit : nettools.jscore.validator.RealTimeValidator and nettools.jscore.validator.FormValidator),
- stack and pool data structures,
- crypto functions (SHA1, SHA256, hmacSHA256, AES),
- size values management (manipulate size values, such as '140px' : add or subtract)
