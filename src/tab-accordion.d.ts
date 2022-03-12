import { TemplateResult } from 'lit';
import { TabAccordion } from './tab-accordion';

/// <reference types="vite/client" />

type IHanlder = (e : Event) => void;

type IRenderEventTrigger = (tab : TabAccordion) => TemplateResult;
