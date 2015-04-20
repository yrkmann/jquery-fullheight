# jQuery FullHeight v1.0.0
Another one full height trick.

## Requirements
* jQuery 2.x

## Usage
Simple call:
```
$('selector').fullheight();
```
or with options:
```
$('selector').fullheight({
  container: '.layout',
  property: 'height'
});
```

## Options
* debug [Boolean] Log to console;
* allowDeviceHeightResize [Boolean] Scroll fix for some mobile devices;
* container [String] Parent element or jQuery selector;
* property [String] Element css property to change on container resize.

## Examples
See examples directory.
