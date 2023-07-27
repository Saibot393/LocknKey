## v1.3.0 (unreleased)
- Fixed bug in Item sheets, that caused tab to reset upon data update
- World setting Lockpick item now allows for multiple item names/IDs
- Added on token/item Lockpick formula which will be added to Lockpick rolls
- Added Lockpick formula override to tokens, which will override the worlds Lockpick formula instead of appending it
- Added Lockpick formula override to items, which will override the worlds and the tokens Lockpick formula instead of appending it

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
