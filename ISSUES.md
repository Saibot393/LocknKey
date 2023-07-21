## Compatibility issues

### UI
Some game system structure their item UI somehwat strange and therefore require extra care when adding the Lock & Key tab. Should you encounter a bug where the tab is not visible or does not have any content, please [open an issue](https://github.com/Saibot393/LocknKey/issues) and let me know which game system causes the issue.

### Key items

#### Key does not generate or has strange item type
All game system use different item types. While the module tries to find an appropriate type for for keys some systems may slip through. If you cannot generate valid keys or you think keys should be another item type please [open an issue](https://github.com/Saibot393/LocknKey/issues) and let me know which game system you are using and, if possible, let me know which item type you would say would be the best fit for keys. For the mean time you may also remedy the problem by changing the item type in the settings (Type of key item).

#### Keys do not work
Please check if the key has stacked with another key in the characters inventory. If keys are stacked they may loose some or all key IDs rendering them useless. This behaviour is strongly system dependent and i have so far not found any solutions. Should any system behave extraordinarily strange in this regard or should the key not work even though it is not stacked please [open an issue](https://github.com/Saibot393/LocknKey/issues).

### Other
Should you encounter any other issues please [let me know](https://github.com/Saibot393/LocknKey/issues)
