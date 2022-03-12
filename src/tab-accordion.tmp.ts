import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
// import {  } from './tab-accordion.d';

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

  @state()
  doInit : boolean = false;

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
      font-size: 4rem;
      position: absolute;
      top: 0.7rem;
      right: -1rem;
      line-height: 1rem;
      transition: transform ease-in-out 0.3s;
    }
    .tab-title--open::after {
      transform: rotate(90 deg);
    }

    .tab-title:hover, .accordion-title:focus  {
      text-decoration: underline;
    }
    // @media screen and (min-width: var(--accordion-cutoff)) {
    //   .accordion-only { display: none; }
    // }
  `
  openClose(e: Event) {
    e.preventDefault();
    this.open = !this.open;
    new Event('change');
  }

  render() {
    const _contentState = this.open
      ? 'open'
      : 'closed';
    const _tabTitleClass = (this.hideTabTitle === false)
      ? 'always-show'
      : 'accordion-only'

    return html`
        <a href="#" class="tab-title tab-title--${_contentState} ${_tabTitleClass}" @click=${this.openClose}>
          <slot name="title></slot>
        </a>
        <div class="tab-content tab-content--${_contentState}">
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

  init() {
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
      console.log('childTabs[' + a + ']:', childTabs[a])
      this.childTabs.push(childTabs[a])
    }
  }

  render() {
    if (this.doInit) {
      this.init()
    }

    return html`
      ${(this.neverTab === false)
        ? html`
        <div class="tab-btns">

        </div>
        `
        : ''
      }
       <h1>Hello, ${this.name}!</h1>
       <slot></slot>
     `
  }

  private _onClick() {
    this.count++
  }

  foo(): string {
    return 'foo'
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tab-accordion': TabAccordion,
    'tab-accordion-group': TabAccordionGroup
  }
}
