<?php

namespace BlueTea\AjaxResponseBundle\Response;

use JMS\Serializer\SerializationContext;
use JMS\Serializer\SerializerBuilder;
use Symfony\Component\HttpFoundation\Response;

class AjaxResponse extends Response
{
    /**
     * Start a new modal
     * $content = "HTML Modal content"
     */
    const TYPE_MODAL = 'modal';

    /**
     * Redirect to a page
     * $content = "http://your_redirect_url"
     */
    const TYPE_REDIRECT = 'redirect';

    /**
     * Fire an event
     * $content = "event name"
     * $data = <your data>
     */
    const TYPE_EVENT = 'event';

    /**
     * Return just some data
     * $content = ''
     * $data = <your data>
     */
    const TYPE_DATA = 'data';

    /**
     * @var array
     */
    protected $data;

    public function __construct($content = '', $type = self::TYPE_DATA, $data = null, $status = 200, $headers = array())
    {
        // Set data
        $this->data = [
            'type' => $type,
            'content' => $content,
            'data' => $data
        ];

        $serializationContext = new SerializationContext();
        $serializationContext->setSerializeNull(true);

        // Create serializer instance
        $serializer = SerializerBuilder::create()->build();

        // The data is serialized by the AjaxReponseListener because we don't have access to the Symfony2 container
        // in this class. We need this container because we need the JMS Serializer including the configured
        // serialization context configured by the YAML files on the entities. If a new serialization context class
        // is initialized in this class we don't know what the settings are in the YAML files. We can't access these
        // configuration files because that would result in a massive performance degradation.
        // INFO: This isn't a really nice solution but it's only possible to add a string to the content
        parent::__construct($serializer->serialize($this->data, 'json', $serializationContext), $status, $headers);
        // Set content type
        $this->headers->set('Content-Type', 'application/json');
    }
}