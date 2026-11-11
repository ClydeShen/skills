# Azure has no region marker, so one rule places its region

Date: 2026-11-10. Status: implemented candidate change; baseline comparison required.

## Finding

Two clean runs of the Azure document Q&A scenario drew its region differently. One drew a text-only "Region: westeurope" outline inside a Microsoft Azure boundary. The other folded the region into a centred "Microsoft Azure, region westeurope" title. The owner asked for one rule, with every boundary title in the same place, and asked whether the Microsoft Azure mark could label a region. [measured]

- AWS publishes two native boundary styles with different corner icons: AWS Cloud and Region. Azure publishes neither. The pinned draw.io Azure library, which follows the official Azure icon set, has 99 general icons and no region icon or Azure mark. `Region Management` is a management-feature icon, not a region marker. [measured catalog]
- The Azure icon terms permit the icons in architecture diagrams and documentation. They ask for icons used "as they would appear within Azure" to show how products work together, and forbid cropping, distortion and representing another product. They do not mention regions. [official, MicrosoftDocs source dated 2026-07-09]
- Microsoft's general trademark guidelines require an express licence for logos and product icons, while names may be used truthfully. They do not address technical diagrams. [official]
- The package's Microsoft Azure mark comes from `@thesvg/icons` 4.0.0. It means "this is Azure", which matches the AWS Cloud level, not the Region level. Putting it on regions would make several regions read as several clouds. Its permission status remains open in [the rights research](./0003-bundled-icon-rights-need-explicit-notices.md); this rule adds no new use of it.

## Rule

- The Microsoft Azure mark labels only the cloud level. With one region, draw one outline: the Microsoft Azure boundary with the region in its title. Draw a separate text-only region outline only for two or more regions, or for an Azure element that must sit outside the region.
- Every boundary title sits inside the outline at the top left. A boundary with a corner icon starts its title beside it. A boundary without one starts at the same corner. `find-icon.mjs --boundary` returns the text-only style when no identity is given, and the layout check reports a title placed anywhere else as an error.

## Not verified

learn.microsoft.com and the official icon download were blocked by this environment's network policy. Two things remain unchecked: the Well-Architected "Architecture design diagrams" page, and whether the official icon package includes an Azure logo file. The icons page describes the package as including "Azure logo files". If it does, the official file should replace the `@thesvg/icons` source.

## Sources

- [Azure icons page source](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/icons/index.md), read on 2026-11-10.
- [Microsoft trademark and brand guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general), read on 2026-11-10.
- Local pinned catalog: `incubator/architecture-diagram/candidate/architecture-diagram/assets/catalog.json`.
