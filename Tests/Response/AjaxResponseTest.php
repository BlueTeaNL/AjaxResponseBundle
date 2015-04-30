<?php

namespace BlueTea\AjaxResponseBundle\Tests\Response;

use BlueTea\AjaxResponseBundle\Response\AjaxResponse;

class AjaxResponseTest extends \PHPUnit_Framework_TestCase
{
    public function testData()
    {
        $ajaxResponse = new AjaxResponse('content', AjaxResponse::TYPE_EVENT, ['data']);

        $expectedData = array(
            'type' => AjaxResponse::TYPE_EVENT,
            'content' => 'content',
            'data' => ['data']
        );

        $this->assertEquals($expectedData, $ajaxResponse->getData());
    }

    public function testContentType()
    {
        $ajaxResponse = new AjaxResponse();

        $this->assertEquals('application/json', $ajaxResponse->headers->get('Content-Type'));
    }
}
