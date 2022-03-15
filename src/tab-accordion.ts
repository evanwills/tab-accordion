import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { IHanlder, TTabTmpl } from './tab-accordion.d';
import { repeat } from 'lit/directives/repeat.js';

/**
 * TODO:
 * 1. Implement WAI-ARIA attibutes to make fully accessible.
 * 2. Fix rendering issue when multipe tabs-accordion-group blocks
 *    are in tab-mode on the same page.
 */

/**
 * Make a string safe to use as an ID attribute value
 *
 * @param input Random string supplied by host
 *
 * @returns
 */
const makeIdSafe = (input: string) : string => {
  return input.replace(/[^a-z0-9_-]+/ig, '-')
}


// const converter = {
//   fromAttribute: (input: string) : string => {
//     return input.toLowerCase().replace(
//       /-+([a-z0-9])/i,
//       (whole, char) => {
//         return char.toUpperCase();
//       }
//     );
//   },
//   toAttribute: (input: string) : string => {
//     return input.replace(
//       /(?<=[a-z0-9])([A-Z])/i,
//       (whole, char) => {
//         return '-' + char.toLowerCase()
//       }
//     );
//   }
// }

const defaultHostStyles = css`
  background-color: inherit;
  box-sizing: border-box;
  color: inherit;
  display: block;
  font-size: inherit;
  font-family: inherit;
  line-height: inherit;
`

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('tab-accordion')
export class TabAccordion extends LitElement {
  /**
   * Tab button text
   */
  @property({ reflect: true, type: String })
  tabLabel : string = '';

  /**
   * Whether or not tab/accordion is open
   */
  @property({ reflect: true, type: Boolean })
  open : boolean = false;

  /**
   * Whether or not to hide the tab/accordion title in tab mode
   */
  @property({ type: Boolean })
  hideTabTitle : boolean = false;

  /**
   * Whether or not this tab/accordion is part of a single open group
   *
   * Used to modify the styling of the accordion title when in single
   * tab/accordion group is in single open mode
   */
  @property({ type: Boolean })
  single : boolean = false;

  /**
   * The minimum width of the screen (in REMs) needs to be before
   * the accordion goes into tab view
   *
   * Used to show/hide the tab title when `hideTabTitle` is true
   * and in tab-accordion is rendered in tab mode
   */
  @property({ type: Number })
  minTabRems = 48;

  /**
  * Whether or not to hide the tab/accordion title in tab mode
  */
  @property({ type: Number })
  hLevel = 2;

  /**
   * Accordion Title
   */
  @property({ type: String, state: true })
  tabTitle : string = '';

  /**
  * Whether or not the basic initialisation has been done
  */
  @state()
  doInit : boolean = true;

