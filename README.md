AjaxResponse for Symfony2
========================
This repository contains an AjaxResponse implementation which allows you an easy-to-use Ajax implementation in the
frontend (javascript) and backend (PHP).

The bundle does relies on the Symfony2 framework and JMS Serializer.

# Installation

## Get a copy of the repo!

You can load this repository with composer:

```bash
composer.phar require "bluetea/ajax-response-bundle" dev-master
```

If you don't use composer, load the repository with GIT:

```bash
git clone https://github.com/BlueTeaNL/AjaxResponseBundle.git your-directory
```

Add the bundle to the AppKernel.php:

```php
new BlueTea\AjaxResponseBundle\BlueTeaAjaxResponseBundle(),
```

## Implementation

This bundle is implemented automatically in the backend via the AjaxResponseListener. The frontend implementation should
be done manually.

### Frontend

First we should load the javascript files including jQuery, jQuery-ui, Pnotify and BlockUI.

```html
<!-- Javascript -->
<script src="Resources/public/vendor/jquery/dist/jquery.min.js"></script>
<script src="Resources/public/vendor/jquery-ui/ui/minified/jquery-ui.min.js"></script>
<script src="Resources/public/vendor/blockui/jquery.blockUI.js"></script>
<script src="Resources/public/vendor/pnotify/pnotify.core.js"></script>
<script src="Resources/public/vendor/pnotify/pnotify.buttons.js"></script>
<script src="Resources/public/vendor/pnotify/pnotify.callbacks.js"></script>
<script src="Resources/public/vendor/pnotify/pnotify.confirm.js"></script>
<script src="Resources/public/vendor/pnotify/pnotify.desktop.js"></script>
<script src="Resources/public/vendor/pnotify/pnotify.history.js"></script>
<script src="Resources/public/vendor/pnotify/pnotify.nonblock.js"></script>
<script src="Resources/public/vendor/pnotify/pnotify.reference.js"></script>
<script src="Resources/private/js/bluetea/ajaxProtocol.js"></script>
<script src="Resources/private/js/bluetea/arrayMerge.js"></script>
<script src="Resources/private/js/bluetea/blockUi.js"></script>
<script src="Resources/private/js/bluetea/bootstrapModal.js"></script>

<!-- Stylesheets -->
<link href="Resources/public/vendor/jquery-ui/themes/smoothness/jquery-ui.min.css" rel="stylesheet" type="text/css" />
<link href="Resources/public/vendor/pnotify/pnotify.core.css" rel="stylesheet" type="text/css" />
<link href="Resources/public/vendor/pnotify/pnotify.buttons.css" rel="stylesheet" type="text/css" />
<link href="Resources/public/vendor/pnotify/pnotify.history.css" rel="stylesheet" type="text/css" />
<link href="Resources/public/vendor/pnotify/pnotify.picon.css" rel="stylesheet" type="text/css" />
```

or with assetic:

```twig
{% javascripts combine=true
    '@BlueTeaAjaxResponseBundle/Resources/public/vendor/jquery/dist/jquery.min.js'
    '@BlueTeaAjaxResponseBundle/Resources/public/vendor/blockui/jquery.blockUI.js'
    '@BlueTeaAjaxResponseBundle/Resources/public/vendor/pnotify/pnotify.core.js'
    '@BlueTeaAjaxResponseBundle/Resources/public/vendor/pnotify/pnotify.buttons.js'
    '@BlueTeaAjaxResponseBundle/Resources/public/vendor/pnotify/pnotify.callbacks.js'
    '@BlueTeaAjaxResponseBundle/Resources/public/vendor/pnotify/pnotify.confirm.js'
    '@BlueTeaAjaxResponseBundle/Resources/public/vendor/pnotify/pnotify.desktop.js'
    '@BlueTeaAjaxResponseBundle/Resources/public/vendor/pnotify/pnotify.history.js'
    '@BlueTeaAjaxResponseBundle/Resources/public/vendor/pnotify/pnotify.nonblock.js'
    '@BlueTeaAjaxResponseBundle/Resources/public/vendor/pnotify/pnotify.reference.js'
    '@BlueTeaAjaxResponseBundle/Resources/private/js/bluetea/ajaxProtocol.js'
    '@BlueTeaAjaxResponseBundle/Resources/private/js/bluetea/arrayMerge.js'
    '@BlueTeaAjaxResponseBundle/Resources/private/js/bluetea/blockUi.js'
    '@BlueTeaAjaxResponseBundle/Resources/private/js/bluetea/bootstrapModal.js'
%}
    <script type="text/javascript" src="{{ asset_url }}"></script>
{% endjavascripts %}

{% stylesheets filter="cssrewrite"
    '@BlueTeaAjaxResponseBundle/Resources/public/vendor/pnotify/pnotify.core.css'
    '@BlueTeaAjaxResponseBundle/Resources/public/vendor/pnotify/pnotify.buttons.css'
    '@BlueTeaAjaxResponseBundle/Resources/public/vendor/pnotify/pnotify.history.css'
    '@BlueTeaAjaxResponseBundle/Resources/public/vendor/pnotify/pnotify.picon.css'
%}
    <link href="{{ asset_url }}" type="text/css" rel="stylesheet" media="screen" />
{% endstylesheets %}
```

