import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { IHanlder, IRenderEventTrigger } from './tab-accordion.d';
import { repeat } from 'lit/directives/repeat.js';

/**
 * TODO:
 * 1. in multi-open   -  Fix styling of closed title
 * 2. Add CSS Custom properties for everything that should be
 *    stylable from the host
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

const hostStyles = css`
  :host {
    --TA-head--color: #00c;
    --TA-head--color-hover: #00f;
    --TA-head--color-disabled: #000;
    --TA-head--decoration: none;
    --TA-head--decoration-hover: underline;
    --TA-head--decoration-disabled: none;
    --TA-head--font-family: Arial, helvetica, san-serif;
    --TA-head--font-size: 1.25rem;
    --TA-head--margin: 0;
    --TA-head--padding: 0.3rem 0;
    --TA-head--transform: none;
    --TA-oc-icon: "▾";
    --TAG-oca-btn--justify: flex-end;
    --TAG-oca-btn--padding: 0.5rem 1rem;
    --TAG-oca-btn--margin: 0;
    --TAG-oca-btn--font-family: inherit;
    --TAG-oca-btn--font-size: inherit;
    --TAG-oca-btn--color: #090;
    --TAG-oca-btn--background-color: #afa;
    --TAG-oca-btn--border-radius: 0.3rem;
    --TAG-oca-btn--border: 0.05rem solid #ccc;
    --TAG-oca-btn--transform: uppercase;
    --TAG-tab-btn--padding: 0.5rem 1rem;

    box-sizing: border-box;
    color: inherit;
    display: block;
    font-size: inherit;
    font-family: inherit;
    line-height: inherit;
  }
  `;

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
   * Accordion Title
   */
  @property({ reflect: true, type: String })
  tabTitle : string = '';

  /**
   * Whether or not to hide the tab/accordion title in tab mode
   */
  @property({ reflect: true, type: Boolean })
  hideTabTitle : boolean = false;

  /**
   * Whether or not tab/accordion is open
   */
  @property({ reflect: true, type: Boolean })
  open : boolean = false

  /**
   * Whether or not this tab/accordion is part of a single open group
   *
   * Used to modify the styling of the accordion title when in single
   * tab/accordion group is in single open mode
   */
  @property({ reflect: true, type: Boolean })
  single : boolean = false

  /**
  * Whether or not to hide the tab/accordion title in tab mode
  */
  @property({ reflect: true, type: Number })
  minTabRems = 48;

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
    .tab-content {
      overflow: hidden;
      transition: height ease-in-out 1.3s;
    }
    .tab-content--open {
      height: auto;
    }
    .tab-content--closed {
      height: 0;
    }
    .tab-title {
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
    .tab-title:hover, .tab-title:focus {
      color: var(--TA-head--color-hover);
      text-decoration: var(--TA-head--decoration-hover);

    }
    .tab-title::after {
      content: var(--TA-oc-icon);
      font-size: 2.5em;
      position: absolute;
      top: 0.7rem;
      right: -0.5rem;
      line-height: 1rem;
      transition: transform ease-in-out 0.3s;
      transform-origin: 50% 40%;
    }
    .tab-title--open::after {
      transform: rotate(180deg);
    }
    .open-single.tab-title--open,
    .open-single.tab-title--open:hover,
    .open-single.tab-title--open:focus {
      text-decoration: var(--TA-head--decoration-disabled);
      color: var(--TA-head--color-disabled);
      cursor: text;
    }
  `

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

  /**
   * Do basic initialisation of this accordion item
   *
   * @returns {void}
   */
  private _init() {
    const title : Element|null = this.querySelector('[slot="title"]');

    this.doInit = false;

    this.tabTitle = (title !== null)
      ? title.innerHTML
      : this.tabLabel;

    if (this.id === '') {
      this.id = makeIdSafe(this.tabLabel);
    }
    if (this.id === '') {
      this.id = makeIdSafe(this.tabLabel);
    }
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

    const _tabTitleClass = (this.hideTabTitle === false)
      ? 'always-show'
      : 'accordion-only';

    const multiClass = (this.single === true)
      ? 'single'
      : 'multi';

    return html`
      <style>
      ${hostStyles}
      ${this._stylesMain}
      ${css`
        @media screen and (min-width: ${this.minTabRems}rem) {
          ${this._stylesMedia}
        }
      `}
      </style>

      <a href="#${this.id}--content" class="tab-title tab-title--${_contentState} ${_tabTitleClass} open-${multiClass}" @click=${this.openClose}>
        <h3>${this.tabTitle}</h3>
      </a>

      <div id="#${this.id}--content" class="tab-content tab-content--${_contentState}">
        <slot></slot>
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
  @property({ reflect: true, type: Number })
  mode = 1;

  /**
  * Whether or not to hide the tab/accordion title in tab mode
  */
  @property({ reflect: true, type: Boolean })
  hideTabTitle = false;

  /**
  * The number of REMs wide the page needs to be before the layout
  * switches from Accordion view to Tabs view
  */
  @property({ reflect: true, type: Number })
  minTabRems = 48;

  /**
  * Whether or not show an open/close all button when in many
  * open mode
  */
  @property({ reflect: true, type: Boolean })
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
  * How to chose when to switch from "Open All" to "Close All"
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

  private _openCount : number = 0;
  private _openAll : boolean = true;


  /**
   * Base CSS delcarations that define the non-responsive styling
   * for tab-accordion-group elements
   */
  private _mainStyles = css`
    .TAG-tab-btns {
      display: none;
      flex-direction: row;
      font-family: var(--TA-head-family);
      column-gap: 1rem;
      margin: 0 0 1.5rem;
      padding: 0 0 0 1rem;
      position: relative;
    }
    .TAG-tab-btns::before {
      content: '';
      position: absolute;
      border-top: 0.1rem solid #aaa;
      bottom: -1.05rem;
      left: 0;
      right: 0;
      display: block;
      width: 100%;
      height: 1rem;
      background-color: #fff;
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
      background-color: #fff;
      z-index: 5;
    }
    .TAG-tab-btn__wrap {
      list-style-type: none;
      margin: 0 0 -0.2rem;
      padding: 0;
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
      border: 0.1rem solid #aaa;
      box-sizing: border-box;
    }
    .TAG-tab-btn__wrap--open {
      background-color: #fff;
      box-shadow: 0.3rem 0.3rem 0.5rem rgba(0, 0, 0, 0.4);
      z-index: 3;
    }
    .TAG-tab-btn__wrap--closed {
      background-color: #eee;
    }
    .TAG-tab-btn {
      display: block;
      padding: 0.5rem 1rem;
      text-decoration: none;
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
          self._openCount = 0;
          for (let a = 0, c = self.childTabs.length; a < c; a += 1) {
            if (this.id === self.childTabs[a].id) {
              self.childTabs[a].open = true;
              self._openCount += 1;
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
    this._openCount = 0;
    const c = this.childTabs.length;
    for (let a = 0; a < c; a += 1) {
      this._openCount += (this.childTabs[a].open) ? 1 : 0;
    }

    switch (this.openCloseAllMode) {
      case 1:
        this._openAll = (this._openCount === c);
        break;
      case 2:
        this._openAll = (this._openCount > (c / 2));
        break;
      case 3:
        this._openAll = (this._openCount === 0);
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
        self._openCount = 0;

        if (self.mode === 1) {
          for (let a = 0, c = self.childTabs.length; a < c; a += 1) {
            const _True = (self.childTabs[a].id === tabID);
            self.childTabs[a].open = _True;
            self._openCount += _True ? 1 : 0;
          }

          if (self._openCount === 0) {
            // This should never happen but just in case...
            self.childTabs[0].open = true;
            self._openCount = 0;
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
   * @returns {IRenderEventTrigger}
   */
  private _getRenderTab(self : TabAccordionGroup) : IRenderEventTrigger {
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

      const b = self._openCount;
      self._openCount = 0;
      for (let a = 0, c = self.childTabs.length; a < c; a += 1) {
        self.childTabs[a].open = self._openAll;
        self._openCount += (self._openAll) ? 1 : 0;
      }

      if (b !== self._openCount) {
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
    if (this.mode === 1 && this._openCount === 0) {
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
      ${hostStyles}
      ${this._mainStyles}

      @media screen and (min-width: ${this.minTabRems}rem) {
        ${this._mediaStyles}
      }
      </style>

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
      <div class="TAG--${blockClass}">
        ${repeat(this.childTabs, (tab : TabAccordion) => tab.id, (tab : TabAccordion) : TemplateResult => {
          return html`<div class="TAG__child TAG__child--${tab.open ? 'open' : 'closed'} open-${multiClass}">${tab}</div>`
        })}
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
