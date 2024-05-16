# Lock & Key

 A Foundry VTT module to handle locking and unlocking of doors and tokens

### Basic use:

A GM can shift+right-click doors and loot containers (PF2e or Item Piles) to create a new key for them in the item sections. Every player that has a key in their inventory can lock or unlock matching doors and tokens with a right-click. If a lock has a password, an appropriate prompt to enter said password can be triggered by right-clicking the lock. Locked tokens can not be looted. Players can attempt to pick a lock by shift+right-clicking a lock and try to break a lock by alt+right-clicking it.

A tutorial for some of the features can be found [here](https://youtu.be/HO_-sb4wSHQ).

Since v2.0.0 Lock & Key can also handle **Pickpocketing!**
 
#### GM controls

A GM can alt+right-click lockable tokens to lock or unlock them.

The key IDs of doors, tokens and keys can be copied and pasted into one another to connect them. To copy or paste a keys IDs right click it in the item section and choose one of the options from the context menu. To copy a tokens or doors IDs ctrl+right-click them and to paste them ctrl+left-click them.

All of these controlls can also be achieved through the included macros.
##### Examples:

- I. Copy Door A's key IDs and paste them into Loot Token B (or vice versa). All keys that can unlock/lock Door A can now also unlock/lock Loot Token B (or vice versa).
- II. Copy Door A's key IDs and paste them into Key B (or vice versa). Key B can now unlock/lock Door A.
- III. Copy Key A's key IDs and paste them into Key B. All doors that can be opened by Key A can now also be opened by Key B (but not the other way around).

All player and GM controls also have corresponding key binds.

### API

The module come with some api method you can check out here [API](./wiki/api.md)

### Settings:

#### World:
- Use GM controlls: to enable/disable the controls above
- Allow player locking: to allow players to also lock doors/tokens for which they have a matching key
- Start as locked: if new lockable objects should start as locked
- Lock distance: the maximum distance from which a lock can be used
- Default lock sound: to set the default sound used for Doors and lockable Tokens
- Alway open owned: to allow players to open their owned tokens, even if they are locked
- Allow all interactions: to allow even impossible actions (pick, break, custom, pickpocket)
- Show all lock interactions to show even unavailable options in the interaction popup
- Prevent key use while paused: to prevent players from using locks while the game is paused
- Type of key items: to change the item type of newly created keys
- Setting item types: to set forwhich item types the settings tab should be displayed
- Key creation menu: to create a menu when creating a new key, allowing the GM to choose the name and folder of the new item
- Key creation id option: to show an option for the keys id in the key creation menu
- Default key folder: to set the default folder the key creation menu selects
- Limit key folders: to only show the chosen default key folder and its sub folders in the key creation menu
- Key name as ID: to use the keys name as an additional ID when interacting with locks
- Use system rolls[only Pf2e and DSA5e]: to use the systems roll rules instead of the Lock & Key roll and crit settings
- Crit system: to change the way crits are calculated (supports Nat1/20 and Pf2e system)
- Lockpick items: name or compendium id of the item used to pick locks
- Mention lockpick item: to give additional information in the chat regarding the used item when picking a lock
- Remove Lockpick on critical fail: to remove Lockpick item on critical failures
- Jam lock on critical lockpick fail: to automatically set locks as jammed
- Keys can't be used on jammed locks: to prevent matching keys from being used on jammed locks
- Default Lock pick attempts to set with how many lock pick attempts a lock normally starts
- Lockpick roll formula: the dice formula used for lockpick rolls
- Default lock dc: to set the lock dc of nely created locks
- Break lock roll formula: the dice formula used for break lock rolls
- Default lock break dc: to set the lock break dc of newly created locks
- Custom check name: to set the name of a third custom check type for circumventing locks
- Custom check formula: to set the formula of the custom check
- Default custom check DC: to set the custom check dc of newly created locks
- Make broken locks unlockable: to prevent locks from being locked once they are broken
- Multi-success during combat only: to disable required multi success outside of combat
- Lock circumvention keywords to set keywords used to identify effects that allow players to circumvent locks (e.g. the spell "Knock")
- Pick pocket formula to set the formula used for pick pocketing
- Pick pocket default DC to set the default DC for pick pocketing
- Pick pocket default DC formula: to set the formula by which the default Pick Pocket DC is calculated
- Auto update Pick Pocket DC: to set if Perception rolls should be registered and used as the new Pick Pocket DC
- Mention Pick Pocket details: to add more informations to the pick pocket chat messages
- Dead tokens lootable: to make all dead tokens (except item piles) lootable without having to roll
- Perception key-word: to set they key-word used to recognise perception rolls
#### Client:
- Control sceme: to either use the standard controls to interact with doors or to get a pop up when right-clicking a lock
- Message popups: to activate some popups on certain actions
- Play lock sounds: to activate sounds when tokens are locked/unlocked
- Lock circumvention indicator position: to set where in the token HUD the Lock circumvention indicator should be displayed
#### Keys(separate tab):
- ID keys: IDs which this key can lock/unlock seperated with ";". You can add any string of characters to this list.
- Remove key on use: to remove the key once it has been used (or reduce the stack by one)
#### Walls/Lockable Tokens/Tiles(separate tab):
- Open Image[Tiles only]: the image for the open state
- Closed Image[Tiles only]: the image for the closed state
- Lockable: if this token can be locked
- Lock on close[Wall only]: to lock this door when it is closed
- [Token only] Locked: if this token is locked
- ID keys: IDs which this key can lock/unlock seperated with ";". You can add any string of characters to this list.
- Password: to set one or more passwords seperated with ";" to unlock (or lock) this door
- Password changeable: to allow players to change this locks password if they have a valid password (only useable with the popup-menu control sceme)
- Identities: to use identities (IDs and Names of Tokens/Actors/User) to unlock this lock
- Jammed: to set this lock as jammed preventing it from being picked
- Lock DC: the difficulty class of a lock, used for lockpicking
- Special lockpick: to set a special lockpick required to pick this lock
- Lock break DC: the difficulty class to break a lock
- Setting for custom check DC
- Required Lockpicking successes: to set how many successes are necessary to pick this lock (crits count as 2)
- Custom Popups: to set custom Popup messages for certain player actions
- Lock Sound [Token only]:to set the sound set used for interactions with this lock
- Lockpicking attempts left: to limit the amount of lock pick attempts for this lock
- Can be circumvented: to set wether this lock can be circumvented by certain effects (e.g. the spell "Knock")
#### Tokens/Items:
- Lockpick formula: an additional formula added to lockpicking rolls (for items only the best formula in the inventory is used)
- Override Lockpick formula: to override the standard formula for this token/the owner
- Break lock formula: an additional formula added to break lock rolls (for items only the best formula in the inventory is used)
- Override Break lock formula: to override the standard formula for this token/the owner
- Setting for additional Custom Check formula
- Setting to override world Custom Check formula
- Pick pocket formula to add to the world pick pocketing formula
- Override Pick pocket lock formula to verride world pick pocket formula
- Replacement items[Items only]: to set items that get consumed instead of this item when a roll fails
- Pick pocket DC[Tokens only]: to set the DC of pick pocket checks against this token

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
- [Perceptive](https://foundryvtt.com/packages/perceptive):
  - A "Peek lock" option will be added to the lock interaction menu
- [libWrapper](https://foundryvtt.com/packages/lib-wrapper/):
  - Improves compatibility with other modules, strongly recommended
- [Monk's Active Tile Triggers](https://foundryvtt.com/packages/monks-active-tiles)
  - Adds additional Lock & Key related triggers for doors and lockable tokens (adds a new triggers tab to lockable tokens)
  - Adds a textbox to enter the tile which should be triggered for lockable tokens
  - The following landings can be optionally used to differentiate between the different Lock & Key triggers: `LockuseKey`, `LockusePasskey`, `LockusePick`, `LockuseBreak`, `LockuseFree`
  - Adds additional Actions & Filters:
    - Action Lock to lock a Door/Token
    - Action Unlock to unlock Door/Token
    - Action Toggle lock to toggle a Door/Token
    - Action Loot inventory to offer the Inventory of a token to a player
    - Filter Filter by lock state to filter by the lock state (locked/unlocked)
 - [Tidy 5e rewrite](https://github.com/kgar/foundry-vtt-tidy-5e-sheets)
   - The item settings will appear correctly

### Languages:

The module contains an English, a German, a Chinese (thanks to [feederze](https://github.com/feederze) and Thousand (_thousand@Discord)), a French (thanks to [MastaGooz](https://github.com/MastaGooz)), a Polish (thanks to [Lioheart](https://github.com/Lioheart)), a Russian (thanks to [maragondi](https://github.com/maragondi)), and a Japanese(thanks to [doumoku](https://github.com/doumoku)) translation. If you want additional languages to be supported [let me know](https://github.com/Saibot393/LocknKey/issues).

---

**If you have suggestions, questions, or requests for additional features please [let me know](https://github.com/Saibot393/LocknKey/issues).**
