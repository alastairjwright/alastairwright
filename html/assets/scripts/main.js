import jQuery from 'jquery';
import 'picturefill';
window.$ = window.jQuery = jQuery;

import HotDog from './components/HotDog';

$('.hot-dog').each((index, element) => new HotDog(element));
