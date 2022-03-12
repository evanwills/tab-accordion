import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { IHanlder, IRenderEventTrigger } from './tab-accordion.d';

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
  // &rsaquo;
	// &#x0203A;
	// &#8250;

  // &nabla; &Del;
	// &#x02207;
	// &#8711;

  // &xdtri; &bigtriangledown;
	// &#x025BD;
	// &#9661;


  private _doInit : boolean = true;

  static styles = css`
    :host {
      --accordion-cutoff: 48rem;
      --ta-head-family: Arial, helvetica, san-serif;
      --ta-head-size: 1.25rem;
      --ta-head-color: pink;
      --ta-head-padding: 0.3rem 0;
      --ta-head-margin: 0;
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
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
    .tab-title--open::after {
      transform: rotate(180deg);
    }

    .tab-title:hover, .accordion-title:focus  {
      text-decoration: underline;
    }
    @media screen and (min-width: var(--accordion-cutoff)) {
      .accordion-only { display: none; }
    }
  `
  private _openClose(e: Event) {
    // e.preventDefault();
    this.open = !this.open;
    new Event('change');
  }

  private _init() {
    this._doInit = false;
    console.group('_inti()');
    console.log('this:', this);
    if (this.id === '') {
      this.id = makeIdSafe(this.tabLabel)
    }
    if (this.id === '') {
      this.id = makeIdSafe(this.tabLabel)
    }
    console.log('this:', this);

    console.groupEnd();
  }

  render() {
    if (this._doInit) {
      this._init();
    }
    const _contentState = this.open
      ? 'open'
      : 'closed';
    const _tabTitleClass = (this.hideTabTitle === false)
      ? 'always-show'
      : 'accordion-only'

    return html`
        <a href="#${this.id}--content" class="tab-title tab-title--${_contentState} ${_tabTitleClass}" @click=${this._openClose}>
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
  openAll = false;

  /**
   * Whether or not this should always be an accordion
   */
  @property({ reflect: true, type: Boolean })
  neverTab = false;

  /**
   * Whether or not this should always be an accordion
   */
  @property({ reflect: true, type: Boolean })
  noOpenAll = false;

  /**
   * Whether or not to hide the tab/accordion title in tab mode
   */
  @property({ reflect: true, type: Boolean })
  hideTabTitle = false;

  @state()
  id : string = '';

  @state()
  doInit : boolean = true;

  @state()
  childTabs : Array<TabAccordion> = [];

  static styles = css`
     :host {
       --accordion-cutoff: 48rem;
       display: block;
       border: solid 1px gray;
       padding: 16px;
       max-width: 800px;
     }
   `

  private _changeWatcher () : IHanlder {
    const self = this
    return function (e : Event) {
      console.group('_changeWatcher() - event');
      console.log('e:', e)
      console.log('self:', self)
      console.groupEnd();
      if (self.openMulti === false) {
        for (let a = 0, c = self.childTabs.length; a < c; a += 1) {

        }

      }
    }
  }

  private _init() {
    this.doInit = false;

    if (this.openMulti === true || this.openAll === true) {
      this.neverTab = true;
    }

    const childTabs = this.querySelectorAll('tab-accordion');
    console.log('childTabs:', childTabs)
    console.log('childTabs.length:', childTabs.length)

    for (let a = 0, c = childTabs.length; a < c; a += 1) {
      console.log('childTabs[' + a + ']:', childTabs[a])
      // console.log('childTabs[a]:', childTabs[a])
      if (this.hideTabTitle === true) {
        childTabs[a].hideTabTitle = true;
      }
      // console.log('childTabs[' + a + ']:', childTabs[a])
      this.childTabs.push(childTabs[a])
      childTabs[a].addEventListener('change', this._changeWatcher)
    }
  }

  private _getClicker(tab : TabAccordion) : IHanlder {
    const self = this
    const tabID = tab.id
    return function (e : Event) {
      // e.preventDefault()
      tab.open = true
      if (self.openMulti === false) {
        for (let a = 0, c = self.childTabs.length; a < c; a += 1) {
          self.childTabs[a].open = (self.childTabs[a].id === tabID)
        }
      }
      console.groupEnd();
    }
  }

  private _getRenderTab(self : TabAccordionGroup) : IRenderEventTrigger {
    return (tab : TabAccordion) : TemplateResult => {
      const _tabState = (tab.open === true) ? 'open' : 'closed'
      const _clicker = self._getClicker(tab)
      // console.log('_clicker:', _clicker)
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

  render() {
    if (this.doInit) {
      this._init()
    }

    return html`
      ${(this.neverTab === false)
        ? html`
        <ul class="tab-btns">
          ${this.childTabs.map(this._getRenderTab(this))}
        </ul>
        `
        : ''
      }
      <slot></slot>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tab-accordion': TabAccordion,
    'tab-accordion-group': TabAccordionGroup
  }
}
