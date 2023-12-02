# Lock and Key API Documentation

The api is reachable from the variable `game.modules.get('LocknKey').api`.

### The documentation can be out of sync with the API code checkout the code if you want to dig up [API CODE](../scripts/compatibility/APIHandler.js)

## Generic API

### LnkFlags

`game.modules.get("LocknKey").api.LnKFlags()` ⇒ `void`

Method to retrieve the current LnKFlags class object

**Returns**: `LnKFlags` 

**Example**:

```js
game.modules.get("LocknKey").api.LnKFlags;
```

### Open TI Window for

`game.modules.get("LocknKey").api.openTIWindowfor(pUserID, pInventoryOwner, pOptions = {customHeader : "", TakerID : ""})` ⇒ `void`

Method for open a window for transfer object between actors

**Returns**: `void` 

| Param                    | Type                    | Default | Description                                            |
|--------------------------|-------------------------|---------|--------------------------------------------------------|
| pUserID                   | `string`             |         |  The game user id associated to the actor to whom transfer the item        |
| pInventoryOwner           | `string`             |         |  The token document reference to the actor target (the one ownings the items)        |
| pOptions                  | `object`             |  {}    | OPTIONAL: Options to pass to the function                        |
| [pItemInfos.customHeader] | `string`             |  null  | The custom header to change header of loot inventory (can include HTML) |
| [pItemInfos.TakerID]      | `string`             |  null  | The taker id to transfer loot to specific token |


**Example**:

```js
let vPlayerName = "Player" //name of target player
let vLootTokenName = "Token" //name of the token in which has the loot (must be in scene)

let vPlayerID = game.users.find(vUser => vUser.name == vPlayerName).id;
let vToken = canvas.scene.tokens.find(vToken => vToken.name == vLootTokenName);

game.modules.get("LocknKey").api.openTIWindowfor(vPlayerID,  vToken, {customHeader : "", TakerID : ""})

//Change customHeader  to change header of loot inventory (can include HTML)
//Change TakerID to transfer loot to specific token
```

### Transfers items

`game.modules.get("LocknKey").api.TransferItems(pSource, pTarget, pItemInfos)` ⇒ `void`

Transfers items defined by pItemInfos(array of id, quantity) from pSource to pTarget

**Returns**: `void` 

| Param                    | Type                    | Default | Description                                            |
|--------------------------|-------------------------|---------|--------------------------------------------------------|
| pSource                    | `TokenDocument`             |         |  The source token document where to retrieve the items        |
| pTarget                    | `TokenDocument`             |         |  The target token document where to put the items        |
| pInventoryOwner             | `string`             |         |  The token document reference to the actor target (the one ownings the items)        |
| pItemInfos                  | `object[] (array of objects)`  |  null  | OPTIONAL: Options about the item to transfer                     |
| [pItemInfos[].itemid]       | `string`             |   null  | The id of the item to transfer |
| [pItemInfos[].quantity]     | `number`             |  null   | The quantity of the item to transfer |
| [pItemInfos[].isCurrency]   | `boolean`            |   false     |  The flag for check the item has currency |


**Example**:

```js
TODO
```

### Check Actor/Tokens Compatibility

`game.modules.get("LocknKey").api.CheckActorPTokensCompatibility()` ⇒ `Promise<void>`

Method for checks the prototype tokens of all actors for LnK compatibility and sets the lockability of incomaptible ones to false

**Returns**: `Promise<void>` 

**Example**:

```js
game.modules.get("LocknKey").api.CheckActorPTokensCompatibility()
```


### Update Lock & Key world formulas

`game.modules.get("LocknKey").api.ResettoStandardFormulas({pLP : true, pLB : true});` ⇒ `void`

Updates the Lock & Key formula world settings with the newest version

**Returns**: `void` 


| Param                    | Type                    | Default | Description                                            |
|--------------------------|-------------------------|---------|--------------------------------------------------------|
| pLP                      | `boolean`               |         |     |
| pLB                      | `boolean`               |         |     |

**Example**:

```js
game.modules.get("LocknKey").api.ResettoStandardFormulas({pLP : true, pLB : true});
```

## GM API

### Copy hovered lock

`game.modules.get("LocknKey").api.CopyhoveredLockGM()` ⇒ `void`

Copy hovered lock

**Returns**: `void` 

**Example**:

```js
game.modules.get("LocknKey").api.CopyhoveredLockGM()
```

### Create new key for hovered lock

`game.modules.get("LocknKey").api.CreateNewKeyhoveredGM()` ⇒ `void`

Create new key for hovered lock

**Returns**: `void` 

**Example**:

```js
game.modules.get("LocknKey").api.CreateNewKeyhoveredGM()
```

### Paste hovered lock

`game.modules.get("LocknKey").api.PastehoveredLockGM()` ⇒ `void`

Paste hovered lock

**Returns**: `void` 

**Example**:

```js
game.modules.get("LocknKey").api.PastehoveredLockGM()
```

### Reset Pick Pocket DC (selected or scene wide)

`game.modules.get("LocknKey").api.LnKFlags.ResetPickPocketDC(token:TokenDocument)` ⇒ `void`

Reset Pick Pocket DC (selected or scene wide) to the default value

**Returns**: `void` 

| Param                    | Type                    | Default | Description                                            |
|--------------------------|-------------------------|---------|--------------------------------------------------------|
| token                   | `TokenDocument`             |         |  The token document to reset        |

**Example**:

```js
let vTokens = canvas.tokens.controlled;

if (!vTokens.length) {
	vTokens = canvas.tokens.placeables;
}

vTokens = vTokens .map(Token => Token.document);

for (let i = 0; i < vTokens.length; i++) {
	game.modules.get("LocknKey").api.LnKFlags.ResetPickPocketDC(vTokens[i]);
}
```


### Toggle hovered lock

`game.modules.get("LocknKey").api.TogglehoveredLockGM()` ⇒ `void`

Toggle hovered lock

**Returns**: `void` 

**Example**:

```js
game.modules.get("LocknKey").api.TogglehoveredLockGM()
```

## PLAYER API

### Break lock

`game.modules.get("LocknKey").api.BreakHoveredLock()` ⇒ `void`

Break lock

**Returns**: `void` 

**Example**:

```js
game.modules.get("LocknKey").api.BreakHoveredLock()
```

### Pick lock

`game.modules.get("LocknKey").api.PickHoveredLock()` ⇒ `void`

Pick lock

**Returns**: `void` 

**Example**:

```js
game.modules.get("LocknKey").api.PickHoveredLock()
```

### Pick pocket

`game.modules.get("LocknKey").api.PickPocketHovered()` ⇒ `void`

Pick pocket

**Returns**: `void` 

**Example**:

```js
game.modules.get("LocknKey").api.PickPocketHovered()
```

### Use custom check

`game.modules.get("LocknKey").api.CustomCheckHoveredLock()` ⇒ `void`

Use custom check

**Returns**: `void` 

**Example**:

```js
game.modules.get("LocknKey").api.CustomCheckHoveredLock()
```

### Use Key

`game.modules.get("LocknKey").api.UseKeyonSelectedLock()` ⇒ `void`

Use Key

**Returns**: `void` 

**Example**:

```js
game.modules.get("LocknKey").api.UseKeyonSelectedLock()
```
