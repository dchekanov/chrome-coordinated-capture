<a name="CoordinatedCapture"></a>

## CoordinatedCapture
**Kind**: global class  

* [CoordinatedCapture](#CoordinatedCapture)
    * [new CoordinatedCapture()](#new_CoordinatedCapture_new)
    * [.sendCommand(command, [parameter])](#CoordinatedCapture+sendCommand)
    * [.sendCommandAndWaitForEvent(...var_args)](#CoordinatedCapture+sendCommandAndWaitForEvent) ⇒ <code>Promise</code>
    * [.getStatus()](#CoordinatedCapture+getStatus) ⇒ <code>Promise</code>
    * [.start([resolution])](#CoordinatedCapture+start) ⇒ <code>Promise</code>
    * [.pause()](#CoordinatedCapture+pause) ⇒ <code>Promise</code>
    * [.resume()](#CoordinatedCapture+resume) ⇒ <code>Promise</code>
    * [.stop()](#CoordinatedCapture+stop) ⇒ <code>Promise</code>
    * [.download()](#CoordinatedCapture+download) ⇒ <code>Promise</code>
    * [.on(eventName, handler)](#CoordinatedCapture+on)
    * [.off(eventName, handler)](#CoordinatedCapture+off)

<a name="new_CoordinatedCapture_new"></a>

### new CoordinatedCapture()
Creates a new instance.

<a name="CoordinatedCapture+sendCommand"></a>

### coordinatedCapture.sendCommand(command, [parameter])
Sends a command to the extension.

**Kind**: instance method of <code>[CoordinatedCapture](#CoordinatedCapture)</code>  
**Access:** protected  

| Param | Type | Description |
| --- | --- | --- |
| command | <code>string</code> |  |
| [parameter] | <code>string</code> | a value to pass on |

<a name="CoordinatedCapture+sendCommandAndWaitForEvent"></a>

### coordinatedCapture.sendCommandAndWaitForEvent(...var_args) ⇒ <code>Promise</code>
Sends a command to the extension and awaits for an event in response.

**Kind**: instance method of <code>[CoordinatedCapture](#CoordinatedCapture)</code>  
**Access:** protected  

| Param | Type | Description |
| --- | --- | --- |
| ...var_args | <code>string</code> | a mandatory command name followed by an optional parameter and mandatory event name |

<a name="CoordinatedCapture+getStatus"></a>

### coordinatedCapture.getStatus() ⇒ <code>Promise</code>
Gets extension status.

**Kind**: instance method of <code>[CoordinatedCapture](#CoordinatedCapture)</code>  
<a name="CoordinatedCapture+start"></a>

### coordinatedCapture.start([resolution]) ⇒ <code>Promise</code>
Starts recording.

**Kind**: instance method of <code>[CoordinatedCapture](#CoordinatedCapture)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [resolution] | <code>string</code> | 'WIDTHxHEIGHT'; if not specified, equals to the screen resolution |

<a name="CoordinatedCapture+pause"></a>

### coordinatedCapture.pause() ⇒ <code>Promise</code>
Pauses recording.

**Kind**: instance method of <code>[CoordinatedCapture](#CoordinatedCapture)</code>  
<a name="CoordinatedCapture+resume"></a>

### coordinatedCapture.resume() ⇒ <code>Promise</code>
Resumes recording.

**Kind**: instance method of <code>[CoordinatedCapture](#CoordinatedCapture)</code>  
<a name="CoordinatedCapture+stop"></a>

### coordinatedCapture.stop() ⇒ <code>Promise</code>
Stops recording.

**Kind**: instance method of <code>[CoordinatedCapture](#CoordinatedCapture)</code>  
<a name="CoordinatedCapture+download"></a>

### coordinatedCapture.download() ⇒ <code>Promise</code>
Downloads the result.

**Kind**: instance method of <code>[CoordinatedCapture](#CoordinatedCapture)</code>  
<a name="CoordinatedCapture+on"></a>

### coordinatedCapture.on(eventName, handler)
Binds a hanler to an event fired by the extension.

**Kind**: instance method of <code>[CoordinatedCapture](#CoordinatedCapture)</code>  

| Param | Type |
| --- | --- |
| eventName | <code>&#x27;enabled&#x27;</code> &#124; <code>&#x27;disabled&#x27;</code> &#124; <code>&#x27;extensionStatus&#x27;</code> &#124; <code>&#x27;started&#x27;</code> &#124; <code>&#x27;stopped&#x27;</code> &#124; <code>&#x27;paused&#x27;</code> &#124; <code>&#x27;resumed&#x27;</code> | 
| handler | <code>function</code> | 

<a name="CoordinatedCapture+off"></a>

### coordinatedCapture.off(eventName, handler)
Unbinds a previously bound handler.

**Kind**: instance method of <code>[CoordinatedCapture](#CoordinatedCapture)</code>  

| Param | Type |
| --- | --- |
| eventName | <code>&#x27;enabled&#x27;</code> &#124; <code>&#x27;disabled&#x27;</code> &#124; <code>&#x27;extensionStatus&#x27;</code> &#124; <code>&#x27;started&#x27;</code> &#124; <code>&#x27;stopped&#x27;</code> &#124; <code>&#x27;paused&#x27;</code> &#124; <code>&#x27;resumed&#x27;</code> | 
| handler | <code>function</code> | 

