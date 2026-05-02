import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const jsdom = new JSDOM('');

export const DOMPurifyServer = createDOMPurify(jsdom.window);
