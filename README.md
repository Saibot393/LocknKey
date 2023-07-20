# Lock & Key

 A Foundry VTT module to handle locking and unlocking of doors and tokens

### Basic use:

A GM can shift+right-click doors and loot containers (PF2e or Item Piles) to create a new key for them in the item sections. Every player that has a key in their inventory can lock or unlock matching doors and tokens with a right-click. Locked tokens can not be looted.

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
#### Client:
- Message popups: to activate some popups on certain actions

### Compatibility:

The module should be compatible with most game systems on Foundry v10 and v11, though a few features are only available for the Pf2e system or in combination with other modules. If you encounter any bugs please [let me know](https://github.com/Saibot393/LocknKey/issues). I am also happy to add further game systems, just let me know. 

#### Explicit compatability:
- [Item Piles](https://foundryvtt.com/packages/item-piles):
  - The module allow item piles to be locked
- [FoundryVTT Arms Reach](https://foundryvtt.com/packages/foundryvtt-arms-reach)/[Arms Reach](https://foundryvtt.com/packages/arms-reach):
  - Additional setting "Use Arms Reach distance": to use the "Arms Reach" distance instead of the set Mounting distance

### Languages:

The module contains an English and a German translation

---

**If you have suggestions, questions, or requests for additional features please [let me know](https://github.com/Saibot393/Rideable/issues).**
