#https://selenium.googlecode.com/git/docs/api/javascript/class_webdriver_promise_Promise.html
# document selectors : https://developer.mozilla.org/en-US/docs/Web/API/Document.title
#todo wait for load JQuery
#todo inject JQuery if not present

fs = require 'fs'
webdriver = require 'selenium-webdriver'
WebDriver = webdriver.WebDriver

selectify = (selector)->
  result = switch typeof selector
    when "object"
      for key,val of selector
        "[#{key}=#{val}]"
    when 'string'
      selector.replace /'/g, '"'
    else
      throw new Error "Bad selector type: "+selector

  "$('#{result}')"


WebDriver::saveScreenshot = (filename)->
  @takeScreenshot()
  .then (data)->
    fs.writeFileSync filename, data.replace(/^data:image\/png;base64,/,''), 'base64'

WebDriver::isElementPresent = (selector)->
  @executeScript "if(!$) return 0; return (#{selectify selector} || []).length"
  .then (length)->
    length >= 1

WebDriver::click = (selector)->
  @executeScript "return #{selectify selector}.click()"


WebDriver::waitForSelector = (selector, msec = 300)->
  @wait( =>
    @isElementPresent selector
  , msec)
  .thenCatch (e)->
    throw new Error 'Error waiting for selector: ' + selectify selector

WebDriver::setValue = (selector, value)->
  @executeScript "return #{selectify selector}.val('#{value}')"

WebDriver::getValue = (selector)->
  @executeScript "return #{selectify selector}.val()"

WebDriver::getText = (selector)->
  @executeScript "return #{selectify selector}.text()"

WebDriver::getAttr = (selector, attrName)->
  @executeScript "return #{selectify selector}.attr('#{attrName}')"

WebDriver::isJQuery = ->
  @executeScript "return !!$"

WebDriver::injectJQuery = ->
  @isJQuery()
  .then (jqueryPresent)=>
    if not jqueryPresent
      console.log 'Injecting JQuery'
      @executeScript "
        var script   = document.createElement('script');
        script.type  = 'text/javascript';
        script.src   = 'lib/jquery-2.1.1.min.js';
        document.body.appendChild(script);
      "
  .then =>
    @wait( =>
      @isJQuery()
    , 200)
    .thenCatch (e)->
      throw new Error 'Error injecting JQuery'

WebDriver::openPage = (url, msec = 300)->
  @get url
  .then =>
    @injectJQuery()

WebDriver::waitForQuerySelector = (selector, msec)->
  @wait( =>
    @executeScript "return document.querySelectorAll('#{selector}').length;"
  , 200)
  .thenCatch (e)->
    throw new Error 'Error wait for query selector: '+selector



module.exports = webdriver