  /**
   * Base CSS delcarations that define the non-responsive
   * styling for a single accordion
   */
  private _stylesMain = css`
    :host {
      --TA-background-color: inherit;
      --TA-border: none;
      --TA-padding: 0;
      --TA-margin: 0.5rem 0;

      --TA-content--background-color: inherit;
      --TA-content--border: none;
      --TA-content--padding: 0;
      --TA-content--margin: 0;

      --TA-head--color: #00c;
      --TA-head--color-hover: #00f;
      --TA-head--color-disabled: #000;
      --TA-head--decoration: none;
      --TA-head--decoration-hover: underline;
      --TA-head--decoration-disabled: none;
      --TA-head--font-family: Arial, helvetica, san-serif;
      --TA-head--font-size: 1.25rem;
      --TA-head--margin: 0;
      --TA-head--padding: 0.3rem 0 0.3rem 1.5rem;
      --TA-head--transform: none;
      --TA-head--cursor-disabled: text;

      --TA-oc-icon: "▾";
      --TA-oc-icon--font-family: inherit;
      --TA-oc-icon--font-size: 2rem;
      --TA-oc-icon--color: inherit;
      --TA-oc-icon--top: 0.6rem;
      --TA-oc-icon--right: auto;
      --TA-oc-icon--bottom: auto;
      --TA-oc-icon--left: -0.5rem;
      --TA-oc-icon--line-height: 1rem;
      --TA-oc-icon--transition: transform ease-in-out 0.3s;
      --TA-oc-icon--transform-origin: 50% 40%;
      --TA-oc-icon--transform--open: rotate(180deg);

      ${defaultHostStyles}
    }
    .TA {
      background-color: var(--TA-background-color);
      padding: var(--TA-padding);
      border: var(--TA-border);
      margin: var(--TA-margin);
    }
    .TA-content {
      overflow: hidden;
      transition: height ease-in-out 1.3s;
      background-color: var(--TA-content--background-color);
      padding: var(--TA-content--padding);
      border: var(--TA-content--border);
      margin: var(--TA-content--margin);
    }
    .TA-content--open {
      height: auto;
    }
    .TA-content--closed {
      height: 0;
    }
    .TA-title {
      font-family: var(--TA-head--font-family);
      font-size: var(--TA-head--font-size);
      margin: var(--TA-head--margin);
      padding: var(--TA-head--padding);
      color: var(--TA-head--color);
      display: block;
      text-decoration: var(--TA-head--decoration);
      position: relative;
      text-transform: var(--TA-head--transform);
      width: 100%;
    }
    .TA-title:hover, .tab-title:focus {
      color: var(--TA-head--color-hover);
      text-decoration: var(--TA-head--decoration-hover);

    }
    .TA-title::after {
      bottom: var(--TA-oc-icon--bottom);
      content: var(--TA-oc-icon);
      font-size: var(--TA-oc-icon--font-size);
      font-family: var(--TA-oc-icon--font-family);
      left: var(--TA-oc-icon--left);
      line-height: var(--TA-oc-icon--line-height);
      position: absolute;
      right: var(--TA-oc-icon--right);
      top: var(--TA-oc-icon--top);
      transition: var(--TA-oc-icon--transition);
      transform-origin: var(--TA-oc-icon--transform-origin);
    }
    .TA-title--open::after {
      transform: var(--TA-oc-icon--transform--open);
    }
    .open-single.TA-title--open,
    .open-single.TA-title--open:hover,
    .open-single.TA-title--open:focus {
      text-decoration: var(--TA-head--decoration-disabled);
      color: var(--TA-head--color-disabled);
      cursor: var(--TA-head--cursor-disabled);
    }
    .TA-head {
      margin: var(--TA-head--margin);
      padding: 0;
    }
  `
  private hTmpl : TTabTmpl = (tab : TabAccordion) : TemplateResult => {
    return html`
      <h2 class="TA-head">${tab._tabTitleLink(tab)}</h2>
    `
  };
  /**
   * Responsive CSS delcarations that are to be wrapped in a
   * media query
   */
  private _stylesMedia = css`
    .accordion-only { display: none; }
  `

  /**
   * Handle opening & closing the accordion
   *
   * @param {Event} e Event that triggered this method to be called
   *
   * @returns {void}
   */
  openClose(e: Event) {
    // e.preventDefault();
    this.open = !this.open;

    this.dispatchEvent(new Event('change'));
  }

  private _tabTitleLink(tab : TabAccordion) : TemplateResult {

    const _contentState = tab.open
      ? 'open'
      : 'closed';

    const _tabTitleClass = (tab.hideTabTitle === false)
      ? 'always-show'
      : 'accordion-only';

    const multiClass = (tab.single === true)
      ? 'single'
      : 'multi';

    return html`<a href="#${tab.id}--content" class="TA-title TA-title--${_contentState} ${_tabTitleClass} open-${multiClass}" @click=${tab.openClose}>${this.tabTitle}</a>`;
  }

