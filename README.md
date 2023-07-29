# Lock & Key

 A Foundry VTT module to handle locking and unlocking of doors and tokens

### Basic use:

A GM can shift+right-click doors and loot containers (PF2e or Item Piles) to create a new key for them in the item sections. Every player that has a key in their inventory can lock or unlock matching doors and tokens with a right-click. Locked tokens can not be looted. Players can attempt to pick a lock by shift+right-clicking a lock and try to break a lock by alt+right-clicking it.

#### GM controls

A GM can alt+right-click lockable tokens to lock or unlock them.

The key IDs of doors, tokens and keys can be copied and pasted into one another to connect them. To copy or paste a keys IDs right click it in the item section and choose one of the options from the context menu. To copy a tokens or doors IDs ctrl+right-click them and to paste them ctrl+left-click them.

##### Examples:

- I. Copy Door A's key IDs and paste them into Loot Token B (or vice versa). All keys that can unlock/lock Door A can now also unlock/lock Loot Token B (or vice versa).
- II. Copy Door A's key IDs and paste them into Key B (or vice versa). Key B can now unlock/lock Door A.
- III. Copy Key A's key IDs and paste them into Key B. All doors that can be opened by Key A can now also be opened by Key B (but not the other way around).

### Settings:

#### World:
- Use GM controlls: to enable/disable the controls above
- Allow player locking: to allow players to also lock doors/tokens for which they have a matching key
- Start as locked: if new lockable objects should start as locked
- Lock distance: the maximum distance from which a lock can be used
- Alway open owned: to allow players to open their owned tokens, even if they are locked
- Prevent key use while paused: to prevent players from using locks while the game is paused
- Type of key items: to change the item type of newly created keys
- Crit system: to change the way crits are calculated (support Nat1/20 and Pf2e system)
- Lockpick items: name or compendium id of the item used to pick locks
- Remove Lockpick on critical fail: to remove Lockpick item on critical failures
- Lockpick roll formula: the dice formula used for lockpick rolls
- Break lock roll formula: the dice formula used for break lock rolls
- Make broken locks unlockable: to prevent locks from being locked once they are broken
#### Client:
- Message popups: to activate some popups on certain actions
- Play lock sounds: to activate sounds when tokens are locked/unlocked
#### Keys(separate tab):
- ID keys: IDs which this key can lock/unlock seperated with ";". You can add any string of characters to this list.
- Remove key on use: to remove the key once it has been used (or reduce the stack by one)
#### Walls/Lockable Tokens(separate tab):
- Lockable: if this token can be locked
- [Token only] Locked: if this token is locked
- ID keys: IDs which this key can lock/unlock seperated with ";". You can add any string of characters to this list.
- Lock DC: the difficulty class of a lock, used for lockpicking
- Lock break DC: the difficulty class to break a lock
- Required Lockpicking successes: to set how many successes are necessary to pick this lock (crits count as 2)
#### Tokens/Items:
- Lockpick formula: an additional formula added to lockpicking rolls (for items only the best formula in the inventory is used)
- Override Lockpick formula: to override the standard formula for this token/the owner
- Break lock formula: an additional formula added to break lock rolls (for items only the best formula in the inventory is used)
- Override Break lock formula: to override the standard formula for this token/the owner

### Compatibility:

The module should be compatible with most game systems on Foundry v10 and v11, though a few features are only available for the Pf2e system or in combination with other modules. If you encounter any bugs please [let me know](https://github.com/Saibot393/LocknKey/issues). I am also happy to add further game systems. ([Issues](https://github.com/Saibot393/LocknKey/blob/main/ISSUES.md) can give you additional informations)

#### Explicit compatability:
- [Item Piles](https://foundryvtt.com/packages/item-piles):
  - The module allow item piles to be locked, strongly recommended for additional features if you do not use Pf2e
- [Rideable](https://foundryvtt.com/packages/rideable):
  - Has to be activated in the Rideable settings
  - Rideable tokens are lockeable
  - Locked tokens can not be mounted or unmounted
- [FoundryVTT Arms Reach](https://foundryvtt.com/packages/foundryvtt-arms-reach)/[Arms Reach](https://foundryvtt.com/packages/arms-reach):
  - Additional setting "Use Arms Reach distance": to use the "Arms Reach" distance instead of the set Mounting distance
- [libWrapper](https://foundryvtt.com/packages/lib-wrapper/):
  - Improves compatibility with other modules, strongly recommended

### Languages:

The module contains an English and a German translation. If you want additional languages to be supported [let me know](https://github.com/Saibot393/Rideable/issues).

---

**If you have suggestions, questions, or requests for additional features please [let me know](https://github.com/Saibot393/Rideable/issues).**
