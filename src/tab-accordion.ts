import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { IHanlder, IRenderEventTrigger } from './tab-accordion.d';
import { repeat } from 'lit/directives/repeat.js';

/**
 * TODO:
 * 1. in tab/accordion - make sure that the first tab is open if no
 *                       tab-accordion elements are open by default
 * 2. in multi-open   -  Fix styling of closed title
 * 3. Add CSS Custom properties for everything that should be
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

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('tab-accordion')
export class TabAccordion extends LitElement {
  /**
   * The name to say "Hello" to.
   */
  @property({ reflect: true, type: String })
  tabLabel : string = ''

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
    :host {
      --accordion-cutoff: 48rem;
      --ta-head-family: Arial, helvetica, san-serif;
      --ta-head-size: 1.25rem;
      --ta-head-color: pink;
      --ta-head-padding: 0.3rem 0;
      --ta-head-margin: 0;
    }
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
      display: block;
      font-family: var(--ta-head-family);
      text-decoration: none;
      position: relative;
      width: 100%;
    }
    .tab-title::after {
      content: "▾";
      font-size: 2.5em;
      position: absolute;
      top: 0.7rem;
      right: -0.5rem;
      line-height: 1rem;
      transition: transform ease-in-out 0.3s;
      transform-origin: 50% 40%;
    }
    .tab-title--open {
      text-decoration: none;
      color: #000;
    }
    .tab-title--open::after {
      transform: rotate(180deg);
    }

    .tab-title:hover, .tab-title:focus  {
      text-decoration: underline;
    }
    .tab-title--open:hover, .tab-title--open:focus {
      cursor: text;
      text-decoration: none;
      color: #000;
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
    this.doInit = false;

    if (this.id === '') {
      this.id = makeIdSafe(this.tabLabel)
    }
    if (this.id === '') {
      this.id = makeIdSafe(this.tabLabel)
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
      : 'accordion-only'

    return html`
      <style>
      ${this._stylesMain}
      ${css`
        @media screen and (min-width: ${this.minTabRems}rem) {
          ${this._stylesMedia}
        }
      `}
      </style>

      <a href="#${this.id}--content" class="tab-title tab-title--${_contentState} ${_tabTitleClass}" @click=${this.openClose}>
        <slot name="title"><h1 class="tab-accordion__head">${this.tabLabel}</h1></slot>
      </a>

      <div id="#${this.id}--content" class="tab-content tab-content--${_contentState}">
        <slot></slot>
      </div>
    `
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
    :host {
      --ta-head-family: Arial, helvetica, san-serif;
      --ta-head-size: 1.25rem;
      --ta-head-color: pink;
      --ta-head-padding: 0.3rem 0;
      --ta-head-margin: 0;
      display: block;
      box-sizing: border-box;
    }

    .tab-btns {
      display: none;
      flex-direction: row;
      font-family: var(--ta-head-family);
      column-gap: 1rem;
      margin: 0 0 1.5rem;
      padding: 0 0 0 1rem;
      position: relative;
    }
    .tab-btns::before {
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
    .tab-btns::after {
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
    .tab-btn__wrap {
      list-style-type: none;
      margin: 0 0 -0.2rem;
      padding: 0;
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
      border: 0.1rem solid #aaa;
      box-sizing: border-box;
    }
    .tab-btn__wrap--open {
      background-color: #fff;
      box-shadow: 0.3rem 0.3rem 0.5rem rgba(0, 0, 0, 0.4);
      z-index: 3;
    }
    .tab-btn__wrap--closed {
      background-color: #eee;
    }
    .tab-btn {
      display: block;
      padding: 0.5rem 1rem;
      text-decoration: none;
    }
    .tab-btn--open {
    }
    .tab-accordion__head {
      font-size: 1.5rem;
      margin: 0;
    }
    .TAG--optional .TAG__child--closed {
      display: block;
    }
    .TAG--optional .TAG__child--open {
      display: block;
    }
  `

  /**
   * Responsive CSS delcarations that are to be wrapped in a
   * media query
   */
  private _mediaStyles = css`
    .tab-btns {
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
    console.group('_getChangeWatcher()')
    console.groupEnd();

    return (self.mode < 3)
      ?  function (e : Event) {
          console.group('child tab-accordion click event')
          console.groupEnd()

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
          console.log('this is a non-event')
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
        <li class="tab-btn__wrap tab-btn__wrap--${_tabState}">
          <a href="#${tab.id}--content" id="${tab.id}--link" class="tab-btn tab-btn--${_tabState}" @click=${_clicker}>
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
      if (this.hideTabTitle === true) {
        childTabs[a].hideTabTitle = true;
        childTabs[a].minTabRems = this.minTabRems
      }

      childTabs[a].addEventListener('change', changeWatcher)
      this.childTabs.push(childTabs[a]);
    }

    if (this.hideOpenClose === false) {
      this._setOpenClosedText()
    }

    // self.styles = self.styles.replace()
    console.log('this.minTabRems:', this.minTabRems);
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
      : 'never';

    return html`
      <style>
      ${this._mainStyles}

      @media screen and (min-width: ${this.minTabRems}rem) {
        ${this._mediaStyles}
      }
      </style>
      ${(this.mode === 1)
        ? html`
        <ul class="tab-btns">
          ${repeat(this.childTabs, (tab : TabAccordion) => tab.id, this._getRenderTab(this))}
        </ul>
        `
        : ''
      }
      ${(this.hideOpenClose === false) ? html`
        <button @click=${this._getOpenCloseAll()}>${(this._openAll) ? this.closeAllTxt : this.openAllTxt}</button>
      ` : ''}
      <div class="TAG--${blockClass}">
        ${repeat(this.childTabs, (tab : TabAccordion) => tab.id, (tab : TabAccordion) : TemplateResult => {
          return html`<div class="TAG__child TAG__child--${tab.open ? 'open' : 'closed'}">${tab}</div>`
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