Then initialize the ajaxProtocol and blockUi widgets.

```javascript
$(function () {
    $(document).ajaxProtocol();
    $(document).blockUi();
});
```

## Usage

### Backend

The AjaxResponse overrides the constructor of the Response object. Two additional parameters are added: type and data.
The type is the most important part because it’s used by the ajaxProtocol.js to determine which action is expected.
Example: the “modal” type opens a modal. The data parameter is used if you like to send additional data.

There are four types implemented:

* Modal: this type opens a modal
* Redirect: this type triggers a redirect
* Event: this type fires a javascript event which can be catched by other javascript files
* Data: this is the default type and just passed the data

The AjaxResponse contains 5 parameters: content, type, data, status and headers.

```php
return new AjaxResponse($content = '', $type = self::TYPE_DATA, $data = null, $status = 200, $headers = array())
```

The content parameter contains the data of the type:

* Modal type: HTML data for the modal
* Redirect type: the URL
* Event type: the event name
* Data type: the data

So, if you want to send a modal to the frontend your code should look like this:

```php
return new AjaxResponse(
    $this->renderView('HotfloSystemGroupBundle:Group/Ajax:show.html.twig',
        array(
            'children' => $children,
            'collection' => $collection,
            'type' => HotfloSystemGroupTypes::getTypeByClass($collection->getClass())
        )
    ),
    AjaxResponse::TYPE_MODAL
);
```

And if you want to fire an event in javascript:

```php
return new AjaxResponse('your_event_name', AjaxResponse::TYPE_EVENT, $additional_data);
```

All possible AjaxResponse types:

```php
// An empty response
return new AjaxResponse();

// Just some data
return new AjaxResponse($yourData);

// Trigger an javascript event
return new AjaxResponse('your_event_name', AjaxResponse::TYPE_EVENT, $optional_data);

// Redirect
return new AjaxResponse('http://your-url.com', AjaxResponse::TYPE_REDIRECT);

// Render Bootstrap modal
return new AjaxResponse('<html code>', AjaxResponse::TYPE_MODAL);

// Render Bootstrap modal with twig rendering
return new AjaxResponse($this->renderView('your-view', $data), AjaxResponse::TYPE_MODAL);
```

Don't pre-serialize the data. The data is serialized to JSON by the AjaxResponseListener.

### Frontend

You should use the AjaxProtocol widget to enable all advantages of the AjaxResponse. The AjaxProtocol widget handles
modal, redirect and event triggering automatically. If you want to do something manual, override the successCallback
and use the DATA type in the AjaxResponse object in the backend.

All options:

```javascript
$(document).ajaxProtocol({
    url: null,
    data: null,
    type: 'POST',
    beforeSendCallback: function() { $(window).application('blockUI'); },
    readyCallback: function() { $(window).application('unblockUI'); },
    successCallback: function() {},
    failCallback: function() { bootbox.alert('Oh god! Something went terribly wrong :-('); }
});
```

Just call an URL. The data parameters contains the POST or GET parameters and the type is default ‘POST’ but can be set
to ‘GET’. The beforeSendCallback is a function callback and is executed before the AJAX call is made. The successCallback
is a function callback and is executed as the AJAX call is successful. The failCallback is a function callback and is
executed as the AJAX call has failed.

Example for a modal:

```javascript
$(document).ajaxProtocol("call", {url: url, type: 'GET'});
```

Example for an event:

```javascript
$(document).ajaxProtocol("call", {url: url, type: 'GET'});
```

Example for posting data:

```javascript
$(document).ajaxProtocol("call", {url: url, type: 'POST', data: {foo: 'bar'});
```

Example when using dataTables:

```javascript
"fnServerData": function ( sSource, aoData, fnCallback ) {
    $(document).ajaxProtocol("call", {
        url: sSource,
        data: aoData,
        type: 'GET',
        successCallback: function(data) { fnCallback(data) },
        beforeSendCallback: null // disable the blockUI by overriding this callback
    });
},
```