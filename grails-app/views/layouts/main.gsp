<!DOCTYPE html>
<!--[if lt IE 7 ]> <html lang="en" class="no-js ie6"> <![endif]-->
<!--[if IE 7 ]>    <html lang="en" class="no-js ie7"> <![endif]-->
<!--[if IE 8 ]>    <html lang="en" class="no-js ie8"> <![endif]-->
<!--[if IE 9 ]>    <html lang="en" class="no-js ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html lang="en" class="no-js"><!--<![endif]-->
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title><g:layoutTitle default="Main"/></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>

    <link rel="shortcut icon" sizes="64x64" href="${assetPath(src: 'favicons/morpheus_fav_64.png')}" type="image/png">
    <link rel="shortcut icon" sizes="32x32" href="${assetPath(src: 'favicons/morpheus_fav_32.png')}" type="image/png">
    <link rel="shortcut icon" sizes="24x24" href="${assetPath(src: 'favicons/morpheus_fav_24.png')}" type="image/png">
    <link rel="shortcut icon" sizes="16x16" href="${assetPath(src: 'favicons/morpheus_fav_16.png')}" type="image/png">

    <asset:stylesheet src="application.css"/>
    <asset:stylesheet src="jquery-ui.min.css"/>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.1.0/css/all.css" integrity="sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt" crossorigin="anonymous">

    <asset:javascript src="application.js" charset="utf-8"/>

    <!-- include summernote css/js -->
    <link href="https://netdna.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.css" rel="stylesheet">
    <asset:stylesheet src="summernote.css"/>
    <asset:javascript src="summernote.min.js" charset="utf-8"/>
    <g:layoutHead/>
</head>

<body data-page="${g.pageProperty(name: 'body.data-page')}" data-id="${g.pageProperty(name: 'body.data-id')}"
      data-stat-type="${g.pageProperty(name: 'body.data-stat-type')}">

<!-- Header -->
<g:render template="/templates/toolHeader"/>

<g:render template="/templates/svgFilters"/>
<div class="flex-wrapper">
    <div class="main-container">
        <%-- Layout Body --%>
        <g:layoutBody/>
    </div>
    <%-- Footer --%>
    <g:render template="/templates/toolFooter"/>
</div>

</body>
</html>