  /**
   * Do basic initialisation of this accordion item
   *
   * @returns {void}
   */
  private _init() {
    console.group('tab-accordion._init()');

    if (this.doInit) {
      this.doInit = false;
      const titleElement : Element|null = this.querySelector('[slot="title"]');

      console.log('titleElement:', titleElement)

      if (titleElement !== null) {
        this.tabTitle = titleElement.innerHTML;
        const _hLevel = titleElement.nodeName.replace(/^h(?=[0-9]$)/i, '');
        console.log('titleElement.nodeName:', titleElement.nodeName)
        console.log('_hLevel:', _hLevel)
        if (_hLevel !== titleElement.nodeName) {
          this.hLevel = parseInt(_hLevel, 10);
        }

        if (this.tabLabel === '') {
          this.tabLabel = titleElement.innerText;
        }
      } else {
        this.tabTitle = this.tabLabel;
      }

      if (this.id === '') {
        this.id = makeIdSafe(this.tabLabel);
      }
      if (this.id === '') {
        this.id = makeIdSafe(this.tabLabel);
      }

      switch (this.hLevel) {
        case 1:
          this.hTmpl = (tab : TabAccordion) : TemplateResult =>
            html`<h1 class="TA-head">${tab._tabTitleLink(tab)}</h1>`;
          break;

        case 3:
          this.hTmpl = (tab : TabAccordion) : TemplateResult =>
            html`<h3 class="TA-head">${tab._tabTitleLink(tab)}</h3>`;
          break;

        case 4:
          this.hTmpl = (tab : TabAccordion) : TemplateResult =>
            html`<h4 class="TA-head">${tab._tabTitleLink(tab)}</h4>`;
          break;

        case 5:
          this.hTmpl = (tab : TabAccordion) : TemplateResult =>
            html`<h5 class="TA-head">${tab._tabTitleLink(tab)}</h5>`;
          break;

        case 6:
          this.hTmpl = (tab : TabAccordion) : TemplateResult =>
            html`<h6 class="TA-head">${tab._tabTitleLink(tab)}</h6>`;
          break;

        default:
          this.hTmpl = (tab : TabAccordion) : TemplateResult =>
            html`<h2 class="TA-head">${tab._tabTitleLink(tab)}</h2>`;
      }

      if (this.tabLabel === '' && this.tabTitle === '') {
        console.warn(
          'This <tab-accordion> element has no title.', this
        );
      }
    }
    console.groupEnd();
  }


  /**
   * The primary render function for this component
   *
   * @returns {TemplateResult}
   */
  render() {
    if (this.doInit) {
      this._init();
    }

    const _contentState = this.open
      ? 'open'
      : 'closed';

    return html`
      <style>
      ${this._stylesMain}
      ${css`
        @media screen and (min-width: ${this.minTabRems}rem) {
          ${this._stylesMedia}
        }
      `}
      </style>
      <div class="TA">
        ${this.hTmpl(this)}

        <div id="#${this.id}--content" class="TA-content TA-content--${_contentState}">
          <slot></slot>
        </div>
      </div>
    `;
  }
}



/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('tab-accordion-group')
export class TabAccordionGroup extends LitElement {
  /**
  * How tab/accordion should be displayed
  *
  * Options are:
  * 1. [default] responsive tab/accordion
  * 2. Always accordion (only one open at a time)
  * 3. Always accordion (many can be open at a time)
  */
  @property({ type: Number })
  mode = 1;

  /**
  * The number of REMs wide the page needs to be before the layout
  * switches from Accordion view to Tabs view
  */
  @property({ type: Number })
  minTabRems = 48;

  /**
  * Whether or not to hide the tab/accordion title in tab mode
  */
  @property({ type: Boolean })
  hideTabTitle = false;

  /**
  * Whether or not show an open/close all button when in many
  * open mode
  */
  @property({ type: Boolean })
  hideOpenClose = false;

  /**
   * Text to show the user when the "Open all" button is available
   */
  @property({ type: String })
  openAllTxt = 'Open all';

  /**
   * Text to show the user when the "Close all" button is available
   */
  @property({ type: String })
  closeAllTxt = 'Close all';

  /**
   * How to decide when to switch from "Open All" to "Close All"
   *
   * Options are:
   *   1. [default] "Open all" shows until all accordions are open
   *   2. "Open all" shows until more than half of the accordions
   *      are open
   *   3. "Open all" only shows if no accordions are open
   */
  @property({ type: Number })
  openCloseAllMode = 1;

  /**
   * How many tab/accordions are currently open
   *
   * This should never be set externally
   */
  @property({ reflect: true, type: Number })
  openCount = 0;

  /**
  * Whether or not the basic initialisation has been done
  */
  @state()
  doInit : boolean = true;

  /**
  * List of all the TabAccodion elements this TabAccordionGroup
  * wraps
  */
  @state()
  childTabs : Array<TabAccordion> = [];

  /**
   * Whether or not to render the "Open all" text or, instead show
   * the "Close all"
   */
  private _openAll : boolean = true;


