import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { IHanlder, IRenderEventTrigger } from './tab-accordion.d';
import { repeat } from 'lit/directives/repeat.js';

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
   * The name to say "Hello" to.
   */
  @property({ reflect: true, type: String })
  tabHeading : string = ''

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

  @state()
  doInit : boolean = true;

  static styles = css`
    :host {
      --accordion-cutoff: 48rem;
      --ta-head-family: Arial, helvetica, san-serif;
      --ta-head-size: 1.25rem;
      --ta-head-color: pink;
      --ta-head-padding: 0.3rem 0;
      --ta-head-margin: 0;
    }
    :host(tab-accordion[hidetabtitle]) .tab-accordion__head {
      display: none;
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

    @media screen and (min-width: 48rem) {
      .accordion-only { display: none; }
    }
  `

  openClose(e: Event) {
    // e.preventDefault();
    this.open = !this.open;

    this.dispatchEvent(new Event('change'));
  }

  private _init() {
    this.doInit = false;

    if (this.id === '') {
      this.id = makeIdSafe(this.tabLabel)
    }
    if (this.id === '') {
      this.id = makeIdSafe(this.tabLabel)
    }
    // if (this.open === true) {
    //   this.classList.add('tab-accordion--open');
    //   this.classList.remove('tab-accordion--closed');
    // } else {
    //   this.classList.add('tab-accordion--closed');
    //   this.classList.remove('tab-accordion--open');
    // }
  }

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
        <a href="#${this.id}--content" class="tab-title tab-title--${_contentState} ${_tabTitleClass}" @click=${this.openClose}>
          <slot name="title"></slot>
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
  * Whether or not to allow multiple accordions to be open at the same time.
  *
  * __NOTE:__ `TRUE` this forces neverTab to be `TRUE`
  */
  @property({ reflect: true, type: Boolean })
  openMulti = false;

  /**
  * Whether or not this should start with all accordions open
  *
  * __NOTE:__ `TRUE` this forces neverTab to be `TRUE`
  */
  @property({ reflect: true, type: Boolean })
  openCloseAll = false;

  /**
  * Whether or not this should always be an accordion
  */
  @property({ reflect: true, type: Boolean })
  neverTab = false;

  /**
  * Whether or not this should always be an accordion
  */
  @property({ reflect: true, type: Boolean })
  noopenCloseAll = false;

  /**
  * Whether or not to hide the tab/accordion title in tab mode
  */
  @property({ reflect: true, type: Boolean })
  hideTabTitle = false;

  /**
  * Whether or not to hide the tab/accordion title in tab mode
  */
  @property({ reflect: true, type: Number })
  minTabRems = 48;

  @state()
  id : string = '';

  @state()
  doInit : boolean = true;

  @state()
  childTabs : Array<TabAccordion> = [];

  private _openCount : number = 0;
  private _openAll : boolean = true;

  // private _closedClasses : Array<string> = ['tab-accordion--closed']

  static styles = css`
    :host {
      --accordion-cutoff: 48rem;
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
      border-bottom: 0.1rem solid #aaa;
      position: relative;
    }
    .tab-btns::after {
      content: '';
      position: absolute;
      bottom: -1.1rem;
      left: 0;
      right: 0;
      display: block;
      width: 100%;
      height: 1rem;
      background-color: #fff;
    }
    .tab-btns > li {
      list-style-type: none;
      margin: 0 0 -0.075rem;
      padding: 0;
    }
    .tab-btn {
      display: block;
      padding: 0.5rem 1rem;
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
      border: 0.1rem solid #aaa;
      box-sizing: border-box;
      background-color: #fff;
      text-decoration: none;
    }
    .tab-btn--open {
      border-bottom-color: #fff;
      box-shadow: 0.3rem 0.3rem 0.5rem rgba(0, 0, 0, 0.4);
    }
    .tab-btn--closed {
      background-color: #eee;
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

    @media screen and (min-width: 48rem) {
      .tab-btns {
        display: flex;
      }
      .TAG--optional .TAG__child--closed {
        display: none;
      }
    }
  `

  /**
   * Get a function to handle change events on child tab-accordion
   * events
   */
  private _getChangeWatcher () : IHanlder {
    const self = this
    console.group('_getChangeWatcher()')
    console.groupEnd();

    return (self.openMulti === false)
      ? function (e : Event) {
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
        }

  }

  private _getClicker(tab : TabAccordion) : IHanlder {
    const self = this
    const tabID = tab.id
    return function (e : Event) {
      // e.preventDefault()
      tab.open = true;
      console.group('tab-btn click event')
      console.log('tabID:', tabID)

      self._openCount = 0;
      if (self.openMulti === false) {
        for (let a = 0, c = self.childTabs.length; a < c; a += 1) {
          self.childTabs[a].open = (self.childTabs[a].id === tabID);
          // self._setOpenCloseClass(self.childTabs[a]);
          console.log('self.childTabs[' + a + '].id:', self.childTabs[a].id)
          console.log('self.childTabs[' + a + '].id  === ' + tabID + ':', self.childTabs[a].id === tabID)
        }
      }
      self.requestUpdate()
      console.groupEnd();
    }
  }

  private _getRenderTab(self : TabAccordionGroup) : IRenderEventTrigger {
    return (tab : TabAccordion) : TemplateResult => {
      const _tabState = (tab.open === true) ? 'open' : 'closed'
      const _clicker = self._getClicker(tab)
      console.log('_clicker:', _clicker)
      console.group('_getRenderTab()');
      console.log('this:', this);
      console.log('tab:', tab);
      console.log('_tabState:', _tabState);
      console.groupEnd();

      return html`
        <li>
          <a href="#${tab.id}--content" id="${tab.id}--link" class="tab-btn tab-btn--${_tabState}" @click=${_clicker}>
            ${tab.tabLabel}
          </a>
        </li>
      `
    }
  }

  /**
   * Do basic initialisation of tab-accordion-group properties
   */
  private _init() {
    this.doInit = false;

    if (this.openMulti === true || this.openCloseAll === true) {
      this.neverTab = true;
    }

    const childTabs = this.querySelectorAll('tab-accordion');
    const changeWatcher = this._getChangeWatcher();

    for (let a = 0, c = childTabs.length; a < c; a += 1) {
      if (this.hideTabTitle === true) {
        childTabs[a].hideTabTitle = true;
      }

      childTabs[a].addEventListener('change', changeWatcher)
      this.childTabs.push(childTabs[a]);
    }

    // self.styles = self.styles.replace()
    console.log('this.minTabRems:', this.minTabRems);
  }

  render() {
    if (this.doInit) {
      this._init()
    }
    const blockClass = (this.neverTab === false)
      ? 'optional'
      : 'never';

    return html`
      ${(this.neverTab === false)
        ? html`
        <ul class="tab-btns">
          ${repeat(this.childTabs, (tab : TabAccordion) => tab.id, this._getRenderTab(this))}
        </ul>
        `
        : ''
      }
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
