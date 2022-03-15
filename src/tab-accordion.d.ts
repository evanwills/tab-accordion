import { TemplateResult } from 'lit';
import { TabAccordion } from './tab-accordion';

/// <reference types="vite/client" />

type IHanlder = (e : Event) => void;

type TTabTmpl = (tab : TabAccordion) => TemplateResult;
