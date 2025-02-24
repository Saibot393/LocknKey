## v3.2.5
- Small logic improvement for lock picking (again)

## v3.2.4
- Small logic improvement for lock picking

## v3.2.3
- Fixed tile config sizing

## v3.2.2
- Added Italien translation (thanks to [Landscape](https://github.com/LandscapeNemo))

## v3.2.1
- Updated polish translation (thanks to [Lioheart](https://github.com/Lioheart))

## v3.2.0
- Added world setting Enable Pickpocketing to enable/disable the Pick pocket feature
- Added world setting setting Default Item Pick pocket DC to set a default DC for pickpocketable items
- Improved the Key creation menu for the GM, so that it is now also possible to directly choose the keys image
- The tag `@Item` can now be used in roll formulas, for example to refer to use lock pick items
- Added world setting Use Key select dialog by default to use the Key use Dialog by default
- Added Lock setting Key use Dialog to popup a dialog on key use in which the player has to select the used key(s), usefull for puzzles
- Added a weight and items taken display to the pick pocket dialog
- Added world setting Remove Lockpick to replace the Remove Lockpick on critical fail setting, allowing for more detailed conditions
- Added world setting Default Item Pick pocket DC to set the default Item Pick pocket DC modifier
- Added world setting(s) Pick pocket item limit (critical/failure) to limit the amount of items that can be taken with the pick pocket dialog (for success/critical success/failure)
- Added world setting(s) Pick pocket item weight limit (critical/failure) to limit the items that can be taken with the pick pocket dialog by their weight (for success/critical success/failure)
- Added world setting Pick pocket cooldown to set a per user cooldown to pick pocket attempts
- The out of reach message will no longer reveal the name of tokens whos name should be hidden
- Added Set Pickpocket DC macro (thanks to [fedeicodip](https://github.com/fedeicodip))

## v3.1.11
- Tokens can no longer loot themselves
- Container items will now be deleted when looted if the quantity can't be set to 0

## v3.1.10
- Small bug fix

## v3.1.9
- Small bug fixes

## v3.1.8
- Small improvement/bug fix

## v3.1.7
- Small bug fix for system rolls, the second one

## v3.1.6
- Small bug fix for system rolls

## v3.1.5
- Updated japanese translation (thanks to [doumoku](https://github.com/doumoku))

## v3.1.4
- Compatibility fix for Tidy 5e Sheets

## v3.1.3
- Small bug fix

## v3.1.2
- Small bug fix

## v3.1.1
- Updated polish translation (thanks to [Lioheart](https://github.com/Lioheart))

## v3.1.0
- Added item setting Pick pocket DC mod to adjust the pick pocket DC per item
- Key IDs for locks can now be seperated by "&" to require mutliple keys at the same time
- Added token setting Custom loot formula to override the gloabel pick pocket formula
- Added world setting Show DCs in interaction menu to add the DCs of available checks to the interaction menu
- Added world setting Auto reset lock pick attempts to set the rule for when lock pick attempts are to be reset
- Added world setting Pick pocket crit DC threshold to set the maximum DC for pickpocketing that can be overcome by crits
- Added world setting Pick pocket item types to filter which item types can be pick pocketed
- Added world setting Loot filter to limit items that can be looted via pick pocketing to items in bags/containers called "Loot"
- Added client setting Double click to pick pocket to adjust controls
- Some bug fixes

## v3.0.6
- Fixed small bug in @skills section for roll formulas

## v3.0.5
- Updated polish translation (thanks to [Lioheart](https://github.com/Lioheart))

## v3.0.4
- Matt trigger "Tiles under Door" should now work correctly
- Cleaned up translation files

## v3.0.3
- Fixed bug that caused some clicks to not register correctly

## v3.0.2
- Fixed bug that caused chosen default sound not to be applied to new doors

## v3.0.1
- Added Portuguese Brazil translation (thanks to [Andersants](https://github.com/Andersants))

## v3.0.0
- v12 Compatibility

## v2.7.13
- Fixed bug with Item piles recognition of prototype tokens 

## v2.7.12
- Fixed error in module.json (thanks to [adracea](https://github.com/adracea))

## v2.7.11
- Added japanese translation (thanks to [doumoku](https://github.com/doumoku))

## v2.7.10
- Updated russian translation (thanks to [maragondi](https://github.com/maragondi))

## v2.7.9
- Added russian translation (thanks to [maragondi](https://github.com/maragondi))

## v2.7.8
- Added tiles a valid targets for [MATT](https://foundryvtt.com/packages/monks-active-tiles) actions and filters

## v2.7.7
- Added polish translation (thanks to [Lioheart](https://github.com/Lioheart))

## v2.7.6
- Small bug fix for free lock circumvent spell recognition

## v2.7.5
- Whenever a lock is locked via Lock & Key the attached [Puzzle Lock](https://foundryvtt.com/packages/puzzle-locks) is now also locked

## v2.7.4
- Small bug fix

## v2.7.3
- Fixed pick pocketing bug for Pf2e rules (thanks to [HaHussain](https://github.com/HaHussain))

## v2.7.2
- Fixed item piles recognition

## v2.7.1
- Improved lock tile behaviour to prevent annoying popups

## v2.7.0
- Added setting Dead tokens lootable to make all dead tokens (except item piles) lootable without having to roll

## v2.6.1
- Fixed bug that caused faulty tab to be added to MATTs tile Triggers tab
- Improved tile state switching

## v2.6.0
- Added tiles as lockable objects:
    - Tiles now have an open and a closed state and the settings "Open Image" and "Closed Image"
    - Tiles can be locked, causing their state to be locked
    - Tiles state can be toggle from the HUD
- Added setting Mention Pick Pocket details to add more informations to the pick pocket chat messages
- Pick pocketing can now trigger [Monk's Active Tile Triggers](https://foundryvtt.com/packages/monks-active-tiles)

## v2.5.4
- Compatibility update for new version of [Tidy 5e Sheet](https://foundryvtt.com/packages/tidy5e-sheet/)

## v2.5.3
- Small bug fix

## v2.5.2
- Added world setting Allow all interactions to allow even impossible actions (pick, break, custom, pickpocket)
- If only one Lock & Key setting is present it will now be displayed in Indentity tab instead of a separate tab

## v2.5.1
- The trigger tab for MATT compatibility will no longer show up in subtabs

## v2.5.0
- replaced setting Use Pf2e roll system with Use system rolls. This system now works Pf2e and DSA5e (thanks to [Plushtoast](https://github.com/Plushtoast))

## v2.4.4
- Added compatibility for [Tidy 5e rewrite](https://github.com/kgar/foundry-vtt-tidy-5e-sheets)

## v2.4.3
- Added support for DSA and SWADE
- Added option to only show items settings for specific subtypes (currently only available for DSA, will be added to other systems based on requests)

## v2.4.2
- Fixed bug with lock on close feature

## v2.4.1
- The enter key will now work in the password dialog

## v2.4.0
- Added `@skills` to roll formulas, allowing formulas to reference skills in systems where skills a saved as items (e.g. Warhammer4e, DSA5e, Stars without Number...)
- Added `@DC` to roll formulas, allowing formulas to reference the targets DC

## v2.3.3
- Fixed bug that caused item piles that were turned back into normal tokens to still be seen as item piles by Lock & Key
- Fixed bug that caused the create key action to make tokens locked even if no key was created

## v2.3.2
- The Lock & Key tab in the item sheets will no longer have symbol but be titled with the full name to be more in line with the sheet design

## v2.3.1
- Fixed Pf2e ui bug in item tabs

## v2.3.0
- Added world setting Key creation id option to show an option for the keys id in the key creation menu
- Added door lock setting Lock on close to lock this door when it is closed
- Added two macros to customise key creation (Create new key with hovered locks IDs & Create new custom key)

## v2.2.8
- Improved general system compatibility

## v2.2.7
- Added options to the identity addition api

## v2.2.6
- Added api to allow players to enter their identity (name/id of token/actor/user)

## v2.2.5
- Fixed bug that prevented pick pocketing from trigering correctly under some circumstances

## v2.2.4
- Fixed bug that prevented the GM controls from appearing in the settings

## v2.2.3
- Added default keys for Pick pocket and Change password

## v2.2.2
- Improved validation checks for change password
- Add key binding for change password (of hovered lock)

## v2.2.1
- Fixed Pf2e specific roll bug

## v2.2.0
- Added lock setting Identities to use identities (IDs and Names of Tokens/Actors/User) to unlock this lock
- Added lock setting Password changeable to allow players to change this locks password if they have a valid password (only useable with the popup-menu control sceme)

## v2.1.1
- Fixed bug that allowed GMs to accidentally lock incompatible tokens

## v2.1.0
- Added world setting Pick pocket default DC formula: to set the formula by which the default Pick Pocket DC is calculated
- Added world setting Auto update Pick Pocket DC: to set if Perception rolls should be registered and used as the new Pick Pocket DC
- Added world setting Perception key-word: to set they key-word used to recognise perception rolls
- Added macro to reset Pick Pocket DCs to default

## v2.0.12
- Replaced "Lock & Key" in tabs with abreviated version "L&K" to improve gui

## v2.0.11
- Added icons for some macros

## v2.0.10
- Error fix for previous update

## v2.0.9
- Improved compatibility with DDB Importer items

## v2.0.8
- Some small ui improvements and a bit of debug macro code

## v2.0.7
- Updated French translation (thanks to [MastaGooz](https://github.com/MastaGooz))

## v2.0.6
- Added missing translation for custom check fail popup

## v2.0.5
- Improvements for the take inventory/transfer items window and api

## v2.0.4
- Improved Pick pocketing support for Custom System Builder

## v2.0.3
- Updated French translation (thanks to [MastaGooz](https://github.com/MastaGooz))
- Added Pick pocketing support for Custom System Builder (maybe?)

## v2.0.2
- Improved MATT actions
- Added Matt action to offer the Inventory of a token to a player

## v2.0.1
- Added missing translation for custom check interaction button

## v2.0.0
- Added world setting Default lock sound to set the default sound used for Doors and lockable Tokens
- Added world setting Default key folder to set the default folder the key creation menu selects
- Added world setting Limit key folders to only show the chosen default key folder and its sub folders in the key creation menu
- Added world setting Default lock dc to set the lock dc of nely created locks
- Added world setting Default lock break dc to set the lock break dc of newly created locks
- Added world setting Custom check name to set the name of a third custom check type for circumbenting locks
- Added world setting Custom check formula to set the formula of the custom check
- Added world setting Default custom check DC to set the custom check dc of newly created locks
- Added Key Custom Check to trigger the custom check
- Added Token setting for custom check DC
- Added Token setting for additional Custom Check formula
- Added Token setting to override world Custom Check formula
- **New feature**: Pickpocketing
    - Added world setting Pick pocket formula to set the formula used for pick pocketing
    - Added world setting Pick pocket default DC to set the default DC for pick pocketing
    - Added Key to trigger Pick pocketing
    - Added Token setting Pick pocket formula to add to the world pick pocketing formula
    - Added Token setting Override Pick pocket lock formula to verride world pick pocket formula
    - Added Token setting Pick pocket DC to set the DC of pick pocket checks against this token
- Added new API (`game.modules.get("LocknKey").api`)
- Added a few example macros

## v1.12.9
- Fixed bug that prevented sheet settings from loading

## v1.12.8
- Removed some things accidentally released in the last version

## v1.12.7
- Fixed error that showed up when opening the wrold default token menu

## v1.12.6
- Fixed bug, so that only Lock & Key compatible can be locked with alt+right-click

## v1.12.5
- Fixed bug that caused the lock interaction to pop up for not lock objects

## v1.12.4
- Added missing translation string

## v1.12.3
- Added French translation (thanks to [MastaGooz](https://github.com/MastaGooz))

## v1.12.2
- Fixed controls bug with [3D Canvas](https://theripper93.com/module/levels-3d-preview) (Big thanks to [TheRipper93](https://theripper93.com/))

## v1.12.1
- Fixed faulty D&D 5e formulas
- Added new macro `Update Lock & Key world formulas`

D&d 5e users using the default Lock & Key Lock break or Lock pick formula should either use the above formula or manually enter these formulas:
- Lockpick roll formula: `1d20 + @actor.system.abilities.dex.mod + @actor.system.tools.thief.prof.flat + @actor.system.tools.thief.bonus`
- Break lock roll formula: '1d20 + @actor.system.abilities.str.mod + @actor.system.skills.ath.prof.flat'

## v1.12.0
- Added world setting Setting item types to set forwhich item types the settings tab should bbe displayed
- Added custom actions for MATT:
  - Added action Lock to lock a Door/Token
  - Added action Unlock to unlock Door/Token
  - Added action Toggle lock to toggle a Door/Token
  - Added filter Filter by lock state to filter by the lock state (locked/unlocked)

## v1.11.5
- Added crit system dependent settings
  - Added d10 crit limit setting for d10 pool >=8 and reroll on 10

## v1.11.4
- Preperation for cross compatibility with planned perceptive MATT triggers

## v1.11.3
- Added support for the Call of Cthulhu 7e system
- Added partial support for the Chronicles of Darkness 2e system

## v1.11.2
- Improved MATT integration, MATT trigered dialogs should now be displayed for the correct user
- Fixed missing translation for MATT trigger conditions

## v1.11.1
- Fixed bug that prevented set tile trigger ids to be displayed for lockable tokens

## v1.11.0
- Added Lock setting Lockpicking attempts left to limit the amount of lock pick attempts for this lock
- Added World setting Default Lock pick attempts to set with how many lock pick attempts a lock normally starts
- Added World setting Lock circumvention keywords to set keywords used to identify effects that allow players to circumvent locks (e.g. the spell "Knock")
- Added Client Setting Lock circumvention indicator position to set where in the token HUD the Lock circumvention indicator should be displayed
- Added Lock setting Can be circumvented to set wether this lock can be circumvented by certain effects (e.g. the spell "Knock")
- Added compatibility with [Monk's Active Tile Triggers](https://foundryvtt.com/packages/monks-active-tiles)
  - Adds additional Lock & Key related triggers for doors and lockable tokens (adds a new triggers tab to lockable tokens)
  - Adds a textbox to enter the tile which should be triggered for lockable tokens
  - The following landings can be optionally used to differentiate between the different Lock & Key triggers: `LockuseKey`, `LockusePasskey`, `LockusePick`, `LockuseBreak`, `LockuseFree`

## v1.10.9
- Improved compatibility with Item Piles

## v1.10.8
- Fixed bug with the success/failure detection under certain conditions
- Fixed bug that prevented item pile locks from being broken

## v1.10.7
- Bug fix to prevent error when a lock pick is removed
- Added new crit systems for Warhammer Fantasy Roleplay 4e

## v1.10.6
- Added default ids/formulas/types for D&D 3.5e

## v1.10.5
- The Lock jammed and Broke lockpick popups will no longer overlap when triggered by the same interaction
- Changed the standard Pick lock hotkey to prevent overlap with Pf2e system

## v1.10.4
- Improved compatibility with Item Piles
  - Locked containers should now correctly display their popup messages and play their sounds

## v1.10.3
- Improved compatibility with Item Piles
  - Containers will now be item pile locked/unlocked when using lock & key locking/unlocking

## v1.10.2
- Improvements for the German translation (thanks to [gsterling](https://github.com/gsterling))

## v1.10.1
- Improved compatibility with Item Piles
  - Containers and Vaults should now be lockable
  - Containers locked by Item Piles will now be automatically unlocked when unlocked with Lock & Key
- Fixed small translation error

## v1.10.0
- Added Item setting Replacement items to set items that get consumed instead of this item when a roll fails
- Improved crit calculation for the Pf2e crit system

## v1.9.13
- Small bug fix

## v1.9.12
- Added additional IDs of lock pick items for Pf2e (thanks to [ottyn](https://github.com/Saibot393/LocknKey/issues/created_by/ottyn))
  - will only be added when using the system defaults ("") or resetting the settings
  - Updated IDs: zvLyCVD8g2PdHJAc;6nrCxNQFycUVFOV2;Ejmv9IHGp9Ad9dgu;QnuL1UEot8ptWNb1;spqcRLBsMOC9WTcd;fprUZviW8khm2BLo;AFE073UYI0mkWuUs

## v1.9.11
- The tab bar of token settings should be less likely to overflow when multiple modules add tabs

## v1.9.10
- Updated the Chinese translation (thanks to Thousand (_thousand@Discord))

## v1.9.9
- Improved arms reach integration

## v1.9.8
- Fixed bug with Pf2e roll integration
- Fixed critical result identification bug

## v1.9.7
- Wall settings will now appear in their own tab and the settings sheet will fit on your screen again

## v1.9.6
- Improved visual compatibility with modules like Tidy5e sheets (Thanks to [Ikabodo](https://github.com/Ikabodo))
- Added support for the [Perceptive](https://foundryvtt.com/packages/perceptive) module
  - A "Peek lock" option will be added to the lock interaction menu

## v1.9.5
- Fixed bug for v10 regarding left clicking doors

## v1.9.4
- Improved Item Piles integration
  - There is a small chance, that previously locked item piles will not unlock correctly, in this case:
    - Click configure at the top border of the character sheet of the item pile
    - Check the "Enabled" option
    - Update document
  - or select the token and execute this macro:
    - canvas.tokens.controlled[0].document.setFlag("item-piles", "data.enabled", true)
   
## v1.9.3
- Fixed libwrapper warning with Monks enhanced journals

## v1.9.2
- Some bug fixes for v10 and the Sandbox system

## v1.9.1
- Fixed bug in relation to lockpick items in the Sandbox module
- Added "no matching key" popup
- Lock interaction popup will now only show up if the interacting token is within interaction range
- Added option Show all lock interactions to show even unavailable options the interaction popup
  - Impossible interaction options (if for example a DC is set to -1) will no longer show up in the popup

## v1.9.0
- Added Control Keys for Lock interactions (for both GM and player controls)
- Added client setting Control sceme to either use the standard controls to interact with doors or to get a pop up when right-clicking a lock
- Added world setting Key creation menu to create a menu when creating a new key, allowing the GM to choose the name and folder of the new item
- Added world setting Key name as ID to use the keys name as an additional ID when interacting with locks
- Added world setting Mention lockpick item to give additional information in the chat regarding the used item when picking a lock
- Added lock setting Special lockpick to set a special lockpick required to pick this lock
- Fixed bug/improved compatibility for the Sandbox system

## v1.8.2
- Added support for the Sandbox system

## v1.8.1
- Updated  translation (thanks to [feederze](https://github.com/feederze))
  
## v1.8.0
- Added Lock jamming
  - World settings:
    - Jam lock on critical lockpick fail to automatically set locks as jammed
    - Keys can't be used on jammed locks to prevent matching keys from being used on jammed locks
  - Lock settings:
    - Jammed to set this lock as jammed preventing it from being picked

## v1.7.1
- Small fix for Item-Piles compatibility

## v1.7.0
- Added Macros for player and GM actions
- Added Lock setting Custom Popups to set custom Popup messages for certain player actions
- Added Token Lock setting Lock Sound to set the sound set used for interactions with this lock

## v1.6.2
- Added Chinese translation (thanks to [feederze](https://github.com/feederze))
- Fixed a few translations bugs/typos (thanks to [cadowtin](https://github.com/cadowtin))

## v1.6.1
- Fixed a few UI bugs

## v1.6.0
- Improved Pf2e integration (thanks to [cadowtin](https://github.com/cadowtin))
  - New setting Use Pf2e roll system to use the Pf2e system instead of the Lock & Key roll and crit settings
  - Should be fully compatible with the Pf2e rules system
- Added Multi-success during combat only to disablerequired multi success outside of combat
- Added quantity check for Lockpicks (in most systems, some systems are weird)

## v1.5.0
- Added passwords for locks
- Removed "Not a lock" message to reduce unnecessary popups

## v1.4.1
- Several small bug fixes and improvements

## v1.4.0
- Improved behaviour when a player tries to interact with a object that is not a lock or a lock that is out of reach
- Added Critical rolls world setting
  - No crits to disable crits
  - Nat crits to crit on a nat 1 or nat 20
  - Nat crit & +-10 to crit on a not 1, nat 20 or 10 below or above the dc
- Added Lock pick successes required setting to locks
  - Before a lock can be locked/unlocked this many successes have to be accumulated
  - Crits will count as two successes
  - Also shows the GM how many successes have already been accumulated and allows GMs to change this number
- Added World setting Remove Lockpick on critical fail
- Added Key setting Remove on use to remove the key on use (or reduce the stack by one)
- Fixed some Token sheet UI bugs

## v1.3.0
- Added Lockable setting to doors (doors are still lockable by GM, independent of this setting)
- Improved Lockpicking
  - World setting Lockpick item now allows for multiple item names/IDs
  - Added on token/item Lockpick formula setting which will be added to Lockpick rolls
  - Added Lockpick formula override setting to tokens, which will override the worlds Lockpick formula instead of appending it
  - Added Lockpick formula override setting to items, which will override the worlds and the tokens Lockpick formula instead of appending it
- Added Lockbreacking
  - Player can attempt to break locks by alt+rightclicking them
  - Added World setting to break locks on lock break action (lock can only be locked by gm)
  - Added World setting Lockbreak roll formula
  - Added on token/item Lockbreak formula setting which will be added to Lockpick rolls
  - Added Lockbreak formula override setting to tokens, which will override the worlds Lockpick formula instead of appending it
  - Added Lockbreak formula override setting to items, which will override the worlds and the tokens Lockpick formula instead of appending it
- Lock settings will only show up in lockable tokens
- Fixed bug in Item sheets, that caused tab to reset upon data update
- Fixed bug that caused popups not to show up for doors

## v1.2.2
- Improved Arms reach integration
- Included item support for Cyberpunk Red (thanks to [diwako](https://github.com/diwako))

## v1.2.1
- Improved compatibility (other developers should now be able to easily interface with the module)
- Added chatmessage for lock pick success/fail
- fixed bug where item setting did not show up correctly in some cases
- fixed buug where under some cases locked tokens did not behave correctly
- several small bug fixes

## v1.2.0
- Compatibility with Rideable
- Generell improvements

## v1.1.0
- Added lockpicking
  - Locks now have a lockpick dc setting
  - New World setting: Lockpick item
  - New World setting: Lockpick formula
  - Player can try to shift+right-click a start an attempt at picking it (starts Lockpick formula)
  - Popups, sounds, chat messages for lockpicking
- Fixed small bug where changes in an ItemPile sheet were not synched correctly

A wrongly named file prevented some users from installing v1.0.0. This bug was "stealth" fixed in v1.0.0.

## v1.0.0
First release on Foundry