  /**
   * Base CSS delcarations that define the non-responsive styling
   * for tab-accordion-group elements
   */
  private _mainStyles = css`
    :host {
      --TAG-background-color: #fff;
      --TAG-padding: 0;
      --TAG-margin: 0;
      --TAG-border: none;

      --TAG-content--padding: 0 0.5rem 0.5rem 0.5rem;

      --TAG-oca-btn--background-color: #afa;
      --TAG-oca-btn--border: 0.05rem solid #ccc;
      --TAG-oca-btn--border-radius: 0.3rem;
      --TAG-oca-btn--color: #090;
      --TAG-oca-btn--font-family: inherit;
      --TAG-oca-btn--font-size: inherit;
      --TAG-oca-btn--justify: flex-end;
      --TAG-oca-btn--margin: 0;
      --TAG-oca-btn--padding: 0.5rem 1rem;
      --TAG-oca-btn--transform: uppercase;

      --TAG-tab-btn--background-color: #ddd;
      --TAG-tab-btn--border-color: #aaa;
      --TAG-tab-btn--border-style: solid;
      --TAG-tab-btn--border-radius: 0.5rem;
      --TAG-tab-btn--border-width: 0.1rem;
      --TAG-tab-btn--border: 0.05rem solid #ccc;
      --TAG-tab-btn--border-radius: 0.3rem;
      --TAG-tab-btn--cursor: pointer;
      --TAG-tab-btn--cursor--open: text;
      --TAG-tab-btn--color--open: #000;
      --TAG-tab-btn--column-gap: 1rem;
      --TAG-tab-btn--font-family: inherit;
      --TAG-tab-btn--font-size: inherit;
      --TAG-tab-btn--font-weight: inherit;
      --TAG-tab-btn--font-weight--open: inherit;
      --TAG-tab-btn--justify: flex-end;
      --TAG-tab-btn--margin: 0;
      --TAG-tab-btn--padding: 0.5rem 1rem;
      --TAG-tab-btn--shadow: none;
      --TAG-tab-btn--shadow--open: 0.3rem 0.3rem 0.5rem rgba(0, 0, 0, 0.4);
      --TAG-tab-btn--text-decoration: none;
      --TAG-tab-btn--text-decoration--open: none;
      --TAG-tab-btn--text-decoration--hover: underline;
      --TAG-tab-btn--transform: uppercase;


      --TAG-tab-btn-list--column-gap: 1rem;
      --TAG-tab-btn-list--margin: 0 0 1rem;
      --TAG-tab-btn-list--padding: 0 0 0 0.5rem;
      --TAG-tab-btn-list--rule-color: #aaa;
      --TAG-tab-btn-list--rule-style: solid;
      --TAG-tab-btn-list--rule-width: 0.1rem;
      --TAG-tab-btn-list--border-radius: 0.5rem;

      ${defaultHostStyles}
    }

    .TAG {
      background-color: var(--TAG-background-color);
      border: var(--TAG-border);
      margin: var(--TAG-margin);
      padding: var(--TAG-padding);
    }
    .TAG-content {
      padding: var(--TAG-content--padding);
    }

    .TAG-tab-btns {
      background-color: var(--TAG-background-color);
      display: none;
      flex-direction: row;
      font-family: var(--TAG-tab-btn--font-family);
      column-gap: var(--TAG-tab-btn-list--column-gap);
      margin: var(--TAG-tab-btn-list--margin);
      padding: var(--TAG-tab-btn-list--padding);
      position: relative;
    }
    .TAG-tab-btns::before {
      content: '';
      position: absolute;
      border-top-color: var(--TAG-tab-btn-list--rule-color);
      border-top-style: var(--TAG-tab-btn-list--rule-style);
      border-top-width: var(--TAG-tab-btn-list--rule-width);
      bottom: -1.05rem;
      left: 0;
      right: 0;
      display: block;
      width: 100%;
      height: 1rem;
      background-color: var(--TAG-background-color);
    }
    .TAG-tab-btns::after {
      content: '';
      position: absolute;
      bottom: -1.025rem;
      left: 0;
      right: 0;
      display: block;
      width: 100%;
      height: 1rem;
      background-color: var(--TAG-background-color);
      z-index: 5;
    }
    .TAG-tab-btn__wrap {
      border-color: var(--TAG-tab-btn--border-color);
      border-style: var(--TAG-tab-btn--border-style);
      border-top-left-radius: var(--TAG-tab-btn--border-radius);
      border-top-right-radius: var(--TAG-tab-btn--border-radius);
      border-width: var(--TAG-tab-btn--border-width);
      box-sizing: border-box;
      list-style-type: none;
      margin: 0 0 calc(-2 * var(--TAG-tab-btn--border-width));
      padding: 0;
    }
    .TAG-tab-btn__wrap--open {
      background-color: var(--TAG-background-color);
      box-shadow: var(--TAG-tab-btn--shadow--open);
      z-index: 3;
    }
    .TAG-tab-btn__wrap--closed {
      background-color: var(--TAG-tab-btn--background-color);
    }
    .TAG-tab-btn {
      color: var(--TAG-tab-btn--color);
      display: block;
      padding: var(--TAG-tab-btn--padding);
      font-weight: var(--TAG-tab-btn--font-weight);
      text-decoration: none;
    }
    .TAG-tab-btn:hover {
      cursor: var(--TAG-tab-btn--cursor);
    }
    .TAG-tab-btn--open {
      color: var(--TAG-tab-btn--color--open);
      font-weight: var(--TAG-tab-btn--font-weight--open);
    }
    .TAG-tab-btn--open:hover {
      cursor: var(--TAG-tab-btn--cursor--open);
    }
    .TAG--optional .TAG__child--closed {
      display: block;
    }
    .TAG--optional .TAG__child--open {
      display: block;
    }
    .open-close-all__wrap {
      display: flex;
      justify-content: var(--TAG-oca-btn--justify);
      margin: var(--TAG-oca-btn--margin);
    }
    .open-close-all {
      background-color: var(--TAG-oca-btn--background-color);
      border: var(--TAG-oca-btn--border);
      border-radius: var(--TAG-oca-btn--border-radius);
      font-family: var(--TAG-oca-btn--font-family);
      font-size: var(--TAG-oca-btn--font-size);
      color: var(--TAG-oca-btn--color);
      justify-content: var(--TAG-oca-btn--justify);
      padding: var(--TAG-oca-btn--padding);
      text-transform: var(--TAG-oca-btn--transform);
    }
  `

