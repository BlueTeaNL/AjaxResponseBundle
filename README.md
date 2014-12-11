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

Thsi bundle is implemented automatically in the backend via the AjaxResponseListener. The frontend implementation should
be done manually.

### Frontend

First we should load the javascript files including jQuery, Pnotify and BlockUI.

```html
<!-- Javascript -->
<script src="Resources/public/vendor/jquery/dist/jquery.min.js"></script>
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

Just return the AjaxResponse object and the AjaxResponseListener will do the rest!

```php
// An empty response
return new AjaxResponse();

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