# Lock and Key API Documentation

The api is reachable from the variable `game.modules.get('LocknKey').api`.

### The documentation can be out of sync with the API code checkout the code if you want to dig up [API CODE](../scripts/compatibility/APIHandler.js)

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
| [pItemInfos.customHeader] | `string`             |  null  | The custom header |
| [pItemInfos.TakerID]      | `string`             |  null  | The taker id is the game user id of the taker |


**Example**:

```js
 game.modules.get("LocknKey").api.openTIWindowfor(game.user.id, fromUuidSync("Scene.JMHvCf1X886hEmtu.Token.g3XNCCgjGs9H445R"),{});
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

## Check Actor/Tokens Compatibility

`game.modules.get("LocknKey").api.CheckActorPTokensCompatibility()` ⇒ `Promise<void>`

Method for checks the prototype tokens of all actors for LnK compatibility and sets the lockability of incomaptible ones to false

**Returns**: `Promise<void>` 

**Example**:

```js
game.modules.get("LocknKey").api.CheckActorPTokensCompatibility()
```
