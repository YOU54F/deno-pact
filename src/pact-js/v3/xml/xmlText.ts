import { Matcher } from '../matchers.ts';
import { XmlNode } from './xmlNode.ts';

export class XmlText extends XmlNode {
  constructor(private content: string, private matcher?: Matcher<string>) {
    super();
  }
}
