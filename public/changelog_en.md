### 1.5.0 - 15 December 2022 
***

#### New
 * GiantBomb Api import added
 * Added checking of new added Apis missing for logged in user
 * Event notification in Avatar bell, with drop-down menu to view events. Currently only those occurring on the current day
 * New Video Games template added to the collection creation, with metadata embedded.

#### Fixed
 * Changed API Logic of obtaining Feeds, now it should be faster and more flexible for multiple RSS Feeds
 * Fixed searching for items with space in the name in the PokemonTCG API.

### 1.4.2 - 9 December 2022 
***

#### New
 * Star Wars Api import added
 * Gijoe Api import added
 * TMNT Api import added

### 1.4.1 - 8 December 2022 
***

#### New
 * MOTU Api import added
 * Duplicate item checking before import item from scrapper

### 1.4.0 - 2 December 2022 
***

#### New
 * Version checker for latest version installed or not in Settings->Updates and Top Bar with Red ribbon
 * DC Multiverse Api import added
 * Added CSV import support

#### Fixed
 * Fixed acquisition date parsing error when importing data from a CSV file
 * Removed next button when finishing all import steps from CSV before starting the import
 * When a series is deleted, all objects that had that series are defaulted to a Default series.
 * When an object is deleted, if there are no more objects with that series, the series is also deleted.
 * When an object is deleted, the list of objects on the screen is updated with the new data.

### 1.3.0 - 1 December 2022 
***

#### New
 * Possibility to import objects as owned when added from an Api or Web
 * Hot Wheels Api import added
 * Metadata import when importing objects from Api or Web

#### Fixed
 * Responsive screens for tablets resolutions
 * Added Tick icon or Cross icon for boolean metadata types in item collections display

### 1.2.0 - 25 November 2022 
***

#### New
 * Marvel Legends Api import added

#### Fixed
 * Empty search string when importing from collections API error fixed
 * Price validation in edit and insert item fixed


### 1.1.0 - 20 November 2022 
***

#### New
 * Responsive screens in Series, Images, Collections, Apis and Dashboard

#### Fixed
 * Recurrent searching for items in Apis without selecting again a new Api.
 

### 1.0.1 - 3 November 2022 
***

#### Fixed
 * Edit items with metadata, find by id was String instead Long
 * Metadata fields of type Boolean fixed. Now checked appears when value is 1 or true.



### 1.0.0 - 30 October 2022 
***

#### New
 * Collection CRUD
 * Series CRUD
 * Images CRUD
 * Control of the collections, both the cost and the number of elements held
 * Importing of collection items from CSV files or from a zero template
 * Custom fields, in addition to the default ones already created in each collection
 * Dashboard cards to display spents, most expensive items, number of collections, number of items, recent acquisitions and so on..
 * Feed viewer
 * Api integration for importing items (By the moment, only Pokemon TCG and Rebrickable)
 * Calendar for event management for future releases or shopping
 * Theme Creation