  /**
   * Responsive CSS delcarations that are to be wrapped in a
   * media query
   */
  private _mediaStyles = css`
    .TAG-tab-btns {
      display: flex;
    }
    .TAG--optional .TAG__child--closed {
      display: none;
    }
  `;

  /**
   * Get a function to handle change events on child tab-accordion
   * events
   *
   * This is only used for multiopen accordions so the open/close
   * all button show the right text for the given set of open
   * accordion items
   *
   * @returns {IHanlder}
   */
  private _getChangeWatcher () : IHanlder {
    const self = this

    return (self.mode < 3)
      ?  function (e : Event) {
          self.openCount = 0;
          for (let a = 0, c = self.childTabs.length; a < c; a += 1) {
            if (this.id === self.childTabs[a].id) {
              self.childTabs[a].open = true;
              self.openCount += 1;
            } else {
              self.childTabs[a].open = false;
            }
          }
        }
      : function (e : Event) {
          // console.log('this is a non-event');
          if (self.hideOpenClose === false) {
            self._setOpenClosedText();
            self.requestUpdate();
          }
        }
  }

  private _setOpenClosedText () : void {
    this.openCount = 0;
    const c = this.childTabs.length;
    for (let a = 0; a < c; a += 1) {
      this.openCount += (this.childTabs[a].open) ? 1 : 0;
    }

    switch (this.openCloseAllMode) {
      case 1:
        this._openAll = (this.openCount === c);
        break;
      case 2:
        this._openAll = (this.openCount > (c / 2));
        break;
      case 3:
        this._openAll = (this.openCount === 0);
        break
    }
  }

  /**
   * Get an event handler function to handle clicking on tab buttons
   *
   * @param {TabAccordion} tab Accordion element the tab button
   *                           applies to
   *
   * @returns {IHanlder} Event handler function to be added as an
   *                     event listener
   */
  private _getClicker(tab : TabAccordion) : IHanlder {
    const self = this
    const tabID = tab.id

    return function (e : Event) {
      // e.preventDefault()
      if (tab.open === false) {
        self.openCount = 0;

        if (self.mode === 1) {
          for (let a = 0, c = self.childTabs.length; a < c; a += 1) {
            const _True = (self.childTabs[a].id === tabID);
            self.childTabs[a].open = _True;
            self.openCount += _True ? 1 : 0;
          }

          if (self.openCount === 0) {
            // This should never happen but just in case...
            self.childTabs[0].open = true;
            self.openCount = 0;
          }
        }

        self.requestUpdate()
      }
    }
  }

