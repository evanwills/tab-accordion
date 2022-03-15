# `tab-accordion` & `tab-accordion-group`

* [Indroduction](#introduction)
* [tab-accordion](#tab-accordion)
  * [Attributes](#tab-accordion-attributes)
  * [Internal state](#tab-accordion-internal-state)
  * [CSS custom properties _(CSS variables)_](#tab-accordion-css-custom-properties-css-variables)
* [tab-accordion-group](#tab-accordion-group)
  * [Attributes](#tab-accordion-group-attributes)
  * [Internal state](#tab-accordion-group-internal-state)
  * [CSS custom properties _(CSS variables)_](#tab-accordion-group-css-custom-properties-css-variables)

## Introduction 

`<tab-accordion></tab-accordion>` is a simple accessible accordion 
component. It can be used as is, but it's real power comes when it's
nested withing a `<tab-accordion-group></tab-accordion-group>` where 
it becomes a simple responsive and accessible tab/accordion group.

Both custom elements are designed to be highly stylable. And are 
(hopefully) WCAG2.0 AAA compliant.

> TODO:
> 1. Implement WAI-ARIA attibutes to make fully accessible.
> 2. Fix rendering issue when multipe tabs-accordion-group blocks
>    are in tab-mode on the same page.

----
## `tab-accordion`

In it's simplest form, is just a wrapper for a heading and some content.

If the heading has a `slot` attribute with the value `title`, the contents of the heading will be used as the heading for the accordion. The title will also be used as the tab button text (when used in `tab-accordion-group`)

The rest of the contents 

```html
<tab-accordion>
    <h1 slot="title" class="tab-accordion__head">System information</h1>
    <p>Application version: 0.1.0</p>
    <p>App name: My application</p>
</tab-accordion>
```

### `tab-accordion` Attributes

#### **`tablabel`** _{string}_ 

> default: `""` (_empty string_)

`tablabel` Tab label is used for the tab button text (when in tab 
mode). It is also used as the heading for the accordion if no heading with `slot="title"` could be found.

If `tablabel` attribute is NOT found, the heading is used as the tablabel.

#### **`hidetabtitle`** _{boolean}_ 

> default: `FALSE`

Whether or not to hide the tab/accordion title in tab mode.

> __NOTE:__ When nested within `tab-accordion-group` this value is
>           inherited from the parent `tab-accordion-group`

#### **`open`** _{boolean}_

> default: `FALSE`

Whether or not tab/accordion content area is currently open.

#### **`single`** _{boolean}_ 

> default: `FALSE`

Whether or not this tab/accordion is part of a single open group. (i.e. only one accordion in the group can be open at a time.)

Used to modify the styling of the accordion title when in single
tab/accordion group is in single open mode.

> __NOTE:__ When nested within `tab-accordion-group` this value will 
>           be set by the parent `tab-accordion-group`

#### **`mintabrems`** _{number}_ 

> default: `48`

The minimum width of the screen (in REMs) needs to be before 
the accordion goes into tab view.
 
Used to show/hide the tab title when `hidetabtitle` is true and in
tab-accordion is rendered in tab mode.

> __NOTE:__ When nested within `tab-accordion-group` this value is
>           inherited from the parent `tab-accordion-group`.

#### **`hlevel`** _{number}_ 

default: `2`

The heading level to use for the title of the tab-accordion. This should be set by the heading (`slot="title"`) of the tab-accordion.

### `tab-accordion` Internal state

#### **`doInit`** _{boolean}_ 

> default: `true` (but automatically changes to `false` as during 
>                 the first render)

`doInit` is used to force the component to reinitialise. This should only be modified externally if new content is added or the entire contents of the `<tab-accordion>` element is replaced.

#### **`tabtitle`** _{string}_ 

> default: `""` (_empty string_)

`tabTitle` is derived from the heading (`slot="title"`) of the tab-accordion. It should not be set manually

### `tab-accordion` CSS custom properties _(CSS variables)_

By defining the following CSS Custom Properties in your own style sheet you can give the `tab-accordion` element your own style.

#### __Main component__

|    CSS custom property name    |             Value             |
|--------------------------------|-------------------------------|
| --TA-background-color          | `inherit`                     |
| --TA-border                    | `none`                        |
| --TA-padding                   | `0`                           |
| --TA-margin                    | `0.5rem 0`                    |

#### __Content area__

|    CSS custom property name    |             Value             |
|--------------------------------|-------------------------------|
| --TA-content--background-color | `inherit`                     |
| --TA-content--border           | `none`                        |
| --TA-content--padding          | `0`                           |
| --TA-content--margin           | `0`                           |

#### __Heading__
|    CSS custom property name    |             Value             |
|--------------------------------|-------------------------------|
| --TA-head--color               | `#00c`                        |
| --TA-head--color-hover         | `#00f`                        |
| --TA-head--color-disabled      | `#000`                        |
| --TA-head--decoration          | `none`                        |
| --TA-head--decoration-hover    | `underline`                   |
| --TA-head--decoration-disabled | `none`                        |
| --TA-head--font-family         | `Arial, helvetica, san-serif` |
| --TA-head--font-size           | `1.25rem`                     |
| --TA-head--margin              | `0`                           |
| --TA-head--padding             | `0.3rem 0 0.3rem 1.5rem`      |
| --TA-head--transform           | `none`                        |
| --TA-head--cursor-disabled     | `text`                        |


#### __Open/close indicator icon__
|    CSS custom property name    |             Value             |
|--------------------------------|-------------------------------|
| --TA-oc-icon                   | `"▾"`                         |
| --TA-oc-icon--font-family      | `inherit`                     |
| --TA-oc-icon--font-size        | `2rem`                        |
| --TA-oc-icon--color            | `inherit`                     |
| --TA-oc-icon--top              | `0.6rem`                      |
| --TA-oc-icon--right            | `auto`                        |
| --TA-oc-icon--bottom           | `auto`                        |
| --TA-oc-icon--left             | `-0.5rem`                     |
| --TA-oc-icon--line-height      | `1rem`                        |
| --TA-oc-icon--transition       | `transform ease-in-out 0.3s`  |
| --TA-oc-icon--transform-origin | `50% 40%`                     |
| --TA-oc-icon--transform--open  | `rotate(180deg)`              |

----

## `tab-accordion-group`

`tab-accordion-group` provides all the magic for tab-accordion. By default the cut-over point from accordion view to tab view is 48rem (768px).

```html
<tab-accordion-group>
    <tab-accordion tablabel="System">
        <h1 slot="title" class="tab-accordion__head">System information</h1>
        <p>Application version: 0.1.0</p>
        <p>App name: My application</p>
    </tab-accordion>
    <tab-accordion>
        <h1 slot="title" class="tab-accordion__head">Users</h1>
        <p>Total users: 34</p>
        <p>Currently active users: 10</p>
    </tab-accordion>
</tab-accordion-group>
```

### `tab-accordion-group` Attributes

#### **`mode`** _{number}_ 

> default: `1`

How tab/accordion should be displayed

Options are:
1. Responsive tab/accordion _[default]_
2. Always accordion (only one accordion item open at a time)
3. Always accordion (many accordion items can be open at one time)

#### **`mintabrems`** _{number}_

> default: `48`

The number of REMs wide the page needs to be before the layout
switches from Accordion view to Tabs view.

This is used in a media query:

```css
@media screen and (min-width: ${minTabRems}rem) {
    ...
}
```

> __NOTE:__ This is only used when `mode` is equal to `1`

> __NOTE ALSO:__ This value is always passed to all child 
>           `tab-accordion` items, overriding the `mintabrems` 
>           that may have been set on those elements.


#### **`hidetabtitle`** _{boolean}_

> default: `FALSE`

Whether or not to hide the tab/accordion title in tab mode.

> __NOTE:__ This value is automatically applied to child 
>           `tab-accordion` elements

#### **`hideopenclose`** _{boolean}_

> default: `FALSE`

Whether or not show an open/close all button when in many open mode (`2`).

#### **`openAllTxt`** _{boolean}_

> default: "`Open all`"

Text to show the user when the "Open all" button is available.

#### **`closeAllTxt`** _{boolean}_

> default: "`Close all`"

Text to show the user when the "Close all" button is available.

#### **`openCloseAllMode`** _{number}_

How to decide when to switch from "Open All" to "Close All"

Options are:
1. "Open all" shows until all accordions are open [default]
2. "Open all" shows until more than half of the accordions are open
3. "Open all" only shows if no accordions are open


### `tab-accordion-group` CSS custom properties _(CSS variables)_

By defining the following CSS Custom Properties in your own stylesheet you can give the `tab-accordion-group` element your own style.


#### __Main component__
| CSS custom property name | Value  |
|--------------------------|--------|
| --TAG-background-color   | `#fff` |
| --TAG-padding            | `0`    |
| --TAG-margin             | `0`    |
| --TAG-border             | `none` |


#### __content (accordion) block__

| CSS custom property name |          Value           |
|--------------------------|--------------------------|
| --TAG-content--padding   | `0 0.5rem 0.5rem 0.5rem` |


#### __Open close all button__

|    CSS custom property name     |        Value         |
|---------------------------------|----------------------|
| --TAG-oca-btn--background-color | `#afa`               |
| --TAG-oca-btn--border           | `0.05rem solid #ccc` |
| --TAG-oca-btn--border-radius    | `0.3rem`             |
| --TAG-oca-btn--color            | `#090`               |
| --TAG-oca-btn--font-family      | `inherit`            |
| --TAG-oca-btn--font-size        | `inherit`            |
| --TAG-oca-btn--justify          | `flex-end`           |
| --TAG-oca-btn--margin           | `0`                  |
| --TAG-oca-btn--padding          | `0.5rem 1rem`        |
| --TAG-oca-btn--transform        | `uppercase`          |


#### __Individual tab button__
|        CSS custom property name       |                   Value                   |
|---------------------------------------|-------------------------------------------|
| --TAG-tab-btn--background-color       | `#ddd`                                    |
| --TAG-tab-btn--border-color           | `#aaa`                                    |
| --TAG-tab-btn--border-style           | `solid`                                   |
| --TAG-tab-btn--border-radius          | `0.5rem`                                  |
| --TAG-tab-btn--border-width           | `0.1rem`                                  |
| --TAG-tab-btn--border                 | `0.05rem solid #ccc`                      |
| --TAG-tab-btn--border-radius          | `0.3rem`                                  |
| --TAG-tab-btn--cursor                 | `pointer`                                 |
| --TAG-tab-btn--cursor--open           | `text`                                    |
| --TAG-tab-btn--color--open            | `#000`                                    |
| --TAG-tab-btn--column-gap             | `1rem`                                    |
| --TAG-tab-btn--font-family            | `inherit`                                 |
| --TAG-tab-btn--font-size              | `inherit`                                 |
| --TAG-tab-btn--font-weight            | `inherit`                                 |
| --TAG-tab-btn--font-weight--open      | `inherit`                                 |
| --TAG-tab-btn--justify                | `flex-end`                                |
| --TAG-tab-btn--margin                 | `0`                                       |
| --TAG-tab-btn--padding                | `0.5rem 1rem`                             |
| --TAG-tab-btn--shadow                 | `none`                                    |
| --TAG-tab-btn--shadow--open           | `0.3rem 0.3rem 0.5rem rgba(0, 0, 0, 0.4)` |
| --TAG-tab-btn--text-decoration        | `none`                                    |
| --TAG-tab-btn--text-decoration--open  | `none`                                    |
| --TAG-tab-btn--text-decoration--hover | `underline`                               |
| --TAG-tab-btn--transform              | `uppercase`                               |

#### __Wrapping tab button list__
|        CSS custom property name       |     Value      |
|---------------------------------------|----------------|
| --TAG-tab-btn-list--column-gap        | `1rem`         |
| --TAG-tab-btn-list--margin            | `0 0 1rem`     |
| --TAG-tab-btn-list--padding           | `0 0 0 0.5rem` |
| --TAG-tab-btn-list--rule-color        | `#aaa`         |
| --TAG-tab-btn-list--rule-style        | `solid`        |
| --TAG-tab-btn-list--rule-width        | `0.1rem`       |
| --TAG-tab-btn-list--border-radius     | `0.5rem`       |
