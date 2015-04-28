<?php

namespace BlueTea\AjaxResponseBundle\EventListener;

use BlueTea\AjaxResponseBundle\Response\AjaxResponse;
use JMS\Serializer\Serializer;
use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use Symfony\Component\HttpFoundation\Session\Session;

class AjaxResponseListener
{
    /**
     * @var \Symfony\Component\HttpFoundation\Session\Session
     */
    protected $session;

    /**
     * @var Serializer
     */
    protected $serializer;

    public function __construct(Session $session, Serializer $serializer)
    {
        $this->session = $session;
        $this->serializer = $serializer;
    }

    public function onKernelResponse(FilterResponseEvent $event)
    {
        $response = $event->getResponse();

        // Do only something as the response is an instance of AjaxResponse
        if (!$response instanceof AjaxResponse) {
            return;
        }

        // Get the data
        $data = $response->getData();

        // Check if there is a FlashBag set
        $flashBags = $this->session->getFlashBag()->all();
        if (!empty($flashBags)) {
            $data['flashBag'] = $flashBags;
        }

        // Serialize the data with JMS serializer to JSON
        $content = $this->serializer->serialize($data, 'json');
        // Set the content
        $response->setContent($content);
        // Set the response
        $event->setResponse($response);
    }
}