  /**
   * Get a function that can be used as an Array.map() callback
   * function for rendering tab buttons for this tab/accordion group
   *
   * @param {TabAccordionGroup} self This object
   *
   * @returns {TTabTmpl}
   */
  private _getRenderTab(self : TabAccordionGroup) : TTabTmpl {
    return (tab : TabAccordion) : TemplateResult => {
      const _tabState = (tab.open === true) ? 'open' : 'closed'
      const _clicker = self._getClicker(tab)

      return html`
        <li class="TAG-tab-btn__wrap TAG-tab-btn__wrap--${_tabState}">
          <a href="#${tab.id}--content" id="${tab.id}--link" class="TAG-tab-btn TAG-tab-btn--${_tabState}" @click=${_clicker}>
            ${tab.tabLabel}
          </a>
        </li>
      `
    }
  }

  private _getOpenCloseAll () : IHanlder {
    const self = this
    return function (e : Event) : void {
      self._openAll = !self._openAll;

      const b = self.openCount;
      self.openCount = 0;
      for (let a = 0, c = self.childTabs.length; a < c; a += 1) {
        self.childTabs[a].open = self._openAll;
        self.openCount += (self._openAll) ? 1 : 0;
      }

      if (b !== self.openCount) {
        self.requestUpdate()
      }
    }
  }

  /**
   * Do basic initialisation of tab-accordion-group properties
   */
  private _init() {
    const childTabs = this.querySelectorAll('tab-accordion');
    const changeWatcher = this._getChangeWatcher();
    const singleMode = (this.mode < 3)

    this.doInit = false;

    this.mode = Math.round(this.mode);
    if (this.mode > 3 || this.mode < 1) {
      this.mode = 1;
    }

    if (this.mode < 3) {
      this.hideOpenClose = true;
    }

    this.openCloseAllMode = Math.round(this.openCloseAllMode);
    if (this.openCloseAllMode > 3 || this.openCloseAllMode < 1) {
      this.openCloseAllMode = 1;
    }

    for (let a = 0, c = childTabs.length; a < c; a += 1) {
      childTabs[a].single = singleMode;

      if (this.hideTabTitle === true) {
        childTabs[a].hideTabTitle = true;
        childTabs[a].minTabRems = this.minTabRems;
      }

      childTabs[a].addEventListener('change', changeWatcher)
      this.childTabs.push(childTabs[a]);
    }

    this._setOpenClosedText();
    if (this.mode === 1 && this.openCount === 0) {
      if (typeof childTabs[0] !== 'undefined') {
        childTabs[0].open = true;
      }
    }
  }

  /**
   * The primary render function for this component
   *
   * @returns {TemplateResult}
   */
  render() : TemplateResult {
    if (this.doInit) {
      this._init()
    }
    const blockClass = (this.mode === 1)
      ? 'optional'
      : 'never-tabs';

    const multiClass = (this.mode === 3)
      ? 'multi'
      : 'single'

    return html`
      <style>
      ${this._mainStyles}

      @media screen and (min-width: ${this.minTabRems}rem) {
        ${this._mediaStyles}
      }
      </style>

      <div class="TAG">
        ${(this.mode === 1)
          ? html`
          <ul class="TAG-tab-btns">
            ${repeat(this.childTabs, (tab : TabAccordion) => tab.id, this._getRenderTab(this))}
          </ul>
          `
          : ''
        }
        ${(this.hideOpenClose === false) ? html`
          <p class="open-close-all__wrap">
            <button @click=${this._getOpenCloseAll()} class="open-close-all">
              ${(this._openAll)
                ? this.closeAllTxt
                : this.openAllTxt}
            </button>
          </p>
        ` : ''}
        <div class="TAG-content TAG-content--${blockClass}">
          ${repeat(this.childTabs, (tab : TabAccordion) => tab.id, (tab : TabAccordion) : TemplateResult => {
            return html`<div class="TAG__child TAG__child--${tab.open ? 'open' : 'closed'} open-${multiClass}">${tab}</div>`
          })}
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tab-accordion': TabAccordion,
    'tab-accordion-group': TabAccordionGroup
  }
}
