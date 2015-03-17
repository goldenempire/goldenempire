String::_clear = ->
  s = Object.keys(@).map (x)=>
    @[x]
  s.join ''
  .replace /(\s)+/g, '$1'
  .replace /\s*$/, ''
  .replace /^\s*/, ''

Q = require 'q'
events = require 'events'
jsdom = require 'jsdom'

webdriver = require './lib/webd.coffee'
WebDriver = webdriver.WebDriver

# !!! use just firefox v28.0 instead of latest version
#browser = webdriver.Capabilities.firefox();
#browser = webdriver.Capabilities.chrome()
browser = webdriver.Capabilities.phantomjs();

driver = new webdriver.Builder().withCapabilities( browser ).build()

get_from_page = (url)->
  [
    -> driver.openPage url
    -> driver.waitForSelector id : 'SITE_STRUCTURE', 5000
    ->
      driver.executeScript "
  return $('div')
  .filter(function(){
    var m = $(this).text().match(/dam/g);
    return 1 == (m || []).length;
  }).map(function(){
    return $(this).text();
  });"
    ->
      [ arr ] = arguments
      arr.map (item)->
        new CatParser item
  ].reduce Q.when, Q()

all_cats = []
[
  ->
    get_from_page 'http://www.goldenempire.gifts/#!cats/c1r52'
    .then (cats)->
      cats.map (cat)->
        cat.sex = 'male'
        cat
    .then (cats)->
      all_cats = all_cats.concat cats
  ->
    get_from_page 'http://www.goldenempire.gifts/#!ladies-cats/c1lo9'
    .then (cats)->
      cats.map (cat)->
        cat.sex = 'female'
        cat
    .then (cats)->
      all_cats = all_cats.concat cats
].reduce Q.when, Q()
.catch (ce)->
  console.log ce.stack
.fin ->
  console.log all_cats
  driver.quit()

class CatParser
  _text_arr : null

  constructor : (item)->
    @_text_arr =
      item.split('\n').map (x)->
        x._clear()
      .filter (x)->
        x.length
    ['brider', 'dam', 'sire', 'owner'].forEach (field_name)=>
      re = new RegExp "^\s*#{field_name}\s*:(.*)$"
      a = @_text_arr
      .filter (x)=>
        re.test x._clear()
      @[field_name] = a.join('').split(':')?[1]._clear()

    @birth = @birth_get().toISOString().substr 0, 10
    @breed = @_text_arr[2]._clear().substr(0, 3)
    @color = @_text_arr[2].replace(@breed, '')._clear()

  birth_get : ->
    re = /^(\d{2}).(\d{2}).(\d{4})$/
    d = @_text_arr.filter (x)->
      re.test x
    .map (x)->
      x.replace re, '$3/$2/$1 GMT+0'
    .join ''
    @birth = new Date d
