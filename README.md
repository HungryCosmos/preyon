# preyon-2 [![Working Demo](https://img.shields.io/badge/demo-running-brightgreen.svg)](https://hungrycosmos.com/preyon-2) [![Rawgit](https://img.shields.io/badge/rawgit-v2.0.0-orange.svg)](https://cdn.rawgit.com/HungryCosmos/preyon-2/v2.0.0/dist/umd/Preyon2.min.js)

> Configurable version of Preyon by @cmiscm which does not draw with points anymore |´• ‸ •`|


## About

This library makes tuning of original [Preyon](https://github.com/cmiscm/preyon) by @cmiscm much easier. Initially, the library had
built-in configuration widget (which is still available at [author's github page](https://cmiscm.github.io/preyon/)), but I'd rather use 
configuration files. Both Preyon2 and Preyon developed and intended for _in-browser_ use only.  

**Compatibility**: _works_ in my ie 11  
**Demo**: [running](https://hungrycosmos.com/preyon-2)  


## Quick Start

1. Download packaged [Preyon2.min.js](/dist/umd/Preyon2.min.js) (or other distribution from [repo](/dist))
and load it with from local files, or use [rawgit](https://rawgit.com) at your own risk:  
   ```html
   <script src="https://cdn.rawgit.com/HungryCosmos/preyon-2/v2.0.0/dist/umd/Preyon2.min.js"></script>
   ```
2. Initialize `Preyon2` with required params in javascript:  
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <!--metadata-->
   </head>
   <body>
       <!--MUST HAVE CANVAS TO DRAW-->
       <canvas id="canvas"></canvas>
   
       <!--content-->
       <div id="content">
           <div id="centered-cell">
               <span id="useful-text"><a href='https://hungrycosmos.com'>Yum-Yum!</a></span>
           </div>
       </div>
          
       <!--loading this library-->
       <script src="https://cdn.rawgit.com/HungryCosmos/preyon-2/v2.0.0/dist/umd/Preyon2.min.js"></script>
   
       <!--initialization-->
       <script>
           // First, we need to get references to canvas element and Preyon2 trigger:
           var canvas = document.getElementById('canvas');
           var chewTrigger = document.getElementById('content');
   
           // Take a look at all possible options. You can change what you want right here, but we will skip it for now.
           var DEFAULTS = {
   
               // dom
               canvas: null,
               chewTrigger: null,
               chewEvents: ['click'],
               chewCallback: null,
   
               // chew animation
               lowerLimit: -1,
               upperLimit: 1,
               timeToCloseMouth: 0.8,
               timeToOpenMouth: 2.0,
   
               // teeth
               toothW: 180,
               toothH: 160,
               teethTotal: 32,
               toothMainColor: '#ffffff',
               toothSecondaryColor: '#cccccc',
   
               // jaws
               innerMouthColor: 'transparent',
               upperJawFillColor: '#000000',
               upperJawStrokeColor: '#000000',
               upperJawStrokeWidth: 0,
               lowerJawFillColor: '#000000',
               lowerJawStrokeColor: '#000000',
               lowerJawStrokeWidth: 0
           };
   
           // These must be configured to make the library actually usable
           DEFAULTS.canvas = canvas;
           DEFAULTS.chewTrigger = chewTrigger;
   
           // This is optional, in case we want to add additional event listener
           DEFAULTS.chewEvents.push('wheel');
   
           // Remember only to keep at least one element in chewEvents
           DEFAULTS.chewEvents = ['click'];
   
           // We can also specify a callback. It will be executed after mouth will get closed.
           function usefulCallback() {
               document.getElementById('useful-text').innerHTML = "So tasty! <a href=\"https://hungrycosmos.com\">Back for more?</a>";
           }
   
           // Let's style it a little bit
           DEFAULTS.innerMouthColor = '#282828';
           DEFAULTS.lowerLimit = 0.4;
           DEFAULTS.toothW = 240;
   
           // We can pack our custom config into separate object
           var config = {
               canvas: canvas,
               chewTrigger: chewTrigger,
               chewEvents: ['click', 'wheel'],
               chewCallback: usefulCallback,
               innerMouthColor: '#282828',
               lowerLimit: 0.4,
               toothW: 240
           };
   
           // And it will overwrite defaults. Note, RealtimeTime.init(DEFAULTS); will work as well
           Preyon2.init(config);
   
           // This lib uses .addEventListener() to manipulate callbacks
           // More reading on events below
           // https://developer.mozilla.org/en-US/docs/Web/Events
       </script>
   </body>
   ```
4. Good Day Sir!


## References

1. Original repo: [github.com/cmiscm/preyon](https://github.com/cmiscm/preyon)  
   Original creator and copyright holder of [Preyon](/src/Preyon2.js): [Jongmin Kim](http://cmiscm.com), his [blog](http://blog.cmiscm.com/)  
   Original license text:  
   > Copyright (c) 2016 Jongmin Kim (http://cmiscm.com)  
   > Licensed under the MIT license.  
   >  - http://www.opensource.org/licenses/mit-license.php  

2. [Preyon source file](/src/Preyon2.js) has been modified by [me](https://github.com/HungryCosmos), to fit my [personal website](https://hungrycosmos.com)  
Mofifications include, but not limited to:
   - changes of variables, such as deleting, adding and mutating existing values
   - changes of methods, such as deleting whole methods or it's parts, adding new instructions to existing methods, 
adding new conditions to make system more customizeable
   - added configurations
   - jaws are now opened right after closing and executing callback  

3. [LICENSE](LICENSE) file has been updated to include my copyright notice and match github style better. Original text saved above.  

4. Added [webpack](https://github.com/webpack/webpack) build scripts to produce browser-ready umd bundle, which includes the following unmodified 
distributions from [npmjs](https://www.npmjs.com): 
   - TweenLite and Expo from [gsap v1.20.3](https://www.npmjs.com/package/gsap) | Copyright (c) 2008-2017, GreenSock | [GreenSock's standard "no charge" license](https://greensock.com/standard-license)
   - [merge-json v0.1.0-b.3](https://www.npmjs.com/package/merge-json) | Copyright (c) 2016 jacob418 | [MIT License](https://github.com/jacob418/node_json-merge/blob/master/LICENSE)

Modifications are licensed under MIT license, Copyright (c) 2017 HungryCosmos
